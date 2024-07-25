import type { AuctionModel } from "../model/auction.model";
import { web3Store } from "./web3.store.svelte";
import Auction from "../../../artifacts/contracts/auction.sol/Auction.json";
import { SvelteMap } from "svelte/reactivity";
import type { Contract, ContractAbi } from "web3";

class AuctionStore {
  auctions = $state(new SvelteMap<string, AuctionModel>());
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

      this.handleAuctionEnded(contract, model, a);

      contract.events.HighestBidIncreased().on("data", (d) => {
        const { returnValues } = d;
        const { bidder, amount } = returnValues;

        console.log("Highest bid increased", { model, bidder, amount });
        model.highestBid = amount as number;
        model.highestBidder = bidder as number;
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

  handleAuctionEnded(
    contract: Contract<ContractAbi>,
    model: AuctionModel,
    a: string
  ) {
    contract.events.AuctionEnded().on("data", (d) => {
      const { returnValues } = d;
      const { winner, amount } = returnValues;

      console.log("Auction ended", { model, winner, amount });
      model.ended = true;

      auctionStore.auctions.set(a, model);
    });
  }

  async createAuctionModel(address: string) {
    const auctionContract = new window.web3.eth.Contract(Auction.abi, address);

    const beneficiary: string = await auctionContract.methods
      .beneficiary()
      .call();

    return {
      contract: auctionContract,
      model: {
        address,
        auctionEndTime: await auctionContract.methods.auctionEndTime().call(),
        beneficiary,
        ended: await auctionContract.methods.ended().call(),
        highestBid: await auctionContract.methods.highestBid().call(),
        highestBidder: await auctionContract.methods.highestBidder().call(),
        beneficiaryRatings: await web3Store.auctionFactoryContract.methods
          .getBeneficiarysRatings(beneficiary)
          .call(),
        currentBid: await auctionContract.methods
          .getPendingReturnForBidder(web3Store.account)
          .call(),
      } as AuctionModel,
    };
  }
}

export const auctionStore = new AuctionStore();
await auctionStore.init();
