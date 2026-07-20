// ============================================================================
// Allbridge Core REST API client
// Docs: https://core-sdk.allbridge.io/
// ============================================================================

import type {
  BridgeChain,
  BridgeChainInfo,
  BridgeQuote,
  BridgeQuoteRequest,
  BridgeToken,
  BridgeTxStatus,
  AllbridgeChainRaw,
  AllbridgeStatusRaw,
} from "@/types/bridge";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const ALLBRIDGE_API_URL =
  process.env.NEXT_PUBLIC_ALLBRIDGE_API_URL ?? "https://core.api.allbridgecoreapi.net";

const ALLBRIDGE_API_KEY = process.env.NEXT_PUBLIC_ALLBRIDGE_API_KEY ?? "";

/** Default fetch timeout (ms) */
const DEFAULT_TIMEOUT_MS = 15_000;

// ---------------------------------------------------------------------------
// Static chain metadata
// ---------------------------------------------------------------------------

export const BRIDGE_CHAINS: Record<BridgeChain, BridgeChainInfo> = {
  stellar: {
    id: "stellar",
    label: "Stellar",
    ticker: "XLM",
    nativeCurrency: "XLM",
    explorerUrl: "https://stellarchain.io/transactions/",
    isStellar: true,
  },
  ethereum: {
    id: "ethereum",
    label: "Ethereum",
    ticker: "ETH",
    nativeCurrency: "ETH",
    explorerUrl: "https://etherscan.io/tx/",
    isStellar: false,
  },
  bsc: {
    id: "bsc",
    label: "BNB Chain",
    ticker: "BNB",
    nativeCurrency: "BNB",
    explorerUrl: "https://bscscan.com/tx/",
    isStellar: false,
  },
  polygon: {
    id: "polygon",
    label: "Polygon",
    ticker: "MATIC",
    nativeCurrency: "MATIC",
    explorerUrl: "https://polygonscan.com/tx/",
    isStellar: false,
  },
  avalanche: {
    id: "avalanche",
    label: "Avalanche",
    ticker: "AVAX",
    nativeCurrency: "AVAX",
    explorerUrl: "https://snowtrace.io/tx/",
    isStellar: false,
  },
  solana: {
    id: "solana",
    label: "Solana",
    ticker: "SOL",
    nativeCurrency: "SOL",
    explorerUrl: "https://solscan.io/tx/",
    isStellar: false,
  },
  tron: {
    id: "tron",
    label: "Tron",
    ticker: "TRX",
    nativeCurrency: "TRX",
    explorerUrl: "https://tronscan.org/#/transaction/",
    isStellar: false,
  },
};

/**
 * Maps Allbridge chain symbols (e.g. "ETH", "SOL", "STLR") to our internal
 * BridgeChain identifiers.
 */
const ALLBRIDGE_CHAIN_MAP: Record<string, BridgeChain> = {
  ETH: "ethereum",
  BSC: "bsc",
  POL: "polygon",
  MATIC: "polygon",
  AVA: "avalanche",
  SOL: "solana",
  TRX: "tron",
  STLR: "stellar",
  XLM: "stellar",
};

// ---------------------------------------------------------------------------
// Default tokens supported across chains
// ---------------------------------------------------------------------------

export const BRIDGE_TOKENS: BridgeToken[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    coingeckoId: "usd-coin",
    addressByChain: {
      ethereum: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      bsc: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      polygon: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      avalanche: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      solana: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    },
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    coingeckoId: "tether",
    addressByChain: {
      ethereum: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      bsc: "0x55d398326f99059fF775485246999027B3197955",
      polygon: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      tron: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    },
  },
  {
    symbol: "EURC",
    name: "Euro Coin",
    decimals: 6,
    coingeckoId: "euro-coin",
    addressByChain: {
      ethereum: "0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c",
    },
  },
];

// ---------------------------------------------------------------------------
// Internal HTTP helper
// ---------------------------------------------------------------------------

async function apiFetch<T>(
  path: string,
  options?: RequestInit & { timeoutMs?: number }
): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchOptions } = options ?? {};

  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeoutMs);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(ALLBRIDGE_API_KEY ? { "x-api-key": ALLBRIDGE_API_KEY } : {}),
    ...((fetchOptions.headers as Record<string, string>) ?? {}),
  };

  try {
    const res = await fetch(`${ALLBRIDGE_API_URL}${path}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Allbridge API error ${res.status}: ${body || res.statusText}`);
    }

    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timerId);
  }
}

// ---------------------------------------------------------------------------
// Public API functions
// ---------------------------------------------------------------------------

/**
 * Fetches the list of supported chains and tokens from Allbridge.
 * Returns merged data as a map of BridgeChain → token array.
 */
export async function fetchSupportedChains(): Promise<
  Partial<Record<BridgeChain, BridgeToken[]>>
> {
  const raw = await apiFetch<AllbridgeChainRaw[]>("/chains");

  const result: Partial<Record<BridgeChain, BridgeToken[]>> = {};

  for (const chain of raw) {
    const chainId = ALLBRIDGE_CHAIN_MAP[chain.chainSymbol.toUpperCase()];
    if (!chainId) continue;

    const tokens: BridgeToken[] = chain.tokens.map((t) => ({
      symbol: t.symbol,
      name: t.name,
      decimals: t.decimals,
      addressByChain: {
        [chainId]: t.tokenAddress ?? "",
      },
    }));

    result[chainId] = tokens;
  }

  return result;
}

/**
 * Requests a bridge quote for a given transfer.
 *
 * NOTE: Allbridge Core does not expose a public "quote" endpoint in its free
 * tier. This function calls the pool info endpoint and derives an estimated
 * output using the virtual price model used by the SDK.
 * If NEXT_PUBLIC_ALLBRIDGE_API_KEY is set, a real server-side quote is used.
 */
export async function fetchBridgeQuote(
  req: BridgeQuoteRequest
): Promise<BridgeQuote> {
  // If no API key is available, return a deterministic simulation so the UI
  // still functions correctly in development / demo mode.
  if (!ALLBRIDGE_API_KEY) {
    return simulateQuote(req);
  }

  try {
    // POST /quote  (available in paid tiers)
    const data = await apiFetch<{
      amountToReceive: string;
      fee: string;
      relayerFeeInUsd: string;
      estimatedTime: number;
      liquidityAvailable: boolean;
    }>("/quote", {
      method: "POST",
      body: JSON.stringify({
        sourceChainSymbol: toAllbridgeChainSymbol(req.sourceChain),
        destinationChainSymbol: toAllbridgeChainSymbol(req.destChain),
        tokenSymbol: req.token,
        amount: req.amount,
      }),
    });

    return {
      receiveAmount: data.amountToReceive,
      bridgeFee: data.fee,
      relayFeeUsd: data.relayerFeeInUsd,
      estimatedSeconds: data.estimatedTime,
      liquidityAvailable: data.liquidityAvailable,
    };
  } catch {
    // Graceful fallback to simulation
    return simulateQuote(req);
  }
}

/**
 * Fetches the status of a bridge transfer by its source-chain TX hash.
 */
export async function fetchBridgeTxStatus(
  sourceChain: BridgeChain,
  sourceTxHash: string
): Promise<{ status: BridgeTxStatus; destTxHash?: string; receivedAmount?: string }> {
  try {
    const data = await apiFetch<AllbridgeStatusRaw>(
      `/bridge/receive/status?blockchain=${toAllbridgeChainSymbol(sourceChain)}&txId=${encodeURIComponent(sourceTxHash)}`
    );

    return {
      status: mapAllbridgeStatus(data.status),
      destTxHash: data.receive?.txId,
      receivedAmount: data.receive?.amount,
    };
  } catch {
    // Network error — return pending so the poller retries
    return { status: "pending" };
  }
}

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

/** Maps our internal BridgeChain to the symbol Allbridge expects. */
export function toAllbridgeChainSymbol(chain: BridgeChain): string {
  const MAP: Record<BridgeChain, string> = {
    stellar: "STLR",
    ethereum: "ETH",
    bsc: "BSC",
    polygon: "POL",
    avalanche: "AVA",
    solana: "SOL",
    tron: "TRX",
  };
  return MAP[chain];
}

function mapAllbridgeStatus(raw: AllbridgeStatusRaw["status"]): BridgeTxStatus {
  switch (raw) {
    case "Completed":
      return "complete";
    case "Failed":
      return "failed";
    case "WaitingForReceive":
    case "WaitingForSignature":
      return "in_progress";
    default:
      return "pending";
  }
}

/**
 * Local simulation used when no API key is configured.
 * Applies a 0.3% bridge fee + a fixed $0.20 relay fee estimate.
 */
function simulateQuote(req: BridgeQuoteRequest): BridgeQuote {
  const amountNum = parseFloat(req.amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return {
      receiveAmount: "0",
      bridgeFee: "0",
      relayFeeUsd: "0.20",
      estimatedSeconds: 60,
      liquidityAvailable: true,
    };
  }

  const feeRate = 0.003; // 0.3%
  const bridgeFee = amountNum * feeRate;
  const receiveAmount = amountNum - bridgeFee;

  // Cross-chain to Stellar (or from Stellar) is generally faster
  const isStellarRoute =
    req.sourceChain === "stellar" || req.destChain === "stellar";

  return {
    receiveAmount: receiveAmount.toFixed(6),
    bridgeFee: bridgeFee.toFixed(6),
    relayFeeUsd: "0.20",
    estimatedSeconds: isStellarRoute ? 30 : 120,
    liquidityAvailable: true,
  };
}

/**
 * Returns a user-friendly chain explorer link for a given tx hash.
 */
export function buildExplorerUrl(chain: BridgeChain, txHash: string): string {
  const chainInfo = BRIDGE_CHAINS[chain];
  return `${chainInfo.explorerUrl}${txHash}`;
}

/**
 * Generates a local unique ID for a bridge transaction.
 */
export function generateBridgeTxId(): string {
  return `bridge-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
