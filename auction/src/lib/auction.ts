export type AuctionModel = {
  address: string;
  auctionEndTime: number;
  beneficiary: string;
  highestBid: number;
  highestBidder: number;
  ended: boolean;
  beneficiaryRatings: number[];
  currentBid?: number;
};
