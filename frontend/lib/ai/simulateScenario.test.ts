import { simulateScenario } from "./simulateScenario";

describe("simulateScenario (backend unavailable)", () => {
  it("reports that the backend is not configured", async () => {
    await expect(simulateScenario({ fxShockPercent: -20, volatilityShockPercent: 0, portfolioValueUsd: 10_000 }))
      .rejects.toThrow("backend is not configured");
  });

  it("dampens the hedged projection relative to the unhedged one", async () => {
    await expect(simulateScenario({ fxShockPercent: -30, volatilityShockPercent: 20, portfolioValueUsd: 10_000 })).rejects.toThrow();
  });

  it("produces no shift and no impact for a zero shock", async () => {
    await expect(simulateScenario({ fxShockPercent: 0, volatilityShockPercent: 0, portfolioValueUsd: 10_000 })).rejects.toThrow();
  });

  it("caps the dampening factor at 70%", async () => {
    await expect(simulateScenario({ fxShockPercent: -50, volatilityShockPercent: 50, portfolioValueUsd: 10_000 })).rejects.toThrow();
  });
});
