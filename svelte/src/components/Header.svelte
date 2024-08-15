<script lang="ts">
  import { web3Store } from "../lib/store/web3.store.svelte";
</script>

<header
  class="bg-dark max-w-full h-14 flex justify-between items-center px-4"
  style="background-color:#2a247a;"
>
  <div class="text-white font-bold">auctions dApp</div>
  <div class="text-white">Account: {web3Store.account}</div>
  <div class="text-white">
    Balance: {parseFloat(
      window.web3.utils.fromWei(web3Store.balance, "ether")
    ).toFixed(4)} ETH
  </div>
</header>
