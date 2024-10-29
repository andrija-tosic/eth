<svelte:options customElement="auction-card" runes={true} />

<script lang="ts">
  import type { AuctionModel } from "../lib/model/auction.model";
  import { ethers } from "ethers";

  let {
    auction,
    isSelected,
    onclick,
  }: {
    auction: AuctionModel;
    isSelected: boolean;
    onclick: () => void;
  } = $props();
</script>

<button
  class="border border-gray-300 text-ellipsis overflow-hidden rounded-lg p-4 cursor-pointer"
  class:selected-auction={isSelected}
  onclick={() => onclick()}
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
</button>

<style>
  .selected-auction {
    background-color: #2a247a;
    color: white;
  }
</style>
