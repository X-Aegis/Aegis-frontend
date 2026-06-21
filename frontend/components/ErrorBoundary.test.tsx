import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ErrorBoundary } from "./ErrorBoundary";

// ============================================================================
// Helpers
// ============================================================================

function ThrowOnRender({ message }: { message: string }): React.ReactElement {
  throw new Error(message);
}

function GoodChild(): React.ReactElement {
  return <p data-testid="good-child">All good</p>;
}

// ============================================================================
// Tests
// ============================================================================

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("good-child")).toBeInTheDocument();
  });

  it("renders default fallback UI when a child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowOnRender message="Test explosion" />
      </ErrorBoundary>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test explosion")).toBeInTheDocument();
  });

  it("renders custom fallback when provided and a child throws", () => {
    render(
      <ErrorBoundary fallback={<div data-testid="custom-fallback">Oops!</div>}>
        <ThrowOnRender message="boom" />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("resets error state when Try again is clicked", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowOnRender message="recoverable error" />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Rerender with a healthy child before clicking reset so the tree recovers
    rerender(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole("button", { name: /try again/i }));

    expect(screen.getByTestId("good-child")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("logs error info to console.error", () => {
    render(
      <ErrorBoundary>
        <ThrowOnRender message="logged error" />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalledWith(
      "[ErrorBoundary] Uncaught error:",
      expect.any(Error),
      expect.any(String)
    );
  });

  it("shows a generic message when error has no message", () => {
    function ThrowBlankError(): React.ReactElement {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw { notAnError: true } as any;
    }

    render(
      <ErrorBoundary>
        <ThrowBlankError />
      </ErrorBoundary>
    );

    expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
  });
});
