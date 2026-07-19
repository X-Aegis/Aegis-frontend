import type { NetworkName } from "./network";

// ============================================================================
// Contract Names
// ============================================================================

/**
 * Known contract identifiers managed by the application.
 * Add new entries here as more contracts are deployed.
 */
export type ContractName = "vault" | "token" | "governance";

// ============================================================================
// Types
// ============================================================================

/** A mapping from every ContractName to its Stellar contract address. */
export type ContractAddresses = Record<ContractName, string>;

/** Metadata about a resolved contract address. */
export interface ResolvedContract {
  /** The contract address (C…) */
  address: string;
  /** Whether the address came from an environment variable override */
  isOverride: boolean;
  /** Whether the address passes Stellar format validation */
  isValid: boolean;
}

// ============================================================================
// Static address map — one entry per network
// ============================================================================

/**
 * Default contract addresses per Stellar network.
 *
 * These are the canonical addresses committed to the repository.
 * For local development overrides, set the corresponding
 * `NEXT_PUBLIC_*_CONTRACT_ID` environment variable instead of
 * editing this map.
 */
export const CONTRACT_ADDRESSES: Record<NetworkName, ContractAddresses> = {
  testnet: {
    vault: "CCWHG2Q4VFY6XCQB4S4A4R6XYLFXSFTNQQYJAY4GZRXF2WYYX3F5YRP",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    governance: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
  },
  mainnet: {
    vault: "",
    token: "",
    governance: "",
  },
  futurenet: {
    vault: "",
    token: "",
    governance: "",
  },
};

// ============================================================================
// Environment variable override mapping
// ============================================================================

/**
 * Maps each ContractName to the `NEXT_PUBLIC_*` env var that can override it.
 */
const ENV_VAR_MAP: Record<ContractName, string> = {
  vault: "NEXT_PUBLIC_VAULT_CONTRACT_ID",
  token: "NEXT_PUBLIC_TOKEN_CONTRACT_ID",
  governance: "NEXT_PUBLIC_GOVERNANCE_CONTRACT_ID",
};

// ============================================================================
// Validation
// ============================================================================

/** Valid base-32 alphabet used by Stellar strkeys (RFC 4648). */
const STELLAR_BASE32_REGEX = /^[A-Z2-7]+$/;

/**
 * Returns `true` if `id` looks like a valid Stellar contract address.
 *
 * Checks:
 * 1. Non-empty string
 * 2. Exactly 56 characters long
 * 3. Starts with `C` (Stellar contract strkey prefix)
 * 4. Contains only valid base-32 characters [A-Z2-7]
 */
export function isValidStellarContractId(id: string): boolean {
  if (!id || id.length !== 56) return false;
  if (!id.startsWith("C")) return false;
  return STELLAR_BASE32_REGEX.test(id);
}

// ============================================================================
// Resolver
// ============================================================================

/**
 * Resolve the contract address for a given network and contract name.
 *
 * Resolution order:
 * 1. Environment variable override (e.g. `NEXT_PUBLIC_VAULT_CONTRACT_ID`)
 * 2. Static `CONTRACT_ADDRESSES` map
 *
 * @throws {Error} If the resolved address is empty or has an invalid format.
 */
export function getContractAddress(
  network: NetworkName,
  contractName: ContractName,
): string {
  const envVar = ENV_VAR_MAP[contractName];
  const envValue =
    typeof process !== "undefined" ? process.env[envVar] : undefined;

  const address = envValue || CONTRACT_ADDRESSES[network]?.[contractName] || "";

  if (!address) {
    throw new Error(
      `No contract address configured for "${contractName}" on "${network}". ` +
        `Set the ${envVar} environment variable or update CONTRACT_ADDRESSES in contracts.config.ts.`,
    );
  }

  if (!isValidStellarContractId(address)) {
    throw new Error(
      `Invalid Stellar contract address for "${contractName}" on "${network}": "${address}". ` +
        `Expected a 56-character base-32 string starting with "C".`,
    );
  }

  return address;
}

/**
 * Resolve a contract address with full metadata (for debug UIs).
 *
 * Unlike `getContractAddress`, this function never throws — it returns
 * validation / override information alongside the address so the
 * Settings/Debug panel can display it.
 */
export function resolveContract(
  network: NetworkName,
  contractName: ContractName,
): ResolvedContract {
  const envVar = ENV_VAR_MAP[contractName];
  const envValue =
    typeof process !== "undefined" ? process.env[envVar] : undefined;

  const isOverride = !!envValue;
  const address = envValue || CONTRACT_ADDRESSES[network]?.[contractName] || "";
  const isValid = isValidStellarContractId(address);

  return { address, isOverride, isValid };
}

/**
 * Returns all contract names defined in the system.
 */
export function getAllContractNames(): ContractName[] {
  return Object.keys(ENV_VAR_MAP) as ContractName[];
}
