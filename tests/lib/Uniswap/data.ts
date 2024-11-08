import { ACTION_ENUM, CHAIN_ID } from '../../../src/enums';
import { IProtocolTestingData } from '../../../src/types/chunks/ITestingData';

export enum UNISWAP_VERSIONS {
  V2 = 'v2',
  V3 = 'v3'
}

export const uniswapData: IProtocolTestingData = {
  [UNISWAP_VERSIONS.V2]: [
    {
      txnHash: '0xf69a1760dc05375d18d4775443404b608dc515bb23c72eac56a92dc3b76774dc',
      chainId: CHAIN_ID.ARBITRUM,
      emittedActions: [
        {
          type: ACTION_ENUM.SINGLE_SWAP,
          fromToken: '0xdDd6eBD74684318fa912084a41a01f11B6C277f7',
          toToken: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
          fromAmount: '13581000000000000000000',
          toAmount: '894501',
          recipient: '0x08C9AA39f1fEbb81d43D8e70b3A0706dA76812aB'
        }
      ]
    },
    {
      txnHash: '0x158075a567ba7191c90fb5f3ed090f32c20f0f2dd8f6ad6216291c066604913a',
      chainId: CHAIN_ID.ARBITRUM,
      emittedActions: [
        {
          type: ACTION_ENUM.SINGLE_SWAP,
          fromToken: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
          toToken: '0xdDd6eBD74684318fa912084a41a01f11B6C277f7',
          fromAmount: '300000',
          toAmount: '4471464971679853714295',
          recipient: '0xb098779473c782808F3e3dB3dBECdb4e8eCe0b1F'
        }
      ]
    },
    {
      txnHash: '0xa5a80e053377f895bcd5cc3995937cd9d9ce1335e26a7aeeb8f6465aef778393',
      chainId: CHAIN_ID.ARBITRUM,
      emittedActions: [
        {
          type: ACTION_ENUM.SINGLE_SWAP,
          fromToken: '0xdDd6eBD74684318fa912084a41a01f11B6C277f7',
          toToken: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
          fromAmount: '14960000000000000000000',
          toAmount: '1042572',
          recipient: '0xd9AF2b86e4998A27eb740316b8a00159FA4a43Dd'
        }
      ]
    },
    {
      txnHash: '0xbd57fdc14052b770aa8618355151e4c3819cd98f5d5e262cd7e3541e8bafb8b9',
      chainId: CHAIN_ID.ARBITRUM,
      emittedActions: [
        {
          type: ACTION_ENUM.SINGLE_SWAP,
          fromToken: '0xdDd6eBD74684318fa912084a41a01f11B6C277f7',
          toToken: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
          fromAmount: '13232000000000000000000',
          toAmount: '922970',
          recipient: '0x8e521C622A8241d20E06b730f3Fe0900e3e4Fe65'
        }
      ]
    },
    {
      txnHash: '0x6fc6004f882dbd1588dbc2acee12201b82fab668792fa6b5f62f211c332a52e2',
      chainId: CHAIN_ID.ARBITRUM,
      emittedActions: [
        {
          type: ACTION_ENUM.SINGLE_SWAP,
          fromToken: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
          toToken: '0x7D717227840328Bf7ABcfAa9B3530412cdA08cE8',
          fromAmount: '378800000000000000',
          toAmount: '0',
          recipient: '0xCd2bDA408106Be06E7f16a6f8cb61e3F03Eb5873'
        }
      ]
    },
    {
      txnHash: '0x7ae686132f723dce718cbf600e0e71b77b7f4cc7eb8264d540ddfd3598e8b6b5',
      chainId: CHAIN_ID.ARBITRUM,
      emittedActions: [
        {
          type: ACTION_ENUM.SINGLE_SWAP,
          fromToken: '0x41169bDBa61440e322913291f4fF9bD2793e48dB', 
          toToken: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', 
          fromAmount: '4284153702325987257', 
          toAmount: '8000000',                   
          recipient: '0xC6FFc94F0fBC0e402e80b0ee09832837a1ECB4B3',
        }
      ]
    },
    {
      txnHash: '0xe6ed104838adfbf16c9eeb170878d0b6a2c7bb3d48b925721fbb893269a1c3b5',
      chainId: CHAIN_ID.ARBITRUM,
      emittedActions: [
        {
          type: ACTION_ENUM.SINGLE_SWAP,
          fromToken: '0x250f93c92AEbF7304c9e7e347D1acA8C0212Edea', 
          toToken: '0x0000000000000000000000000000000000000000', 
          fromAmount: '64825425796635640', 
          toAmount: '1845000000000000',                   
          recipient: '0xC8b19E53D9366f68811C6c851A2c3aC1cF14AF96',
        }
      ]
    },
    {
      txnHash: '0xbca182c0827a69081c1ee9cfab40a3c7feb5dd5fbce9f3249cb93a339e35aba5',
      chainId: CHAIN_ID.ARBITRUM,
      emittedActions: [
        {
          type: ACTION_ENUM.SINGLE_SWAP,
          fromToken: '0x0000000000000000000000000000000000000000', 
          toToken: '0x250f93c92AEbF7304c9e7e347D1acA8C0212Edea', 
          fromAmount: '6093902262353599', 
          toAmount: '200000000000000000',                   
          recipient: '0xB047A319827D6f00999091390D6aaD3cd256a59A',
        }
      ]
    },
    {
      txnHash: '0x14648c7f19cf5b4456c446d68a97006a53c9575cfb0fc95480bc0cdc93d22540',
      chainId: CHAIN_ID.ARBITRUM,
      emittedActions: [
        {
          type: ACTION_ENUM.SINGLE_SWAP,
          fromToken: '0x0000000000000000000000000000000000000000', 
          toToken: '0xE916D7bb0DBc0d07EE1028c21E60458eB34E8870', 
          fromAmount: '2277876151417014', 
          toAmount: '0',                   
          recipient: '0xeCCfc88097EeB44A7B5930d91B41452b017Ea1c8',
        }
      ]
    },
    {
      txnHash: '0x19b2c1a867d2f81f289842e061f4392133c2236bb001df6d0b5216bc9bb8ef9f',
      chainId: CHAIN_ID.ARBITRUM,
      emittedActions: [
        {
          type: ACTION_ENUM.SINGLE_SWAP,
          fromToken: '0xEd7d16E3aD3D98E623C1dF356A810867f44F4D8d', 
          toToken: '0x0000000000000000000000000000000000000000', 
          fromAmount: '100000000000000000000',
          toAmount: '3112638000000000',                   
          recipient: '0x74d90f1dcb8EBA0B3855601747A3a905f02C157B',
        }
      ]
    },
  ]
}; 