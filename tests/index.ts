import { ethers } from 'ethers';
import {
  ACTION_ENUM,
  CHAIN_ID,
  chainConfig,
  IBridgeInAction,
  IBridgeOutAction,
  IMultiSwapAction,
  IProtocolTestTransaction,
  ISingleSwapAction,
  ITransaction,
  ITransactionAction,
  parsers,
  protocols
} from '../src';

export class ProtocolParserUtils {
  public readonly protocolIdentifier: string;
  private readonly rpcPool: Record<string, ethers.JsonRpcProvider>;

  constructor(protocolIdentifier: string) {
    this.protocolIdentifier = protocolIdentifier;
    this.rpcPool = {};
  }

  public async initialize(): Promise<void> {
    for (const [chainId, chain] of Object.entries(chainConfig)) {
      this.rpcPool[chainId] = new ethers.JsonRpcProvider(chain.rpcUrl);
    }
  }

  public isValidProtocol(): void {
    const hasParser = parsers[this.protocolIdentifier] !== undefined;
    expect(hasParser).toBe(true);

    const hasCorrectDefinition =
      protocols[this.protocolIdentifier] !== undefined &&
      protocols[this.protocolIdentifier].identifier === this.protocolIdentifier;

    expect(hasCorrectDefinition).toBe(true);
  }

  public async fetchAndParseTestTxn(data: IProtocolTestTransaction): Promise<ITransactionAction[]> {
    const formattedTxn = await this.fetchAndFormatTransaction(data.chainId, data.txnHash);
    const actions = await parsers[this.protocolIdentifier].parseTransaction(formattedTxn);
    return actions;
  }

  private async fetchAndFormatTransaction(chainId: CHAIN_ID, txnHash: string): Promise<ITransaction> {
    const [txn, receipts] = await Promise.all([
      this.rpcPool[chainId].getTransaction(txnHash),
      this.rpcPool[chainId].getTransactionReceipt(txnHash)
    ]);

    const timestamp = (await this.rpcPool[chainId].getBlock(txn.blockNumber)).timestamp * 1000;

    const formattedTxn: ITransaction = {
      chainId: chainId,
      hash: txnHash,
      from: txn.from,
      to: txn.to,
      value: txn.value.toString(),
      timestamp: timestamp,
      data: txn.data,
      logs: receipts.logs.map((log) => ({
        contractAddress: log.address,
        topics: log.topics as string[],
        data: log.data
      }))
    };

    return formattedTxn;
  }

  public assertTestTransactionForData(data: IProtocolTestTransaction, actions: ITransactionAction[]): void {
    expect(actions.length).toBe(data.emittedActions.length);

    for (let i = 0; i < actions.length; i++) {
      const expectedAction = data.emittedActions[i];
      const actualAction = actions[i];

      expect(actualAction.type).toBe(expectedAction.type);

      switch (expectedAction.type) {
        case ACTION_ENUM.BRIDGE_IN:
          this.assertBridgeInAction(expectedAction, actualAction as IBridgeInAction);
          break;
        case ACTION_ENUM.BRIDGE_OUT:
          this.assertBridgeOutAction(expectedAction, actualAction as IBridgeOutAction);
          break;
        case ACTION_ENUM.SINGLE_SWAP:
          this.assertSingleSwapAction(expectedAction, actualAction as ISingleSwapAction);
          break;
        case ACTION_ENUM.MULTI_SWAP:
          this.assertMultiSwapAction(expectedAction, actualAction as IMultiSwapAction);
          break;
      }
    }
  }

  public assertBridgeInAction(expectedAction: IBridgeInAction, actualAction: IBridgeInAction): void {
    expect(actualAction.fromChain).toBe(expectedAction.fromChain);
    expect(actualAction.toChain).toBe(expectedAction.toChain);
    expect(actualAction.fromToken).toBe(expectedAction.fromToken);
    expect(actualAction.toToken).toBe(expectedAction.toToken);
    expect(actualAction.fromAmount).toBe(expectedAction.fromAmount);
    expect(actualAction.toAmount).toBe(expectedAction.toAmount);
    expect(actualAction.sender).toBe(expectedAction.sender);
    expect(actualAction.recipient).toBe(expectedAction.recipient);
  }

  public assertBridgeOutAction(expectedAction: IBridgeOutAction, actualAction: IBridgeOutAction): void {
    expect(actualAction.fromChain).toBe(expectedAction.fromChain);
    expect(actualAction.toChain).toBe(expectedAction.toChain);
    expect(actualAction.fromToken).toBe(expectedAction.fromToken);
    expect(actualAction.toToken).toBe(expectedAction.toToken);
    expect(actualAction.fromAmount).toBe(expectedAction.fromAmount);
    expect(actualAction.toAmount).toBe(expectedAction.toAmount);
    expect(actualAction.sender).toBe(expectedAction.sender);
    expect(actualAction.recipient).toBe(expectedAction.recipient);
  }
  
  public assertSwapAction(expectedAction: ISingleSwapAction, actualAction: ISingleSwapAction): void {
    expect(actualAction.fromToken).toBe(expectedAction.fromToken);
    expect(actualAction.toToken).toBe(expectedAction.toToken);
    expect(actualAction.fromAmount).toBe(expectedAction.fromAmount);
    expect(actualAction.toAmount).toBe(expectedAction.toAmount);
    expect(actualAction.recipient).toBe(expectedAction.recipient);
  }
  
  public assertSingleSwapAction(expectedAction: ISingleSwapAction, actualAction: ISingleSwapAction): void {
    expect(actualAction.fromToken).toBe(expectedAction.fromToken);
    expect(actualAction.toToken).toBe(expectedAction.toToken);
    expect(actualAction.fromAmount).toBe(expectedAction.fromAmount);
    expect(actualAction.toAmount).toBe(expectedAction.toAmount);
    expect(actualAction.recipient).toBe(expectedAction.recipient);
  }
    
  public assertMultiSwapAction(expectedAction: IMultiSwapAction, actualAction: IMultiSwapAction): void {
    expect(actualAction.fromTokens).toEqual(expectedAction.fromTokens);
    expect(actualAction.toTokens).toEqual(expectedAction.toTokens);
    expect(actualAction.fromAmounts).toEqual(expectedAction.fromAmounts);
    expect(actualAction.toAmounts).toEqual(expectedAction.toAmounts);
    expect(actualAction.recipients).toEqual(expectedAction.recipients);
  }
}
