import { formatCompactNumber, formatPercent, pluralize, truncateAddress } from "./utils";

describe("truncateAddress", () => {
    it("shortens a full Stellar address, keeping start and end chars", () => {
        const address = "GBRPYHIL2CH3LFQ5I2RIK5QV6E4U6K5V7YF2UJ5A6B7C8D9E0F1G2H3I4J5K";
        expect(truncateAddress(address)).toBe("GBRPYH...4J5K");
    });

    it("returns short addresses unchanged", () => {
        expect(truncateAddress("GABCDE")).toBe("GABCDE");
    });

    it("returns addresses at the threshold length unchanged", () => {
        // startChars(6) + endChars(4) + 3 = 13
        expect(truncateAddress("ABCDEFGHIJKLM")).toBe("ABCDEFGHIJKLM");
    });

    it("truncates addresses longer than the threshold", () => {
        expect(truncateAddress("ABCDEFGHIJKLMN")).toBe("ABCDEF...KLMN");
    });

    it("returns an empty string for empty input", () => {
        expect(truncateAddress("")).toBe("");
    });

    it("honors custom start and end character counts", () => {
        expect(truncateAddress("GABCDEFGHIJKLMNOPQRSTUVWXYZ", 4, 4)).toBe("GABC...WXYZ");
    });
});

describe("formatCompactNumber", () => {
    it("formats millions to one decimal place", () => {
        expect(formatCompactNumber(1_000_000)).toBe("1M");
        expect(formatCompactNumber(2_500_000)).toBe("2.5M");
    });

    it("formats thousands to one decimal place", () => {
        expect(formatCompactNumber(1_500)).toBe("1.5K");
        expect(formatCompactNumber(999)).toBe("999");
    });

    it("returns zero for zero", () => {
        expect(formatCompactNumber(0)).toBe("0");
    });

    it("handles negative values", () => {
        expect(formatCompactNumber(-2_500_000)).toBe("-2.5M");
        expect(formatCompactNumber(-1_500)).toBe("-1.5K");
    });
});

describe("formatPercent", () => {
    it("formats ratios as compact percentages", () => {
        expect(formatPercent(0.1234)).toBe("12.3%");
        expect(formatPercent(0.05)).toBe("5%");
        expect(formatPercent(1)).toBe("100%");
        expect(formatPercent(0)).toBe("0%");
    });

    it("handles negative values", () => {
        expect(formatPercent(-0.02)).toBe("-2%");
    });
});

describe("pluralize", () => {
    it("returns count with word", () => {
        expect(pluralize(1, "strategy")).toBe("1 strategy");
        expect(pluralize(3, "strategy")).toBe("3 strategy");
        expect(pluralize(0, "strategy")).toBe("0 strategy");
    });
});
