"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { FreighterProvider } from "@/contexts/FreighterContext";
import { SessionProvider } from "@/contexts/SessionContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FreighterProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider>{children}</SessionProvider>
        <Toaster richColors closeButton position="bottom-right" />
      </ThemeProvider>
    </FreighterProvider>
  );
}
