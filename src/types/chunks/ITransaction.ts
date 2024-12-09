import { CHAIN_ID } from "../../enums";

export type ITransaction = {
  /** Chain ID of the transaction */
  chainId: CHAIN_ID;

  /** Hash of the transaction */
  hash: string;

  /** From address */
  from: string;

  /** To address */
  to: string;

  /** Value of the transaction */
  value: string;

  /** Timestamp of the transaction */
  timestamp: number;

  /** Data of the transaction */
  data: string;

  /** Gas price of the transaction */
  gasPrice: string;

  /** Gas used of the transaction */
  gasUsed: string;

  /** Logs of the transaction */
  logs: ITransactionLog[];
};

export type ITransactionLog = {
  /** Address of the contract */
  contractAddress: string;

  /** Topics of the log */
  topics: string[];

  /** Data of the log */
  data: string;
};
