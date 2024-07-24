<script lang="ts">
  import { auctionStore } from "./auctions.svelte";
  import { web3Store } from "./lib/web3.svelte";
  import Auction from "../../artifacts/Auction.json";
  import { onMount } from "svelte";
  import { formatTime } from "./lib/util";

  let selectedRating = $state(0);
  let bidAmount = $state<number>()!;
  let biddingTime = $state<number>()!;
  let currentTimeMillis = $state(Date.now());

  onMount(() => {
    const interval = setInterval(() => {
      currentTimeMillis = Date.now();
    }, 1000);

    return () => clearInterval(interval);
  });

  console.log(web3Store.auctionFactoryContract.events);

  const auctionCreatedSub =
    web3Store.auctionFactoryContract.events.AuctionCreated();
  auctionCreatedSub.on("data", (d) => {
    console.log({ d });
  });

  const rateAuction = async () => {
    if (web3Store && auctionStore.selectedAuction) {
      try {
        const auctionContract = new window.web3.eth.Contract(
          Auction.abi,
          auctionStore.selectedAuction.address
        );

        await auctionContract.methods
          .rate(selectedRating)
          .send({ from: web3Store.account });

        alert("Rating submitted!");
      } catch (error) {
        console.error("Error submitting rating:", error);
        alert("Error submitting rating");
      }
    }
  };

  const bidOnAuction = async () => {
    if (web3Store && auctionStore.selectedAuction) {
      try {
        const auctionContract = new window.web3.eth.Contract(
          Auction.abi,
          auctionStore.selectedAuction.address
        );

        await auctionContract.methods.bid().send({
          from: web3Store.account,
          value: window.web3.utils.toWei(bidAmount.toString(), "ether"),
        });

        alert("Bid placed!");
      } catch (error) {
        console.error("Error placing bid:", error);
        alert("Error placing bid");
      }
    }
  };

  const createNewAuction = async () => {
    if (web3Store) {
      try {
        await web3Store.auctionFactoryContract.methods
          .createAuction(biddingTime)
          .send({ from: web3Store.account });

        alert("New auction created!");
      } catch (error) {
        console.error("Error creating auction:", error);
        alert("Error creating auction");
      }
    }
  };
</script>

{#if web3Store}
  <header
    class="bg-dark max-w-full h-14 flex justify-between items-center px-4"
    style="background-color:#2a247a;"
  >
    <div class="text-white font-bold">eth auctions</div>
    <div class="text-white">Account: {web3Store.account}</div>
  </header>

  <main class="flex p-4">
    <div class="w-2/3 p-4">
      {#if auctionStore.selectedAuction}
        <div class="border rounded-lg p-4" style="background-color:#2a247a;">
          <h2 class="text-3xl font-bold">Selected Auction</h2>
          <p>
            <strong>Auction End Time:</strong>
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
              currentTimeMillis >
            0
              ? "left"
              : "ago"})
          </p>
          <p>
            <strong>Beneficiary:</strong>
            {auctionStore.selectedAuction.beneficiary}
          </p>
          <p>
            <strong>Highest Bid:</strong>
            {auctionStore.selectedAuction.highestBid}
          </p>
          <p>
            <strong>Highest Bidder:</strong>
            {auctionStore.selectedAuction.highestBidder}
          </p>
          <p>
            <strong>Your bid:</strong>
            {auctionStore.selectedAuction.currentBid}
          </p>
          <p>
            <strong>Ratings:</strong>
            {auctionStore.selectedAuction.beneficiaryRatings?.length > 0
              ? auctionStore.selectedAuction.beneficiaryRatings
              : "none"}
          </p>

          <div class="mt-4">
            <h3 class="text-xl font-bold">Rate</h3>
            <div class="flex space-x-2 mt-2">
              {#each Array(5).fill(0) as _, index}
                <button
                  class="w-10 h-10 border rounded-full"
                  style={selectedRating > index
                    ? "background-color: gold;"
                    : ""}
                  on:click={() => (selectedRating = index + 1)}
                >
                  {index + 1}
                </button>
              {/each}
            </div>
            <button
              class="mt-4 bg-purple-600 text-white py-2 px-4 rounded"
              on:click={rateAuction}
            >
              Submit Rating
            </button>
          </div>

          <div class="mt-4 flex items-center">
            <h3 class="text-xl font-bold mr-2">Place a Bid:</h3>
            <input
              type="number"
              min="0"
              step="0.001"
              bind:value={bidAmount}
              class="border rounded px-2 py-1"
              placeholder="Bid amount in ETH"
            />
            <button
              class="ml-2 bg-purple-600 text-white py-2 px-4 rounded"
              on:click={bidOnAuction}
            >
              Place Bid
            </button>
          </div>
        </div>
      {/if}
    </div>

    <div class="w-1/3">
      <div class="mb-4">
        <h2 class="text-2xl font-bold">Create New Auction</h2>
        <div class="flex items-center">
          <input
            type="number"
            min="0"
            bind:value={biddingTime}
            class="rounded px-2 py-1"
            placeholder="Bidding time in seconds"
          />
          <button
            class="ml-2 bg-purple-600 text-white py-2 px-4 rounded"
            on:click={createNewAuction}
          >
            Create Auction
          </button>
        </div>
      </div>

      <div class="mb-4">
        <h2 class="text-2xl font-bold">Active Auctions</h2>
        <div class="grid grid-cols-1 gap-4">
          {#each [...auctionStore.auctions.values()].filter((e) => !e.ended) as active}
            <div
              class="border text-ellipsis overflow-hidden rounded-lg p-4 cursor-pointer"
              class:selected-auction={auctionStore.selectedAuction === active}
              on:click={() => {
                auctionStore.selectedAuction = active;
              }}
            >
              <p>
                <strong>Auction End Time:</strong>
                {new Date(
                  Number(active.auctionEndTime) * 1000
                ).toLocaleString()}
              </p>
              <p><strong>Beneficiary:</strong> {active.beneficiary}</p>
              <p><strong>Highest Bid:</strong> {active.highestBid}</p>
              <p><strong>Highest Bidder:</strong> {active.highestBidder}</p>
              <p><strong>Ended:</strong> {active.ended}</p>
            </div>
          {/each}
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-bold">Finished Auctions</h2>
        <div class="grid grid-cols-1 gap-4">
          {#each [...auctionStore.auctions.values()].filter((e) => e.ended) as finished}
            <div
              class="border rounded-lg p-4 cursor-pointer"
              class:selected-auction={auctionStore.selectedAuction === finished}
              on:click={() => {
                auctionStore.selectedAuction = finished;
              }}
            >
              <p>
                <strong>Auction End Time:</strong>
                {new Date(
                  Number(finished.auctionEndTime) * 1000
                ).toLocaleString()}
              </p>
              <p><strong>Beneficiary:</strong> {finished.beneficiary}</p>
              <p><strong>Highest Bid:</strong> {finished.highestBid}</p>
              <p><strong>Highest Bidder:</strong> {finished.highestBidder}</p>
              <p><strong>Ended:</strong> {finished.ended}</p>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </main>
{:else}
  <div class="text-red-500 text-center mt-4">window.ethereum not enabled.</div>
{/if}
