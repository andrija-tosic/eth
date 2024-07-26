<script lang="ts">
  import { web3Store } from "./lib/store/web3.store.svelte";
  import Auction from "../artifacts/contracts/Auction.sol/Auction.json";
  import { onMount } from "svelte";
  import { formatTime } from "./lib/util";
  import { auctionStore } from "./lib/store/auctions.store.svelte";
  import AuctionCard from "./components/AuctionCard.svelte";
  import { ERR_INVALID_PASSWORD } from "web3";

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

  web3Store.auctionFactoryContract.events
    .AuctionCreated()
    .on("data", async (d) => {
      const { returnValues } = d;
      const { auction } = returnValues;

      const { contract, model } = await auctionStore.createAuctionModel(
        auction as string
      );
      auctionStore.auctions.set(auction as string, model);

      auctionStore.handleAuctionEndedEvent(contract, model);
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

        const data = await auctionContract.methods.bid().send({
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
        const auctionContract = new window.web3.eth.Contract(
          Auction.abi,
          auctionStore.selectedAuction.address
        );

        await auctionContract.methods
          .auctionEnd()
          .send({ from: web3Store.account });
      } catch (error) {
        console.error("Error ending auction:", error);
      }
    }
  };

  const createNewAuction = async () => {
    if (web3Store) {
      try {
        await web3Store.auctionFactoryContract.methods
          .createAuction(biddingTime)
          .send({ from: web3Store.account });
      } catch (error) {
        console.error("Error creating auction:", error);
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
    <div class="text-white">
      Balance: {parseFloat(
        window.web3.utils.fromWei(web3Store.balance, "ether")
      ).toFixed(4)} eth
    </div>
  </header>

  <main class="flex p-4">
    <div class="w-2/3 p-4">
      {#if auctionStore.selectedAuction}
        <div
          class="text-ellipsis overflow-hidden border rounded-lg p-4"
          style="background-color:#2a247a;"
        >
          <h2 class="text-3xl font-bold">
            Auction {auctionStore.selectedAuction.address}
          </h2>
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
            {window.web3.utils.fromWei(
              auctionStore.selectedAuction.highestBid,
              "ether"
            )} eth
          </p>
          <p>
            <strong>Highest Bidder:</strong>
            {auctionStore.selectedAuction.highestBidder}
          </p>
          <p>
            <strong>Your bid:</strong>
            {window.web3.utils.fromWei(
              auctionStore.selectedAuction.currentBid!,
              "ether"
            )} eth
          </p>
          <p>
            <strong>Beneficiary's ratings:</strong>
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
                  onclick={() => (selectedRating = index + 1)}
                >
                  {index + 1}
                </button>
              {/each}
            </div>
            <button
              class="mt-4 bg-purple-600 text-white py-2 px-4 rounded"
              onclick={rateAuction}
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
              onclick={bidOnAuction}
            >
              Place Bid
            </button>
            <button
              class="ml-2 bg-purple-600 text-white py-2 px-4 rounded"
              onclick={endAuction}
            >
              End auction
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
            onclick={createNewAuction}
          >
            Create Auction
          </button>
        </div>
      </div>

      <div class="mb-4">
        <h2 class="text-2xl font-bold">Active Auctions</h2>
        <div class="grid grid-cols-1 gap-4">
          {#each auctionStore.activeAuctions() as active (active.address)}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <AuctionCard
              auction={active}
              isSelected={auctionStore.selectedAuction?.address ===
                active.address}
              on:click={() => {
                auctionStore.selectedAuction = active;
              }}
            ></AuctionCard>
          {/each}
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-bold">Finished Auctions</h2>
        <div class="grid grid-cols-1 gap-4">
          {#each auctionStore.finishedAuctions() as finished (finished.address)}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <AuctionCard
              auction={finished}
              isSelected={auctionStore.selectedAuction?.address ===
                finished.address}
              on:click={() => {
                auctionStore.selectedAuction = finished;
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
