// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;
import './auction.sol';

contract AuctionFactory {
    Auction[] public auctions;

    function createAuction(uint biddingTime) public returns (Auction) {
        Auction newAuction = (new Auction(biddingTime, payable(msg.sender)));
        auctions.push(newAuction);
        return newAuction;
    }

    function getActiveAuctions() public view returns (Auction[] memory) {
        uint count = 0;
        for (uint i = 0; i < auctions.length; i++) {
            if (!auctions[i].ended()) {
                count++;
            }
        }

        Auction[] memory actives = new Auction[](count);

        uint j = 0;
        for (uint i = 0; i < auctions.length; i++) {
            if (!auctions[i].ended()) {
                actives[j++] = auctions[i];
            }
        }

        return actives;
    }

    function getFinishedAuctions() public view returns (Auction[] memory) {
        uint count = 0;
        for (uint i = 0; i < auctions.length; i++) {
            if (!auctions[i].ended()) {
                count++;
            }
        }

        Auction[] memory finished = new Auction[](count);

        uint j = 0;
        for (uint i = 0; i < auctions.length; i++) {
            if (!auctions[i].ended()) {
                finished[j++] = auctions[i];
            }
        }

        return finished;  
          }
    

    function getBeneficiarysRatings(address beneficiary) public view returns (uint[] memory)  {
        uint count = 0;
        for (uint i = 0; i < auctions.length; i++) {
            if (auctions[i].beneficiary() == beneficiary) {
                address[] memory raters = auctions[i].getRaters();
                count += raters.length;
            }
        }

        uint[] memory beneficiarysRatings = new uint[](count);
        uint j = 0;
        for (uint i = 0; i < auctions.length; i++) {
            if (auctions[i].beneficiary() == beneficiary) {
                address[] memory raters = auctions[i].getRaters();
                for (uint k = 0; k < raters.length; k++) {
                    beneficiarysRatings[j++] = auctions[i].ratings(raters[k]);
                }
            }
        }

        return beneficiarysRatings;
    }
}
