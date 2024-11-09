import { protocols } from '../config';
import RhinoFi from './RhinoFi';
import Uniswap from './Uniswap';
import UniswapV3 from './UniswapV3';

export const parsers = {
  [protocols.rhinofi.identifier]: new RhinoFi(),
  [protocols.uniswap.identifier]: new Uniswap(),
  [protocols.uniswapv3.identifier]: new UniswapV3()
};
