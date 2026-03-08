'use client';

import { useFreighter } from '@/contexts/FreighterContext';
import { useEffect, useState } from 'react';

/**
 * Example: Using Wallet Address in API Calls
 * 
 * This example demonstrates:
 * - Using wallet address as a dependency in useEffect
 * - Making API calls with the connected wallet address
 * - Conditional rendering based on connection state
 * - Handling loading and error states for API calls
 * - Cleaning up effects when address changes
 * 
 * Usage:
 * ```tsx
 * import { UserBalanceDisplay } from '@/examples/WalletAddressInAPI';
 * 
 * export default function MyPage() {
 *   return <UserBalanceDisplay />;
 * }
 * ```
 */
export function UserBalanceDisplay() {
  // Access wallet state from FreighterContext
  const { address, isConnected } = useFreighter();

  // Local state for API data
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Effect hook that runs when address changes
  // This is the key pattern: use address as a dependency
  useEffect(() => {
    // Early return if no address - prevents unnecessary API calls
    if (!address) {
      setBalance(null);
      return;
    }

    // Define async function inside useEffect
    const fetchBalance = async () => {
      setIsLoadingBalance(true);
      setApiError(null);

      try {
        // Example API call using the wallet address
        // Replace with your actual API endpoint
        const response = await fetch(`/api/balance/${address}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch balance');
        }

        const data = await response.json();
        setBalance(data.balance);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setApiError(errorMessage);
        console.error('Balance fetch error:', err);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    // Call the async function
    fetchBalance();

    // Optional cleanup function
    // This runs when address changes or component unmounts
    return () => {
      // Cancel any pending requests here if needed
      // For example, using AbortController
    };
  }, [address]); // Re-run effect when address changes

  // State 1: Wallet Not Connected
  if (!isConnected || !address) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <p className="text-gray-600">
          Connect your wallet to view your balance.
        </p>
      </div>
    );
  }

  // State 2: Loading Balance
  if (isLoadingBalance) {
    return (
      <div className="p-4 border rounded-lg">
        <p className="text-gray-600">Loading balance...</p>
      </div>
    );
  }

  // State 3: API Error
  if (apiError) {
    return (
      <div className="p-4 border rounded-lg bg-red-50">
        <p className="text-red-600">Error: {apiError}</p>
      </div>
    );
  }

  // State 4: Balance Loaded Successfully
  return (
    <div className="p-4 border rounded-lg bg-green-50">
      <h3 className="font-semibold mb-2">Account Balance</h3>
      <p className="text-sm text-gray-600 mb-2">
        Address: <span className="font-mono">{address.slice(0, 8)}...{address.slice(-8)}</span>
      </p>
      <p className="text-2xl font-bold text-green-700">
        {balance ?? 'N/A'} XLM
      </p>
    </div>
  );
}

/**
 * Example: Transaction History with Address Dependency
 * 
 * Another example showing the useEffect + address pattern for fetching data.
 */
export function TransactionHistory() {
  const { address, isConnected } = useFreighter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Guard clause: only fetch if address exists
    if (!address) {
      setTransactions([]);
      return;
    }

    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        // Example API call - replace with your actual endpoint
        const response = await fetch(`/api/transactions/${address}?limit=5`);
        const data = await response.json();
        setTransactions(data.transactions || []);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [address]); // Re-fetch when address changes

  if (!isConnected) {
    return <p className="text-gray-600">Connect wallet to view transactions</p>;
  }

  if (isLoading) {
    return <p className="text-gray-600">Loading transactions...</p>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-3">Recent Transactions</h3>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((tx, index) => (
            <li key={index} className="text-sm border-b pb-2">
              {/* Display transaction details */}
              <p className="font-mono text-xs">{tx.id}</p>
              <p className="text-gray-600">{tx.type} - {tx.amount}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Example: Using AbortController for Cleanup
 * 
 * Advanced example showing proper cleanup of API requests.
 */
export function AdvancedAPIExample() {
  const { address } = useFreighter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!address) return;

    // Create AbortController for this effect
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        // Pass abort signal to fetch
        const response = await fetch(`/api/data/${address}`, {
          signal: abortController.signal,
        });
        const result = await response.json();
        setData(result);
      } catch (err) {
        // Ignore abort errors (they're expected on cleanup)
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('Fetch error:', err);
      }
    };

    fetchData();

    // Cleanup: abort the request if address changes or component unmounts
    return () => {
      abortController.abort();
    };
  }, [address]);

  return (
    <div className="p-4 border rounded-lg">
      <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
