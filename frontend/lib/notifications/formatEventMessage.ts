import type { TransactionItem } from "@/types/transactions";

export interface FormattedNotification {
  title: string;
  message: string;
}

function formatAmount(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Turns a normalized on-chain event into a short title + message pair,
 * suitable for a toast, the notification center list, or a browser/SW
 * notification body.
 */
export function formatEventMessage(item: TransactionItem): FormattedNotification {
  const amount = formatAmount(item.amount);

  switch (item.kind) {
    case "DEPOSIT":
      return {
        title: "Deposit confirmed",
        message: `${amount} ${item.asset} was deposited into your vault position.`,
      };
    case "WITHDRAW":
      return {
        title: "Withdrawal confirmed",
        message: `${amount} ${item.asset} was withdrawn from your vault position.`,
      };
    case "REBALANCE":
      return {
        title: "Vault rebalanced",
        message: `The vault rebalanced ${amount} ${item.asset} across strategies.`,
      };
  }
}
