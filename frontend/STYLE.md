# Code Style Guide

## Rust (Soroban Contracts)

*   **Formatting:** Always run `cargo fmt`.
*   **Errors:** Use `Result<T, E>` for logic errors.
*   **Safety:** Always use the `Env` object for authorization.
*   **Math:** Be careful with fixed-point arithmetic for currency calculations.

## TypeScript (Frontend)

*   **Formatting:** Use Prettier standard config.
*   **Components:** Functional components with typed props.
*   **State:** Use React Hooks.
*   **Styling:** Use Tailwind CSS utility classes.

## Integrity Checks

*   **Always run:** `cargo build --all` before starting your work to ensure the workspace is clean and compiles correctly.
