import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingsPage from "./page";

describe("SettingsPage accessibility", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, "Notification", {
      configurable: true,
      value: {
        permission: "default",
        requestPermission: jest.fn().mockResolvedValue("granted"),
      },
    });
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: {
        register: jest.fn().mockResolvedValue({}),
        ready: Promise.resolve({ showNotification: jest.fn() }),
      },
    });
  });

  it("provides an accessible name for the back navigation link", () => {
    render(<SettingsPage />);

    expect(
      screen.getByRole("link", { name: /back to dashboard/i })
    ).toHaveAttribute("href", "/");
  });

  it("exposes the notification toggle as a keyboard-accessible switch that opts in on click", async () => {
    render(<SettingsPage />);

    const notificationSwitch = screen.getByRole("switch", {
      name: /enable push notifications/i,
    });

    // Starts opted out — this is a real opt-in now, not a decorative default.
    expect(notificationSwitch).toHaveAttribute("aria-checked", "false");

    fireEvent.click(notificationSwitch);

    await waitFor(() =>
      expect(notificationSwitch).toHaveAttribute("aria-checked", "true")
    );

    fireEvent.click(notificationSwitch);

    expect(notificationSwitch).toHaveAttribute("aria-checked", "false");
  });

  it("marks the selected appearance theme with aria-checked", () => {
    render(<SettingsPage />);

    const systemThemeButton = screen.getByRole("radio", { name: /system/i });
    const lightThemeButton = screen.getByRole("radio", { name: /light/i });

    expect(systemThemeButton).toHaveAttribute("aria-checked", "true");

    fireEvent.click(lightThemeButton);

    expect(lightThemeButton).toHaveAttribute("aria-checked", "true");
    expect(systemThemeButton).toHaveAttribute("aria-checked", "false");
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
