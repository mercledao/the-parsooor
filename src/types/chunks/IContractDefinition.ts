import { ethers } from 'ethers';
import { CHAIN_ID, LISTEN_FOR_TRANSACTIONS } from '../../enums';

/** Mapping of a protocol's contract names to their configurations */
export type IProtocolContractDefinitions = Record<string, IContractConfig>;

/** Configuration for a smart contract */
export type IContractConfig = {
  /** Interface for the contract */
  interface: ethers.Interface;

  /** Mapping of chain IDs to contract deployments */
  deployments: Partial<Record<CHAIN_ID, IContractDeployment>>;

  /** Mapping of event names to their configurations */
  events: Record<string, IContractEventConfig>;
};

/** Deployment configuration for a smart contract */
export type IContractDeployment = {
  /** Address of the contract */
  address: string;

  /** Types of transactions to listen for */
  listenForTransactions: LISTEN_FOR_TRANSACTIONS[] | null;
};

/** Configuration for a smart contract event */
export type IContractEventConfig = {
  /** Interface for the event */
  abi: ethers.Interface;
  /** Optional signature for the event */
  signature?: string;
};
