import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingsPage from "./page";

describe("SettingsPage accessibility", () => {
  it("provides an accessible name for the back navigation link", () => {
    render(<SettingsPage />);

    expect(
      screen.getByRole("link", { name: /back to dashboard/i })
    ).toHaveAttribute("href", "/");
  });

  it("exposes the notification toggle as a keyboard-accessible switch", () => {
    render(<SettingsPage />);

    const notificationSwitch = screen.getByRole("switch", {
      name: /toggle push notifications/i,
    });

    expect(notificationSwitch).toHaveAttribute("aria-checked", "true");

    fireEvent.click(notificationSwitch);

    expect(notificationSwitch).toHaveAttribute("aria-checked", "false");
  });

  it("marks the selected appearance theme with aria-pressed", () => {
    render(<SettingsPage />);

    const systemThemeButton = screen.getByRole("button", { name: /system/i });
    const lightThemeButton = screen.getByRole("button", { name: /light/i });

    expect(systemThemeButton).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(lightThemeButton);

    expect(lightThemeButton).toHaveAttribute("aria-pressed", "true");
    expect(systemThemeButton).toHaveAttribute("aria-pressed", "false");
  });

  it("renders settings actions as keyboard-reachable buttons and links", () => {
    render(<SettingsPage />);

    expect(screen.getByRole("button", { name: /general profile/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /security & keys/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /volatility alerts/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /rebalance success/i })).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /view on stellar\.expert/i })
    ).toHaveAttribute("target", "_blank");
  });
});
