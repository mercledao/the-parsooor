import { ethers } from 'ethers';
import { ACTION_ENUM } from '../../enums';
import { ProtocolHelper } from '../../helpers';
import { IBridgeInAction, IBridgeOutAction, ITransaction, ITransactionAction, ITransactionLog } from '../../types';
import { CONTRACT_ENUM, contracts, EVENT_ENUM } from './contracts';

enum CONTRACT_FUNCTION_NAMES {
  // Function for depositing tokens to the bridge
  DEPOSIT = 'deposit',

  // Function for depositing native tokens to the bridge
  DEPOSIT_NATIVE = 'depositNative',

  // Function for withdrawing tokens from the bridge
  WITHDRAW = 'withdrawV2',

  // Function for withdrawing native tokens from the bridge
  WITHDRAW_NATIVE = 'withdrawNativeV2',

  // Function for withdrawing tokens from the bridge with native + erc20
  WITHDRAW_WITH_NATIVE = 'withdrawV2WithNative'
}

export class DepositContractParser {
  public static parseTransaction(transaction: ITransaction): ITransactionAction[] {
    const actions: ITransactionAction[] = [];

    const parsedTxn = ProtocolHelper.parseTransaction(transaction, CONTRACT_ENUM.DEPOSIT_CONTRACT, contracts);

    switch (parsedTxn.name) {
      case CONTRACT_FUNCTION_NAMES.DEPOSIT:
        actions.push(this.parseDeposit(transaction, parsedTxn));
        break;
      case CONTRACT_FUNCTION_NAMES.DEPOSIT_NATIVE:
        actions.push(this.parseDepositNative(transaction, parsedTxn));
        break;
      case CONTRACT_FUNCTION_NAMES.WITHDRAW:
        actions.push(this.parseWithdraw(transaction, parsedTxn));
        break;
      case CONTRACT_FUNCTION_NAMES.WITHDRAW_NATIVE:
        actions.push(this.parseWithdrawNative(transaction, parsedTxn));
        break;
      case CONTRACT_FUNCTION_NAMES.WITHDRAW_WITH_NATIVE:
        actions.push(...this.parseWithdrawWithNative(transaction, parsedTxn));
        break;
    }

    return actions;
  }

  private static parseWithdraw(transaction: ITransaction, parsedTxn: ethers.TransactionDescription): IBridgeInAction {
    return {
      type: ACTION_ENUM.BRIDGE_IN,

      fromChain: null,
      toChain: transaction.chainId,

      fromToken: null,
      toToken: parsedTxn.args.token,

      fromAmount: null,
      toAmount: parsedTxn.args.amount.toString(),

      sender: null,
      recipient: parsedTxn.args.to
    };
  }

  private static parseWithdrawNative(
    transaction: ITransaction,
    parsedTxn: ethers.TransactionDescription
  ): IBridgeInAction {
    return {
      type: ACTION_ENUM.BRIDGE_IN,

      fromChain: null,
      toChain: transaction.chainId,

      fromToken: null,
      toToken: ethers.ZeroAddress,

      fromAmount: null,
      toAmount: parsedTxn.args.amount.toString(),

      sender: null,
      recipient: parsedTxn.args.to
    };
  }

  private static parseWithdrawWithNative(
    transaction: ITransaction,
    parsedTxn: ethers.TransactionDescription
  ): IBridgeInAction[] {
    return [
      {
        type: ACTION_ENUM.BRIDGE_IN,

        fromChain: null,
        toChain: transaction.chainId,

        fromToken: null,
        toToken: parsedTxn.args.token,

        fromAmount: null,
        toAmount: parsedTxn.args.amountToken.toString(),

        sender: null,
        recipient: parsedTxn.args.to
      },
      {
        type: ACTION_ENUM.BRIDGE_IN,

        fromChain: null,
        toChain: transaction.chainId,

        fromToken: null,
        toToken: ethers.ZeroAddress,

        fromAmount: null,
        toAmount: parsedTxn.args.amountNative.toString(),

        sender: null,
        recipient: parsedTxn.args.to
      }
    ];
  }

  private static parseDeposit(transaction: ITransaction, parsedTxn: ethers.TransactionDescription): IBridgeOutAction {
    return {
      type: ACTION_ENUM.BRIDGE_OUT,

      fromChain: transaction.chainId,
      toChain: null,

      fromToken: parsedTxn.args.token,
      toToken: null,

      fromAmount: parsedTxn.args.amount.toString(),
      toAmount: null,

      sender: transaction.from,
      recipient: null
    };
  }

  private static parseDepositNative(
    transaction: ITransaction,
    parsedTxn: ethers.TransactionDescription
  ): IBridgeOutAction {
    return {
      type: ACTION_ENUM.BRIDGE_OUT,

      fromChain: transaction.chainId,
      toChain: null,

      fromToken: ethers.ZeroAddress,
      toToken: null,

      fromAmount: transaction.value.toString(),
      toAmount: null,

      sender: transaction.from,
      recipient: null
    };
  }
}

export class RhinoFiEthL1DepositContractParser {
  private static contractDefiniton = contracts[CONTRACT_ENUM.RHINOFI_ETH_L1_DEPOSIT_CONTRACT];
  private static assetTypesToTokenAddress = {
    '316623735692853304525146192642758839706355829840274185964789512850136103846': ethers.ZeroAddress
  };

  public static parseTransaction(transaction: ITransaction): ITransactionAction[] {
    const actions: ITransactionAction[] = [];

    const hasDepositLog = transaction.logs.find((log) => log.topics[0] === EVENT_ENUM.L1_DEPOSIT_LOG);

    if (hasDepositLog) {
      actions.push(this.parseDeposit(transaction, hasDepositLog));
    }

    return actions;
  }

  private static parseDeposit(transaction: ITransaction, depositLog: ITransactionLog): IBridgeOutAction {
    const parsedLog = ProtocolHelper.parseLog(depositLog, this.contractDefiniton.events[EVENT_ENUM.L1_DEPOSIT_LOG]);

    const fromToken = this.assetTypesToTokenAddress[parsedLog.args.assetType.toString()];

    if (!fromToken) {
      throw new Error(`No token found for asset type ${parsedLog.args.assetType.toString()}`);
    }

    return {
      type: ACTION_ENUM.BRIDGE_OUT,
      fromChain: transaction.chainId,
      toChain: null,
      fromToken,
      toToken: null,
      fromAmount: transaction.value.toString(),
      toAmount: null,
      sender: transaction.from,
      recipient: null
    };
  }
}
