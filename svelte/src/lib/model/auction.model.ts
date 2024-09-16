import type { Auction } from "../../../../typechain-types";

export type AuctionModel = {
  address: string;
  item: string;
  description: string;
  endTime: bigint;
  beneficiary: string;
  highestBid: bigint;
  highestBidder: string;
  bidderCount: bigint;
  ended: boolean;
  beneficiaryRatings: bigint[];
  pendingReturn: bigint;
  contract: Auction;
};
