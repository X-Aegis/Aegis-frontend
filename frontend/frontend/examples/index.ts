/**
 * FreighterContext Usage Examples
 * 
 * This directory contains practical examples demonstrating how to use
 * the FreighterContext in real-world applications.
 * 
 * Import examples like this:
 * ```tsx
 * import { BasicConnectionButton } from '@/examples';
 * ```
 */

// Basic connection flow example
export { BasicConnectionButton } from './BasicConnectionButton';

// Protected feature examples with conditional rendering
export {
  ProtectedFeature,
  SimpleInstallationCheck,
  SimpleConnectionCheck,
} from './ProtectedFeature';

// API integration examples
export {
  UserBalanceDisplay,
  TransactionHistory,
  AdvancedAPIExample,
} from './WalletAddressInAPI';

// Demo page showcasing all examples
export { default as DemoPage } from './DemoPage';
