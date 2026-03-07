"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { FreighterProvider } from "@/context/FreighterContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <FreighterProvider>
        {children}
      </FreighterProvider>
    </ThemeProvider>
  );
}
