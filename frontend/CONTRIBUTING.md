# Contributing to X-Aegis

Thank you for your interest in building the future of inflation protection on Stellar! This guide will help you contribute effectively.

## 🛠 Tech Stack

*   **Smart Contracts:** Soroban asset management logic (Rust)
*   **Frontend:** Next.js, TypeScript, Tailwind CSS, Freighter Wallet
*   **AI Engine:** Time-series FX forecasting (Python/FastAPI)
*   **Data:** Central Bank APIs, Market Feeds

## 📝 Commit Guidelines (Strict)

We follow a strict **Modular Commit** philosophy to ensure history is readable and revertible.

**The Golden Rule:**
> "Commit after every meaningful change, not every line."

*   **Meaningful Change:** Completing a function, finishing a fix, adding a feature block, creating a file, or making a significant modification.
*   **Avoid:** Micro-commits for single-line edits unless they are standalone fixes.
*   **Frequency:** Commit often, but only when you finish a logical piece of work.

### Example Commit Messages
*   `feat(contract): implement yield allocation logic`
*   `fix(ui): correct risk visualization chart`
*   `docs: update fx data source list`

## 📋 Issue Tracking

1.  Pick an issue from the `docs/` folder.
2.  When you start, comment on the issue or mark it as "In Progress".
3.  **When Completed:** You MUST update the issue file with:
    *   Check the box `[x]`
    *   Append your GitHub username and Date/Time.
    *   *Example:* `- [x] Integrate FX Feed (@bbkenny - 2023-10-27 14:00)`

## 🧪 Development Workflow

1.  **Clone**: Clone the repo locally.
2.  **Branch**: Create a feature branch (`feat/my-feature`).
3.  **Develop**: Write code following the Style Guide (`STYLE.md`).
4.  **Test**: Run `cargo test` (contracts) or `npm run test` (frontend).
5.  **Commit**: Follow the commit guidelines above.

## Getting Help

Read the **Integration Guides** located in the `docs/` directory for detailed setup instructions.
