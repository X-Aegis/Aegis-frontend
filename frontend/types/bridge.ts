// ============================================================================
// Bridge types — shared across allbridge client, hooks, and components
// ============================================================================

/** Internal chain identifiers */
export type BridgeChain =
  | "stellar"
  | "ethereum"
  | "bsc"
  | "polygon"
  | "avalanche"
  | "solana"
  | "tron";

/** Static metadata about a supported chain */
export interface BridgeChainInfo {
  id: BridgeChain;
  label: string;
  ticker: string;
  nativeCurrency: string;
  explorerUrl: string;
  /** True when this chain is Stellar — used to gate Freighter signing */
  isStellar: boolean;
}

/** A token that can be bridged across chains */
export interface BridgeToken {
  symbol: string;
  name: string;
  decimals: number;
  coingeckoId?: string;
  /** Contract / issuer address per chain. May be absent if not deployed there. */
  addressByChain: Partial<Record<BridgeChain, string>>;
}

/** Input for a quote request */
export interface BridgeQuoteRequest {
  sourceChain: BridgeChain;
  destChain: BridgeChain;
  token: string;
  amount: string;
}

/** Quote returned by the Allbridge client */
export interface BridgeQuote {
  receiveAmount: string;
  bridgeFee: string;
  relayFeeUsd: string;
  estimatedSeconds: number;
  liquidityAvailable: boolean;
}

/** Status of an in-flight or completed bridge transfer */
export type BridgeTxStatus = "pending" | "in_progress" | "complete" | "failed";

/** A bridge transaction stored locally in the monitor */
export interface BridgeTransaction {
  id: string;
  sourceChain: BridgeChain;
  destChain: BridgeChain;
  token: string;
  amount: string;
  receiveAmount: string;
  sourceTxHash: string;
  destTxHash?: string;
  receivedAmount?: string;
  status: BridgeTxStatus;
  /** ISO timestamp of when the user submitted the transaction */
  createdAt: string;
  /** ISO timestamp of the most recent status poll */
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Raw API shapes from Allbridge REST endpoints
// ---------------------------------------------------------------------------

/** Single token entry inside an Allbridge /chains response */
export interface AllbridgeTokenRaw {
  symbol: string;
  name: string;
  decimals: number;
  tokenAddress?: string;
}

/** Single chain entry from the Allbridge /chains response */
export interface AllbridgeChainRaw {
  chainSymbol: string;
  name: string;
  tokens: AllbridgeTokenRaw[];
}

/** Response from /bridge/receive/status */
export interface AllbridgeStatusRaw {
  status:
    | "Completed"
    | "Failed"
    | "WaitingForReceive"
    | "WaitingForSignature"
    | string;
  receive?: {
    txId: string;
    amount: string;
  };
}
