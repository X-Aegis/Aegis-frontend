"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { FreighterProvider } from "@/contexts/FreighterContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FreighterProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </FreighterProvider>
  );
}
