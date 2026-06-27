"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { NetworkName, NETWORKS, getProvider } from "@/lib/network";
import { SorobanRpc } from "@stellar/stellar-sdk";

const STORAGE_KEY = "aegis_network";

interface NetworkContextType {
  network: NetworkName;
  switchNetwork: (network: NetworkName) => void;
  provider: SorobanRpc.Server;
  networkConfig: (typeof NETWORKS)[NetworkName];
}

const NetworkContext = createContext<NetworkContextType | null>(null);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<NetworkName>(() => {
    if (typeof window === "undefined") return "testnet";
    const stored = localStorage.getItem(STORAGE_KEY);
    if (
      stored === "testnet" ||
      stored === "mainnet" ||
      stored === "futurenet"
    )
      return stored;
    return "testnet";
  });

  const switchNetwork = useCallback((newNetwork: NetworkName) => {
    setNetwork(newNetwork);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newNetwork);
    }
  }, []);

  const provider = React.useMemo(
    () => getProvider(network),
    [network],
  );

  const networkConfig = NETWORKS[network];

  return (
    <NetworkContext.Provider
      value={{ network, switchNetwork, provider, networkConfig }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx)
    throw new Error("useNetwork must be used within a NetworkProvider");
  return ctx;
}
