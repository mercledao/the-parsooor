import { ethers } from "ethers";
import { ACTION_ENUM } from "../../enums";
import { ProtocolHelper } from "../../helpers";
import { ISingleSwapAction, ITransaction, ITransactionAction } from "../../types";
import { CONTRACT_ENUM, contracts } from "./contracts";

enum CONTRACT_FUNCTION_NAMES {
  SWAP_EXACT_TOKENS_FOR_TOKENS = "swapExactTokensForTokens",
  SWAP_TOKENS_FOR_EXACT_TOKENS = "swapTokensForExactTokens",
  SWAP_EXACT_ETH_FOR_TOKENS = "swapExactETHForTokens",
  SWAP_TOKENS_FOR_EXACT_ETH = "swapTokensForExactETH",
  SWAP_EXACT_TOKENS_FOR_ETH = "swapExactTokensForETH",
  SWAP_ETH_FOR_EXACT_TOKENS = "swapETHForExactTokens",
  SWAP_EXACT_TOKENS_FOR_TOKENS_SUPPORTING_FEE = "swapExactTokensForTokensSupportingFeeOnTransferTokens",
  SWAP_EXACT_ETH_FOR_TOKENS_SUPPORTING_FEE = "swapExactETHForTokensSupportingFeeOnTransferTokens",
  SWAP_EXACT_TOKENS_FOR_ETH_SUPPORTING_FEE = "swapExactTokensForETHSupportingFeeOnTransferTokens"
}

export class UniswapParser {
  public static parseTransaction(
    transaction: ITransaction
  ): ITransactionAction[] {
    const actions: ITransactionAction[] = [];

    const parsedTxn = ProtocolHelper.parseTransaction(
      transaction,
      CONTRACT_ENUM.ROUTER_V2,
      contracts
    );

    switch (parsedTxn.name) {
      case CONTRACT_FUNCTION_NAMES.SWAP_EXACT_TOKENS_FOR_TOKENS:
      case CONTRACT_FUNCTION_NAMES.SWAP_EXACT_TOKENS_FOR_TOKENS_SUPPORTING_FEE:
        actions.push(this.parseSwapExactTokensForTokens(transaction, parsedTxn));
        break;
      case CONTRACT_FUNCTION_NAMES.SWAP_TOKENS_FOR_EXACT_TOKENS:
        actions.push(this.parseSwapTokensForExactTokens(transaction, parsedTxn));
        break;
      case CONTRACT_FUNCTION_NAMES.SWAP_EXACT_ETH_FOR_TOKENS:
      case CONTRACT_FUNCTION_NAMES.SWAP_EXACT_ETH_FOR_TOKENS_SUPPORTING_FEE:
        actions.push(this.parseSwapExactETHForTokens(transaction, parsedTxn));
        break;
      case CONTRACT_FUNCTION_NAMES.SWAP_TOKENS_FOR_EXACT_ETH:
        actions.push(this.parseSwapTokensForExactETH(transaction, parsedTxn));
        break;
      case CONTRACT_FUNCTION_NAMES.SWAP_EXACT_TOKENS_FOR_ETH:
      case CONTRACT_FUNCTION_NAMES.SWAP_EXACT_TOKENS_FOR_ETH_SUPPORTING_FEE:
        actions.push(this.parseSwapExactTokensForETH(transaction, parsedTxn));
        break;
      case CONTRACT_FUNCTION_NAMES.SWAP_ETH_FOR_EXACT_TOKENS:
        actions.push(this.parseSwapETHForExactTokens(transaction, parsedTxn));
        break;
    }

    return actions;
  }

  private static parseSwapExactTokensForTokens(
    transaction: ITransaction,
    parsedTxn: ethers.TransactionDescription
  ): ISingleSwapAction {
    const path = parsedTxn.args.path;
    return {
      type: ACTION_ENUM.SINGLE_SWAP,
      fromToken: path[0],
      toToken: path[path.length - 1],
      fromAmount: parsedTxn.args.amountIn.toString(),
      toAmount: parsedTxn.args.amountOutMin.toString(),
      recipient: parsedTxn.args.to
    };
  }

  private static parseSwapTokensForExactTokens(
    transaction: ITransaction,
    parsedTxn: ethers.TransactionDescription
  ): ISingleSwapAction {
    const path = parsedTxn.args.path;
    return {
      type: ACTION_ENUM.SINGLE_SWAP,
      fromToken: path[0],
      toToken: path[path.length - 1],
      fromAmount: parsedTxn.args.amountInMax.toString(),
      toAmount: parsedTxn.args.amountOut.toString(),
      recipient: parsedTxn.args.to
    };
  }

  private static parseSwapExactETHForTokens(
    transaction: ITransaction,
    parsedTxn: ethers.TransactionDescription
  ): ISingleSwapAction {
    const path = parsedTxn.args.path;
    return {
      type: ACTION_ENUM.SINGLE_SWAP,
      fromToken: ethers.ZeroAddress,
      toToken: path[path.length - 1],
      fromAmount: transaction.value,
      toAmount: parsedTxn.args.amountOutMin.toString(),
      recipient: parsedTxn.args.to
    };
  }

  private static parseSwapTokensForExactETH(
    transaction: ITransaction,
    parsedTxn: ethers.TransactionDescription
  ): ISingleSwapAction {
    const path = parsedTxn.args.path;
    return {
      type: ACTION_ENUM.SINGLE_SWAP,
      fromToken: path[0],
      toToken: ethers.ZeroAddress,
      fromAmount: parsedTxn.args.amountInMax.toString(),
      toAmount: parsedTxn.args.amountOut.toString(),
      recipient: parsedTxn.args.to
    };
  }

  private static parseSwapExactTokensForETH(
    transaction: ITransaction,
    parsedTxn: ethers.TransactionDescription
  ): ISingleSwapAction {
    const path = parsedTxn.args.path;
    return {
      type: ACTION_ENUM.SINGLE_SWAP,
      fromToken: path[0],
      toToken: ethers.ZeroAddress,
      fromAmount: parsedTxn.args.amountIn.toString(),
      toAmount: parsedTxn.args.amountOutMin.toString(),
      recipient: parsedTxn.args.to
    };
  }

  private static parseSwapETHForExactTokens(
    transaction: ITransaction,
    parsedTxn: ethers.TransactionDescription
  ): ISingleSwapAction {
    const path = parsedTxn.args.path;
    return {
      type: ACTION_ENUM.SINGLE_SWAP,
      fromToken: ethers.ZeroAddress,
      toToken: path[path.length - 1],
      fromAmount: transaction.value,
      toAmount: parsedTxn.args.amountOut.toString(),
      recipient: parsedTxn.args.to
    };
  }
}