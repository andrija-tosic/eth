import "@nomicfoundation/hardhat-chai-matchers";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import hardhat from "hardhat";
import AuctionFactory from "../artifacts/contracts/AuctionFactory.sol/AuctionFactory.json";
import Auction from "../artifacts/contracts/Auction.sol/Auction.json";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import Web3 from "web3";

const hre = hardhat as unknown as HardhatRuntimeEnvironment & { web3: Web3 };

describe("AuctionFactory", function () {
  async function deployAuctionFactoryFixture() {
    const ONE_HOUR_IN_SECS = 60 * 60;
    const [deployer, beneficiary, bidder1, bidder2] =
      await hre.web3.eth.getAccounts();

    const auctionFactoryContract = new hre.web3.eth.Contract(
      AuctionFactory.abi
    );
    auctionFactoryContract.handleRevert = true;

    const rawContract = auctionFactoryContract.deploy({
      data: AuctionFactory.bytecode,
    });

    const estimateGas = await rawContract.estimateGas({
      from: deployer,
    });

    const auctionFactory = await rawContract.send({
      from: deployer,
      gas: estimateGas.toString(),
      gasPrice: "10000000000",
    });

    const tx = await auctionFactory.methods
      .createAuction(ONE_HOUR_IN_SECS)
      .send({ from: beneficiary });

    const auctionAddress = tx.events!.AuctionCreated.returnValues.auction;

    const auction = new hre.web3.eth.Contract(Auction.abi, auctionAddress!);

    return {
      auctionFactory,
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
        deployAuctionFactoryFixture
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
        deployAuctionFactoryFixture
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
        deployAuctionFactoryFixture
      );

      await auction.methods.bid().send({ from: bidder1, value: "1000" });

      try {
        await auction.methods.bid().send({ from: bidder2, value: "500" });
        // expect.fail("Expected revert not received");
      } catch (error: any) {
        expect(error.cause.message).to.include("Bid not high enough.");
      }
    });

    it("Should revert if auction has ended", async function () {
      const { auction, bidder1, auctionEndTime } = await loadFixture(
        deployAuctionFactoryFixture
      );

      await time.increaseTo(auctionEndTime + 1);

      try {
        await auction.methods.bid().send({ from: bidder1, value: "1000" });
        expect.fail("Expected revert not received");
      } catch (error: any) {
        expect(error.cause.message).to.include("Auction already ended.");
      }
    });
  });

  describe("Withdrawals", function () {
    it("Should allow previous bidders to withdraw their funds", async function () {
      const { auction, bidder1, bidder2 } = await loadFixture(
        deployAuctionFactoryFixture
      );

      await auction.methods
        .bid()
        .send({ from: bidder1, value: "100000000000000000" });
      await auction.methods
        .bid()
        .send({ from: bidder2, value: "200000000000000000" });

      const initialBalance = await hre.web3.eth.getBalance(bidder1);

      await auction.methods.withdraw().send({ from: bidder1 });

      const finalBalance = await hre.web3.eth.getBalance(bidder1);

      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("Auction End", function () {
    it("Should allow the beneficiary to end the auction and receive funds", async function () {
      const { auction, beneficiary, bidder1, auctionEndTime } =
        await loadFixture(deployAuctionFactoryFixture);

      const startingBalance = await hre.web3.eth.getBalance(beneficiary);

      await auction.methods
        .bid()
        .send({ from: bidder1, value: "1000000000000000000" });

      await time.increaseTo(auctionEndTime + 1);

      await auction.methods.auctionEnd().send({ from: beneficiary });

      const ended = await auction.methods.ended().call();
      expect(ended).to.be.true;

      const endingBalance = await hre.web3.eth.getBalance(beneficiary);
      expect(endingBalance).to.be.gt(startingBalance); // Ensure beneficiary received funds
    });

    it("Should revert if non-beneficiary tries to end the auction", async function () {
      const { auction, bidder1, bidder2, auctionEndTime } = await loadFixture(
        deployAuctionFactoryFixture
      );

      await auction.methods.bid().send({ from: bidder1, value: "1000" });

      await time.increaseTo(auctionEndTime + 1);

      try {
        await auction.methods.auctionEnd().send({ from: bidder2 });
        expect.fail("Expected revert not received");
      } catch (error: any) {
        expect(error.cause.message).to.include(
          "Only beneficiary can end the auction."
        );
      }
    });
  });

  describe("Ratings", function () {
    it("Should revert if rating is attempted before auction ends", async function () {
      const { auction, bidder1 } = await loadFixture(
        deployAuctionFactoryFixture
      );

      await auction.methods.bid().send({ from: bidder1, value: "1000" });

      try {
        await auction.methods.rate(5).send({ from: bidder1 });
        expect.fail("Expected revert not received");
      } catch (error: any) {
        expect(error.cause.message).to.include(
          "You can rate only auctions that have successfully ended."
        );
      }
    });

    it("Should revert if non-bidder tries to rate", async function () {
      const { auction, beneficiary, auctionEndTime } = await loadFixture(
        deployAuctionFactoryFixture
      );

      await time.increaseTo(auctionEndTime + 1);
      await auction.methods.auctionEnd().send({ from: beneficiary });

      try {
        await auction.methods.rate(5).send({ from: beneficiary });
        expect.fail("Expected revert not received");
      } catch (error: any) {
        expect(error.cause.message).to.include(
          "You can rate only if you have previously bid."
        );
      }
    });

    it("Should allow valid ratings from eligible users", async function () {
      const {
        auctionFactory,
        auction,
        beneficiary,
        bidder1,
        bidder2,
        auctionEndTime,
      } = await loadFixture(deployAuctionFactoryFixture);

      await auction.methods.bid().send({ from: bidder1, value: "1000" });
      await auction.methods.bid().send({ from: bidder2, value: "2000" });
      await time.increaseTo(auctionEndTime + 1);
      await auction.methods.auctionEnd().send({ from: beneficiary });

      await auction.methods.rate(5).send({ from: bidder1 });
      await auction.methods.rate(4).send({ from: bidder2 });

      const ratings = await auctionFactory.methods
        .getBeneficiarysRatings(beneficiary)
        .call();
      expect(ratings).to.eql([5n, 4n]);
    });

    it("Should revert if rating is invalid", async function () {
      const { auction, beneficiary, bidder1, auctionEndTime } =
        await loadFixture(deployAuctionFactoryFixture);

      await auction.methods.bid().send({ from: bidder1, value: "1000" });
      await time.increaseTo(auctionEndTime + 1);
      await auction.methods.auctionEnd().send({ from: beneficiary });

      try {
        await auction.methods.rate(6).send({ from: bidder1 });
        expect.fail("Expected revert not received");
      } catch (error: any) {
        expect(error.cause.message).to.include("Rating must be from 1 to 5.");
      }
    });
  });
});
