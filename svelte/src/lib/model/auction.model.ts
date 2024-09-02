import type { Contract, ContractAbi } from "web3";

export type AuctionModel = {
  address: string;
  auctionEndTime: number;
  beneficiary: string;
  highestBid: bigint;
  highestBidder: string;
  ended: boolean;
  beneficiaryRatings: bigint[];
  pendingReturn: bigint;
  contract: Contract<ContractAbi>;
};
