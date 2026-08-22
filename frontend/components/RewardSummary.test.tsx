import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RewardSummary } from "./RewardSummary";
import { fetchRewardSummary } from "@/lib/rewards/fetchRewards";

jest.mock("@/lib/rewards/fetchRewards", () => ({
  fetchRewardSummary: jest.fn(),
}));

const mockFetchRewardSummary = fetchRewardSummary as jest.MockedFunction<typeof fetchRewardSummary>;

describe("RewardSummary", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("shows pending and claimed totals once data loads", async () => {
    mockFetchRewardSummary.mockResolvedValue({
      totalPending: 18.42,
      totalClaimed: 12.5,
      entries: [
        { id: "1", source: "USDC Savings Vault", amount: "18.42", asset: "USDC", status: "pending", dateISO: "2024-03-10T00:00:00.000Z" },
        { id: "2", source: "Referral Bonus", amount: "12.50", asset: "USDC", status: "claimed", dateISO: "2024-03-01T00:00:00.000Z" },
      ],
    });

    render(<RewardSummary />);

    expect(await screen.findByText("$18.42")).toBeInTheDocument();
    expect(screen.getByText("$12.50")).toBeInTheDocument();
    expect(screen.getByText("USDC Savings Vault")).toBeInTheDocument();
    expect(screen.getByText("Referral Bonus")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
    expect(screen.getByText("claimed")).toBeInTheDocument();
  });

  it("shows an error state and allows retry when the fetch fails", async () => {
    mockFetchRewardSummary.mockRejectedValueOnce(new Error("network error"));

    render(<RewardSummary />);

    await waitFor(() => expect(screen.getByText("Failed to load reward data")).toBeInTheDocument());
  });

  it("shows an empty state when there are no reward entries", async () => {
    mockFetchRewardSummary.mockResolvedValue({ totalPending: 0, totalClaimed: 0, entries: [] });

    render(<RewardSummary />);

    expect(await screen.findByText("No rewards yet.")).toBeInTheDocument();
  });
});
