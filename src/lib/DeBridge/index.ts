import { protocols } from "../../config";
import { IProtocolContractDefinitions, IProtocolParserExport, ITransaction, ITransactionAction } from "../../types";
import { contracts } from "./contracts";
import { DeBridgeParser } from "./parser";

export default class DeBridge implements IProtocolParserExport {
    public readonly protocolIdentifier: string

    constructor() {
        this.protocolIdentifier = protocols.debridge.identifier;
    }

  public async parseTransaction(transaction: ITransaction): Promise<ITransactionAction[]> {
    return DeBridgeParser.parseTransaction(transaction);
  }

  public getProtocolContracts(): IProtocolContractDefinitions {
    return contracts;
  }
}
