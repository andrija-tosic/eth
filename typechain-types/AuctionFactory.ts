/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export type AuctionStructStruct = {
  item: string;
  description: string;
  endTime: BigNumberish;
};

export type AuctionStructStructOutput = [
  item: string,
  description: string,
  endTime: bigint
] & { item: string; description: string; endTime: bigint };

export interface AuctionFactoryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "auctions"
      | "createAuction"
      | "getActiveAuctions"
      | "getBeneficiarysRatings"
      | "getFinishedAuctions"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "AuctionCreated"): EventFragment;

  encodeFunctionData(
    functionFragment: "auctions",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createAuction",
    values: [AuctionStructStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "getActiveAuctions",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getBeneficiarysRatings",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getFinishedAuctions",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "auctions", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createAuction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getActiveAuctions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBeneficiarysRatings",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFinishedAuctions",
    data: BytesLike
  ): Result;
}

export namespace AuctionCreatedEvent {
  export type InputTuple = [auction: AddressLike];
  export type OutputTuple = [auction: string];
  export interface OutputObject {
    auction: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface AuctionFactory extends BaseContract {
  connect(runner?: ContractRunner | null): AuctionFactory;
  waitForDeployment(): Promise<this>;

  interface: AuctionFactoryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  auctions: TypedContractMethod<[arg0: BigNumberish], [string], "view">;

  createAuction: TypedContractMethod<
    [auction: AuctionStructStruct],
    [string],
    "nonpayable"
  >;

  getActiveAuctions: TypedContractMethod<[], [string[]], "view">;

  getBeneficiarysRatings: TypedContractMethod<
    [beneficiary: AddressLike],
    [bigint[]],
    "view"
  >;

  getFinishedAuctions: TypedContractMethod<[], [string[]], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "auctions"
  ): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "createAuction"
  ): TypedContractMethod<
    [auction: AuctionStructStruct],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getActiveAuctions"
  ): TypedContractMethod<[], [string[]], "view">;
  getFunction(
    nameOrSignature: "getBeneficiarysRatings"
  ): TypedContractMethod<[beneficiary: AddressLike], [bigint[]], "view">;
  getFunction(
    nameOrSignature: "getFinishedAuctions"
  ): TypedContractMethod<[], [string[]], "view">;

  getEvent(
    key: "AuctionCreated"
  ): TypedContractEvent<
    AuctionCreatedEvent.InputTuple,
    AuctionCreatedEvent.OutputTuple,
    AuctionCreatedEvent.OutputObject
  >;

  filters: {
    "AuctionCreated(address)": TypedContractEvent<
      AuctionCreatedEvent.InputTuple,
      AuctionCreatedEvent.OutputTuple,
      AuctionCreatedEvent.OutputObject
    >;
    AuctionCreated: TypedContractEvent<
      AuctionCreatedEvent.InputTuple,
      AuctionCreatedEvent.OutputTuple,
      AuctionCreatedEvent.OutputObject
    >;
  };
}
