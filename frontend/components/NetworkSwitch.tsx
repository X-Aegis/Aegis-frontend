"use client";

import { useNetwork } from "@/contexts/NetworkContext";
import type { NetworkName } from "@/lib/network";
import { Wifi } from "lucide-react";

const NETWORK_OPTIONS: { value: NetworkName; label: string }[] = [
  { value: "mainnet", label: "Mainnet" },
  { value: "testnet", label: "Testnet" },
  { value: "futurenet", label: "Futurenet" },
];

export function NetworkSwitch() {
  const { network, switchNetwork } = useNetwork();

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border bg-muted/50 p-0.5">
      {NETWORK_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => switchNetwork(option.value)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors select-none ${
            network === option.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-pressed={network === option.value}
        >
          <Wifi className="w-3 h-3" />
          {option.label}
        </button>
      ))}
    </div>
  );
}
