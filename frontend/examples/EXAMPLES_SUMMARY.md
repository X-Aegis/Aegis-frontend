# FreighterContext Examples - Quick Reference

This document provides a quick overview of all available examples with code snippets.

## Table of Contents

1. [Basic Connection Button](#1-basic-connection-button)
2. [Protected Feature](#2-protected-feature)
3. [Wallet Address in API Calls](#3-wallet-address-in-api-calls)

---

## 1. Basic Connection Button

**File:** `BasicConnectionButton.tsx`

**Demonstrates:** Connect/disconnect flow, loading states, error handling

**Code Snippet:**
```tsx
import { BasicConnectionButton } from '@/examples';

function Header() {
  return <BasicConnectionButton />;
}
```

**Key Features:**
- ✅ Loading state during connection
- ✅ Error display
- ✅ Truncated address display
- ✅ Clean connect/disconnect toggle

---

## 2. Protected Feature

**File:** `ProtectedFeature.tsx`

**Demonstrates:** Conditional rendering, installation checks, connection checks

**Code Snippet:**
```tsx
import { ProtectedFeature } from '@/examples';

function Dashboard() {
  return <ProtectedFeature />;
}
```

**Key Features:**
- ✅ Installation check with install prompt
- ✅ Connection check with connect prompt
- ✅ Progressive content reveal
- ✅ User guidance at each step

**Additional Components:**
```tsx
import { 
  SimpleInstallationCheck,
  SimpleConnectionCheck 
} from '@/examples';

// Minimal installation check
<SimpleInstallationCheck />

// Minimal connection check
<SimpleConnectionCheck />
```

---

## 3. Wallet Address in API Calls

**File:** `WalletAddressInAPI.tsx`

**Demonstrates:** Using address in useEffect, API integration, cleanup

**Code Snippet:**
```tsx
import { UserBalanceDisplay } from '@/examples';

function WalletPage() {
  return <UserBalanceDisplay />;
}
```

**Key Features:**
- ✅ Address as useEffect dependency
- ✅ API call with wallet address
- ✅ Loading and error states
- ✅ Automatic refetch on address change

**Additional Components:**
```tsx
import { 
  TransactionHistory,
  AdvancedAPIExample 
} from '@/examples';

// Transaction history example
<TransactionHistory />

// Advanced example with AbortController
<AdvancedAPIExample />
```

---

## Quick Start

### 1. Import the hook in any client component:

```tsx
'use client';

import { useFreighter } from '@/contexts/FreighterContext';

export function MyComponent() {
  const { 
    address,      // string | null
    isConnected,  // boolean
    isInstalled,  // boolean
    error,        // string | null
    isLoading,    // boolean
    connect,      // () => Promise<void>
    disconnect    // () => void
  } = useFreighter();
  
  // Your component logic
}
```

### 2. Handle all states:

```tsx
// Check installation
if (!isInstalled) {
  return <InstallPrompt />;
}

// Check connection
if (!isConnected) {
  return <ConnectPrompt />;
}

// Show connected content
return <ConnectedContent address={address} />;
```

### 3. Use address in effects:

```tsx
useEffect(() => {
  if (!address) return;
  
  // Fetch data for this address
  fetchUserData(address);
}, [address]); // Re-run when address changes
```

---

## Common Use Cases

### Use Case 1: Navigation Bar

```tsx
import { BasicConnectionButton } from '@/examples';

export function Navbar() {
  return (
    <nav>
      <Logo />
      <NavLinks />
      <BasicConnectionButton />
    </nav>
  );
}
```

### Use Case 2: Protected Dashboard

```tsx
import { ProtectedFeature } from '@/examples';

export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>
      <ProtectedFeature />
    </main>
  );
}
```

### Use Case 3: Wallet Balance Display

```tsx
import { UserBalanceDisplay } from '@/examples';

export function WalletSection() {
  return (
    <section>
      <h2>Your Wallet</h2>
      <UserBalanceDisplay />
    </section>
  );
}
```

### Use Case 4: Transaction History

```tsx
import { TransactionHistory } from '@/examples';

export function ActivityPage() {
  return (
    <main>
      <h1>Recent Activity</h1>
      <TransactionHistory />
    </main>
  );
}
```

---

## Pattern Cheat Sheet

### Pattern: Conditional Rendering
```tsx
const { isInstalled, isConnected } = useFreighter();

if (!isInstalled) return <InstallPrompt />;
if (!isConnected) return <ConnectPrompt />;
return <Content />;
```

### Pattern: Loading State
```tsx
const { connect, isLoading } = useFreighter();

<button onClick={connect} disabled={isLoading}>
  {isLoading ? 'Connecting...' : 'Connect'}
</button>
```

### Pattern: Error Display
```tsx
const { error } = useFreighter();

{error && <div className="error">{error}</div>}
```

### Pattern: Address Dependency
```tsx
const { address } = useFreighter();

useEffect(() => {
  if (!address) return;
  fetchData(address);
}, [address]);
```

### Pattern: Cleanup
```tsx
useEffect(() => {
  if (!address) return;
  
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  
  return () => controller.abort();
}, [address]);
```

---

## All Available Exports

```tsx
import {
  // Basic connection
  BasicConnectionButton,
  
  // Protected features
  ProtectedFeature,
  SimpleInstallationCheck,
  SimpleConnectionCheck,
  
  // API integration
  UserBalanceDisplay,
  TransactionHistory,
  AdvancedAPIExample,
} from '@/examples';
```

---

## Requirements Mapping

These examples validate the following requirements:

- **Requirement 5.5** - Global state access through useFreighter hook
- **Requirement 4.3** - Installation status exposed to components
- **Requirement 5.3** - Connection state exposed to components
- **Requirement 5.4** - isInstalled status exposed to components
- **Requirement 5.2** - Wallet address exposed to components

---

## Next Steps

1. Copy an example that matches your use case
2. Customize the styling to match your design system
3. Replace placeholder API endpoints with your actual endpoints
4. Add additional error handling as needed
5. Test with Freighter installed and uninstalled

For detailed documentation, see [README.md](./README.md)
