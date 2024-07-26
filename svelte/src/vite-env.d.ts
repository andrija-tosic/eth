import { MetaMaskInpageProvider } from "@metamask/providers";
import { Web3 } from "web3";
/// <reference types="svelte" />
/// <reference types="vite/client" />
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    web3: Web3;
  }

  interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_AUCTION_FACTORY_ADDR: string;
    // more env variables...
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
