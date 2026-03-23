# FreighterContext Usage Examples

This directory contains practical, production-ready examples demonstrating how to use the FreighterContext in your Next.js application.

## Overview

The FreighterContext provides global wallet state management for Freighter wallet integration. These examples show common patterns and best practices for building wallet-connected features.

## Examples

### 1. Basic Connection Button (`BasicConnectionButton.tsx`)

**What it demonstrates:**
- Connect/disconnect flow
- Loading state handling
- Error display
- Connected state with truncated address
- Clean UI transitions

**Key patterns:**
```tsx
const { isConnected, address, connect, disconnect, isLoading, error } = useFreighter();

// Show different UI based on connection state
if (isConnected) {
  return <DisconnectButton />;
}
return <ConnectButton />;
```

**Usage:**
```tsx
import { BasicConnectionButton } from '@/examples';

export default function Header() {
  return (
    <nav>
      <BasicConnectionButton />
    </nav>
  );
}
```

---

### 2. Protected Feature (`ProtectedFeature.tsx`)

**What it demonstrates:**
- Installation check (`isInstalled`)
- Connection check (`isConnected`)
- Progressive content reveal
- User guidance for installation and connection

**Key patterns:**
```tsx
const { isInstalled, isConnected } = useFreighter();

// Check installation first
if (!isInstalled) {
  return <InstallPrompt />;
}

// Then check connection
if (!isConnected) {
  return <ConnectPrompt />;
}

// Finally show protected content
return <ProtectedContent />;
```

**Usage:**
```tsx
import { ProtectedFeature } from '@/examples';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <ProtectedFeature />
    </div>
  );
}
```

**Additional exports:**
- `SimpleInstallationCheck` - Minimal installation check
- `SimpleConnectionCheck` - Minimal connection check

---

### 3. Wallet Address in API Calls (`WalletAddressInAPI.tsx`)

**What it demonstrates:**
- Using `address` as useEffect dependency
- Making API calls with wallet address
- Conditional rendering based on connection
- Loading and error states for API calls
- Proper cleanup with AbortController

**Key patterns:**
```tsx
const { address, isConnected } = useFreighter();
const [data, setData] = useState(null);

useEffect(() => {
  // Guard clause: only fetch if address exists
  if (!address) return;

  const fetchData = async () => {
    const response = await fetch(`/api/data/${address}`);
    const result = await response.json();
    setData(result);
  };

  fetchData();
}, [address]); // Re-run when address changes
```

**Usage:**
```tsx
import { UserBalanceDisplay } from '@/examples';

export default function WalletPage() {
  return (
    <div>
      <h1>My Wallet</h1>
      <UserBalanceDisplay />
    </div>
  );
}
```

**Additional exports:**
- `TransactionHistory` - Fetch and display transactions
- `AdvancedAPIExample` - Shows AbortController cleanup pattern

---

## Common Patterns

### Pattern 1: Conditional Rendering

Always check wallet state before rendering wallet-dependent content:

```tsx
const { isInstalled, isConnected, address } = useFreighter();

if (!isInstalled) return <InstallPrompt />;
if (!isConnected) return <ConnectPrompt />;
return <WalletContent address={address} />;
```

### Pattern 2: Address as Dependency

Use `address` in useEffect dependencies to react to wallet changes:

```tsx
useEffect(() => {
  if (!address) return;
  
  // Fetch data for this address
  fetchUserData(address);
}, [address]);
```

### Pattern 3: Loading States

Always handle loading states for async operations:

```tsx
const { connect, isLoading } = useFreighter();

<button onClick={connect} disabled={isLoading}>
  {isLoading ? 'Connecting...' : 'Connect'}
</button>
```

### Pattern 4: Error Handling

Display errors to users for better UX:

```tsx
const { error } = useFreighter();

{error && (
  <div className="error-message">
    {error}
  </div>
)}
```

---

## Best Practices

### 1. Always Check Installation First

Before checking connection, verify Freighter is installed:

```tsx
if (!isInstalled) {
  // Show installation prompt
}
```

### 2. Use Guard Clauses in Effects

Prevent unnecessary API calls when wallet is disconnected:

```tsx
useEffect(() => {
  if (!address) return; // Guard clause
  
  fetchData(address);
}, [address]);
```

### 3. Clean Up API Requests

Use AbortController to cancel requests when component unmounts:

```tsx
useEffect(() => {
  const controller = new AbortController();
  
  fetch(url, { signal: controller.signal });
  
  return () => controller.abort();
}, [address]);
```

### 4. Provide Clear User Guidance

Tell users exactly what they need to do:

```tsx
if (!isInstalled) {
  return (
    <div>
      <p>Please install Freighter to continue</p>
      <a href="https://freighter.app">Install Freighter</a>
    </div>
  );
}
```

### 5. Handle All States

Account for all possible states: disconnected, connecting, connected, error:

```tsx
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!isConnected) return <ConnectPrompt />;
return <ConnectedContent />;
```

---

## Integration Guide

### Step 1: Ensure Provider is Set Up

The `FreighterProvider` should wrap your app in `app/providers.tsx`:

```tsx
export function Providers({ children }) {
  return (
    <FreighterProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </FreighterProvider>
  );
}
```

### Step 2: Import the Hook

In any client component, import and use the hook:

```tsx
'use client';

import { useFreighter } from '@/contexts/FreighterContext';

export function MyComponent() {
  const { isConnected, address } = useFreighter();
  // ...
}
```

### Step 3: Handle States

Always handle all possible wallet states in your UI.

---

## TypeScript Support

All examples are fully typed. The `useFreighter` hook returns:

```typescript
interface FreighterContextType {
  address: string | null;           // Stellar public key or null
  isConnected: boolean;             // Connection status
  isInstalled: boolean;             // Installation status
  error: string | null;             // Error message or null
  isLoading: boolean;               // Loading state
  connect: () => Promise<void>;     // Connect function
  disconnect: () => void;           // Disconnect function
}
```

---

## Testing

When testing components that use `useFreighter`, mock the context:

```tsx
import { FreighterProvider } from '@/contexts/FreighterContext';

// Wrap component in provider for tests
render(
  <FreighterProvider>
    <YourComponent />
  </FreighterProvider>
);
```

---

## Troubleshooting

### "useFreighter must be used within a FreighterProvider"

**Solution:** Ensure your component is wrapped by `FreighterProvider`. Check that `app/providers.tsx` includes the provider.

### Address is null even when connected

**Solution:** The address is only available after successful connection. Check `isConnected` before using `address`.

### API calls not updating when wallet changes

**Solution:** Ensure `address` is in your useEffect dependency array:

```tsx
useEffect(() => {
  fetchData(address);
}, [address]); // ← Must include address
```

---

## Additional Resources

- [Freighter Documentation](https://docs.freighter.app/)
- [Stellar SDK Documentation](https://stellar.github.io/js-stellar-sdk/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Context API](https://react.dev/reference/react/useContext)

---

## Contributing

When adding new examples:

1. Create a new file in `frontend/examples/`
2. Add comprehensive inline comments
3. Export from `index.ts`
4. Update this README with usage instructions
5. Follow the existing patterns and naming conventions
