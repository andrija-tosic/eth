import type { AuctionModel } from "./lib/auction";

class AuctionStore {
  auctions = $state<Map<string, AuctionModel>>(new Map<string, AuctionModel>());
  selectedAuction = $state(
    this.auctions.get(this.auctions.values().next().value)
  );
}

export const auctionStore = new AuctionStore();
