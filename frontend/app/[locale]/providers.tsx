"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { FreighterProvider } from "@/contexts/FreighterContext";
import { SessionProvider } from "@/contexts/SessionContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { NetworkProvider } from "@/contexts/NetworkContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NetworkProvider>
      <FreighterProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CurrencyProvider>
            <SessionProvider>{children}</SessionProvider>
          </CurrencyProvider>
          <Toaster richColors closeButton position="bottom-right" />
        </ThemeProvider>
      </FreighterProvider>
    </NetworkProvider>
  );
}
