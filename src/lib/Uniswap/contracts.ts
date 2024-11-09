import { ethers } from 'ethers';
import { CHAIN_ID, LISTEN_FOR_TRANSACTIONS } from '../../enums';
import { IProtocolContractDefinitions } from '../../types';
import UniswapV2RouterABI from './abis/UniswapV2Router.json';

export enum CONTRACT_ENUM {
  POOL_V2 = 'PoolV2',
  ROUTER_V2 = 'RouterV2',
  POOL_V3 = 'PoolV3',
  ROUTER_V3 = 'RouterV3'
}

export enum EVENT_ENUM {
  SWAP = '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822'
}

export const contracts: IProtocolContractDefinitions = {
  [CONTRACT_ENUM.ROUTER_V2]: {
    interface: new ethers.Interface(UniswapV2RouterABI),
    deployments: {
      [CHAIN_ID.ARBITRUM]: {
        address: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.INCOMING]
      }
    },
    events: {
      [EVENT_ENUM.SWAP]: {
        abi: new ethers.Interface([
          'event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)'
        ])
      }
    }
  }
};
