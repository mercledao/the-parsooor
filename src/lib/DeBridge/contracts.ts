import { ethers } from "ethers";
import { CHAIN_ID, LISTEN_FOR_TRANSACTIONS } from "../../enums";
import { IProtocolContractDefinitions } from "../../types";
import DeBridgeABI from "./abis/DeBridge.json";

export enum CONTRACT_ENUM {
  DEBRIDGE_GATE = "DeBridgeGate",
}

export enum EVENT_ENUM {
  SENT = "0xe315721819a1f353fe56de404206bdd896ab5edc7822f1804a8c4c2c4788174c",
  CLAIMED = "0xfee5cae6d86f128037e90fc8d24296e73ad402bd6f6f09098589d528c2e14ad2"
}

export const contracts: IProtocolContractDefinitions = {
  [CONTRACT_ENUM.DEBRIDGE_GATE]: {
    interface: new ethers.Interface(DeBridgeABI),
    deployments: {
      [CHAIN_ID.ETHEREUM]: {
        address: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.INCOMING, LISTEN_FOR_TRANSACTIONS.OUTGOING],
      },
      [CHAIN_ID.BSC]: {
        address: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.INCOMING, LISTEN_FOR_TRANSACTIONS.OUTGOING],
      },
      [CHAIN_ID.HECO]: {
        address: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.INCOMING, LISTEN_FOR_TRANSACTIONS.OUTGOING],
      },
      [CHAIN_ID.POLYGON]: {
        address: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.INCOMING, LISTEN_FOR_TRANSACTIONS.OUTGOING],
      },
      [CHAIN_ID.ARBITRUM]: {
        address: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.INCOMING, LISTEN_FOR_TRANSACTIONS.OUTGOING],
      },
      [CHAIN_ID.AVALANCHE]: {
        address: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.INCOMING, LISTEN_FOR_TRANSACTIONS.OUTGOING],
      },
      [CHAIN_ID.FANTOM]: {
        address: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.INCOMING, LISTEN_FOR_TRANSACTIONS.OUTGOING],
      },
      [CHAIN_ID.LINEA]: {
        address: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.INCOMING, LISTEN_FOR_TRANSACTIONS.OUTGOING],
      },
      [CHAIN_ID.BASE]: {
        address: "0xc1656B63D9EEBa6d114f6bE19565177893e5bCBF",
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.INCOMING, LISTEN_FOR_TRANSACTIONS.OUTGOING],
      },
      [CHAIN_ID.OPTIMISM]: {
        address: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.INCOMING, LISTEN_FOR_TRANSACTIONS.OUTGOING],
      },
      [CHAIN_ID.NEON]: {
        address: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.INCOMING, LISTEN_FOR_TRANSACTIONS.OUTGOING],
      },
      [CHAIN_ID.GNOSIS]: {
        address: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.INCOMING, LISTEN_FOR_TRANSACTIONS.OUTGOING],
      },
      [CHAIN_ID.LIGHTLINK]: {
        address: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.INCOMING, LISTEN_FOR_TRANSACTIONS.OUTGOING],
      },
      [CHAIN_ID.METIS]: {
        address: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.INCOMING, LISTEN_FOR_TRANSACTIONS.OUTGOING],
      },
      [CHAIN_ID.BITROCK]: {
        address: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
        listenForTransactions: [LISTEN_FOR_TRANSACTIONS.INCOMING, LISTEN_FOR_TRANSACTIONS.OUTGOING],
      }
    },
    events: {
      [EVENT_ENUM.SENT]: {
        abi: new ethers.Interface([
          "event Sent(bytes32 submissionId, bytes32 indexed debridgeId, uint256 amount, bytes receiver, uint256 nonce, uint256 indexed chainIdTo, uint32 referralCode, tuple(uint256 receivedAmount, uint256 fixFee, uint256 transferFee, bool useAssetFee, bool isNativeToken) feeParams, bytes autoParams, address nativeSender)"
        ]),
      },
      [EVENT_ENUM.CLAIMED]: {
        abi: new ethers.Interface([
          "event Claimed(bytes32 submissionId, bytes32 indexed debridgeId, uint256 amount, address indexed receiver, uint256 nonce, uint256 indexed chainIdFrom, bytes autoParams, bool isNativeToken)"
        ]),
      }
    }
  }
};
