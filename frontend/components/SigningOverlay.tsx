"use client";

import { Loader2, CheckCircle2, XCircle, Shield, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type SigningStatus =
  | "building"
  | "simulating"
  | "signing"
  | "submitting"
  | "confirming"
  | "success"
  | "error";

interface SigningOverlayProps {
  isOpen: boolean;
  status: SigningStatus;
  txHash?: string | null;
  error?: string | null;
  onClose?: () => void;
}

const steps: { key: SigningStatus; labelKey: string }[] = [
  { key: "building", labelKey: "buildingTransaction" },
  { key: "simulating", labelKey: "simulatingTransaction" },
  { key: "signing", labelKey: "signingTransaction" },
  { key: "submitting", labelKey: "submittingTransaction" },
  { key: "confirming", labelKey: "confirmingTransaction" },
];

const stepOrder = steps.map((s) => s.key);

function StepIndicator({
  label,
  isActive,
  isCompleted,
  isError,
}: {
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  isError: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          isCompleted && "border-emerald-500 bg-emerald-500 text-white",
          isActive && !isCompleted && "border-primary bg-primary/20",
          isError && "border-destructive bg-destructive/20",
          !isActive && !isCompleted && !isError && "border-border bg-card"
        )}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : isActive ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : isError ? (
          <XCircle className="h-4 w-4 text-destructive" />
        ) : (
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
        )}
      </div>
      <span
        className={cn(
          "text-sm transition-colors",
          isActive && "font-medium text-foreground",
          isCompleted && "text-emerald-600 dark:text-emerald-400",
          isError && "text-destructive",
          !isActive && !isCompleted && !isError && "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function SigningOverlay({
  isOpen,
  status,
  txHash,
  error,
  onClose,
}: SigningOverlayProps) {
  const t = useTranslations("SigningOverlay");

  if (!isOpen) return null;

  const currentStepIndex = stepOrder.indexOf(status);
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signing-overlay-title"
    >
      <div className="w-full max-w-md mx-4 bg-card border border-border rounded-2xl shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10" aria-hidden="true">
            {isSuccess ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            ) : isError ? (
              <XCircle className="h-5 w-5 text-destructive" />
            ) : (
              <Shield className="h-5 w-5 text-primary" />
            )}
          </div>
          <div>
            <h3 id="signing-overlay-title" className="text-lg font-semibold text-foreground">
              {isSuccess
                ? t("transactionSuccessful")
                : isError
                  ? t("transactionFailed")
                  : t("signingTitle")}
            </h3>
            {txHash && (
              <p className="text-xs text-muted-foreground font-mono break-all mt-0.5">
                {txHash.slice(0, 12)}...{txHash.slice(-8)}
              </p>
            )}
          </div>
        </div>

        {(isSuccess || isError) ? (
          <div className="space-y-4">
            {isError && error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
                {error}
              </p>
            )}
            {isSuccess && (
              <p className="text-sm text-muted-foreground">
                {t("transactionHash")}
              </p>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors",
                  isSuccess
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                )}
              >
                {isSuccess ? t("close") : t("close")}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;
              const isStepError = isError && index === currentStepIndex;

              return (
                <StepIndicator
                  key={step.key}
                  label={t(step.labelKey)}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  isError={isStepError}
                />
              );
            })}
          </div>
        )}

        {!isSuccess && !isError && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>{t("waitingForWallet")}</span>
            </div>
          </div>
        )}

        {txHash && (
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-1 text-xs text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            {t("viewOnExplorer")}
          </a>
        )}
      </div>
    </div>
  );
}
