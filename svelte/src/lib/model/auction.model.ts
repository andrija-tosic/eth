export type AuctionModel = {
  address: string;
  auctionEndTime: number;
  beneficiary: string;
  highestBid: bigint;
  highestBidder: string;
  ended: boolean;
  beneficiaryRatings: number[];
  currentBid?: bigint;
};
