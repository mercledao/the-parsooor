import { ethers } from 'ethers';
import { CHAIN_ID, LISTEN_FOR_TRANSACTIONS } from '../../enums';
import { IProtocolContractDefinitions } from '../../types';
import { CONTRACT_ENUM } from '../Uniswap/contracts';
import PoolAbi from './abis/Pool.json';
import RouterAbi from './abis/Router.json';

enum EVENT_ENUM {
  SWAP = 'Swap'
}

// Uniswap V3 Command IDs
enum COMMAND_ENUM {
  // V3 Swap Commands
  V3_SWAP_EXACT_IN = 0x00,
  V3_SWAP_EXACT_OUT = 0x01,
  
  // V2 Swap Commands  
  V2_SWAP_EXACT_IN = 0x02,
  V2_SWAP_EXACT_OUT = 0x03,
  
  // Permit2 Commands
  PERMIT2_PERMIT = 0x0a,
  PERMIT2_TRANSFER_FROM = 0x0b,
  
  // Wrap/Unwrap Commands
  WRAP_ETH = 0x0c,
  UNWRAP_WETH = 0x0d,
  
  // Sweep Commands
  SWEEP = 0x0e,
  TRANSFER = 0x0f,
  
  // Payment Commands  
  PAY_PORTION = 0x10,
  
  // V3 LP Commands
  V3_MINT = 0x11,
  V3_COLLECT = 0x12,
  V3_BURN = 0x13,
  
  // V2 LP Commands
  V2_MINT = 0x14,
  V2_BURN = 0x15,
  
  // Routing Commands
  ROUTE = 0x16,
  NOOP = 0x17,
  
  // Timestamp Commands
  TIMESTAMP = 0x18
}

const contracts: IProtocolContractDefinitions = {
  [CONTRACT_ENUM.POOL_V3]: {
    interface: new ethers.Interface(PoolAbi.abi),
    deployments: {
      [CHAIN_ID.ARBITRUM]: {
        address: ethers.ZeroAddress,
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.INCOMING]
      }
    },
    events: {
      [EVENT_ENUM.SWAP]: {
        signature: '0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67',
        abi: new ethers.Interface([
          'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)'
        ])
      }
    }
  },
  [CONTRACT_ENUM.ROUTER_V3]: {
    interface: new ethers.Interface(RouterAbi.abi),
    deployments: {
      [CHAIN_ID.ARBITRUM]: {
        address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.OUTGOING]
      }
    },
    events: {}
  }
};

export { COMMAND_ENUM, CONTRACT_ENUM, contracts, EVENT_ENUM };

