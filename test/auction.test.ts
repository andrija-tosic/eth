import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import hardhat from "hardhat";
import Auction from "../artifacts/contracts/Auction.sol/Auction.json";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Web3 } from "web3";

const hre = hardhat as unknown as HardhatRuntimeEnvironment & { web3: Web3 };

describe("Auction", function () {
  async function deployAuctionFixture() {
    const ONE_HOUR_IN_SECS = 60 * 60;
    const [deployer, beneficiary, bidder1, bidder2] =
      await hre.web3.eth.getAccounts();

    const auctionContract = new hre.web3.eth.Contract(Auction.abi);
    auctionContract.handleRevert = true;

    const rawContract = auctionContract.deploy({
      data: Auction.bytecode,
      arguments: [ONE_HOUR_IN_SECS, beneficiary],
    });

    const estimateGas = await rawContract.estimateGas({
      from: deployer,
    });

    const auction = await rawContract.send({
      from: deployer,
      gas: estimateGas.toString(),
      gasPrice: "10000000000",
    });

    return {
      auction,
      deployer,
      beneficiary,
      bidder1,
      bidder2,
      auctionEndTime: (await time.latest()) + ONE_HOUR_IN_SECS,
    };
  }

  describe("Deployment", function () {
    it("Should set the right beneficiary and auctionEndTime", async function () {
      const { auction, beneficiary, auctionEndTime } = await loadFixture(
        deployAuctionFixture
      );

      const setBeneficiary = await auction.methods.beneficiary().call();
      const setAuctionEndTime = await auction.methods.auctionEndTime().call();

      expect(setBeneficiary).to.equal(beneficiary);
      expect(Number(setAuctionEndTime)).to.be.closeTo(auctionEndTime, 10); // Allowing some time deviation
    });
  });

  describe("Bidding", function () {
    it("Should accept bids higher than the current highest bid", async function () {
      const { auction, bidder1, bidder2 } = await loadFixture(
        deployAuctionFixture
      );

      await auction.methods.bid().send({ from: bidder1, value: "1000" });

      let highestBidder = await auction.methods.highestBidder().call();
      let highestBid = await auction.methods.highestBid().call();
      expect(highestBidder).to.equal(bidder1);
      expect(highestBid).to.equal("1000");

      await auction.methods.bid().send({ from: bidder2, value: "2000" });

      highestBidder = await auction.methods.highestBidder().call();
      highestBid = await auction.methods.highestBid().call();
      expect(highestBidder).to.equal(bidder2);
      expect(highestBid).to.equal("2000");
    });

    it("Should revert if bid is not higher than the current highest bid", async function () {
      const { auction, bidder1, bidder2 } = await loadFixture(
        deployAuctionFixture
      );

      await auction.methods.bid().send({ from: bidder1, value: "1000" });

      await expect(
        auction.methods.bid().send({ from: bidder2, value: "500" })
      ).to.be.revertedWith("BidNotHighEnough");
    });

    it("Should revert if auction has ended", async function () {
      const { auction, bidder1, auctionEndTime } = await loadFixture(
        deployAuctionFixture
      );

      await time.increaseTo(auctionEndTime + 1);

      await expect(
        auction.methods.bid().send({ from: bidder1, value: "1000" })
      ).to.be.revertedWith("AuctionAlreadyEnded");
    });
  });

  describe("Withdrawals", function () {
    it("Should allow previous bidders to withdraw their funds", async function () {
      const { auction, bidder1, bidder2 } = await loadFixture(
        deployAuctionFixture
      );

      await auction.methods.bid().send({ from: bidder1, value: "1000" });
      await auction.methods.bid().send({ from: bidder2, value: "2000" });

      const initialBalance = await hre.web3.eth.getBalance(bidder1);

      await auction.methods.withdraw().send({ from: bidder1 });

      const finalBalance = await hre.web3.eth.getBalance(bidder1);
      expect(Number(finalBalance)).to.be.gt(Number(initialBalance));
    });
  });

  describe("Auction End", function () {
    it("Should allow the beneficiary to end the auction and receive funds", async function () {
      const { auction, beneficiary, bidder1, auctionEndTime } =
        await loadFixture(deployAuctionFixture);

      await auction.methods.bid().send({ from: bidder1, value: "1000" });

      await time.increaseTo(auctionEndTime + 1);

      await auction.methods.auctionEnd().send({ from: beneficiary });

      const ended = await auction.methods.ended().call();
      expect(ended).to.be.true;

      const beneficiaryBalance = await hre.web3.eth.getBalance(beneficiary);
      expect(Number(beneficiaryBalance)).to.be.gt(Number(auctionEndTime)); // Ensure beneficiary received funds
    });

    it("Should revert if non-beneficiary tries to end the auction", async function () {
      const { auction, bidder1, bidder2, auctionEndTime } = await loadFixture(
        deployAuctionFixture
      );

      await auction.methods.bid().send({ from: bidder1, value: "1000" });

      await time.increaseTo(auctionEndTime + 1);

      await expect(
        auction.methods.auctionEnd().send({ from: bidder2 })
      ).to.be.revertedWith("Only beneficiary can end the auction.");
    });
  });

  describe("Ratings", function () {
    it("Should allow valid ratings from eligible users", async function () {
      const { auction, bidder1, auctionEndTime } = await loadFixture(
        deployAuctionFixture
      );

      await auction.methods.bid().send({ from: bidder1, value: "1000" });
      await time.increaseTo(auctionEndTime + 1);
      await auction.methods.auctionEnd().send({ from: bidder1 });

      await auction.methods.rate(5).send({ from: bidder1 });
      const rating = await auction.methods.ratings(bidder1).call();

      expect(rating).to.equal("5");
    });

    it("Should revert if rating is invalid", async function () {
      const { auction, bidder1, auctionEndTime } = await loadFixture(
        deployAuctionFixture
      );

      await auction.methods.bid().send({ from: bidder1, value: "1000" });
      await time.increaseTo(auctionEndTime + 1);
      await auction.methods.auctionEnd().send({ from: bidder1 });

      await expect(
        auction.methods.rate(6).send({ from: bidder1 })
      ).to.be.revertedWith("Rating must be from 1 to 5.");
    });

    it("Should revert if non-bidder tries to rate", async function () {
      const { auction, beneficiary, bidder1, auctionEndTime } =
        await loadFixture(deployAuctionFixture);

      await auction.methods.bid().send({ from: bidder1, value: "1000" });
      await time.increaseTo(auctionEndTime + 1);
      await auction.methods.auctionEnd().send({ from: beneficiary });

      await expect(
        auction.methods.rate(5).send({ from: beneficiary })
      ).to.be.revertedWith("You can rate only if you have previously bid.");
    });
  });
});
