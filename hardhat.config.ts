import "@nomicfoundation/hardhat-ignition";
import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-web3-v4";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337, // 31337
    },
  },
};

export default config;
