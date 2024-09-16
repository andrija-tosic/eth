// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.4;

struct AuctionStruct {
    string item;
    string description;
    uint endTime;
}

contract Auction {
    string public item;
    string public description;
    uint public auctionEndTime;

    address payable public beneficiary;

    address public highestBidder;
    uint public highestBid;

    mapping(address => uint) public ratings;
    address[] public raters;

    mapping(address => uint) bids;
    mapping(address => bool) hasPreviouslyBid;
    uint public bidderCount = 0;

    bool public ended;

    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);
    event HighestBidLost(address bidder, uint amount);

    constructor(AuctionStruct memory auction, address payable _beneficiary) {
        item = auction.item;
        description = auction.description;
        beneficiary = _beneficiary;
        auctionEndTime = auction.endTime;
    }

    function bid() public payable {
        require(block.timestamp <= auctionEndTime, "Auction already ended");
        require(
            msg.sender != beneficiary,
            "Beneficiary can't bid on their own auction"
        );
        require(
            bids[msg.sender] + msg.value > highestBid,
            "Bid not high enough"
        );

        if (bids[msg.sender] == 0) {
            hasPreviouslyBid[msg.sender] = true;
            bidderCount++;
        }

        bids[msg.sender] += msg.value;

        if (bids[msg.sender] > highestBid) {
            if (highestBidder != msg.sender && highestBid != 0) {
                emit HighestBidLost(highestBidder, bids[highestBidder]);
            }

            highestBid = bids[msg.sender];
            highestBidder = msg.sender;
            emit HighestBidIncreased(highestBidder, highestBid);
        }
    }

    function withdraw() public returns (bool) {
        require(
            msg.sender != highestBidder,
            "Highest bidder can't withdraw bid"
        );

        uint amount = bids[msg.sender];
        if (amount > 0) {
            bids[msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                bids[msg.sender] = amount;
                return false;
            }
        }

        bidderCount--;
        return true;
    }

    function end() public {
        // TODO: require(block.timestamp >= auctionEndTime, "Auction not yet ended");
        require(!ended, "Auction already");
        require(
            beneficiary == msg.sender,
            "Only beneficiary can end the auction"
        );

        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        beneficiary.transfer(highestBid);
    }

    function rate(uint rating) public {
        require(rating > 0 && rating <= 5, "Rating must be from 1 to 5");
        require(
            hasPreviouslyBid[msg.sender] == true,
            "You can rate only if you have previously bid"
        );
        require(beneficiary != msg.sender, "You can't rate yourself");
        require(
            ended,
            "You can rate only auctions that have successfully ended"
        );

        if (ratings[msg.sender] == 0) {
            raters.push(msg.sender);
        }
        ratings[msg.sender] = rating;
    }

    function getPendingReturnForBidder(
        address bidder
    ) public view returns (uint) {
        if (bidder == highestBidder) {
            return 0;
        }

        return bids[bidder];
    }

    function getRaters() public view returns (address[] memory) {
        return raters;
    }
}
