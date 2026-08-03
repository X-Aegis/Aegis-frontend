"use client";

import { useState, useEffect, useCallback } from "react";
import { X, FileText, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "x-aegis-legal-accepted";

interface LegalModalsProps {
  /** Whether to force-show the modals (e.g. on first deposit attempt) */
  forceOpen?: boolean;
  /** Called when user accepts terms */
  onAccept?: () => void;
  /** Called when user closes without accepting */
  onClose?: () => void;
}

/**
 * Tracks whether the user has accepted the Terms of Service and Privacy Policy.
 * Persisted in localStorage.
 */
export function useLegalAcceptance() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setAccepted(true);
    }
  }, []);

  const accept = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setAccepted(true);
  }, []);

  return { accepted, accept };
}

/**
 * Terms of Service content modal.
 */
function TermsOfServiceModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Terms of Service"
    >
      <div
        className="bg-card w-full max-w-2xl border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200 max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Terms of Service</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">1. Acceptance of Terms</h3>
          <p>
            By accessing or using the X-Aegis platform ("the Platform"), you agree to be bound
            by these Terms of Service. If you do not agree, do not use the Platform.
          </p>

          <h3 className="text-base font-semibold text-foreground">2. Service Description</h3>
          <p>
            X-Aegis provides a decentralized volatility shield and hedging protocol built on
            the Stellar network. The Platform allows users to deposit assets, manage vault
            positions, and interact with smart contracts.
          </p>

          <h3 className="text-base font-semibold text-foreground">3. User Responsibilities</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>You are solely responsible for the security of your wallet keys and credentials.</li>
            <li>You must comply with all applicable laws and regulations.</li>
            <li>You must not use the Platform for any illegal or unauthorized purpose.</li>
            <li>You are responsible for all transactions initiated from your wallet.</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground">4. Risk Disclosure</h3>
          <p>
            DeFi protocols and digital assets carry inherent risks, including but not limited to
            smart contract risk, market volatility, impermanent loss, and regulatory uncertainty.
            Past performance does not guarantee future results. You should only commit capital
            you are prepared to lose.
          </p>

          <h3 className="text-base font-semibold text-foreground">5. Smart Contract Risk</h3>
          <p>
            The Platform uses smart contracts that have been audited but may still contain bugs
            or vulnerabilities. X-Aegis is not liable for any losses resulting from smart
            contract failures, exploits, or attacks.
          </p>

          <h3 className="text-base font-semibold text-foreground">6. Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, X-Aegis and its contributors shall not be
            liable for any indirect, incidental, special, consequential, or punitive damages
            arising from your use of the Platform.
          </p>

          <h3 className="text-base font-semibold text-foreground">7. Changes to Terms</h3>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the
            Platform after changes constitutes acceptance of the new terms.
          </p>

          <p className="text-xs text-muted-foreground pt-4 border-t border-border">
            Last updated: July 2026
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Privacy Policy content modal.
 */
function PrivacyPolicyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Privacy Policy"
    >
      <div
        className="bg-card w-full max-w-2xl border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200 max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Privacy Policy</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">1. Information We Collect</h3>
          <p>
            We collect minimal information necessary to operate the Platform:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Wallet Address:</strong> Your Stellar public key for transaction processing.</li>
            <li><strong>Preferences:</strong> Theme, currency, and notification settings stored locally.</li>
            <li><strong>Usage Data:</strong> Anonymous analytics to improve the Platform.</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground">2. No Personal Information</h3>
          <p>
            X-Aegis does not collect email addresses, phone numbers, names, or any personally
            identifiable information. The Platform is designed to be privacy-first.
          </p>

          <h3 className="text-base font-semibold text-foreground">3. Data Storage</h3>
          <p>
            Preferences are stored locally in your browser using localStorage. Blockchain
            transactions are public by nature and stored on the Stellar network.
          </p>

          <h3 className="text-base font-semibold text-foreground">4. Third-Party Services</h3>
          <p>
            The Platform may interact with third-party services (e.g., RPC providers, bridge
            protocols). These services have their own privacy policies.
          </p>

          <h3 className="text-base font-semibold text-foreground">5. Data Security</h3>
          <p>
            We implement industry-standard security measures to protect your data. However,
            no method of electronic storage is 100% secure.
          </p>

          <h3 className="text-base font-semibold text-foreground">6. Changes to Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on
            this page.
          </p>

          <p className="text-xs text-muted-foreground pt-4 border-t border-border">
            Last updated: July 2026
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * LegalModals — Manages the Terms of Service and Privacy Policy modals,
 * and provides a consent checkbox for the deposit flow.
 */
export function LegalModals({ forceOpen, onAccept, onClose }: LegalModalsProps) {
  const [showTos, setShowTos] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const handleAccept = () => {
    setCheckboxChecked(true);
    onAccept?.();
  };

  return (
    <>
      {/* Consent banner shown when forceOpen is true and user hasn't accepted */}
      {forceOpen && (
        <div className="space-y-3 p-4 bg-muted/30 border border-border rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Legal Agreement
              </p>
              <p className="text-xs text-muted-foreground">
                By depositing, you agree to our{" "}
                <button
                  type="button"
                  onClick={() => setShowTos(true)}
                  className="text-primary underline hover:text-primary/80 transition-colors"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => setShowPrivacy(true)}
                  className="text-primary underline hover:text-primary/80 transition-colors"
                >
                  Privacy Policy
                </button>
                .
              </p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={checkboxChecked}
              onChange={(e) => setCheckboxChecked(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
              aria-label="Accept Terms of Service and Privacy Policy"
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              I have read and agree to the{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTos(true);
                }}
                className="text-primary underline hover:text-primary/80"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPrivacy(true);
                }}
                className="text-primary underline hover:text-primary/80"
              >
                Privacy Policy
              </button>
            </span>
          </label>
        </div>
      )}

      <TermsOfServiceModal isOpen={showTos} onClose={() => setShowTos(false)} />
      <PrivacyPolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </>
  );
}

export { TermsOfServiceModal, PrivacyPolicyModal };