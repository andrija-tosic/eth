import Web3, { Contract, type ContractAbi } from "web3";
import AuctionFactory from "../../../artifacts/contracts/auction-factory.sol/AuctionFactory.json";

class Web3Store {
  account = $state<string>()!;
  balance = $state<string>()!;
  auctionFactoryContract: Contract<ContractAbi> = $state()!;

  constructor() {
    window.web3 = new Web3(window.ethereum);

    this.auctionFactoryContract = new window.web3.eth.Contract(
      AuctionFactory.abi,
      import.meta.env.VITE_AUCTION_FACTORY_ADDR
    );

    if (!window.ethereum) return;

    window.ethereum
      .request<string[]>({
        method: "eth_requestAccounts",
      })
      .then((accounts) => {
        this.account = accounts![0]!;

        window.web3.eth.getBalance(this.account!).then((balance) => {
          this.balance = window.web3.utils.fromWei(balance, "ether");
        });
      });

    window.ethereum.on("accountsChanged", (accounts) => {
      this.account = (accounts as string[])[0];

      window
        .ethereum!.request({
          method: "eth_getBalance",
          params: [null, null],
        })
        .then();
    });
  }
}

export const web3Store = new Web3Store();
