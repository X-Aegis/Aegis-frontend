"use client";

import { useState, useEffect } from "react";
import Joyride, {
  type CallBackProps,
  type Step,
  type STATUS,
} from "react-joyride";

const TOUR_STORAGE_KEY = "x-aegis-onboarding-completed";

const defaultSteps: Step[] = [
  {
    target: "body",
    content:
      "Welcome to X-Aegis! This quick tour will show you how to monitor your volatility shield and manage your portfolio.",
    title: "👋 Welcome to X-Aegis",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: "header",
    content:
      "Use the navigation to switch between your Dashboard, Referrals, Partners, and more. Head to Bridge to move funds across chains.",
    title: "📍 Navigation",
    placement: "bottom",
    spotlightClicks: false,
  },
  {
    target: '[aria-label="Main navigation"]',
    content:
      "The Dashboard shows your portfolio at a glance — vault performance, risk metrics, and transaction history.",
    title: "📊 Dashboard",
    placement: "bottom",
    spotlightClicks: false,
  },
  {
    target: ".VaultOverviewCard",
    content:
      "This is your Treasury overview. Track total value locked (TVL), current APY, and your portfolio balance across all vaults.",
    title: "🏦 Treasury Overview",
    placement: "bottom",
    spotlightClicks: false,
  },
  {
    target: ".PerformanceAttribution",
    content:
      "The Strategy section breaks down your returns by source — helping you understand which positions are driving performance.",
    title: "📈 Strategy Performance",
    placement: "left",
    spotlightClicks: false,
  },
  {
    target: ".RiskChart",
    content:
      "The AI Risk Forecast shows a 7-day projected volatility index. Use this to anticipate market movements and adjust your shield.",
    title: "🤖 AI Risk Forecast",
    placement: "bottom",
    spotlightClicks: false,
  },
  {
    target: "button",
    content:
      "Connect your Freighter wallet to start depositing into vaults and earning yield. Your funds are protected by the Aegis volatility shield.",
    title: "🔌 Connect Wallet",
    placement: "bottom",
    spotlightClicks: false,
  },
  {
    target: "body",
    content:
      "That's it! You're ready to use X-Aegis. You can restart this tour anytime from the Settings page.",
    title: "🎉 You're All Set!",
    placement: "center",
    disableBeacon: true,
  },
];

interface OnboardingTourProps {
  /** Optional custom steps. Defaults to the standard onboarding flow. */
  steps?: Step[];
  /** If true, the tour starts automatically on mount (for first-time visitors). */
  autoStart?: boolean;
}

export function OnboardingTour({
  steps = defaultSteps,
  autoStart = true,
}: OnboardingTourProps) {
  const [run, setRun] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!autoStart || initialized) return;
    const completed = localStorage.getItem(TOUR_STORAGE_KEY);
    if (completed !== "true") {
      // Small delay to let the DOM render fully before the tour targets it
      const timer = setTimeout(() => setRun(true), 800);
      setInitialized(true);
      return () => clearTimeout(timer);
    }
    setInitialized(true);
  }, [autoStart, initialized]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [
      "finished",
      "skipped",
    ];
    if (finishedStatuses.includes(status as string)) {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      disableOverlayClose
      hideCloseButton
      spotlightClicks
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: "#1a1d27",
          backgroundColor: "#1a1d27",
          primaryColor: "#6366f1",
          textColor: "#e1e4eb",
          overlayColor: "rgba(0, 0, 0, 0.55)",
          zIndex: 1000,
        },
        tooltipContainer: {
          textAlign: "left",
        },
        tooltipTitle: {
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 8,
        },
        tooltipContent: {
          fontSize: 14,
          lineHeight: 1.6,
          color: "#c4c8d4",
        },
        buttonNext: {
          backgroundColor: "#6366f1",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 600,
          padding: "8px 16px",
        },
        buttonBack: {
          color: "#8b8fa3",
          fontSize: "13px",
          fontWeight: 500,
          marginRight: 8,
        },
        buttonSkip: {
          color: "#8b8fa3",
          fontSize: "13px",
          fontWeight: 500,
        },
      }}
      locale={{
        back: "Back",
        close: "Close",
        last: "Done",
        next: "Next",
        skip: "Skip tour",
      }}
    />
  );
}

/**
 * Reset the onboarding tour so it shows again on next page load.
 * Call this from a "Restart Tour" button in settings or elsewhere.
 */
export function resetOnboardingTour(): void {
  localStorage.removeItem(TOUR_STORAGE_KEY);
}