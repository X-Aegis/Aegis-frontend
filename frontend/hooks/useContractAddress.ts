"use client";

import { useMemo } from "react";
import { useNetwork } from "@/contexts/NetworkContext";
import {
  getContractAddress,
  type ContractName,
} from "@/lib/contracts.config";

/**
 * React hook that returns the correct Stellar contract address for the
 * currently selected network.
 *
 * Resolution order:
 * 1. Environment variable override (e.g. `NEXT_PUBLIC_VAULT_CONTRACT_ID`)
 * 2. Static `CONTRACT_ADDRESSES` config for the active network
 *
 * @param contractName — which contract to resolve (e.g. `"vault"`)
 * @returns The 56-char Stellar contract ID string
 * @throws If the address is missing or has an invalid Stellar format
 *
 * @example
 * ```tsx
 * const vaultContractId = useContractAddress("vault");
 * ```
 */
export function useContractAddress(contractName: ContractName): string {
  const { network } = useNetwork();

  return useMemo(
    () => getContractAddress(network, contractName),
    [network, contractName],
  );
}
