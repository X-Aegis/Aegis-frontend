'use client';

import { useFreighter } from '@/contexts/FreighterContext';

/**
 * Example: Protected Feature with Conditional Rendering
 * 
 * This example demonstrates how to:
 * - Check if Freighter is installed before allowing access
 * - Check if wallet is connected before showing protected content
 * - Guide users to install Freighter if needed
 * - Prompt users to connect their wallet
 * - Progressively reveal content based on wallet state
 * 
 * Usage:
 * ```tsx
 * import { ProtectedFeature } from '@/examples/ProtectedFeature';
 * 
 * export default function MyPage() {
 *   return <ProtectedFeature />;
 * }
 * ```
 */
export function ProtectedFeature() {
  // Access wallet state from FreighterContext
  const { isInstalled, isConnected, address } = useFreighter();

  // State 1: Freighter Not Installed
  // Show installation prompt with link to Freighter website
  if (!isInstalled) {
    return (
      <div className="p-6 border-2 border-yellow-400 rounded-lg bg-yellow-50">
        <h3 className="text-lg font-semibold mb-2">Freighter Wallet Required</h3>
        <p className="text-gray-700 mb-4">
          This feature requires the Freighter wallet extension. 
          Please install it to continue.
        </p>
        
        {/* External link to Freighter installation page */}
        <a
          href="https://freighter.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          Install Freighter →
        </a>
      </div>
    );
  }

  // State 2: Freighter Installed but Not Connected
  // Prompt user to connect their wallet
  if (!isConnected) {
    return (
      <div className="p-6 border-2 border-blue-400 rounded-lg bg-blue-50">
        <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-gray-700 mb-4">
          Please connect your Freighter wallet to access this feature.
        </p>
        
        {/* 
          Note: This example focuses on the conditional rendering pattern.
          In a real app, you would include a connect button here or 
          direct users to a connect button elsewhere in your UI.
          
          Example:
          <BasicConnectionButton />
        */}
        <p className="text-sm text-gray-600 italic">
          Use the connect button in your navigation to proceed.
        </p>
      </div>
    );
  }

  // State 3: Wallet Connected - Show Protected Content
  // This content is only visible when wallet is connected
  return (
    <div className="p-6 border-2 border-green-400 rounded-lg bg-green-50">
      <h3 className="text-lg font-semibold mb-2">✓ Protected Feature Unlocked</h3>
      
      {/* Display user's wallet address */}
      <p className="text-sm text-gray-600 mb-4">
        Wallet: <span className="font-mono">{address}</span>
      </p>

      {/* Protected content goes here */}
      <div className="bg-white p-4 rounded border">
        <h4 className="font-semibold mb-2">Your Protected Content</h4>
        <p className="text-gray-700">
          This content is only visible to users with a connected wallet.
          You can now:
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-700">
          <li>Sign transactions</li>
          <li>View account balances</li>
          <li>Access wallet-gated features</li>
          <li>Interact with smart contracts</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Example: Simple Installation Check
 * 
 * A minimal example showing just the installation check pattern.
 */
export function SimpleInstallationCheck() {
  const { isInstalled } = useFreighter();

  if (!isInstalled) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p>
          Freighter not detected.{' '}
          <a 
            href="https://freighter.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            Install it here
          </a>
        </p>
      </div>
    );
  }

  return <p className="text-green-600">✓ Freighter is installed</p>;
}

/**
 * Example: Simple Connection Check
 * 
 * A minimal example showing just the connection check pattern.
 */
export function SimpleConnectionCheck() {
  const { isConnected } = useFreighter();

  if (!isConnected) {
    return (
      <div className="p-4 bg-blue-100 border border-blue-400 rounded">
        <p>Please connect your wallet to continue.</p>
      </div>
    );
  }

  return <p className="text-green-600">✓ Wallet connected</p>;
}
