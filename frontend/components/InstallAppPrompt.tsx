"use client";

import { Download, X } from "lucide-react";
import Image from "next/image";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Button } from "@/components/ui/button";

/**
 * Bottom-sheet style "Install App" prompt shown to eligible mobile browsers
 * once Chrome/Edge/Android fire `beforeinstallprompt`. No-ops (renders
 * nothing) on browsers that never fire the event, e.g. desktop Safari/iOS.
 */
export function InstallAppPrompt() {
  const { isInstallable, promptInstall, dismiss } = useInstallPrompt();

  if (!isInstallable) return null;

  return (
    <div
      role="dialog"
      aria-label="Install XHedge (Aegis)"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 sm:justify-end sm:pb-6 sm:pr-6"
    >
      <div className="flex w-full max-w-sm items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-lg">
        <div className="flex shrink-0 items-center justify-center">
          <Image src="/logo.png" alt="XHedge (Aegis) Logo" width={40} height={40} className="rounded-lg" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Install XHedge (Aegis)</p>
          <p className="text-xs text-muted-foreground">Add it to your home screen for quick, offline-friendly access.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button size="sm" onClick={() => promptInstall()}>
            Install
          </Button>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss install prompt"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
