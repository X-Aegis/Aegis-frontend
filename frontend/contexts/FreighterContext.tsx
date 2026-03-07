'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import {
  isConnected as isFreighterConnected,
  requestAccess,
  getPublicKey,
} from '@stellar/freighter-api';

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'freighter_wallet_address';

const ERROR_MESSAGES = {
  NOT_INSTALLED: 'Freighter wallet extension is not installed. Please install it from the Chrome Web Store.',
  USER_REJECTED: 'Connection request was rejected. Please try again and approve the connection.',
  VERIFICATION_FAILED: 'Failed to verify stored connection.',
  UNKNOWN: 'An unexpected error occurred. Please try again.',
} as const;

// ============================================================================
// TypeScript Interfaces and Types
// ============================================================================

/**
 * Context type exposed to consumers through useFreighter hook
 */
export interface FreighterContextType {
  /** Stellar public key (G...) or null if not connected */
  address: string | null;
  /** Whether a wallet is currently connected */
  isConnected: boolean;
  /** Whether Freighter extension is installed in the browser */
  isInstalled: boolean;
  /** Current error message or null */
  error: string | null;
  /** Loading state for async operations */
  isLoading: boolean;
  /** Connect to Freighter wallet */
  connect: () => Promise<void>;
  /** Disconnect from wallet and clear state */
  disconnect: () => void;
}

/**
 * Props for FreighterProvider component
 */
interface FreighterProviderProps {
  children: ReactNode;
}

/**
 * Internal wallet state type
 */
interface WalletState {
  address: string | null;
  isConnected: boolean;
  isInstalled: boolean;
  error: string | null;
  isLoading: boolean;
}

// ============================================================================
// Context Creation
// ============================================================================

const FreighterContext = createContext<FreighterContextType | undefined>(undefined);

// ============================================================================
// FreighterProvider Component
// ============================================================================

export function FreighterProvider({ children }: FreighterProviderProps) {
  // State management
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Connect function
  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check installation
      const installed = await isFreighterConnected();
      if (!installed) {
        throw new Error(ERROR_MESSAGES.NOT_INSTALLED);
      }

      // Request access
      await requestAccess();

      // Get public key
      const publicKey = await getPublicKey();

      // Update state
      setAddress(publicKey);
      setIsConnected(true);

      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, publicKey);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN;
      setError(errorMessage);
      console.error('Connection error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Disconnect function
  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Initialization logic
  useEffect(() => {
    const initialize = async () => {
      try {
        // Check Freighter installation
        const installed = await isFreighterConnected();
        setIsInstalled(installed);

        if (!installed) return;

        // Check for stored address
        const storedAddress = localStorage.getItem(STORAGE_KEY);
        if (!storedAddress) return;

        // Verify stored address with Freighter
        const currentKey = await getPublicKey();

        if (currentKey === storedAddress) {
          // Verification succeeded, restore state
          setAddress(storedAddress);
          setIsConnected(true);
        } else {
          // Stored key doesn't match, clear it
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (err) {
        // Verification failed, clear stored data
        console.error('Verification error:', err);
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    initialize();
  }, []);

  // Memoize context value
  const value = useMemo(
    () => ({
      address,
      isConnected,
      isInstalled,
      error,
      isLoading,
      connect,
      disconnect,
    }),
    [address, isConnected, isInstalled, error, isLoading, connect, disconnect]
  );

  return (
    <FreighterContext.Provider value={value}>
      {children}
    </FreighterContext.Provider>
  );
}

// ============================================================================
// useFreighter Hook
// ============================================================================

/**
 * Custom hook to access Freighter wallet context
 * @throws Error if used outside FreighterProvider
 */
export function useFreighter(): FreighterContextType {
  const context = useContext(FreighterContext);

  if (context === undefined) {
    throw new Error('useFreighter must be used within a FreighterProvider');
  }

  return context;
}
