import { protocols } from "../../config";
import { ProtocolHelper } from "../../helpers";
import {
  IProtocolContractDefinitions,
  IProtocolParserExport,
  ITransaction,
  ITransactionAction,
} from "../../types";
import { contracts as v3Contracts } from "../UniswapV3/contracts";
import { UniswapV3Parser } from "../UniswapV3/parser";
import { CONTRACT_ENUM, contracts as v2Contracts } from "./contracts";
import { UniswapParser } from "./parser";

export default class Uniswap implements IProtocolParserExport {
  public readonly protocolIdentifier: string;
  private readonly combinedContracts: IProtocolContractDefinitions;

  constructor() {
    this.protocolIdentifier = protocols.uniswap.identifier;
    this.combinedContracts = {
      ...v2Contracts,
      ...v3Contracts
    };
  }

  public async parseTransaction(
    transaction: ITransaction
  ): Promise<ITransactionAction[]> {
    const actions: ITransactionAction[] = [];

    // Try V2 parsing first
    if (ProtocolHelper.txnToIsListenerContract(
      transaction,
      CONTRACT_ENUM.ROUTER_V2,
      v2Contracts
    )) {
      const v2Actions = UniswapParser.parseTransaction(transaction);
      actions.push(...v2Actions);
    }

    // Try V3 parsing
    const v3Actions = await UniswapV3Parser.parseTransaction(transaction);
    if (v3Actions.length > 0) {
      actions.push(...v3Actions);
    }

    return actions;
  }

  public getProtocolContracts(): IProtocolContractDefinitions {
    return this.combinedContracts;
  }
}