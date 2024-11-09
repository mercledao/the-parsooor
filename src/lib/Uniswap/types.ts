export interface IUniswapV2SwapParams {
  recipient: string;
  amountIn?: string;
  amountOut?: string;
  amountInMax?: string;
  amountOutMin?: string;
  path: string[];
}

export interface IUniswapV3SwapParams {
  recipient: string;
  tokenIn: string;
  tokenOut: string;
  fee: number;
  amountIn?: string;
  amountOut?: string;
  amountInMax?: string;
  amountOutMin?: string;
}

export type UniswapVersion = 'V2' | 'V3';
