import "@nomicfoundation/hardhat-ignition";
import { extendEnvironment } from "hardhat/config";
import "@nomicfoundation/hardhat-web3-v4";
import { Web3 } from "web3";

extendEnvironment((hre) => {
  (hre as any).Web3 = Web3;

  // hre.network.provider is an EIP1193-compatible provider.
  hre.web3 = new Web3(hre.network.provider);
});

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337, // 31337
    },
  },
};

export default config;
// module.exports = config;
