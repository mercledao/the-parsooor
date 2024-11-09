import { ethers } from 'ethers';
import { ACTION_ENUM } from '../../enums';
import { ProtocolHelper } from '../../helpers';
import { IMultiSwapAction, ISingleSwapAction, ITransaction, ITransactionAction } from '../../types';
import { COMMAND_ENUM, CONTRACT_ENUM, contracts } from './contracts';

interface V3SwapParams {
  recipient: string;
  tokenIn: string;
  tokenOut: string;
  fee: number;
  sender: string;
  amountIn?: string;
  amountOutMinimum?: string;
  amountOut?: string;
  amountInMaximum?: string;
}

export class UniswapV3Parser {
  public static async parseTransaction(transaction: ITransaction): Promise<ITransactionAction[]> {
    if (!transaction?.data) {
      console.error('Invalid transaction: missing data');
      return [];
    }
    const actions: ITransactionAction[] = [];

    if (!ProtocolHelper.txnToIsListenerContract(transaction, CONTRACT_ENUM.ROUTER_V3, contracts)) {
      return actions;
    }

    try {
      const routerActions = await this.parseRouterCalldata(transaction);
      if (routerActions.length > 0) {
        return this.combineMultiHopSwaps(routerActions);
      }
    } catch (error) {
      console.error('Failed to parse router calldata:', error);
    }

    return actions;
  }

  private static async parseRouterCalldata(transaction: ITransaction): Promise<ITransactionAction[]> {
    try {
      const decodedData = contracts[CONTRACT_ENUM.ROUTER_V3].interface.parseTransaction({
        data: transaction.data
      });

      if (decodedData.name !== 'execute' || !decodedData.args || decodedData.args.length < 2) {
        console.warn('Not a valid execute transaction');
        return [];
      }

      const commands = decodedData.args[0] as string;
      const inputs = decodedData.args[1] as string[];
      
      if (!commands || !inputs || commands.length % 2 !== 0 || commands.length === 0) {
        console.error('Invalid commands or inputs format');
        return [];
      }

      const actions: ITransactionAction[] = [];
      let inputIndex = 0;

      for (let i = 0; i < commands.length; i += 2) {
        const commandId = parseInt(commands.slice(i, i + 2), 16);
        
        if (inputIndex >= inputs.length) {
          console.error('Input index out of bounds');
          break;
        }

        switch (commandId) {
          case COMMAND_ENUM.V3_SWAP_EXACT_IN:
          case COMMAND_ENUM.V3_SWAP_EXACT_OUT: {
            const swapData = this.decodeSwapData(inputs[inputIndex], commandId);
            if (swapData) {
              actions.push(swapData);
            }
            inputIndex++;
            break;
          }

          case COMMAND_ENUM.V2_SWAP_EXACT_IN:
          case COMMAND_ENUM.V2_SWAP_EXACT_OUT: {
            const v2SwapData = this.decodeV2SwapData(inputs[inputIndex], commandId);
            if (v2SwapData) {
              actions.push(v2SwapData);
            }
            inputIndex++;
            break;
          }

          case COMMAND_ENUM.ROUTE: {
            const routeData = this.decodeRouteData(inputs[inputIndex]);
            if (routeData.length > 0) {
              actions.push(...routeData);
            }
            inputIndex++;
            break;
          }
          
          case COMMAND_ENUM.PERMIT2_TRANSFER_FROM:
          case COMMAND_ENUM.WRAP_ETH:
          case COMMAND_ENUM.UNWRAP_WETH:
          case COMMAND_ENUM.V3_MINT:
          case COMMAND_ENUM.V3_COLLECT:
          case COMMAND_ENUM.V3_BURN:
          case COMMAND_ENUM.SWEEP:
          case COMMAND_ENUM.TRANSFER:
          case COMMAND_ENUM.PERMIT2_PERMIT:
          case COMMAND_ENUM.PAY_PORTION:
          case COMMAND_ENUM.NOOP:
          case COMMAND_ENUM.TIMESTAMP:
            inputIndex++;
            break;

          default:
            console.warn(`Unknown command ID: ${commandId}`);
            inputIndex++;
            break;
        }
      }

      return actions;
    } catch (error) {
      console.error('Failed to parse router calldata:', error);
      return [];
    }
  }

  private static decodeSwapData(input: string, commandId: number): ISingleSwapAction | null {
    try {
      const abiCoder = new ethers.AbiCoder();
      
      const isExactIn = commandId === COMMAND_ENUM.V3_SWAP_EXACT_IN;
      const params = abiCoder.decode(
        [
          'address', // recipient
          'address', // tokenIn
          'address', // tokenOut
          'uint24', // fee
          'uint256', // amount
          'uint256', // amountLimit
          'address'  // sender
        ],
        input
      ) as unknown[];

      const swapParams: V3SwapParams = {
        recipient: params[0] as string,
        tokenIn: params[1] as string,
        tokenOut: params[2] as string,
        fee: Number(params[3]),
        sender: params[6] as string
      };

      if (isExactIn) {
        swapParams.amountIn = (params[4] as bigint).toString();
        swapParams.amountOutMinimum = (params[5] as bigint).toString();
      } else {
        swapParams.amountOut = (params[4] as bigint).toString();
        swapParams.amountInMaximum = (params[5] as bigint).toString();
      }

      return {
        type: ACTION_ENUM.SINGLE_SWAP,
        fromToken: swapParams.tokenIn,
        toToken: swapParams.tokenOut,
        fromAmount: isExactIn ? swapParams.amountIn! : swapParams.amountInMaximum!,
        toAmount: isExactIn ? swapParams.amountOutMinimum : swapParams.amountOut,
        recipient: swapParams.recipient,
        sender: swapParams.sender
      };
    } catch (error) {
      console.error('Failed to decode swap data:', error);
      return null;
    }
  }

  private static decodeV2SwapData(input: string, commandId: number): ISingleSwapAction | null {
    try {
      const abiCoder = new ethers.AbiCoder();
      
      const isExactIn = commandId === COMMAND_ENUM.V2_SWAP_EXACT_IN;
      const params = abiCoder.decode(
        [
          'address', // recipient
          'address', // tokenIn
          'address', // tokenOut
          'uint256', // amount
          'uint256', // amountLimit
          'address'  // sender
        ],
        input
      ) as unknown[];

      return {
        type: ACTION_ENUM.SINGLE_SWAP,
        fromToken: params[1] as string,
        toToken: params[2] as string,
        fromAmount: isExactIn ? (params[3] as bigint).toString() : (params[4] as bigint).toString(),
        toAmount: isExactIn ? (params[4] as bigint).toString() : (params[3] as bigint).toString(),
        recipient: params[0] as string,
        sender: params[5] as string
      };
    } catch (error) {
      console.error('Failed to decode V2 swap data:', error);
      return null;
    }
  }

  private static decodeRouteData(input: string): ITransactionAction[] {
    try {
      const abiCoder = new ethers.AbiCoder();
      const decoded = abiCoder.decode(
        ['bytes', 'bytes[]'],
        input
      ) as unknown as [string, string[]];
      
      const [nestedCommands, nestedInputs] = decoded;

      const actions: ITransactionAction[] = [];
      let inputIndex = 0;

      for (let i = 0; i < nestedCommands.length; i += 2) {
        const commandId = parseInt(nestedCommands.slice(i, i + 2), 16);
        
        switch (commandId) {
          case COMMAND_ENUM.V3_SWAP_EXACT_IN:
          case COMMAND_ENUM.V3_SWAP_EXACT_OUT: {
            const swapData = this.decodeSwapData(nestedInputs[inputIndex], commandId);
            if (swapData) {
              actions.push(swapData);
            }
            inputIndex++;
            break;
          }
          case COMMAND_ENUM.V2_SWAP_EXACT_IN:
          case COMMAND_ENUM.V2_SWAP_EXACT_OUT: {
            const v2SwapData = this.decodeV2SwapData(nestedInputs[inputIndex], commandId);
            if (v2SwapData) {
              actions.push(v2SwapData);
            }
            inputIndex++;
            break;
          }
          default:
            inputIndex++;
            break;
        }
      }

      return actions;
    } catch (error) {
      console.error('Failed to decode route data:', error);
      return [];
    }
  }

  private static combineMultiHopSwaps(actions: ITransactionAction[]): ITransactionAction[] {
    const result: ITransactionAction[] = [];
    let currentMultiSwap: IMultiSwapAction | null = null;

    for (const action of actions) {
      if (action.type !== ACTION_ENUM.SINGLE_SWAP) {
        if (currentMultiSwap) {
          result.push(currentMultiSwap);
          currentMultiSwap = null;
        }
        result.push(action);
        continue;
      }

      const singleSwap = action as ISingleSwapAction;

      if (!currentMultiSwap) {
        currentMultiSwap = {
          type: ACTION_ENUM.MULTI_SWAP,
          fromTokens: [singleSwap.fromToken],
          toTokens: [singleSwap.toToken],
          fromAmounts: [singleSwap.fromAmount],
          toAmounts: singleSwap.toAmount ? [singleSwap.toAmount] : undefined,
          recipients: singleSwap.recipient ? [singleSwap.recipient] : undefined,
          sender: singleSwap.sender
        };
      } else {
        currentMultiSwap.fromTokens.push(singleSwap.fromToken);
        currentMultiSwap.toTokens.push(singleSwap.toToken);
        currentMultiSwap.fromAmounts.push(singleSwap.fromAmount);
        
        if (currentMultiSwap.toAmounts && singleSwap.toAmount) {
          currentMultiSwap.toAmounts.push(singleSwap.toAmount);
        }
        
        if (currentMultiSwap.recipients && singleSwap.recipient) {
          currentMultiSwap.recipients.push(singleSwap.recipient);
        }
      }
    }

    if (currentMultiSwap) {
      result.push(currentMultiSwap);
    }

    return result;
  }
}
