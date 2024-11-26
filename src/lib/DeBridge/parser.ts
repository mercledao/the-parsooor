import { ethers } from "ethers";
import { ACTION_ENUM } from "../../enums";
import { ProtocolHelper } from "../../helpers";
import { IBridgeInAction, IBridgeOutAction, ITransaction, ITransactionAction, ITransactionLog } from "../../types";
import { CONTRACT_ENUM, EVENT_ENUM, contracts } from "./contracts";

export class DeBridgeParser {
  public static async parseTransaction(transaction: ITransaction): Promise<ITransactionAction[]> {
    for (const log of transaction.logs) {
      const topic = log.topics[0].toLowerCase();
      
      if (topic === EVENT_ENUM.SENT.toLowerCase()) {
        return [this.parseSentEvent(log, transaction)];
      }

      if (topic === EVENT_ENUM.CLAIMED.toLowerCase()) {
        return [this.parseClaimedEvent(log, transaction)];
      }
    }

    throw new Error("No supported events found in transaction");
  }

  private static parseSentEvent(log: ITransactionLog, transaction: ITransaction): IBridgeOutAction {
    const parsedLog = ProtocolHelper.parseLog(
      log,
      contracts[CONTRACT_ENUM.DEBRIDGE_GATE].events[EVENT_ENUM.SENT]
    );

    return {
      type: ACTION_ENUM.BRIDGE_OUT,
      fromChain: transaction.chainId,
      toChain: Number(parsedLog.args.chainIdTo),
      fromToken: parsedLog.args.feeParams.isNativeToken ? ethers.ZeroAddress : transaction.to,
      toToken: null,
      fromAmount: parsedLog.args.amount.toString(),
      toAmount: null,
      sender: parsedLog.args.nativeSender,
      recipient: null
    };
  }

  private static parseClaimedEvent(log: ITransactionLog, transaction: ITransaction): IBridgeInAction {
    const parsedLog = ProtocolHelper.parseLog(
      log,
      contracts[CONTRACT_ENUM.DEBRIDGE_GATE].events[EVENT_ENUM.CLAIMED]
    );

    return {
      type: ACTION_ENUM.BRIDGE_IN,
      fromChain: Number(parsedLog.args.chainIdFrom),
      toChain: transaction.chainId,
      fromToken: null,
      toToken: parsedLog.args.isNativeToken ? ethers.ZeroAddress : transaction.to,
      fromAmount: null,
      toAmount: parsedLog.args.amount.toString(),
      sender: null,
      recipient: parsedLog.args.receiver
    };
  }
}
