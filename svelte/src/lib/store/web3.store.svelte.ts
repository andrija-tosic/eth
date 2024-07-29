import Web3, { Contract, type ContractAbi } from "web3";
import AuctionFactory from "../../../../artifacts/contracts/AuctionFactory.sol/AuctionFactory.json";

class Web3Store {
  account = $state<string>()!;
  balance = $state<bigint>()!;
  auctionFactoryContract: Contract<ContractAbi> = $state()!;

  constructor() {
    window.web3 = new Web3(window.ethereum);

    window.web3.handleRevert = true;
    window.web3.eth.handleRevert = true;

    this.auctionFactoryContract = new window.web3.eth.Contract(
      AuctionFactory.abi,
      import.meta.env.VITE_AUCTION_FACTORY_ADDR
    );

    if (!window.ethereum) return;

    window.ethereum
      .request({ method: "eth_chainId" })
      .then((c) => console.log({ chainId: parseInt(String(c), 16) }));

    window.ethereum
      .request<string[]>({
        method: "eth_requestAccounts",
      })
      .then((accounts) => {
        this.account = accounts![0]!;

        window.web3.eth.getBalance(this.account!).then((balance) => {
          this.balance = balance;
        });
      });

    window.ethereum.on("accountsChanged", (accounts) => {
      this.account = (accounts as string[])[0];

      window.web3.eth.getBalance(this.account!).then((balance) => {
        this.balance = balance;
      });
    });
  }
}

export const web3Store = new Web3Store();
