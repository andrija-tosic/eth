import type { AuctionModel } from "../model/auction.model";
import { web3Store } from "./web3.store.svelte";
import Auction from "../../../../artifacts/contracts/Auction.sol/Auction.json";
import { SvelteMap } from "svelte/reactivity";
import type { Contract, ContractAbi } from "web3";

class AuctionStore {
  auctions = $state(new SvelteMap<string, AuctionModel>());

  activeAuctions = $derived(() =>
    [...auctionStore.auctions.values()]
      .filter((e) => !e.ended)
      .sort((e1, e2) => Number(e2.auctionEndTime) - Number(e1.auctionEndTime))
  );

  finishedAuctions = $derived(() =>
    [...auctionStore.auctions.values()]
      .filter((e) => e.ended)
      .sort((e1, e2) => Number(e2.auctionEndTime) - Number(e1.auctionEndTime))
  );

  selectedAuction = $state(
    this.auctions.get(this.auctions.values().next().value)
  );

  async init() {
    const activeAuctions: string[] =
      await web3Store.auctionFactoryContract.methods.getActiveAuctions().call();

    const finishedAuctions: string[] =
      await web3Store.auctionFactoryContract.methods
        .getFinishedAuctions()
        .call();

    const auctions = [...activeAuctions, ...finishedAuctions];

    for (const a of auctions) {
      const { contract, model } = await this.createAuctionModel(a);

      if (!model.ended) {
        this.handleAuctionEndedEvent(contract, model);
      }

      contract.events.HighestBidIncreased().on("data", (d) => {
        const { returnValues } = d;
        const { bidder, amount } = returnValues;

        console.log("Highest bid increased", { model, bidder, amount });
        model.highestBid = amount as bigint;
        model.highestBidder = bidder as string;
        this.auctions.set(a, model); // won't re-render without this
      });

      this.auctions.set(a, model);
    }

    if (this.auctions.size > 0) {
      this.selectedAuction = [...this.auctions.values()].reduce(
        (prev, current) => {
          return prev && prev.auctionEndTime > current.auctionEndTime
            ? prev
            : current;
        }
      );
    }
  }

  handleAuctionEndedEvent(
    contract: Contract<ContractAbi>,
    model: AuctionModel
  ) {
    contract.events.AuctionEnded().on("data", (d) => {
      const { returnValues } = d;
      const { winner, amount } = returnValues;

      console.log("Auction ended", { model, winner, amount });
      model.ended = true;

      auctionStore.auctions.set(model.address, model);
    });
  }

  async createAuctionModel(address: string) {
    const contract = new window.web3.eth.Contract(Auction.abi, address);

    const beneficiary: string = await contract.methods.beneficiary().call();

    const model: AuctionModel = {
      address,
      auctionEndTime: await contract.methods.auctionEndTime().call(),
      beneficiary,
      ended: await contract.methods.ended().call(),
      highestBid: await contract.methods.highestBid().call(),
      highestBidder: await contract.methods.highestBidder().call(),
      beneficiaryRatings: await web3Store.auctionFactoryContract.methods
        .getBeneficiarysRatings(beneficiary)
        .call(),
      currentBid: await contract.methods
        .getPendingReturnForBidder(web3Store.account)
        .call(),
    };

    return {
      contract,
      model,
    };
  }
}

export const auctionStore = new AuctionStore();
await auctionStore.init();
