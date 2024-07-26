import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AuctionModule", (m) => {
  const contract = m.contract("AuctionFactory");

  // m.call(contract, "launch", []);

  return { contract };
});
