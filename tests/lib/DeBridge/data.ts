import { ethers } from 'ethers';
import { ACTION_ENUM, CHAIN_ID, IProtocolTestingData } from '../../../src';

export enum DEBRIDGE_VERSIONS {
  V1 = 'v1'
}

export const SOLANA: CHAIN_ID = 7565164 as CHAIN_ID;

export const debridgeTestData: IProtocolTestingData = {
  [DEBRIDGE_VERSIONS.V1]: [
    {
      txnHash: '0x591c3e7aaa9c9e6580940cc8580e1b79b3b46da1baf27e53f0a542503a018a29',
      chainId: CHAIN_ID.ETHEREUM,
      emittedActions: [
        {
          type: ACTION_ENUM.BRIDGE_IN,
          fromChain: SOLANA,
          toChain: CHAIN_ID.ETHEREUM,
          fromToken: null,
          toToken: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
          fromAmount: null,
          toAmount: "0",
          sender: null,
          recipient: "0xeF4fB24aD0916217251F553c0596F8Edc630EB66"
        }
      ]
    },
    {
        txnHash: '0x7a735e83ee94f4f847ac3d89fbb22a7a801fefa632bf3db98de60612fcfb353e',
        chainId: CHAIN_ID.ETHEREUM,
        emittedActions: [
          {
            type: ACTION_ENUM.BRIDGE_OUT,
            fromChain: CHAIN_ID.ETHEREUM,
            toChain: SOLANA,
            fromToken: ethers.ZeroAddress,
            toToken: null,
            fromAmount: "48664594885400000000000",
            toAmount: null,
            sender: "0x65A8F07Bd9A8598E1b5B6C0a88F4779DBC077675",
            recipient: null
          }
        ]
      },
      {
        txnHash: '0xe9f6386b1836b5012789c220d4b298efa4a6baffdcc525b0220ae9228ba9aad9',
        chainId: CHAIN_ID.ETHEREUM,
        emittedActions: [
          {
            type: ACTION_ENUM.BRIDGE_OUT,
            fromChain: CHAIN_ID.ETHEREUM,
            toChain: SOLANA,
            fromToken: ethers.ZeroAddress,
            toToken: null,
            fromAmount: "4227312847948450000000000",
            toAmount: null,
            sender: "0x65A8F07Bd9A8598E1b5B6C0a88F4779DBC077675",
            recipient: null,
          }
        ]
      },
      {
        txnHash: '0xf17a85576391926365841c18a07b0234ecf8deec194ea33b72e7914d58f5f99a',
        chainId: CHAIN_ID.ETHEREUM,
        emittedActions: [
          {
            type: ACTION_ENUM.BRIDGE_IN,
            fromChain: SOLANA,
            toChain: CHAIN_ID.ETHEREUM,
            fromToken: null,
            toToken: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
            fromAmount: null,
            toAmount: "0",
            sender: null,
            recipient: "0xeF4fB24aD0916217251F553c0596F8Edc630EB66"
          }
        ]
      },
      {
        txnHash: '0x5f657c602415621dc49adc874e3d75e405d6acfb060182be306054ffdbdae3b0',
        chainId: CHAIN_ID.ETHEREUM,
        emittedActions: [
          {
            type: ACTION_ENUM.BRIDGE_IN,
            fromChain: SOLANA,
            toChain: CHAIN_ID.ETHEREUM,
            fromToken: null,
            toToken: ethers.ZeroAddress,
            fromAmount: null,
            toAmount: "6079378427921190000000000",
            sender: null,
            recipient: "0x65A8F07Bd9A8598E1b5B6C0a88F4779DBC077675"
          }
        ]
      },
      {
        txnHash: '0xc9669bf2973c4ffdec184fd1f70621749640f6ebb11ca643ac9f7d2ddd664360',
        chainId: CHAIN_ID.ETHEREUM,
        emittedActions: [
          {
            type: ACTION_ENUM.BRIDGE_OUT,
            fromChain: CHAIN_ID.ETHEREUM,
            toChain: SOLANA,
            fromToken: ethers.ZeroAddress,
            toToken: null,
            fromAmount: "5250656717199960000000000",
            toAmount: null,
            sender: "0x65A8F07Bd9A8598E1b5B6C0a88F4779DBC077675",
            recipient: null,
          }
        ]
      },
      {
        txnHash: '0xdc0bfb7ec585e85d2ee58d8cee6e3a967bfc4cd5d081d8950c085f5db8772001',
        chainId: CHAIN_ID.ETHEREUM,
        emittedActions: [
          {
            type: ACTION_ENUM.BRIDGE_OUT,
            fromChain: CHAIN_ID.ETHEREUM,
            toChain: CHAIN_ID.POLYGON,
            fromToken: ethers.ZeroAddress,
            toToken: null,
            fromAmount: "970000000000",
            toAmount: null,
            sender: "0xB2a8c66172309Ec01f2e55498e699C5C4C665E21",
            recipient: null,
          }
        ]
      },
      {
        txnHash: '0xba9518ee556257f554967038a5e7fefee40ed06d6eddd6becff942cd7db64f83',
        chainId: CHAIN_ID.ETHEREUM,
        emittedActions: [
          {
            type: ACTION_ENUM.BRIDGE_IN,
            fromChain: SOLANA,
            toChain: CHAIN_ID.ETHEREUM,
            fromToken: null,
            toToken: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
            fromAmount: null,
            toAmount: "0",
            sender: null,
            recipient: "0xeF4fB24aD0916217251F553c0596F8Edc630EB66",
          }
        ]
      },
      {
        txnHash: '0x44925dd3a675ef8cfcb695fd5b0a3fbd2638a6eb89aa54466ed7fb488540fb24',
        chainId: CHAIN_ID.ARBITRUM,
        emittedActions: [
          {
            type: ACTION_ENUM.BRIDGE_IN,
            fromChain: CHAIN_ID.LINEA,
            toChain: CHAIN_ID.ARBITRUM,
            fromToken: null,
            toToken: "0x43dE2d77BF8027e25dBD179B491e8d64f38398aA",
            fromAmount: null,
            toAmount: "0",
            sender: null,
            recipient: "0xeF4fB24aD0916217251F553c0596F8Edc630EB66",
          }
        ]
      },
      {
        txnHash: '0x9168bcc02724b8c11f4b18447995c8deec3f89c66f47c37340510c84f30d55be',
        chainId: CHAIN_ID.ARBITRUM,
        emittedActions: [
          {
            type: ACTION_ENUM.BRIDGE_OUT,
            fromChain: CHAIN_ID.ARBITRUM,
            toChain: CHAIN_ID.POLYGON,
            fromToken: ethers.ZeroAddress,
            toToken: null,
            fromAmount: "990000000000",
            toAmount: null,
            sender: "0x1E379e0ecFFdDAfFeEFad48b811BCc873C199e28",
            recipient: null,
          }
        ]
      },
  ]
};