<script lang="ts">
  import { web3Store } from "./lib/store/web3.store.svelte";
  import { formatTime } from "./lib/util";
  import { auctionStore } from "./lib/store/auctions.store.svelte";
  import AuctionCard from "./components/AuctionCard.svelte";
  import Header from "./components/Header.svelte";

  let selectedRating = $state(0);
  let bidAmount = $state<number>()!;
  let biddingTime = $state<number>()!;
  let currentTimeMillis = $state(Date.now());

  $effect(() => {
    const interval = setInterval(() => {
      currentTimeMillis = Date.now();
    }, 1000);

    console.log(auctionStore.auctions)

    return () => clearInterval(interval);

  });

  const rateAuction = async () => {
    if (web3Store && auctionStore.selectedAuction) {
      try {
        const auctionContract = auctionStore.selectedAuction.contract;

        console.log('Rating auction...')
        await auctionContract.methods
          .rate(selectedRating)
          .send({ from: web3Store.account });

        console.log("Rating submitted!");
      } catch (error) {
        console.error("Error submitting rating:", error);
      }
    }
  };

  const bidOnAuction = async () => {
    if (web3Store && auctionStore.selectedAuction) {
      try {
        const auctionContract = auctionStore.selectedAuction.contract;

        console.log('Bidding on auction...')
          await auctionContract.methods.bid().send({
          from: web3Store.account,
          value: window.web3.utils.toWei(bidAmount.toString(), "ether"),
        });
      } catch (error) {
        console.error("Error placing bid:", error);
        console.log(JSON.stringify(error,null,2))
        
        let errFlat = JSON.stringify(error);
        let { innerError : { message } } = JSON.parse(errFlat);

        message = message.replace('execution reverted: ', '');
        console.log(message);
      }
    }
  };

  const endAuction = async () => {
    if (web3Store && auctionStore.selectedAuction) {
      try {
        const auctionContract = auctionStore.selectedAuction.contract;
        
        console.log('Ending auction...')
        await auctionContract.methods.auctionEnd().send({ from: web3Store.account });
      } catch (error) {
        console.error("Error ending auction:", error);
      }
    }
  };

  const withdrawBid = async () => {
    if (web3Store && auctionStore.selectedAuction) {
      try {
        const auctionContract = auctionStore.selectedAuction.contract;

        console.log('Withdrawing bid...')
        await auctionContract.methods
          .withdraw()
          .send({ from: web3Store.account });
      } catch (error) {
        console.error("Error withdrawing bid:", error);
      }
    }
  };

  const createNewAuction = async () => {
    if (web3Store) {
      try {
        console.log('Creating auction...')
        await auctionStore.auctionFactoryContract.methods
          .createAuction(biddingTime)
          .send({ from: web3Store.account });
      } catch (error) {
        console.error("Error creating auction:", error);
      }
    }
  };
</script>

{#if web3Store}
  <Header></Header>
  <main class="flex p-4">
    <div class="w-2/3 p-4">
      {#if auctionStore.selectedAuction}
        <div
          class="border border-gray-900 text-ellipsis overflow-hidden rounded-lg p-4"
          style="background-color:#2a247a;"
        >
          <h2 class="text-3xl font-bold">
            auction {auctionStore.selectedAuction.address}
          </h2>
          <p>
            <strong>auction end time:</strong>
            {new Date(
              Number(auctionStore.selectedAuction.auctionEndTime) * 1000
            ).toLocaleString()}

            ({formatTime(
              Math.abs(
                Number(auctionStore.selectedAuction.auctionEndTime) * 1000 -
                  currentTimeMillis
              )
            )}
            {Number(auctionStore.selectedAuction.auctionEndTime) * 1000 -
              currentTimeMillis >= 1.0
              ? "left"
              : "ago"})
          </p>
          <p>
            <strong>beneficiary:</strong>
            {auctionStore.selectedAuction.beneficiary}
          </p>
          <p>
            <strong>highest bid:</strong>
            {window.web3.utils.fromWei(
              auctionStore.selectedAuction.highestBid,
              "ether"
            )} ETH
          </p>
          <p>
            <strong>highest bidder:</strong>
            {auctionStore.selectedAuction.highestBidder}
          </p>
          <p>
            <strong>you can withdraw:</strong>
            {window.web3.utils.fromWei(
              auctionStore.selectedAuction.pendingReturn!,
              "ether"
            )} ETH
          </p>
          <p>
            <strong>beneficiary's ratings:</strong>
            {auctionStore.selectedAuction.beneficiaryRatings?.length > 0
              ? auctionStore.selectedAuction.beneficiaryRatings
              : "none"}
          </p>

          <div class="mt-4">
            <h3 class="text-xl font-bold">rate</h3>
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
            </button>    </div>
      
          </div>

          <div class="mt-4 flex items-center">
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
              class="ml-2 bg-gray-900 text-white py-2 px-4 rounded"
              onclick={bidOnAuction}
            >
              place bid
            </button>
            
          </div>

          <div class="mt-4 flex justify-between">
            <button
            class="ml-2 bg-gray-900 text-white py-2 px-4 rounded"
            onclick={withdrawBid}
          >
              withdraw bid
            </button>
          
            <button
            class="ml-2 bg-gray-900 text-white py-2 px-4 rounded"
            onclick={endAuction}
          >
            end auction
          </button>
        </div>
        </div>
        {:else}
        <h2>create an auction.
        </h2>
      {/if}
    </div>

    <div class="w-1/3">
      <div class="mb-4">
        <h2 class="text-2xl font-bold">create new auction</h2>
        <div class="flex items-center">
          <input
            type="number"
            min="0"
            bind:value={biddingTime}
            class="rounded px-2 py-1"
            placeholder="bidding time (secs)"
          />
          <button
            class="ml-2 bg-gray-900 text-white py-2 px-4 rounded"
            onclick={createNewAuction}
          >
            create auction
          </button>
        </div>
      </div>

      <div class="mb-4">
        {#if auctionStore.activeAuctions.length}
        <h2>active auctions</h2>
      {/if}
        <div class="grid grid-cols-1 gap-4">
          {#each auctionStore.activeAuctions as active (active.address)}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <AuctionCard
              auction={active}
              isSelected={auctionStore.selectedAuction?.address.toLowerCase() ===
                active.address.toLowerCase()}
              on:click={() => {
                auctionStore.selectedAuctionAddress = active.address;
              }}
            ></AuctionCard>
          {/each}
        </div>
      </div>

      {#if auctionStore.activeAuctions.length && auctionStore.finishedAuctions.length}
        <hr class="mt-4 mb-4" />
      {/if}

      <div>
      {#if auctionStore.finishedAuctions.length}
        <h2>finished auctions</h2>
      {/if}
        <div class="grid grid-cols-1 gap-4">
          {#each auctionStore.finishedAuctions as finished (finished.address)}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <AuctionCard
              auction={finished}
              isSelected={auctionStore.selectedAuction?.address.toLowerCase() ===
                finished.address.toLowerCase()}
              on:click={() => {
                auctionStore.selectedAuctionAddress = finished.address;
              }}
            ></AuctionCard>
          {/each}
        </div>
      </div>
    </div>
  </main>
{:else}
  <div class="text-red-500 text-center mt-4">window.ethereum not enabled.</div>
{/if}
