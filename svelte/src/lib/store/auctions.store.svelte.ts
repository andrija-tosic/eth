import type { AuctionModel } from "../model/auction.model";
import AuctionFactory from "../../../../artifacts/contracts/AuctionFactory.sol/AuctionFactory.json";
import Auction from "../../../../artifacts/contracts/Auction.sol/Auction.json";
import { SvelteMap } from "svelte/reactivity";
import type { Contract, ContractAbi } from "web3";
import { web3Store } from "./web3.store.svelte";

class AuctionStore {
  auctions = $state(new SvelteMap<string, AuctionModel>());

  auctionFactoryContract!: Contract<ContractAbi>;

  activeAuctions = $derived(() =>
    [...this.auctions.values()]
      .filter((e) => !e.ended)
      .sort((e1, e2) => Number(e2.auctionEndTime) - Number(e1.auctionEndTime))
  );

  finishedAuctions = $derived(() =>
    [...this.auctions.values()]
      .filter((e) => e.ended)
      .sort((e1, e2) => Number(e2.auctionEndTime) - Number(e1.auctionEndTime))
  );

  selectedAuctionAddress = $state<string>()!;
  selectedAuction = $derived(this.auctions.get(this.selectedAuctionAddress));

  private constructor() {}

  static async init() {
    const auctionStore = new AuctionStore();
    auctionStore.auctionFactoryContract = new window.web3.eth.Contract(
      AuctionFactory.abi,
      import.meta.env.VITE_AUCTION_FACTORY_ADDR
    );

    auctionStore.auctionFactoryContract.events
      .AuctionCreated()
      .on("data", async (d) => {
        const { returnValues } = d;
        const { auction } = returnValues;

        console.log("Auction created");

        const model = await auctionStore.createAuction(auction as string);
        auctionStore.#setupAuctionEventListeners(model);
        auctionStore.auctions.set(auction as string, model);
        auctionStore.selectedAuctionAddress = auction as string;
      });

    const activeAuctions: string[] =
      await auctionStore.auctionFactoryContract.methods
        .getActiveAuctions()
        .call();

    const finishedAuctions: string[] =
      await auctionStore.auctionFactoryContract.methods
        .getFinishedAuctions()
        .call();

    const auctions = [...activeAuctions, ...finishedAuctions];

    for (const a of auctions) {
      const model = await auctionStore.createAuction(a);
      auctionStore.#setupAuctionEventListeners(model);
      auctionStore.auctions.set(a, model);
    }

    return auctionStore;
  }

  #setupAuctionEventListeners(model: AuctionModel) {
    if (!model.ended) {
      model.contract.events.AuctionEnded().on("data", (d) => {
        const { returnValues } = d;
        const { winner, amount } = returnValues;

        console.log("Auction ended", { model, winner, amount });
        model.ended = true;

        if (
          web3Store.account.toLowerCase() === model.beneficiary.toLowerCase()
        ) {
          console.log("Balance should get updated");
          web3Store.updateBalance();
        }

        this.auctions.delete(model.address); // TODO: won't rerender without this
        this.auctions.set(model.address, model);
      });
    }

    model.contract.events.HighestBidIncreased().on("data", (d) => {
      const { returnValues } = d;
      const { bidder, amount } = returnValues;

      console.log("Highest bid increased", { model, bidder, amount });
      model.highestBid = amount as bigint;
      model.highestBidder = bidder as string;
      console.log({ model });
      this.auctions.delete(model.address); // TODO: won't rerender without this
      this.auctions.set(model.address, model);
      // this.selectedAuctionAddress = model.address; // TODO: won't rerender without this
    });

    model.contract.events.PendingReturnIncreased().on("data", (d) => {
      const { returnValues } = d;
      const { bidder, amount } = returnValues;

      if (
        web3Store.account.toLowerCase() === (bidder as string).toLowerCase()
      ) {
        console.log("Pending return increased", { model, bidder, amount });

        model.pendingReturn = amount as bigint;
        this.auctions.delete(model.address); // TODO: won't rerender without this
        this.auctions.set(model.address, model);
      }
    });
  }

  async createAuction(address: string) {
    const contract = new window.web3.eth.Contract(Auction.abi, address);

    const beneficiary: string = await contract.methods.beneficiary().call();

    const model: AuctionModel = {
      address,
      auctionEndTime: await contract.methods.auctionEndTime().call(),
      beneficiary,
      ended: await contract.methods.ended().call(),
      highestBid: await contract.methods.highestBid().call(),
      highestBidder: await contract.methods.highestBidder().call(),
      beneficiaryRatings: await this.auctionFactoryContract.methods
        .getBeneficiarysRatings(beneficiary)
        .call(),
      pendingReturn: await contract.methods
        .getPendingReturnForBidder(web3Store.account)
        .call(),
      contract,
    };

    return model;
  }
}

export const auctionStore = await AuctionStore.init();
