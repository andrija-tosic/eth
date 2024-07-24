import { MetaMaskInpageProvider } from "@metamask/providers";
import { Web3 } from "web3";
/// <reference types="svelte" />
/// <reference types="vite/client" />
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    web3: Web3<RegisteredSubscription>;
  }
}
