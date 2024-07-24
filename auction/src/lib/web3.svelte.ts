import Web3, { Contract, type ContractAbi } from "web3";
import { auctionStore } from "../auctions.svelte";
import type { AuctionModel } from "./auction";
import AuctionFactory from "../../../artifacts/AuctionFactory.json";
import Auction from "../../../artifacts/Auction.json";

class Web3Store {
  account = $state<string>();
  auctionFactoryContract: Contract<
    | {
        inputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        outputs: {
          internalType: string;
          name: string;
          type: string;
        }[];
        stateMutability: string;
        type: string;
      }[]
  > = $state()!;

  constructor() {
    window.web3 = new Web3(window.ethereum);
    this.auctionFactoryContract = new window.web3.eth.Contract(
      AuctionFactory.abi,
      "0x5cee5053F22845aF2387E0d27927e3e2e0fCdC13"
    );
  }

  async init() {
    if (!window.ethereum) return;

    const accounts = await window.ethereum.request<string[]>({
      method: "eth_requestAccounts",
    });

    this.account = accounts![0]!;

    const activeAuctions =
      await this.auctionFactoryContract!.methods.getActiveAuctions().call();

    const auctionModels = await Promise.all(
      activeAuctions!.map(async (a) => {
        const auctionContract = new window.web3.eth.Contract(Auction.abi, a);

        const beneficiary: string = await auctionContract.methods
          .beneficiary()
          .call();

        return {
          address: a,
          auctionEndTime: await auctionContract.methods.auctionEndTime().call(),
          beneficiary,
          ended: await auctionContract.methods.ended().call(),
          highestBid: await auctionContract.methods.highestBid().call(),
          highestBidder: await auctionContract.methods.highestBidder().call(),
          beneficiaryRatings: await this.auctionFactoryContract.methods
            .getBeneficiarysRatings(beneficiary)
            .call(),
          currentBid: await auctionContract.methods
            .getPendingReturnForBidder(this.account)
            .call(),
        } as AuctionModel;
      })
    );

    auctionModels.forEach((a) => {
      auctionStore.auctions.set(a.address, a);
    });

    const finishedAuctions = await this.auctionFactoryContract.methods
      .getFinishedAuctions()
      .call();

    const finishedAuctionModels = await Promise.all(
      finishedAuctions!.map(async (a) => {
        const auctionContract = new window.web3.eth.Contract(Auction.abi, a);

        const beneficiary: string = await auctionContract.methods
          .beneficiary()
          .call();

        return {
          address: a,
          auctionEndTime: await auctionContract.methods.auctionEndTime().call(),
          beneficiary,
          ended: await auctionContract.methods.ended().call(),
          highestBid: await auctionContract.methods.highestBid().call(),
          highestBidder: await auctionContract.methods.highestBidder().call(),
          beneficiaryRatings: await this.auctionFactoryContract.methods
            .getBeneficiarysRatings(beneficiary)
            .call(),
          currentBid: await auctionContract.methods
            .getPendingReturnForBidder(this.account)
            .call(),
        } as AuctionModel;
      })
    );

    finishedAuctionModels.forEach((a) => {
      auctionStore.auctions.set(a.address, a);
    });

    auctionStore.selectedAuction = auctionStore.auctions.values().next().value;
  }
}

export const web3Store = new Web3Store();
await web3Store.init();
