import { protocols } from '../../config';
import { IProtocolContractDefinitions, IProtocolParserExport, ITransaction, ITransactionAction } from '../../types';
import { contracts } from './contracts';
import { UniswapV3Parser } from './parser';

export default class UniswapV3 implements IProtocolParserExport {
  public readonly protocolIdentifier: string;

  constructor() {
    this.protocolIdentifier = protocols.uniswapv3.identifier;
  }

  public async parseTransaction(transaction: ITransaction): Promise<ITransactionAction[]> {
    return UniswapV3Parser.parseTransaction(transaction);
  }

  public getProtocolContracts(): IProtocolContractDefinitions {
    return contracts;
  }
}
