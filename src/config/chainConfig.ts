import { CHAIN_ID } from "../enums";
import { IChainDefinitions } from "../types";

export const chainConfig: IChainDefinitions = {
  [CHAIN_ID.ETHEREUM]: {
    rpcUrl: process.env.ETHEREUM_RPC_URL || "https://eth.public-rpc.com",
  },
  [CHAIN_ID.OPTIMISM]: {
    rpcUrl: process.env.OPTIMISM_RPC_URL || "https://mainnet.optimism.io",
  },
  [CHAIN_ID.BSC]: {
    rpcUrl: process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org",
  },
  [CHAIN_ID.GNOSIS]: {
    rpcUrl: process.env.GNOSIS_RPC_URL || "https://rpc.gnosischain.com",
  },
  [CHAIN_ID.VELAS]: {
    rpcUrl: process.env.VELAS_RPC_URL || "https://explorer.velas.com/rpc",
  },
  [CHAIN_ID.FUSE]: {
    rpcUrl: process.env.FUSE_RPC_URL || "https://rpc.fuse.io",
  },
  [CHAIN_ID.POLYGON]: {
    rpcUrl: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
  },
  [CHAIN_ID.MANTA]: {
    rpcUrl:
      process.env.MANTA_RPC_URL || "https://pacific-rpc.manta.network/http",
  },
  [CHAIN_ID.FANTOM]: {
    rpcUrl: process.env.FANTOM_RPC_URL || "https://fantom-rpc.publicnode.com",
  },
  [CHAIN_ID.BOBA]: {
    rpcUrl: process.env.BOBA_RPC_URL || "https://mainnet.boba.network",
  },
  [CHAIN_ID.ZKSYNC_ERA]: {
    rpcUrl: process.env.ZKSYNC_ERA_RPC_URL || "https://mainnet.era.zksync.io",
  },
  [CHAIN_ID.METIS]: {
    rpcUrl:
      process.env.METIS_RPC_URL || "https://metis-mainnet.public.blastapi.io",
  },
  [CHAIN_ID.POLYGON_ZK]: {
    rpcUrl: process.env.POLYGON_ZK_RPC_URL || "https://zkevm-rpc.com",
  },
  [CHAIN_ID.MOONBEAM]: {
    rpcUrl: process.env.MOONBEAM_RPC_URL || "https://rpc.api.moonbeam.network",
  },
  [CHAIN_ID.MOONRIVER]: {
    rpcUrl:
      process.env.MOONRIVER_RPC_URL || "https://moonriver-rpc.publicnode.com",
  },
  [CHAIN_ID.MANTLE]: {
    rpcUrl: process.env.MANTLE_RPC_URL || "https://rpc.mantle.xyz",
  },
  [CHAIN_ID.BASE]: {
    rpcUrl: process.env.BASE_RPC_URL || "https://mainnet.base.org",
  },
  [CHAIN_ID.EVMOS]: {
    rpcUrl: process.env.EVMOS_RPC_URL || "https://evmos.lava.build",
  },
  [CHAIN_ID.MODE]: {
    rpcUrl: process.env.MODE_RPC_URL || "https://mainnet.mode.network",
  },
  [CHAIN_ID.ARBITRUM]: {
    rpcUrl: process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc",
  },
  [CHAIN_ID.CELO]: {
    rpcUrl: process.env.CELO_RPC_URL || "https://forno.celo.org",
  },
  [CHAIN_ID.AVALANCHE]: {
    rpcUrl: process.env.AVALANCHE_RPC_URL || "https://avalanche.public-rpc.com",
  },
  [CHAIN_ID.LINEA]: {
    rpcUrl: process.env.LINEA_RPC_URL || "https://linea-rpc.publicnode.com",
  },
  [CHAIN_ID.SCROLL]: {
    rpcUrl: process.env.SCROLL_RPC_URL || "https://rpc.ankr.com/scroll",
  },
  [CHAIN_ID.AURORA]: {
    rpcUrl: process.env.AURORA_RPC_URL || "https://mainnet.aurora.dev",
  },
  [CHAIN_ID.HARMONY]: {
    rpcUrl: process.env.HARMONY_RPC_URL || "https://api.harmony.one",
  },
  [CHAIN_ID.HECO]: {
    rpcUrl: process.env.HECO_RPC_URL || "https://http-mainnet.hecochain.com",
  },
  [CHAIN_ID.NEON]: {
    rpcUrl: process.env.NEON_RPC_URL || "https://neon-proxy-mainnet.solana.p2p.org",
  },
  [CHAIN_ID.BITROCK]: {
    rpcUrl: process.env.BITROCK_RPC_URL || "https://connect.bit-rock.io",
  },
  [CHAIN_ID.LIGHTLINK]: {
    rpcUrl: process.env.LIGHTLINK_RPC_URL || "https://replicator.phoenix.lightlink.io/rpc/v1",
  }
};
