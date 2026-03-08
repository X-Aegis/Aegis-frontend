# Quick Start Guide - FreighterContext Examples

Get started with FreighterContext in 5 minutes.

## Step 1: Verify Provider Setup

Ensure `FreighterProvider` wraps your app in `app/providers.tsx`:

```tsx
// app/providers.tsx
"use client";

import { FreighterProvider } from "@/contexts/FreighterContext";
import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <FreighterProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </FreighterProvider>
  );
}
```

✅ If this is already set up, proceed to Step 2.

## Step 2: Choose Your Example

Pick the example that matches your use case:

| Use Case | Example | File |
|----------|---------|------|
| Add connect button to navbar | `BasicConnectionButton` | `BasicConnectionButton.tsx` |
| Protect a page/feature | `ProtectedFeature` | `ProtectedFeature.tsx` |
| Fetch user balance | `UserBalanceDisplay` | `WalletAddressInAPI.tsx` |
| Show transaction history | `TransactionHistory` | `WalletAddressInAPI.tsx` |
| Check if Freighter installed | `SimpleInstallationCheck` | `ProtectedFeature.tsx` |
| Check if wallet connected | `SimpleConnectionCheck` | `ProtectedFeature.tsx` |

## Step 3: Copy and Customize

### Example A: Add Connect Button to Navbar

```tsx
// app/components/Navbar.tsx
'use client';

import { BasicConnectionButton } from '@/examples';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4">
      <div className="text-xl font-bold">My DApp</div>
      <BasicConnectionButton />
    </nav>
  );
}
```

### Example B: Protect a Dashboard Page

```tsx
// app/dashboard/page.tsx
'use client';

import { ProtectedFeature } from '@/examples';

export default function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <ProtectedFeature />
    </main>
  );
}
```

### Example C: Show User Balance

```tsx
// app/wallet/page.tsx
'use client';

import { UserBalanceDisplay } from '@/examples';

export default function WalletPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Wallet</h1>
      <UserBalanceDisplay />
    </main>
  );
}
```

## Step 4: Customize for Your App

### Update Styling

Replace Tailwind classes with your design system:

```tsx
// Before (example styling)
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  Connect
</button>

// After (your styling)
<button className="btn btn-primary">
  Connect
</button>
```

### Update API Endpoints

Replace placeholder endpoints with your actual API:

```tsx
// Before (example endpoint)
const response = await fetch(`/api/balance/${address}`);

// After (your endpoint)
const response = await fetch(`https://api.yourdomain.com/stellar/balance/${address}`);
```

### Add Your Error Handling

Customize error messages and handling:

```tsx
// Add custom error handling
try {
  await connect();
} catch (err) {
  // Your custom error handling
  logErrorToService(err);
  showToast('Connection failed');
}
```

## Step 5: Test

### Test Checklist

- [ ] Test with Freighter installed
- [ ] Test with Freighter NOT installed
- [ ] Test connect flow
- [ ] Test disconnect flow
- [ ] Test page refresh (connection persistence)
- [ ] Test with multiple tabs open
- [ ] Test error states

### Testing Tips

1. **Uninstall Freighter** to test the "not installed" state
2. **Clear localStorage** to test fresh connection flow
3. **Reject connection** in Freighter to test error handling
4. **Refresh page** after connecting to test persistence

## Common Patterns

### Pattern 1: Use in Any Component

```tsx
'use client';

import { useFreighter } from '@/contexts/FreighterContext';

export function MyComponent() {
  const { address, isConnected } = useFreighter();
  
  if (!isConnected) {
    return <p>Please connect wallet</p>;
  }
  
  return <p>Connected: {address}</p>;
}
```

### Pattern 2: Conditional Rendering

```tsx
const { isInstalled, isConnected } = useFreighter();

if (!isInstalled) return <InstallPrompt />;
if (!isConnected) return <ConnectPrompt />;
return <YourContent />;
```

### Pattern 3: Fetch Data on Connect

```tsx
const { address } = useFreighter();

useEffect(() => {
  if (!address) return;
  
  fetchUserData(address);
}, [address]);
```

## Troubleshooting

### Error: "useFreighter must be used within a FreighterProvider"

**Cause:** Component is not wrapped by FreighterProvider

**Solution:** Ensure `app/providers.tsx` includes FreighterProvider and wraps your app

### Address is always null

**Cause:** Wallet not connected or connection failed

**Solution:** 
1. Check if `isConnected` is true
2. Check if Freighter is installed (`isInstalled`)
3. Check console for errors

### Connection doesn't persist on refresh

**Cause:** localStorage might be disabled or cleared

**Solution:**
1. Check browser localStorage is enabled
2. Check if localStorage key `freighter_wallet_address` exists
3. Check console for verification errors

### API calls not working

**Cause:** Placeholder endpoints don't exist

**Solution:** Replace example API endpoints with your actual backend endpoints

## Next Steps

1. ✅ Copy an example
2. ✅ Customize styling
3. ✅ Update API endpoints
4. ✅ Test thoroughly
5. 📖 Read [README.md](./README.md) for detailed documentation
6. 📋 Check [EXAMPLES_SUMMARY.md](./EXAMPLES_SUMMARY.md) for more patterns

## Need Help?

- 📖 [Full Documentation](./README.md)
- 📋 [Quick Reference](./EXAMPLES_SUMMARY.md)
- 🎨 [Demo Page](./DemoPage.tsx)
- 🌐 [Freighter Docs](https://docs.freighter.app/)
- 🌐 [Stellar Docs](https://stellar.github.io/js-stellar-sdk/)

## Example Project Structure

```
app/
├── layout.tsx
├── providers.tsx          ← FreighterProvider here
├── page.tsx
├── dashboard/
│   └── page.tsx          ← Use ProtectedFeature
└── components/
    └── Navbar.tsx        ← Use BasicConnectionButton

contexts/
├── FreighterContext.tsx  ← Context implementation
└── index.ts

examples/                 ← Copy examples from here
├── BasicConnectionButton.tsx
├── ProtectedFeature.tsx
├── WalletAddressInAPI.tsx
└── ...
```

---

**Ready to build?** Start with `BasicConnectionButton` in your navbar! 🚀
