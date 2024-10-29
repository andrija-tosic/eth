/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../common";
import type {
  Auction,
  AuctionInterface,
  AuctionStructStruct,
} from "../Auction";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "item",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
        ],
        internalType: "struct AuctionStruct",
        name: "auction",
        type: "tuple",
      },
      {
        internalType: "address payable",
        name: "_beneficiary",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "AuctionEnded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "bidder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "HighestBidIncreased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "bidder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "HighestBidLost",
    type: "event",
  },
  {
    inputs: [],
    name: "auctionEndTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "beneficiary",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "bidderCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "end",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "ended",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "bidder",
        type: "address",
      },
    ],
    name: "getPendingReturnForBidder",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRaters",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "highestBid",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "highestBidder",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "item",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "rating",
        type: "uint256",
      },
    ],
    name: "rate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "raters",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "ratings",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040526000600a553480156200001657600080fd5b50604051620020c7380380620020c783398181016040528101906200003c9190620002b5565b81600001516000908051906020019062000058929190620000ca565b5081602001516001908051906020019062000075929190620000ca565b5080600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081604001516002819055505050620004f1565b828054620000d890620003e2565b90600052602060002090601f016020900481019282620000fc576000855562000148565b82601f106200011757805160ff191683800117855562000148565b8280016001018555821562000148579182015b82811115620001475782518255916020019190600101906200012a565b5b5090506200015791906200015b565b5090565b5b80821115620001765760008160009055506001016200015c565b5090565b6000620001916200018b8462000338565b6200030f565b905082815260208101848484011115620001aa57600080fd5b620001b7848285620003ac565b509392505050565b600081519050620001d081620004bd565b92915050565b600082601f830112620001e857600080fd5b8151620001fa8482602086016200017a565b91505092915050565b6000606082840312156200021657600080fd5b6200022260606200030f565b9050600082015167ffffffffffffffff8111156200023f57600080fd5b6200024d84828501620001d6565b600083015250602082015167ffffffffffffffff8111156200026e57600080fd5b6200027c84828501620001d6565b602083015250604062000292848285016200029e565b60408301525092915050565b600081519050620002af81620004d7565b92915050565b60008060408385031215620002c957600080fd5b600083015167ffffffffffffffff811115620002e457600080fd5b620002f28582860162000203565b92505060206200030585828601620001bf565b9150509250929050565b60006200031b6200032e565b905062000329828262000418565b919050565b6000604051905090565b600067ffffffffffffffff8211156200035657620003556200047d565b5b6200036182620004ac565b9050602081019050919050565b60006200037b8262000382565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60005b83811015620003cc578082015181840152602081019050620003af565b83811115620003dc576000848401525b50505050565b60006002820490506001821680620003fb57607f821691505b602082108114156200041257620004116200044e565b5b50919050565b6200042382620004ac565b810181811067ffffffffffffffff821117156200044557620004446200047d565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b620004c8816200036e565b8114620004d457600080fd5b50565b620004e281620003a2565b8114620004ee57600080fd5b50565b611bc680620005016000396000f3fe6080604052600436106100f35760003560e01c80638463b38b1161008a578063e7ee6ad611610059578063e7ee6ad614610311578063ef9973ba1461033a578063efbe1c1c14610365578063f2a4a82e1461037c576100f3565b80638463b38b1461024157806391f901571461027e5780639e01dfbb146102a9578063d57bde79146102e6576100f3565b80633ccfd60b116100c65780633ccfd60b146101955780634b449cba146101c057806370d29c11146101eb5780637284e41614610216576100f3565b806312fa6feb146100f85780631998aeef14610123578063218052051461012d57806338af3eed1461016a575b600080fd5b34801561010457600080fd5b5061010d6103a7565b60405161011a9190611526565b60405180910390f35b61012b6103ba565b005b34801561013957600080fd5b50610154600480360381019061014f91906111fb565b610880565b60405161016191906116a3565b60405180910390f35b34801561017657600080fd5b5061017f610929565b60405161018c91906114c0565b60405180910390f35b3480156101a157600080fd5b506101aa61094f565b6040516101b79190611526565b60405180910390f35b3480156101cc57600080fd5b506101d5610b1d565b6040516101e291906116a3565b60405180910390f35b3480156101f757600080fd5b50610200610b23565b60405161020d91906116a3565b60405180910390f35b34801561022257600080fd5b5061022b610b29565b6040516102389190611541565b60405180910390f35b34801561024d57600080fd5b5061026860048036038101906102639190611224565b610bb7565b60405161027591906114a5565b60405180910390f35b34801561028a57600080fd5b50610293610bf6565b6040516102a091906114a5565b60405180910390f35b3480156102b557600080fd5b506102d060048036038101906102cb91906111fb565b610c1c565b6040516102dd91906116a3565b60405180910390f35b3480156102f257600080fd5b506102fb610c34565b60405161030891906116a3565b60405180910390f35b34801561031d57600080fd5b5061033860048036038101906103339190611224565b610c3a565b005b34801561034657600080fd5b5061034f610ef0565b60405161035c9190611504565b60405180910390f35b34801561037157600080fd5b5061037a610f7e565b005b34801561038857600080fd5b50610391611143565b60405161039e9190611541565b60405180910390f35b600b60009054906101000a900460ff1681565b6002544211156103ff576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103f6906115a3565b60405180910390fd5b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610490576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161048790611563565b60405180910390fd5b60055434600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546104de9190611713565b1161051e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610515906115c3565b60405180910390fd5b6000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414156105d7576001600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600a60008154809291906105d190611852565b91905055505b34600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546106269190611713565b92505081905550600554600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054111561087e573373ffffffffffffffffffffffffffffffffffffffff16600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141580156106d75750600060055414155b15610799577ff1d1bfd404a468cc8ce2ce0d4bfefa9b375f89696c660ea67f102c6f1f88bbab600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660086000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040516107909291906114db565b60405180910390a15b600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205460058190555033600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507ff4757a49b326036464bec6fe419a4ae38c8a02ce3e68bf0809674f6aab8ad300600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166005546040516108759291906114db565b60405180910390a15b565b6000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156108e15760009050610924565b600860008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b919050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156109e2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109d990611643565b60405180910390fd5b6000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000811115610afc576000600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050610afb5780600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506000915050610b1a565b5b600a6000815480929190610b0f906117f6565b919050555060019150505b90565b60025481565b600a5481565b60018054610b3690611820565b80601f0160208091040260200160405190810160405280929190818152602001828054610b6290611820565b8015610baf5780601f10610b8457610100808354040283529160200191610baf565b820191906000526020600020905b815481529060010190602001808311610b9257829003601f168201915b505050505081565b60078181548110610bc757600080fd5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60066020528060005260406000206000915090505481565b60055481565b600081118015610c4b575060058111155b610c8a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c8190611663565b60405180910390fd5b60011515600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151514610d1d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d1490611603565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff16600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610dae576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610da590611623565b60405180910390fd5b600b60009054906101000a900460ff16610dfd576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610df490611683565b60405180910390fd5b6000600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541415610ea9576007339080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b80600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555050565b60606007805480602002602001604051908101604052809291908181526020018280548015610f7457602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610f2a575b5050505050905090565b600b60009054906101000a900460ff1615610fce576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fc590611583565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff16600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461105e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611055906115e3565b60405180910390fd5b6001600b60006101000a81548160ff0219169083151502179055507fdaec4582d5d9595688c8c98545fdd1c696d41c6aeaeb636737e84ed2f5c00eda600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166005546040516110ce9291906114db565b60405180910390a1600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6005549081150290604051600060405180830381858888f19350505050158015611140573d6000803e3d6000fd5b50565b6000805461115090611820565b80601f016020809104026020016040519081016040528092919081815260200182805461117c90611820565b80156111c95780601f1061119e576101008083540402835291602001916111c9565b820191906000526020600020905b8154815290600101906020018083116111ac57829003601f168201915b505050505081565b6000813590506111e081611b62565b92915050565b6000813590506111f581611b79565b92915050565b60006020828403121561120d57600080fd5b600061121b848285016111d1565b91505092915050565b60006020828403121561123657600080fd5b6000611244848285016111e6565b91505092915050565b60006112598383611274565b60208301905092915050565b61126e8161177b565b82525050565b61127d81611769565b82525050565b61128c81611769565b82525050565b600061129d826116ce565b6112a781856116f1565b93506112b2836116be565b8060005b838110156112e35781516112ca888261124d565b97506112d5836116e4565b9250506001810190506112b6565b5085935050505092915050565b6112f98161178d565b82525050565b600061130a826116d9565b6113148185611702565b93506113248185602086016117c3565b61132d816118f9565b840191505092915050565b6000611345602a83611702565b91506113508261190a565b604082019050919050565b6000611368600f83611702565b915061137382611959565b602082019050919050565b600061138b601583611702565b915061139682611982565b602082019050919050565b60006113ae601383611702565b91506113b9826119ab565b602082019050919050565b60006113d1602483611702565b91506113dc826119d4565b604082019050919050565b60006113f4602c83611702565b91506113ff82611a23565b604082019050919050565b6000611417601783611702565b915061142282611a72565b602082019050919050565b600061143a602183611702565b915061144582611a9b565b604082019050919050565b600061145d601a83611702565b915061146882611aea565b602082019050919050565b6000611480603783611702565b915061148b82611b13565b604082019050919050565b61149f816117b9565b82525050565b60006020820190506114ba6000830184611283565b92915050565b60006020820190506114d56000830184611265565b92915050565b60006040820190506114f06000830185611283565b6114fd6020830184611496565b9392505050565b6000602082019050818103600083015261151e8184611292565b905092915050565b600060208201905061153b60008301846112f0565b92915050565b6000602082019050818103600083015261155b81846112ff565b905092915050565b6000602082019050818103600083015261157c81611338565b9050919050565b6000602082019050818103600083015261159c8161135b565b9050919050565b600060208201905081810360008301526115bc8161137e565b9050919050565b600060208201905081810360008301526115dc816113a1565b9050919050565b600060208201905081810360008301526115fc816113c4565b9050919050565b6000602082019050818103600083015261161c816113e7565b9050919050565b6000602082019050818103600083015261163c8161140a565b9050919050565b6000602082019050818103600083015261165c8161142d565b9050919050565b6000602082019050818103600083015261167c81611450565b9050919050565b6000602082019050818103600083015261169c81611473565b9050919050565b60006020820190506116b86000830184611496565b92915050565b6000819050602082019050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600061171e826117b9565b9150611729836117b9565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561175e5761175d61189b565b5b828201905092915050565b600061177482611799565b9050919050565b600061178682611799565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60005b838110156117e15780820151818401526020810190506117c6565b838111156117f0576000848401525b50505050565b6000611801826117b9565b915060008214156118155761181461189b565b5b600182039050919050565b6000600282049050600182168061183857607f821691505b6020821081141561184c5761184b6118ca565b5b50919050565b600061185d826117b9565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156118905761188f61189b565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b7f42656e65666963696172792063616e277420626964206f6e207468656972206f60008201527f776e2061756374696f6e00000000000000000000000000000000000000000000602082015250565b7f41756374696f6e20616c72656164790000000000000000000000000000000000600082015250565b7f41756374696f6e20616c726561647920656e6465640000000000000000000000600082015250565b7f426964206e6f74206869676820656e6f75676800000000000000000000000000600082015250565b7f4f6e6c792062656e65666963696172792063616e20656e64207468652061756360008201527f74696f6e00000000000000000000000000000000000000000000000000000000602082015250565b7f596f752063616e2072617465206f6e6c7920696620796f75206861766520707260008201527f6576696f75736c79206269640000000000000000000000000000000000000000602082015250565b7f596f752063616e2774207261746520796f757273656c66000000000000000000600082015250565b7f48696768657374206269646465722063616e277420776974686472617720626960008201527f6400000000000000000000000000000000000000000000000000000000000000602082015250565b7f526174696e67206d7573742062652066726f6d203120746f2035000000000000600082015250565b7f596f752063616e2072617465206f6e6c792061756374696f6e7320746861742060008201527f68617665207375636365737366756c6c7920656e646564000000000000000000602082015250565b611b6b81611769565b8114611b7657600080fd5b50565b611b82816117b9565b8114611b8d57600080fd5b5056fea2646970667358221220cdfe0334a69a0e9547cb0e377b6e8efae085f9b8fec4b538c42924a22ae1dc9064736f6c63430008040033";

type AuctionConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AuctionConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Auction__factory extends ContractFactory {
  constructor(...args: AuctionConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    auction: AuctionStructStruct,
    _beneficiary: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(auction, _beneficiary, overrides || {});
  }
  override deploy(
    auction: AuctionStructStruct,
    _beneficiary: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(auction, _beneficiary, overrides || {}) as Promise<
      Auction & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Auction__factory {
    return super.connect(runner) as Auction__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AuctionInterface {
    return new Interface(_abi) as AuctionInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Auction {
    return new Contract(address, _abi, runner) as unknown as Auction;
  }
}