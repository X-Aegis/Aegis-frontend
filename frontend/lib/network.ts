import { SorobanRpc } from "@stellar/stellar-sdk";

export type NetworkName = "futurenet" | "testnet" | "mainnet";

export interface NetworkConfig {
    network: NetworkName;
    rpcUrl: string;
    networkPassphrase: string;
}

export const NETWORKS: Record<NetworkName, NetworkConfig> = {
    futurenet: {
        network: "futurenet",
        rpcUrl: "https://rpc-futurenet.stellar.org",
        networkPassphrase: "Test SDF Future Network ; October 2022",
    },
    testnet: {
        network: "testnet",
        rpcUrl: "https://soroban-testnet.stellar.org",
        networkPassphrase: "Test SDF Network ; September 2015",
    },
    mainnet: {
        network: "mainnet",
        rpcUrl: "https://mainnet.stellar.org",
        networkPassphrase: "Public Global Stellar Network ; September 2015",
    },
};

/**
 * Helper to get the Soroban RPC Server provider for a specific network.
 */
export function getProvider(networkName: NetworkName = "testnet"): SorobanRpc.Server {
    const config = NETWORKS[networkName];
    if (!config) {
        throw new Error(`Unsupported network: ${networkName}`);
    }
    return new SorobanRpc.Server(config.rpcUrl);
}

/**
 * Standard configuration for the app (useful for easy toggling during development).
 */
export const activeNetwork = NETWORKS.testnet; 
