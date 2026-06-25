import React from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

import SettingsPage from "@/app/[locale]/settings/page";
import VaultDetailsPage from "@/app/[locale]/vaults/[id]/page";
import { DepositTab } from "@/components/DepositTab";
import { WithdrawTab } from "@/components/WithdrawTab";
import { ReferralLinkCard } from "@/components/ReferralLinkCard";

expect.extend(toHaveNoViolations);

jest.mock("@stellar/freighter-api", () => ({
  isConnected: jest.fn().mockResolvedValue(false),
  requestAccess: jest.fn(),
  signTransaction: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "1" }),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/contexts/CurrencyContext", () => ({
  useCurrency: () => ({
    currency: "USD",
    setCurrency: jest.fn(),
    formatAmount: (n: number) => `$${n.toFixed(2)}`,
  }),
}));

describe("Accessibility (axe-core)", () => {
  it("settings page has no detectable violations", async () => {
    const { container } = render(<SettingsPage />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("vault details page has no detectable violations", async () => {
    const { container } = render(<VaultDetailsPage />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("deposit form has no detectable violations", async () => {
    const { container } = render(<DepositTab />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("withdraw form has no detectable violations", async () => {
    const { container } = render(<WithdrawTab />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("referral link card has no detectable violations", async () => {
    const { container } = render(<ReferralLinkCard />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
