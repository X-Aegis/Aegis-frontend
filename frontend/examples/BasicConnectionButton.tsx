'use client';

import { useFreighter } from '@/contexts/FreighterContext';

/**
 * Example: Basic Connection Button Component
 * 
 * This example demonstrates the fundamental connect/disconnect flow with:
 * - Loading state handling during async operations
 * - Error display for user feedback
 * - Connected state with truncated address display
 * - Clean UI transitions between states
 * 
 * Usage:
 * ```tsx
 * import { BasicConnectionButton } from '@/examples/BasicConnectionButton';
 * 
 * export default function MyPage() {
 *   return <BasicConnectionButton />;
 * }
 * ```
 */
export function BasicConnectionButton() {
  // Access wallet state and operations from FreighterContext
  // The useFreighter hook provides all wallet-related state and functions
  const { 
    isConnected,    // Boolean: true when wallet is connected
    address,        // String | null: Stellar public key (G...) when connected
    connect,        // Function: Initiates wallet connection flow
    disconnect,     // Function: Disconnects wallet and clears state
    isLoading,      // Boolean: true during async operations (connecting)
    error           // String | null: Error message if operation failed
  } = useFreighter();

  // Connected State: Show wallet address and disconnect button
  if (isConnected && address) {
    return (
      <div className="flex flex-col gap-2 p-4 border rounded-lg">
        {/* Display truncated wallet address for better UX */}
        <p className="text-sm text-gray-600">
          Connected: <span className="font-mono font-semibold">
            {address.slice(0, 8)}...{address.slice(-8)}
          </span>
        </p>
        
        {/* Disconnect button - calls disconnect() to clear state */}
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Disconnect Wallet
        </button>
      </div>
    );
  }

  // Disconnected State: Show connect button with loading and error handling
  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg">
      {/* Connect button - disabled during loading to prevent duplicate requests */}
      <button
        onClick={connect}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {/* Show loading text during connection attempt */}
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {/* Error Display: Show error message if connection failed */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}
    </div>
  );
}
