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

    constructor(
        uint biddingTime,
        address payable beneficiaryAddress
    ) {
        beneficiary = beneficiaryAddress;
        auctionEndTime = block.timestamp + biddingTime;
    }

    function bid() external payable {
        require(block.timestamp <= auctionEndTime, "Auction already ended.");
        require(msg.sender != beneficiary, "Beneficiary can't bid on their own auction.");
        require(msg.value > highestBid, "Bid not high enough.");

        if (highestBid != 0) {
            pendingReturns[highestBidder] += highestBid;
        }
        highestBidder = msg.sender;
        highestBid = msg.value;

        emit HighestBidIncreased(msg.sender, msg.value);
    }

    function withdraw() external returns (bool) {
        uint amount = pendingReturns[msg.sender];
        if (amount > 0) {
            // It is important to set this to zero because the recipient
            // can call this function again as part of the receiving call
            // before `send` returns.
            pendingReturns[msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    function auctionEnd() external {
        // It is a good guideline to structure functions that interact
        // with other contracts (i.e. they call functions or send Ether)
        // into three phases:
        // 1. checking conditions
        // 2. performing actions (potentially changing conditions)
        // 3. interacting with other contracts
        // If these phases are mixed up, the other contract could call
        // back into the current contract and modify the state or cause
        // effects (ether payout) to be performed multiple times.
        // If functions called internally include interaction with external
        // contracts, they also have to be considered interaction with
        // external contracts.

        // 1. Conditions
        require(block.timestamp >= auctionEndTime, "Auction not yet ended.");
        require(!ended, "Auction end already called.");
        require(beneficiary == msg.sender, "Only beneficiary can end the auction.");

        // 2. Effects
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        // 3. Interaction
        beneficiary.transfer(highestBid);
    }

    function rate(uint rating) external {
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
