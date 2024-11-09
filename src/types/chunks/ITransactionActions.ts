import { ACTION_ENUM, CHAIN_ID } from '../../enums';

export type ITransactionAction = ISingleSwapAction | IMultiSwapAction | IBridgeInAction | IBridgeOutAction;

export type ISingleSwapAction = {
  type: ACTION_ENUM.SINGLE_SWAP;
  /**
   * The token being swapped from
   */
  fromToken: string;
  /**
   * The token being swapped to
   */
  toToken: string;
  /**
   * The amount being swapped from
   */
  fromAmount: string;
  /**
   * The amount being swapped to
   */
  toAmount?: string;
  /**
   * The recipient of the swap
   */
  recipient?: string;
  /**
   * The sender of the swap
   */
  sender?: string;
};

export type IMultiSwapAction = {
  type: ACTION_ENUM.MULTI_SWAP;
  /**
   * The tokens being swapped from
   */
  fromTokens: string[];
  /**
   * The tokens being swapped to
   */
  toTokens: string[];
  /**
   * The amounts being swapped from with the same index as the fromTokens
   */
  fromAmounts: string[];
  /**
   * The amounts being swapped to with the same index as the toTokens
   */
  toAmounts?: string[];
  /**
   * The recipients of the swaps with the same index as the fromTokens and toTokens
   */
  recipients?: string[];
  /**
   * The sender of the swaps
   */
  sender?: string;
};

export type IBridgeInAction = {
  type: ACTION_ENUM.BRIDGE_IN;
  /**
   * The chain the funds are coming from
   */
  fromChain: CHAIN_ID | null;
  /**
   * The chain the funds are going to
   */
  toChain: CHAIN_ID;
  /**
   * The token being bridged out
   */
  fromToken: string | null;
  /**
   * The token being bridged in
   */
  toToken: string;
  /**
   * The amount being bridged out
   */
  fromAmount: string | null;
  /**
   * The amount being bridged in
   */
  toAmount: string;
  /**
   * The sender of the bridged funds
   */
  sender: string | null;
  /**
   * The recipient of the bridged funds
   */
  recipient: string;
};

export type IBridgeOutAction = {
  type: ACTION_ENUM.BRIDGE_OUT;
  /**
   * The chain the funds are coming from
   */
  fromChain: CHAIN_ID;
  /**
   * The chain the funds are going to
   */
  toChain: CHAIN_ID | null;
  /**
   * The token being bridged out
   */
  fromToken: string;
  /**
   * The token being bridged in
   */
  toToken: string | null;
  /**
   * The amount being bridged out
   */
  fromAmount: string;
  /**
   * The amount being bridged in
   */
  toAmount: string | null;
  /**
   * The sender of the bridged funds
   */
  sender: string;
  /**
   * The recipient of the bridged funds
   */
  recipient: string | null;
};
