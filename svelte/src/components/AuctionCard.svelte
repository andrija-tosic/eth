<svelte:options customElement="auction-card" runes={true} />

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { AuctionModel } from "../lib/model/auction.model";
  import { ethers } from "ethers";

  const dispatch = createEventDispatcher(); // until "$$props() is not defined" error gets fixed

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
  class="border border-gray-300 text-ellipsis overflow-hidden rounded-lg p-4 cursor-pointer"
  class:selected-auction={isSelected}
  onclick={() => dispatch("click")}
>
  <!-- <p>
    {auction.address}
  </p> -->
  <p>
    <strong>{auction.item}</strong>
  </p>

  <i>
    {auction.description}
  </i>
  <p>
    <strong>ends at</strong>
    {new Date(Number(auction.endTime) * 1000).toLocaleString()}
  </p>
  <p><strong>beneficiary</strong> {auction.beneficiary}</p>
  <p>
    <strong>highest bid</strong>
    {ethers.formatEther(auction.highestBid)} ETH
  </p>
</div>

<style>
  .selected-auction {
    background-color: #2a247a;
    color: white;
  }
</style>
