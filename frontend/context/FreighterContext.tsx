"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  isAllowed,
  setAllowed,
  getUserInfo,
  isConnected,
} from "@stellar/freighter-api";

interface FreighterContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const FreighterContext = createContext<FreighterContextType | undefined>(undefined);

export function FreighterProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const allowed = await isAllowed();
      if (!allowed) {
        await setAllowed();
      }
      const userInfo = await getUserInfo();
      if (userInfo && userInfo.publicKey) {
        setAddress(userInfo.publicKey);
      } else {
        throw new Error("Failed to get wallet address");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to Freighter");
      console.error("Freighter connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setError(null);
  }, []);

  // Auto-reconnect on mount/refresh
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (await isConnected() && await isAllowed()) {
          const userInfo = await getUserInfo();
          if (userInfo && userInfo.publicKey) {
            setAddress(userInfo.publicKey);
          }
        }
      } catch (err) {
        console.error("Auto-reconnect failed:", err);
      }
    };
    checkConnection();
  }, []);

  return (
    <FreighterContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        error,
        connect,
        disconnect,
      }}
    >
      {children}
    </FreighterContext.Provider>
  );
}

export function useFreighter() {
  const context = useContext(FreighterContext);
  if (context === undefined) {
    throw new Error("useFreighter must be used within a FreighterProvider");
  }
  return context;
}
