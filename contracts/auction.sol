// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.4;
contract Auction {
    // Times are either
    // absolute unix timestamps (seconds since 1970-01-01)
    // or time periods in seconds.
    address payable public beneficiary;

    mapping(address => uint) public ratings;
    address[] public raters;
    uint public auctionEndTime;

    address public highestBidder;
    uint public highestBid;

    // Allowed withdrawals of previous bids
    mapping(address => uint) pendingReturns;

    bool public ended;

    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);
    event PendingReturnIncreased(address bidder, uint amount);

    constructor(
        uint biddingTime,
        address payable beneficiaryAddress
    ) {
        beneficiary = beneficiaryAddress;
        auctionEndTime = block.timestamp + biddingTime;
    }

    function bid() public payable {
        require(block.timestamp <= auctionEndTime, "Auction already ended.");
        require(msg.sender != beneficiary, "Beneficiary can't bid on their own auction.");
        require(msg.value > highestBid, "Bid not high enough.");

        if (highestBid != 0) {
            pendingReturns[highestBidder] += highestBid;
            emit PendingReturnIncreased(highestBidder, pendingReturns[highestBidder]);
        }
        highestBidder = msg.sender;
        highestBid = msg.value;

        emit HighestBidIncreased(msg.sender, msg.value);
    }

    function withdraw() public returns (bool) {
        uint amount = pendingReturns[msg.sender];
        if (amount > 0) {
            pendingReturns[msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    function auctionEnd() public {
        require(block.timestamp >= auctionEndTime, "Auction not yet ended.");
        require(!ended, "Auction end already called.");
        require(beneficiary == msg.sender, "Only beneficiary can end the auction.");

        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        beneficiary.transfer(highestBid);
    }

    function rate(uint rating) public {
        require(rating > 0 && rating <= 5, "Rating must be from 1 to 5.");
        require(pendingReturns[msg.sender] != 0 || highestBidder == msg.sender, "You can rate only if you have previously bid.");
        require(beneficiary != msg.sender, "You can't rate yourself.");
        require(ended, "You can rate only auctions that have successfully ended.");

        if (ratings[msg.sender] == 0) {
            raters.push(msg.sender);
        }
        ratings[msg.sender] = rating;
    }

    function getRaters() public view returns (address[] memory) {
        return raters;
    }

    function getPendingReturnForBidder(address bidder) public view returns (uint) {
        return pendingReturns[bidder];
    }
}
