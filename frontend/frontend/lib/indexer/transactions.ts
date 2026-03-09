import type { IndexerEventRaw } from "@/types/transactions";

interface FetchEventsParams {
  account?: string;
  limit?: number;
  signal?: AbortSignal;
}

const MERCURY_URL = process.env.NEXT_PUBLIC_MERCURY_URL;
const MERCURY_API_KEY = process.env.NEXT_PUBLIC_MERCURY_API_KEY;

export async function fetchRecentEvents({
  account,
  limit = 20,
  signal,
}: FetchEventsParams): Promise<IndexerEventRaw[]> {
  if (!MERCURY_URL) {
    throw new Error("NEXT_PUBLIC_MERCURY_URL is not configured");
  }

  const url = new URL("/api/events", MERCURY_URL);
  if (account) url.searchParams.set("account", account);
  url.searchParams.set("limit", String(limit));

  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (MERCURY_API_KEY) {
    headers["Authorization"] = `Bearer ${MERCURY_API_KEY}`;
  }

  const res = await fetch(url.toString(), { headers, signal });

  if (!res.ok) {
    throw new Error(`Indexer returned ${res.status}: ${res.statusText}`);
  }

  const body: unknown = await res.json();

  if (!Array.isArray(body)) {
    throw new Error("Unexpected indexer payload: expected an array of events");
  }

  return body as IndexerEventRaw[];
}
