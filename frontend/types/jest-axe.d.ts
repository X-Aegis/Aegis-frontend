declare module "jest-axe" {
  import type { AxeResults, RunOptions } from "axe-core";
  export function axe(element: Element, options?: RunOptions): Promise<AxeResults>;
  export const toHaveNoViolations: {
    toHaveNoViolations: () => jest.CustomMatcherResult;
  };
}

declare namespace jest {
  interface Matchers<R> {
    toHaveNoViolations(): R;
  }
}
