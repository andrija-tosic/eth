<script lang="ts">
  import { ethersStore } from "./lib/store/ethers.store.svelte";
  import { formatTime } from "./lib/util";
  import AuctionCard from "./components/AuctionCard.svelte";
  import Header from "./components/Header.svelte";
  import { ethers } from "ethers";
  import { auctionStore } from "./lib/store/auctions.store.svelte";
  
  const d = new Date();

  let selectedRating = $state(0);
  let bidAmount = $state<number>()!;
  let endTime = $state<string>(new Date(d.getTime() + (-d.getTimezoneOffset() * 60 + 120) * 1000).toISOString().slice(0, -5))!;
  let item = $state<string>('item')!;
  let description = $state<string>('desc')!;
  let currentTimeMillis = $state(Date.now());

  let showDialog = $state(false);
  let auctionTypeTab = $state<'active' | 'finished'>('active');
  let selectedAuctions = $derived(auctionTypeTab === 'active' ? auctionStore.activeAuctions : auctionStore.finishedAuctions)

  $effect(() => {
    const interval = setInterval(() => {
      currentTimeMillis = Date.now();
    }, 1000);

    return () => clearInterval(interval);
  });


  const createAuction = async () => {
      try {
        const tx = await auctionStore.factoryContract.createAuction({ item, description, endTime: Math.floor(new Date(endTime).getTime() / 1000) });
        await tx.wait();
        showDialog = false;
        console.log('auction created')
      } catch (error) {
        alert((error as any).reason);
      }
  };

  const bidOnAuction = async () => {
      try {
        const auctionContract = auctionStore.selectedAuction!.contract;
        const tx = await auctionContract.bid({
          value: ethers.parseUnits(bidAmount.toString(), 'ether')
        });
        await tx.wait();

        await ethersStore.updateBalance();
      } catch (error) {
        console.error(error)
        alert((error as any).reason);
      }
  };

  const withdrawBid = async () => {
      try {
        const auctionContract = auctionStore.selectedAuction!.contract;
        const tx = await auctionContract.withdraw();
        await tx.wait();

        auctionStore.selectedAuction!.pendingReturn = 0n;
        await ethersStore.updateBalance();
      } catch (error) {
        alert((error as any).reason);
      }
  };

  const endAuction = async () => {
      try {
        const auctionContract = auctionStore.selectedAuction!.contract;
        const tx = await auctionContract.end();
        await tx.wait();
      } catch (error) {
        alert((error as any).reason);
      }
  };

  const rateAuction = async () => {
      try {
        const auctionContract = auctionStore.selectedAuction!.contract;
        const tx = await auctionContract.rate(selectedRating);
        await tx.wait();

        auctionStore.selectedAuction!.beneficiaryRatings = await auctionStore.factoryContract
          .getBeneficiarysRatings(auctionStore.selectedAuction!.beneficiary);
      } catch (error) {
        alert((error as any).reason);
      }
  };

</script>

<Header></Header>
<main class="flex p-4">
  <div class="w-2/3 p-4">
    {#if auctionStore.selectedAuction && auctionStore.selectedAuction.ended !== (auctionTypeTab === 'active')}
      <div
        class="border border-gray-900 text-ellipsis overflow-hidden rounded-lg p-4"
        style="background-color:#2a247a;"
      >
      <div class="flex justify-between align-bottom">
        <h2 class="text-2xl font-bold">
          {auctionStore.selectedAuction.item}
        </h2>
        <h2 class="flex justify-end">
          {auctionStore.selectedAuction.address}
        </h2>
      </div>
      <i>
          {auctionStore.selectedAuction.description}
      </i>
      <div class="mb-4">
        <p>
          <strong>ends at</strong>
          {new Date(Number(auctionStore.selectedAuction.endTime) * 1000).toLocaleString()} 
          ({formatTime(Math.abs(Number(auctionStore.selectedAuction.endTime) * 1000 - currentTimeMillis))} 
          {Number(auctionStore.selectedAuction.endTime) * 1000 - currentTimeMillis >= 1.0 ? "left" : "ago"})
        </p>
        <p>
          <strong>beneficiary</strong>
          <span class="{auctionStore.selectedAuction.beneficiary.toLowerCase() === ethersStore.account.toLowerCase() ? 'font-bold': ''}">
            {auctionStore.selectedAuction.beneficiary}
          </span>
        <p>
          <strong>highest bid</strong>
          {auctionStore.selectedAuction.highestBid > 0
            ? ethers.formatEther(auctionStore.selectedAuction.highestBid) + ` ETH (${auctionStore.selectedAuction.highestBidder})`
            : 'none'}
        </p>
        <p>
          <strong>bidders</strong>
          {auctionStore.selectedAuction.bidderCount}
        </p>
        <p>
          <strong>rating</strong>
          {auctionStore.selectedAuction.beneficiaryRatings?.length > 0
            ? parseFloat((Number(auctionStore.selectedAuction.beneficiaryRatings.reduce((acc, e) => acc += e, 0n)) 
            / (auctionStore.selectedAuction.beneficiaryRatings.length)).toFixed(2)) 
            : "none"}
        </p>
      </div>

        {#if auctionStore.selectedAuction.beneficiary.toLowerCase() !== ethersStore.account.toLowerCase()}
          <div class="mb-4 flex items-center gap-2">
            <h3 class="text-xl font-bold mr-2">place a bid:</h3>
            <input
              type="number"
              min="0"
              step="0.001"
              bind:value={bidAmount}
              class="border border-gray-900 rounded px-2 py-1"
              placeholder="bid amount in ETH"
            />
            <button
              class="bg-gray-900 text-white py-2 px-4 rounded"
              onclick={bidOnAuction}
            >
              bid {bidAmount} {bidAmount > 0 ? 'ETH' : ''}
            </button>
          </div>
          <div class="mb-4">
            <div class="flex items-center space-x-2 mt-2">
              {#each Array(5).fill(0) as _, index}
                <button
                  class="w-10 h-10 border rounded-full {selectedRating > index ? 'bg-gray-900':''}"
                  onclick={() => (selectedRating = index + 1)}
                >
                  {index + 1}
                </button>
              {/each}
              <button
                class=" bg-gray-900 text-white py-2 px-4 rounded"
                onclick={rateAuction}
              >
                rate
              </button>
            </div>
        </div>
        {/if}

        <div class="flex justify-between">
          {#if auctionStore.selectedAuction.pendingReturn > 0}
            <p>
              <strong>you can withdraw</strong>
              {ethers.formatEther(auctionStore.selectedAuction.pendingReturn!)} ETH
            </p>
            <button
              class="bg-gray-900 text-white py-2 px-4 rounded"
              onclick={withdrawBid}
            >
              withdraw bid
            </button>
          {/if}

          {#if !auctionStore.selectedAuction.ended && ethersStore.account.toLowerCase() === auctionStore.selectedAuction.beneficiary.toLowerCase()}
            <button
              class="bg-gray-900 text-white py-2 px-4 rounded"
              onclick={endAuction}
            >
              end auction
            </button>
          {/if}
        </div>
      </div>
    {/if}
  </div>

  <div class="w-1/3 p-4">
    <div class="mb-4 flex justify-end">
      <button
        class="bg-gray-900 text-white py-2 px-4 rounded"
        onclick={() => (showDialog = true)}
      >
        new auction
      </button>
    </div>
        <div class="flex mb-4">
          <button
            class="w-1/2 py-2 px-4 border border-r-0 rounded-l-lg" style="background-color:{auctionTypeTab === 'active' ? 'var(--accent)' : ''}"
            onclick={() => (auctionTypeTab = 'active')}
          >
            active
          </button>
          <button
            class="w-1/2 py-2 px-4 border rounded-r-lg" style="background-color:{auctionTypeTab === 'finished' ? 'var(--accent)' : ''}"
            onclick={() => (auctionTypeTab = 'finished')}
          >
            finished
          </button>
        </div>
    
          {#if selectedAuctions.length}
          <div class="p-2 rounded">
            <div class="grid grid-cols-1 gap-4">
              {#each selectedAuctions as auctions (auctions.address)}
                <AuctionCard
                  auction={auctions}
                  isSelected={auctionStore.selectedAuction?.address.toLowerCase() === auctions.address.toLowerCase()}
                  on:click={() => {
                    auctionStore.selectedAuctionAddress = auctions.address;
                  }}
                ></AuctionCard>
              {/each}
            </div>
          </div>
          {/if}
    </div>
</main>

{#if showDialog}
  <div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
    <div class="rounded-lg p-6 w-full max-w-md" style="background-color: var(--bg)">
      <h2 class="text-2xl font-bold mb-4">start a new auction</h2>
      <div class="mb-4">
        <i class="block">item name</i>
        <input
        name="item"
          type="text"
          bind:value={item}
          class="w-full border border-gray-900 rounded px-3 py-2"
          placeholder="Item name"
        />
      </div>

      <div class="mb-4">
        <i class="block">description</i>
        <textarea
          name="description"
          bind:value={description}
          class="w-full border border-gray-900 rounded px-3 py-2"
          placeholder="Description"
        ></textarea>
      </div>

      <div class="mb-4">
        <i class="block">end time</i>
        <input
          name="endtime"
          type="datetime-local"
          bind:value={endTime}
          class="w-full border border-gray-900 rounded px-3 py-2"
        />
      </div>

      <div class="flex justify-end">
        <button
        class="text-white py-2 px-4 rounded"
        onclick={() => (showDialog = false)}
      >
        cancel
      </button>
        <button
          class="bg-gray-900 text-white py-2 px-4 rounded"
          onclick={createAuction}
        >
          create
        </button>
      </div>
    </div>
  </div>
{/if}
