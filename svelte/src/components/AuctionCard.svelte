<svelte:options customElement="auction-card" runes={true} />

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { AuctionModel } from "../lib/model/auction.model";

  const dispatch = createEventDispatcher(); // until $$props() is not defined error gets fixed

  let {
    auction,
    isSelected,
  }: {
    auction: AuctionModel;
    isSelected: boolean;
  } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="border text-ellipsis overflow-hidden rounded-lg p-4 cursor-pointer"
  class:selected-auction={isSelected}
  onclick={() => dispatch("click")}
>
  <b>
    {auction.address}
  </b>
  <p>
    <strong>Auction End Time:</strong>
    {new Date(Number(auction.auctionEndTime) * 1000).toLocaleString()}
  </p>
  <p><strong>Beneficiary:</strong> {auction.beneficiary}</p>
  <p><strong>Highest Bid:</strong> {auction.highestBid}</p>
  <p><strong>Highest Bidder:</strong> {auction.highestBidder}</p>
</div>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .selected-auction {
    background-color: #2a247a;
    color: white;
  }
</style>
