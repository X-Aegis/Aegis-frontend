"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type TourStepPosition = "left" | "right" | "top" | "bottom";

export interface TourStep {
  selector?: string;
  title: string;
  content: string;
  position?: TourStepPosition;
  layout?: "spotlight" | "welcome";
  imageUrl?: string;
}

interface TourFlows {
  home: TourStep[];
  vault?: TourStep[];
  portfolio?: TourStep[];
}

export type TourFlowName = keyof TourFlows;

interface CompletedFlows {
  twoFAModalShown?: boolean;
  [flowName: string]: boolean | undefined;
}

interface TourContextValue {
  tourActive: boolean;
  setTourActive: React.Dispatch<React.SetStateAction<boolean>>;
  tourStep: number;
  setTourStep: React.Dispatch<React.SetStateAction<number>>;
  currentFlow: TourFlowName;
  setCurrentFlow: React.Dispatch<React.SetStateAction<TourFlowName>>;
  tourSteps: TourStep[];
  startFlow: (flowName: TourFlowName) => void;
  completeFlow: (flowName: TourFlowName) => Promise<void>;
  completedFlows: CompletedFlows;
  tourFlows: TourFlows;
  checkCompletedFlows: (flowName: TourFlowName) => Promise<void>;
  handleTourClose: (flowName?: TourFlowName) => Promise<void>;
  getCompletedFlows: () => Promise<CompletedFlows>;
  saveCompletedFlows: (completedFlows: CompletedFlows) => Promise<void>;
}

const TourContext = createContext<TourContextValue | undefined>(undefined);

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within a TourProvider");
  return ctx;
}

function openTourDB(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("indexedDB is not available in this environment"));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open("XHedgeDB", 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const target = event.target as IDBOpenDBRequest | null;
      const db = target?.result;
      if (!db) return;
      if (!db.objectStoreNames.contains("tourData")) {
        db.createObjectStore("tourData", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getCompletedFlows(): Promise<CompletedFlows> {
  try {
    const db = await openTourDB();

    return await new Promise<CompletedFlows>((resolve, reject) => {
      const transaction = db.transaction(["tourData"], "readonly");
      const store = transaction.objectStore("tourData");
      const request = store.get("completedFlows");

      request.onsuccess = () => {
        const result = (request.result?.data as CompletedFlows | undefined) ?? {};
        db.close();
        resolve(result);
      };

      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("Failed to get completed flows:", error);
    return {};
  }
}

async function saveCompletedFlows(completedFlows: CompletedFlows): Promise<void> {
  try {
    const db = await openTourDB();

    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(["tourData"], "readwrite");
      const store = transaction.objectStore("tourData");
      store.put({ id: "completedFlows", data: completedFlows });

      transaction.oncomplete = () => {
        db.close();
        resolve(undefined);
      };

      transaction.onerror = () => {
        console.error("Failed to save to IndexedDB:", transaction.error);
        db.close();
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error("Failed to save completed flows:", error);
    throw error;
  }
}

interface TourProviderProps {
  children: React.ReactNode;
}

export function TourProvider({ children }: TourProviderProps) {
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [currentFlow, setCurrentFlow] = useState<TourFlowName>("home");
  const [completedFlows, setCompletedFlows] = useState<CompletedFlows>({});

  const tourFlows: TourFlows = useMemo(
    () => ({
      home: [
        {
          title: "Welcome to XHedge (Aegis)",
          content: "XHedge (Aegis) acts as a 'Micro hedge fund for everyday Africans.' Use the 'Show me around' button to get started.",
          layout: 'welcome',
        },
        {
          selector: "#tour-sidebar-dashboard",
          title: "Dashboard",
          content: "Your main dashboard showing vault overview, risk forecast, and AI insights.",
        },
        {
          selector: "#tour-sidebar-wallet",
          title: "Connect Wallet",
          content: "Connect your Freighter wallet to start interacting with the vault.",
        },
        {
          selector: "#tour-sidebar-vault",
          title: "Vault",
          content: "Deposit and withdraw assets from the volatility shield vault.",
        },
        {
          selector: "#tour-sidebar-strategies",
          title: "Strategies",
          content: "View and manage your investment strategies.",
        },
        {
          selector: "#tour-sidebar-portfolio",
          title: "Portfolio",
          content: "Track your portfolio performance and allocation.",
        },
        {
          selector: "#tour-sidebar-referrals",
          title: "Referrals",
          content: "Invite friends and earn rewards on every deposit they make.",
        },
        {
          selector: "#tour-sidebar-settings",
          title: "Settings",
          content: "Manage your notification and display preferences.",
        },
      ],
    }),
    []
  );

  const checkCompletedFlows = async (flowName: TourFlowName) => {
    try {
      const completed = await getCompletedFlows();

      if (!completed?.[flowName]) {
        setTourActive(true);
        setTourStep(0);
        setCurrentFlow(flowName);
      }
    } catch (error) {
      console.error("Failed to check completed flows:", error);
      setTourActive(true);
      setTourStep(0);
      setCurrentFlow(flowName);
    }
  };

  const startFlow = (flowName: TourFlowName) => {
    setCurrentFlow(flowName);
    setTourStep(0);
    setTourActive(true);
  };

  const completeFlow = async (flowName: TourFlowName) => {
    try {
      const existingFlows = await getCompletedFlows();
      const updatedFlows: CompletedFlows = { ...existingFlows, [flowName]: true };

      await saveCompletedFlows(updatedFlows);
      setCompletedFlows(updatedFlows);
      setTourActive(false);
    } catch (error) {
      console.error("Failed to complete flow:", error);
      setTourActive(false);
    }
  };

  const handleTourClose = async (flowName?: TourFlowName) => {
    await completeFlow(flowName ?? currentFlow);
  };

  const tourSteps = useMemo(() => tourFlows[currentFlow] ?? [], [currentFlow, tourFlows]);

  const value = useMemo<TourContextValue>(
    () => ({
      tourActive,
      setTourActive,
      tourStep,
      setTourStep,
      currentFlow,
      setCurrentFlow,
      tourSteps,
      startFlow,
      completeFlow,
      completedFlows,
      tourFlows,
      checkCompletedFlows,
      handleTourClose,
      getCompletedFlows,
      saveCompletedFlows,
    }),
    [
      completedFlows,
      currentFlow,
      tourActive,
      tourFlows,
      tourStep,
      tourSteps,
    ]
  );

  return (
    <TourContext.Provider value={value}>{children}</TourContext.Provider>
  );
}
