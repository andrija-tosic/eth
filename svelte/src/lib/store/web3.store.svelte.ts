import Web3 from "web3";

class Web3Store {
  account = $state<string>()!;
  balance = $state<bigint>()!;

  private constructor() {}

  // async #handleAccountsChanged(accounts: unknown) {
  //   this.account = (accounts as string[])[0];
  //   this.balance = await window.web3.eth.getBalance(this.account!);
  // }

  async updateBalance() {
    this.balance = await window.web3.eth.getBalance(this.account);
  }

  static async init() {
    if (!window.ethereum) throw new Error("Ethereum not available in browser");

    const store = new Web3Store();
    window.web3 = new Web3(window.ethereum);

    window.web3.handleRevert = true;
    window.web3.eth.handleRevert = true;

    window.ethereum
      .request({ method: "eth_chainId" })
      .then((c) => console.log({ chainId: parseInt(String(c), 16) }));

    // WOW.
    // window.ethereum.removeAllListeners();

    // window.ethereum.off("accountsChanged", store.#handleAccountsChanged);
    window.ethereum.on("accountsChanged", async (accounts) => {
      web3Store.account = (accounts as string[])[0];
      web3Store.balance = await window.web3.eth.getBalance(web3Store.account!);
    });

    const accounts = await window.ethereum!.request<string[]>({
      method: "eth_requestAccounts",
    });
    store.account = accounts![0]!;
    store.balance = await window.web3.eth.getBalance(store.account!);

    return store;
  }
}

export const web3Store = await Web3Store.init();
