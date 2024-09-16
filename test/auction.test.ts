import "@nomicfoundation/hardhat-chai-matchers";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import hre from "hardhat";

const ONE_HOUR_IN_SECS = 120;

describe("AuctionFactory", function () {
  async function deployAuctionFactoryFixture() {
    const [beneficiary, bidder1, bidder2] = await hre.ethers.getSigners();

    const auctionFactory = await hre.ethers.deployContract("AuctionFactory");
    const auctionFactoryAddress = await auctionFactory.getAddress();

    const tx = await auctionFactory.createAuction({
      item: "Bidding item",
      description: "Desc",
      endTime: Math.floor(new Date().getTime() / 1000) + ONE_HOUR_IN_SECS,
    });
    const receipt = await tx.wait();

    const AuctionCreatedEvent = receipt?.logs.find(
      (log) => log.address === auctionFactoryAddress
    );

    const auction = await hre.ethers.getContractAt(
      "Auction",
      (AuctionCreatedEvent as any).args.auction!
    );

    return {
      auctionFactory,
      auction,
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

      const setBeneficiary = await auction.beneficiary();
      const setAuctionEndTime = await auction.auctionEndTime();

      expect(setBeneficiary).to.equal(beneficiary.address);
      expect(Number(setAuctionEndTime)).to.be.closeTo(auctionEndTime, 10);
    });
  });

  describe("Bidding", function () {
    it("Should accept bids higher than the current highest bid", async function () {
      const { auction, bidder1, bidder2 } = await loadFixture(
        deployAuctionFactoryFixture
      );

      await auction
        .connect(bidder1)
        .bid({ value: hre.ethers.parseEther("1.0") });

      let highestBidder = await auction.highestBidder();
      let highestBid = await auction.highestBid();
      expect(highestBidder).to.equal(bidder1.address);
      expect(highestBid).to.equal(hre.ethers.parseEther("1.0"));

      await auction
        .connect(bidder2)
        .bid({ value: hre.ethers.parseEther("2.0") });

      highestBidder = await auction.highestBidder();
      highestBid = await auction.highestBid();
      expect(highestBidder).to.equal(bidder2.address);
      expect(highestBid).to.equal(hre.ethers.parseEther("2.0"));
    });

    it("Should revert if bid is not higher than the current highest bid", async function () {
      const { auction, bidder1, bidder2 } = await loadFixture(
        deployAuctionFactoryFixture
      );

      await auction
        .connect(bidder1)
        .bid({ value: hre.ethers.parseEther("1.0") });

      await expect(
        auction.connect(bidder2).bid({ value: hre.ethers.parseEther("0.5") })
      ).to.be.revertedWith("Bid not high enough");
    });

    it("Should revert if auction has ended", async function () {
      const { auction, bidder1, auctionEndTime } = await loadFixture(
        deployAuctionFactoryFixture
      );

      await time.increaseTo(auctionEndTime + 1);

      await expect(
        auction.connect(bidder1).bid({ value: hre.ethers.parseEther("1.0") })
      ).to.be.revertedWith("Auction already ended");
    });
  });

  describe("Withdrawals", function () {
    it("Should allow previous bidders to withdraw their funds", async function () {
      const { auction, bidder1, bidder2 } = await loadFixture(
        deployAuctionFactoryFixture
      );

      await auction
        .connect(bidder1)
        .bid({ value: hre.ethers.parseEther("1.0") });
      await auction
        .connect(bidder2)
        .bid({ value: hre.ethers.parseEther("2.0") });

      const initialBalance = await hre.ethers.provider.getBalance(
        bidder1.address
      );

      const withdrawTx = await auction.connect(bidder1).withdraw();
      await withdrawTx.wait();

      const finalBalance = await hre.ethers.provider.getBalance(bidder1);

      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("Auction End", function () {
    it("Should allow the beneficiary to end the auction and receive funds", async function () {
      const { auction, beneficiary, bidder1, auctionEndTime } =
        await loadFixture(deployAuctionFactoryFixture);

      const startingBalance = await hre.ethers.provider.getBalance(beneficiary);

      await auction
        .connect(bidder1)
        .bid({ value: hre.ethers.parseEther("1.0") });

      await time.increaseTo(auctionEndTime + 1);

      const endTx = await auction.connect(beneficiary).end();
      await endTx.wait();

      const ended = await auction.ended();
      expect(ended).to.be.true;

      const endingBalance = await hre.ethers.provider.getBalance(beneficiary);
      expect(endingBalance).to.be.gt(startingBalance);
    });

    it("Should revert if non-beneficiary tries to end the auction", async function () {
      const { auction, bidder1, bidder2, auctionEndTime } = await loadFixture(
        deployAuctionFactoryFixture
      );

      await auction
        .connect(bidder1)
        .bid({ value: hre.ethers.parseEther("1.0") });

      await time.increaseTo(auctionEndTime + 1);

      await expect(auction.connect(bidder2).end()).to.be.revertedWith(
        "Only beneficiary can end the auction"
      );
    });
  });

  describe("Ratings", function () {
    it("Should revert if rating is attempted before auction ends", async function () {
      const { auction, bidder1 } = await loadFixture(
        deployAuctionFactoryFixture
      );

      await auction
        .connect(bidder1)
        .bid({ value: hre.ethers.parseEther("1.0") });

      await expect(auction.connect(bidder1).rate(5)).to.be.revertedWith(
        "You can rate only auctions that have successfully ended"
      );
    });

    it("Should revert if non-bidder tries to rate", async function () {
      const { auction, beneficiary, auctionEndTime } = await loadFixture(
        deployAuctionFactoryFixture
      );

      await time.increaseTo(auctionEndTime + 1);
      await auction.connect(beneficiary).end();

      await expect(auction.connect(beneficiary).rate(5)).to.be.revertedWith(
        "You can rate only if you have previously bid"
      );
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

      await auction
        .connect(bidder1)
        .bid({ value: hre.ethers.parseEther("1.0") });
      await auction
        .connect(bidder2)
        .bid({ value: hre.ethers.parseEther("2.0") });

      await time.increaseTo(auctionEndTime + 1);
      await auction.connect(beneficiary).end();

      await auction.connect(bidder1).rate(5);
      await auction.connect(bidder2).rate(4);

      const ratings = await auctionFactory.getBeneficiarysRatings(
        beneficiary.address
      );

      expect(ratings).to.eql([5n, 4n]);
    });

    it("Should revert if rating is invalid", async function () {
      const { auction, beneficiary, bidder1, auctionEndTime } =
        await loadFixture(deployAuctionFactoryFixture);

      await auction
        .connect(bidder1)
        .bid({ value: hre.ethers.parseEther("1.0") });
      await time.increaseTo(auctionEndTime + 1);
      await auction.connect(beneficiary).end();

      await expect(auction.connect(bidder1).rate(6)).to.be.revertedWith(
        "Rating must be from 1 to 5"
      );
    });
  });
});
