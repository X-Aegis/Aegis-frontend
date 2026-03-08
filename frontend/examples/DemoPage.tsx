'use client';

import { 
  BasicConnectionButton,
  ProtectedFeature,
  SimpleInstallationCheck,
  SimpleConnectionCheck,
  UserBalanceDisplay,
  TransactionHistory,
} from '@/examples';

/**
 * Demo Page - Showcases All FreighterContext Examples
 * 
 * This page demonstrates all available examples in one place.
 * Use this as a reference or testing page during development.
 * 
 * To use this page, create a route in your app:
 * 
 * File: app/examples/page.tsx
 * ```tsx
 * import { DemoPage } from '@/examples/DemoPage';
 * export default DemoPage;
 * ```
 * 
 * Then visit: http://localhost:3000/examples
 */
export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-2">FreighterContext Examples</h1>
          <p className="text-gray-600">
            Interactive demonstrations of wallet integration patterns
          </p>
        </header>

        {/* Example 1: Basic Connection Button */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">
              1. Basic Connection Button
            </h2>
            <p className="text-gray-600 text-sm mb-2">
              Demonstrates connect/disconnect flow with loading and error states
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              import {'{ BasicConnectionButton }'} from '@/examples';
            </code>
          </div>
          <div className="border-t pt-4">
            <BasicConnectionButton />
          </div>
        </section>

        {/* Example 2: Simple Checks */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">
              2. Simple Installation & Connection Checks
            </h2>
            <p className="text-gray-600 text-sm mb-2">
              Minimal examples for checking wallet status
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              import {'{ SimpleInstallationCheck, SimpleConnectionCheck }'} from '@/examples';
            </code>
          </div>
          <div className="border-t pt-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-sm">Installation Check:</h3>
              <SimpleInstallationCheck />
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-sm">Connection Check:</h3>
              <SimpleConnectionCheck />
            </div>
          </div>
        </section>

        {/* Example 3: Protected Feature */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">
              3. Protected Feature
            </h2>
            <p className="text-gray-600 text-sm mb-2">
              Progressive content reveal based on installation and connection status
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              import {'{ ProtectedFeature }'} from '@/examples';
            </code>
          </div>
          <div className="border-t pt-4">
            <ProtectedFeature />
          </div>
        </section>

        {/* Example 4: User Balance Display */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">
              4. User Balance Display
            </h2>
            <p className="text-gray-600 text-sm mb-2">
              Demonstrates using wallet address in API calls with useEffect
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              import {'{ UserBalanceDisplay }'} from '@/examples';
            </code>
          </div>
          <div className="border-t pt-4">
            <UserBalanceDisplay />
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <strong>Note:</strong> This example will show an error because the API endpoint 
            doesn't exist. Replace <code className="bg-yellow-100 px-1">/api/balance/{'${address}'}</code> with 
            your actual endpoint.
          </div>
        </section>

        {/* Example 5: Transaction History */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">
              5. Transaction History
            </h2>
            <p className="text-gray-600 text-sm mb-2">
              Another example of address-dependent data fetching
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              import {'{ TransactionHistory }'} from '@/examples';
            </code>
          </div>
          <div className="border-t pt-4">
            <TransactionHistory />
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <strong>Note:</strong> This example will show an error because the API endpoint 
            doesn't exist. Replace <code className="bg-yellow-100 px-1">/api/transactions/{'${address}'}</code> with 
            your actual endpoint.
          </div>
        </section>

        {/* Usage Instructions */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">How to Use These Examples</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>
              <strong>Copy the example</strong> that matches your use case
            </li>
            <li>
              <strong>Customize the styling</strong> to match your design system
            </li>
            <li>
              <strong>Replace API endpoints</strong> with your actual backend endpoints
            </li>
            <li>
              <strong>Add error handling</strong> specific to your application
            </li>
            <li>
              <strong>Test thoroughly</strong> with Freighter installed and uninstalled
            </li>
          </ol>
        </section>

        {/* Documentation Links */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">Documentation</h2>
          <div className="space-y-2 text-sm">
            <div>
              <a 
                href="/examples/README.md" 
                className="text-blue-600 hover:underline font-semibold"
              >
                📖 Full Documentation (README.md)
              </a>
              <p className="text-gray-600 ml-6">
                Comprehensive guide with patterns, best practices, and troubleshooting
              </p>
            </div>
            <div>
              <a 
                href="/examples/EXAMPLES_SUMMARY.md" 
                className="text-blue-600 hover:underline font-semibold"
              >
                📋 Quick Reference (EXAMPLES_SUMMARY.md)
              </a>
              <p className="text-gray-600 ml-6">
                Quick overview with code snippets and common use cases
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 pt-8 border-t">
          <p>
            For more information, see the{' '}
            <a 
              href="https://docs.freighter.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Freighter Documentation
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
