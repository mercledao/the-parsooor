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
          case COMMAND_ENUM.V3_SWAP_EXACT_IN: {
            if (this.isMultiHop(inputs[inputIndex])) {
              const { recipient, sender } = this.decodeSwapRecipientAndSender(inputs[inputIndex]);
              const multiHopData = this.parseMultiHopExactInput(
                inputs[inputIndex],
                recipient,
                sender
              );
              actions.push(multiHopData);
            } else {
              const swapData = this.decodeSwapData(inputs[inputIndex], commandId);
              if (swapData) {
                actions.push(swapData);
              }
            }
            inputIndex++;
            break;
          }

          case COMMAND_ENUM.V3_SWAP_EXACT_OUT: {
            if (this.isMultiHop(inputs[inputIndex])) {
              const { recipient, sender } = this.decodeSwapRecipientAndSender(inputs[inputIndex]);
              const multiHopData = this.parseMultiHopExactOutput(
                inputs[inputIndex],
                recipient,
                sender
              );
              actions.push(multiHopData);
            } else {
              const swapData = this.decodeSwapData(inputs[inputIndex], commandId);
              if (swapData) {
                actions.push(swapData);
              }
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
          toAmounts: [singleSwap.toAmount],
          recipients: [singleSwap.recipient],
          sender: singleSwap.sender
        };
        continue;
      }

      // Check if this swap continues the chain
      if (currentMultiSwap.toTokens[currentMultiSwap.toTokens.length - 1] === singleSwap.fromToken) {
        currentMultiSwap.toTokens.push(singleSwap.toToken);
        currentMultiSwap.fromAmounts.push(singleSwap.fromAmount);
        currentMultiSwap.toAmounts.push(singleSwap.toAmount);
        currentMultiSwap.recipients.push(singleSwap.recipient);
      } else {
        result.push(currentMultiSwap);
        currentMultiSwap = {
          type: ACTION_ENUM.MULTI_SWAP,
          fromTokens: [singleSwap.fromToken],
          toTokens: [singleSwap.toToken],
          fromAmounts: [singleSwap.fromAmount],
          toAmounts: [singleSwap.toAmount],
          recipients: [singleSwap.recipient],
          sender: singleSwap.sender
        };
      }
    }

    if (currentMultiSwap) {
      result.push(currentMultiSwap);
    }

    return result;
  }

  private static decodeMultiHopPath(pathData: string): { tokens: string[]; fees: number[] } {
    try {
      const tokens: string[] = [];
      const fees: number[] = [];
      
      const path = pathData.startsWith('0x') ? pathData.slice(2) : pathData;
      
      let i = 0;
      while (i < path.length) {
        tokens.push('0x' + path.slice(i, i + 40));
        i += 40;
        
        if (i < path.length) {
          const fee = parseInt(path.slice(i, i + 6), 16);
          fees.push(fee);
          i += 6;
        }
      }
      
      return { tokens, fees };
    } catch (error) {
      console.error('Failed to decode multi-hop path:', error);
      return { tokens: [], fees: [] };
    }
  }

  private static decodeV3Path(path: string): {
    tokens: string[];
    fees: number[];
  } {
    const result = {
      tokens: [] as string[],
      fees: [] as number[]
    };
    
    let currentIndex = 2; // Skip '0x' prefix
    while (currentIndex < path.length) {
      // Extract token address (20 bytes)
      const token = '0x' + path.slice(currentIndex, currentIndex + 40);
      result.tokens.push(token.toLowerCase());
      currentIndex += 40;
      
      // Extract fee if not at end (3 bytes)
      if (currentIndex < path.length) {
        const fee = parseInt(path.slice(currentIndex, currentIndex + 6), 16);
        result.fees.push(fee);
        currentIndex += 6;
      }
    }
    
    return result;
  }

  private static parseMultiHopExactInput(
    input: string,
    recipient: string,
    sender: string
  ): IMultiSwapAction {
    const abiCoder = new ethers.AbiCoder();
    const decoded = abiCoder.decode(['bytes', 'uint256'], input);
    const path = decoded[0] as string;
    const amountIn = decoded[1] as bigint;

    const { tokens } = this.decodeMultiHopPath(path);
    
    return {
      type: ACTION_ENUM.MULTI_SWAP,
      fromTokens: [tokens[0]],
      toTokens: tokens.slice(1),
      fromAmounts: [amountIn.toString()],
      toAmounts: new Array(tokens.length - 1).fill('0'),
      recipients: new Array(tokens.length - 1).fill(recipient),
      sender
    };
  }

  private static parseMultiHopExactOutput(
    input: string,
    recipient: string,
    sender: string
  ): IMultiSwapAction {
    const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
      ['bytes', 'uint256', 'uint256'],
      input
    );
    
    const path = this.decodeV3Path(decoded[0]);
    // For exact output, path is encoded in reverse
    path.tokens.reverse();
    path.fees.reverse();
    
    return {
      type: ACTION_ENUM.MULTI_SWAP,
      fromTokens: path.tokens.slice(0, -1),
      toTokens: path.tokens.slice(1),
      fromAmounts: [decoded[2].toString()], // amountInMaximum
      toAmounts: [decoded[1].toString()], // amountOut
      recipients: [recipient],
      sender
    };
  }

  private static isMultiHop(input: string): boolean {
    try {
      const abiCoder = new ethers.AbiCoder();
      const decoded = abiCoder.decode(['bytes'], input)[0] as string;
      // A multihop path must be at least 2 tokens (40 bytes) + 1 fee (3 bytes)
      return decoded.length >= 86; // 43 bytes * 2 hex chars per byte
    } catch {
      return false;
    }
  }

  private static decodeSwapRecipientAndSender(input: string): { recipient: string; sender: string } {
    try {
      const abiCoder = new ethers.AbiCoder();
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

      return {
        recipient: params[0] as string,
        sender: params[6] as string
      };
    } catch (error) {
      console.error('Failed to decode recipient and sender:', error);
      return {
        recipient: ethers.ZeroAddress,
        sender: ethers.ZeroAddress
      };
    }
  }
}
