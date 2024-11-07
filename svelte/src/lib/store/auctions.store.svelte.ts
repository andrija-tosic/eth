import type { AuctionModel } from "../model/auction.model";
import AuctionFactoryAbi from "../../../../artifacts/contracts/AuctionFactory.sol/AuctionFactory.json";
import AuctionAbi from "../../../../artifacts/contracts/Auction.sol/Auction.json";
import { Contract, parseUnits } from "ethers";
import { ethersStore } from "./ethers.store.svelte";
import { SvelteMap } from "svelte/reactivity";
import type { Auction, AuctionFactory } from "../../../../typechain-types";
import Toast from "typescript-toastify";

class AuctionStore {
  auctions = $state(new SvelteMap<string, AuctionModel>());

  factoryContract!: AuctionFactory;

  activeAuctions = $derived(
    [...this.auctions.values()]
      .filter((e) => !e.ended)
      .sort((e1, e2) => Number(e2.endTime) - Number(e1.endTime))
  );

  finishedAuctions = $derived(
    [...this.auctions.values()]
      .filter((e) => e.ended)
      .sort((e1, e2) => Number(e2.endTime) - Number(e1.endTime))
  );

  selectedAuctionAddress = $state<string>()!;
  selectedAuction = $derived(this.auctions.get(this.selectedAuctionAddress));

  private constructor() {
    // this should be solved with $effect.

    window.ethereum?.on("accountsChanged", async (accounts) => {
      auctionStore.auctions.forEach(auctionStore.#removeEventListeners);
      this.#getAuctions();

      this.auctions.forEach(async (a) => {
        a.pendingReturn = await a.contract.getPendingReturnForBidder(ethersStore.account);
      });
    });
  }

  static async init() {
    const auctionStore = new AuctionStore();

    auctionStore.factoryContract = new Contract(
      import.meta.env.VITE_AUCTION_FACTORY_ADDR,
      AuctionFactoryAbi.abi,
      await ethersStore.provider.getSigner()
    ) as unknown as AuctionFactory;

    auctionStore.factoryContract.on(
      auctionStore.factoryContract.getEvent("AuctionCreated"),
      async (auctionAddress) => {
        new Toast({
          position: "bottom-right",
          toastMsg: "Auction created",
          type: "success",
          canClose: true,
          showProgress: true,

          pauseOnFocusLoss: true,
          theme: "dark",
        });

        const model = $state(await auctionStore.initAuction(auctionAddress));
        auctionStore.auctions.set(model.address, model);
        auctionStore.#setupEventListeners(model);
        auctionStore.selectedAuctionAddress = auctionAddress;
      }
    );

    await auctionStore.#getAuctions();

    auctionStore.selectedAuctionAddress =
      auctionStore.activeAuctions[0]?.address ?? auctionStore.finishedAuctions[0]?.address;

    window.ethereum?.on("accountsChanged", async (accounts) => {
      auctionStore.auctions.forEach(async (a) => {
        a.pendingReturn = await a.contract.getPendingReturnForBidder(ethersStore.account);
      });
    });

    return auctionStore;
  }

  #setupEventListeners(model: AuctionModel) {
    if (!model.ended) {
      model.contract.on(model.contract.getEvent("AuctionEnded"), async (winner, amount) => {
        model.ended = true;

        console.log("Auction ended", { model, winner, amount });
        new Toast({
          position: "bottom-right",
          toastMsg: "Auction ended",
          type: "success",
          canClose: true,
          showProgress: true,
          pauseOnFocusLoss: true,
          theme: "dark",
        });

        if (ethersStore.account.toLowerCase() === model.beneficiary.toLowerCase()) {
          console.log("Balance should get updated");
          await ethersStore.updateBalance();
        }
      });
    }

    model.contract.on(model.contract.getEvent("HighestBidIncreased"), (bidder, amount) => {
      model.highestBid = amount as bigint;
      model.highestBidder = bidder as string;
      this.auctions = this.auctions;
      console.log("Highest bid increased", { model, bidder, amount });
      new Toast({
        position: "bottom-right",
        toastMsg: `Highest bid increased to ${parseUnits(amount.toString(), "ether")} ETH`,
        type: "info",
        canClose: true,
        showProgress: true,
        pauseOnFocusLoss: true,
        theme: "dark",
      });
    });

    model.contract.on(model.contract.getEvent("HighestBidLost"), (bidder, amount) => {
      if (ethersStore.account.toLowerCase() === (bidder as string).toLowerCase()) {
        console.log("Highest bid lost", { model, bidder, amount });
        new Toast({
          position: "bottom-right",
          toastMsg: "Highest bid lost",
          type: "info",
          canClose: true,
          showProgress: true,
          pauseOnFocusLoss: true,
          theme: "dark",
        });

        model.pendingReturn = amount as bigint;
      }
    });
  }

  #removeEventListeners(model: AuctionModel) {
    model.contract.off("AuctionEnded");
    model.contract.off("HighestBidIncreased");
    model.contract.off("HighestBidLost");
  }

  async #getAuctions() {
    let activeAuctions: string[] = [];
    let finishedAuctions: string[] = [];

    try {
      activeAuctions = await this.factoryContract.getActiveAuctions();
    } catch (error) {}
    try {
      finishedAuctions = await this.factoryContract.getFinishedAuctions();
    } catch (error) {}

    const auctions = [...activeAuctions, ...finishedAuctions];
    for (const a of auctions) {
      const model = $state(await this.initAuction(a));
      this.#setupEventListeners(model);
      this.auctions.set(model.address, model);
    }
  }

  async initAuction(address: string) {
    const contract = new Contract(
      address,
      AuctionAbi.abi,
      await ethersStore.provider.getSigner()
    ) as unknown as Auction;

    const beneficiary: string = await contract.beneficiary();

    const model: AuctionModel = {
      address,
      item: await contract.item(),
      description: await contract.description(),
      endTime: await contract.auctionEndTime(),
      beneficiary,
      ended: await contract.ended(),
      highestBid: await contract.highestBid(),
      highestBidder: await contract.highestBidder(),
      bidderCount: await contract.bidderCount(),
      beneficiaryRatings: await this.factoryContract.getBeneficiarysRatings(beneficiary),
      pendingReturn: await contract.getPendingReturnForBidder(ethersStore.account),
      contract,
    };

    return model;
  }
}

export const auctionStore = await AuctionStore.init();
