<script lang="ts">
  import { ethers } from "ethers";
  import { ethersStore } from "../lib/store/ethers.store.svelte";
</script>

<header
  class="bg-dark max-w-full h-14 flex justify-between items-center px-4"
  style="background-color:#2a247a;"
>
  <div class="text-white font-bold">auctions dApp</div>
  <div class="text-white">account {ethersStore.account}</div>
  <div class="text-white">
    Balance: {parseFloat(ethers.formatUnits(ethersStore.balance, "ether")).toFixed(4)} ETH
  </div>
</header>
