import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatRelativeTime(iso: string): string {
    const date = new Date(iso);
    const diffMs = Date.now() - date.getTime();
    const diffHrs = Math.floor(diffMs / 3_600_000);

    if (diffHrs < 1) return "Just now";
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function truncateAddress(
    address: string,
    startChars: number = 6,
    endChars: number = 4
): string {
    if (!address) return "";
    if (address.length <= startChars + endChars + 3) return address;
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

export function formatCompactNumber(n: number): string {
    if (!Number.isFinite(n)) return "0";
    if (n === 0) return "0";
    const abs = Math.abs(n);
    const sign = n < 0 ? "-" : "";
    if (abs >= 1_000_000) {
        const value = Math.round((abs / 1_000_000) * 10) / 10;
        return `${sign}${value}M`;
    }
    if (abs >= 1_000) {
        const value = Math.round((abs / 1_000) * 10) / 10;
        return `${sign}${value}K`;
    }
    return `${sign}${abs}`;
}

export function formatPercent(value: number): string {
    if (!Number.isFinite(value)) return "0%";
    if (value === 0) return "0%";
    const rounded = Math.round(value * 100 * 10) / 10;
    const compact = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
    return `${compact}%`;
}

export function pluralize(count: number, singular: string): string {
    return count === 1 ? `1 ${singular}` : `${count} ${singular}s`;
}
