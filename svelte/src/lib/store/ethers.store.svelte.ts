import { ethers } from "ethers";

class EthersStore {
  provider = $state<ethers.BrowserProvider>()!;
  account = $state<string>()!;
  balance = $state<bigint>()!;

  private constructor() {}

  // async #handleAccountsChanged(accounts: unknown) {
  //   this.account = (accounts as string[])[0];
  //   this.balance = await window.web3.eth.getBalance(this.account!);
  // }

  async updateBalance() {
    this.balance = await this.provider.getBalance(this.account);
  }

  static async init() {
    if (!window.ethereum) throw new Error("Ethereum not available in browser");

    const store = new EthersStore();
    store.provider = new ethers.BrowserProvider(window.ethereum);

    window.ethereum
      .request({ method: "eth_chainId" })
      .then((c) => console.log({ chainId: parseInt(String(c), 16) }));

    window.ethereum.on("accountsChanged", async (accounts) => {
      store.account = (accounts as string[])[0];

      store.balance = await store.provider.getBalance(store.account!);
    });

    const accounts = await window.ethereum!.request<string[]>({
      method: "eth_requestAccounts",
    });
    store.account = accounts![0]!;
    store.balance = await store.provider.getBalance(store.account!);

    return store;
  }
}

export const ethersStore = await EthersStore.init();
