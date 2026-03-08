import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import { FreighterProvider, useFreighter } from './FreighterContext';
import * as freighterApi from '@stellar/freighter-api';
import fc from 'fast-check';

// ============================================================================
// Mocks
// ============================================================================

jest.mock('@stellar/freighter-api', () => ({
  isConnected: jest.fn(),
  requestAccess: jest.fn(),
  getPublicKey: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'freighter_wallet_address';

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Test component that uses the useFreighter hook
 */
function TestComponent() {
  const { address, isConnected, isInstalled, error, isLoading, connect, disconnect } = useFreighter();

  return (
    <div>
      <div data-testid="address">{address || 'null'}</div>
      <div data-testid="isConnected">{isConnected.toString()}</div>
      <div data-testid="isInstalled">{isInstalled.toString()}</div>
      <div data-testid="error">{error || 'null'}</div>
      <div data-testid="isLoading">{isLoading.toString()}</div>
      <button onClick={connect} data-testid="connect-button">Connect</button>
      <button onClick={disconnect} data-testid="disconnect-button">Disconnect</button>
    </div>
  );
}

/**
 * Generator for valid Stellar public keys (G... format, 56 characters)
 */
const stellarPublicKeyArbitrary = fc.string({ minLength: 56, maxLength: 56 }).map(
  (str) => 'G' + str.slice(1).toUpperCase().replace(/[^A-Z2-7]/g, 'A')
);

/**
 * Helper to render provider and get test utilities
 */
function renderProvider() {
  const result = render(
    <FreighterProvider>
      <TestComponent />
    </FreighterProvider>
  );

  return {
    ...result,
    getAddress: () => result.getByTestId('address').textContent,
    getIsConnected: () => result.getByTestId('isConnected').textContent === 'true',
    getIsInstalled: () => result.getByTestId('isInstalled').textContent === 'true',
    getError: () => {
      const content = result.getByTestId('error').textContent;
      return content === 'null' ? null : content;
    },
    getIsLoading: () => result.getByTestId('isLoading').textContent === 'true',
    clickConnect: () => act(() => result.getByTestId('connect-button').click()),
    clickDisconnect: () => act(() => result.getByTestId('disconnect-button').click()),
  };
}

// ============================================================================
// Property-Based Tests
// ============================================================================

describe('Feature: freighter-wallet-context - Property-Based Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ==========================================================================
  // Property 1: Successful Connection Updates State
  // **Validates: Requirements 1.2, 1.3, 1.4**
  // ==========================================================================

  it('Property 1: Successful Connection Updates State', async () => {
    await fc.assert(
      fc.asyncProperty(stellarPublicKeyArbitrary, async (publicKey) => {
        // Setup: Mock successful connection
        (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);
        (freighterApi.requestAccess as jest.Mock).mockResolvedValue(undefined);
        (freighterApi.getPublicKey as jest.Mock).mockResolvedValue(publicKey);

        const { getAddress, getIsConnected, clickConnect, unmount } = renderProvider();

        // Wait for initialization
        await waitFor(() => expect(freighterApi.isConnected).toHaveBeenCalled());

        // Action: Connect
        clickConnect();

        // Assert: State should be updated with the public key and connected status
        await waitFor(() => {
          expect(getAddress()).toBe(publicKey);
          expect(getIsConnected()).toBe(true);
        });

        unmount();
        jest.clearAllMocks();
        localStorageMock.clear();
      }),
      { numRuns: 100 }
    );
  });

  // ==========================================================================
  // Property 2: Disconnection Clears State
  // **Validates: Requirements 2.2, 2.3**
  // ==========================================================================

  it('Property 2: Disconnection Clears State', async () => {
    await fc.assert(
      fc.asyncProperty(stellarPublicKeyArbitrary, async (publicKey) => {
        // Setup: Establish connection first
        (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);
        (freighterApi.requestAccess as jest.Mock).mockResolvedValue(undefined);
        (freighterApi.getPublicKey as jest.Mock).mockResolvedValue(publicKey);

        const { getAddress, getIsConnected, clickConnect, clickDisconnect, unmount } = renderProvider();

        await waitFor(() => expect(freighterApi.isConnected).toHaveBeenCalled());

        // Connect first
        clickConnect();
        await waitFor(() => expect(getIsConnected()).toBe(true));

        // Action: Disconnect
        clickDisconnect();

        // Assert: State should be cleared
        await waitFor(() => {
          expect(getAddress()).toBe('null');
          expect(getIsConnected()).toBe(false);
        });

        unmount();
        jest.clearAllMocks();
        localStorageMock.clear();
      }),
      { numRuns: 100 }
    );
  });

  // ==========================================================================
  // Property 3: Disconnection Clears Persistence
  // **Validates: Requirements 2.4**
  // ==========================================================================

  it('Property 3: Disconnection Clears Persistence', async () => {
    await fc.assert(
      fc.asyncProperty(stellarPublicKeyArbitrary, async (publicKey) => {
        // Setup: Establish connection first
        (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);
        (freighterApi.requestAccess as jest.Mock).mockResolvedValue(undefined);
        (freighterApi.getPublicKey as jest.Mock).mockResolvedValue(publicKey);

        const { getIsConnected, clickConnect, clickDisconnect, unmount } = renderProvider();

        await waitFor(() => expect(freighterApi.isConnected).toHaveBeenCalled());

        // Connect first
        clickConnect();
        await waitFor(() => expect(getIsConnected()).toBe(true));

        // Verify localStorage has the key
        expect(localStorageMock.getItem(STORAGE_KEY)).toBe(publicKey);

        // Action: Disconnect
        clickDisconnect();

        // Assert: localStorage should be cleared
        await waitFor(() => {
          expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();
        });

        unmount();
        jest.clearAllMocks();
        localStorageMock.clear();
      }),
      { numRuns: 100 }
    );
  });

  // ==========================================================================
  // Property 4: Connection Persists to Storage
  // **Validates: Requirements 3.1**
  // ==========================================================================

  it('Property 4: Connection Persists to Storage', async () => {
    await fc.assert(
      fc.asyncProperty(stellarPublicKeyArbitrary, async (publicKey) => {
        // Setup: Mock successful connection
        (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);
        (freighterApi.requestAccess as jest.Mock).mockResolvedValue(undefined);
        (freighterApi.getPublicKey as jest.Mock).mockResolvedValue(publicKey);

        const { getIsConnected, clickConnect, unmount } = renderProvider();

        await waitFor(() => expect(freighterApi.isConnected).toHaveBeenCalled());

        // Action: Connect
        clickConnect();
        await waitFor(() => expect(getIsConnected()).toBe(true));

        // Assert: localStorage should contain the wallet address
        expect(localStorageMock.getItem(STORAGE_KEY)).toBe(publicKey);

        unmount();
        jest.clearAllMocks();
        localStorageMock.clear();
      }),
      { numRuns: 100 }
    );
  });

  // ==========================================================================
  // Property 5: Verification Success Restores State
  // **Validates: Requirements 3.3, 3.4**
  // ==========================================================================

  it('Property 5: Verification Success Restores State', async () => {
    await fc.assert(
      fc.asyncProperty(stellarPublicKeyArbitrary, async (publicKey) => {
        // Setup: Pre-populate localStorage
        localStorageMock.setItem(STORAGE_KEY, publicKey);

        // Mock Freighter API to confirm the connection
        (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);
        (freighterApi.getPublicKey as jest.Mock).mockResolvedValue(publicKey);

        const { getAddress, getIsConnected, unmount } = renderProvider();

        // Assert: State should be restored from localStorage
        await waitFor(() => {
          expect(getAddress()).toBe(publicKey);
          expect(getIsConnected()).toBe(true);
        });

        unmount();
        jest.clearAllMocks();
        localStorageMock.clear();
      }),
      { numRuns: 100 }
    );
  });

  // ==========================================================================
  // Property 6: Verification Failure Clears Everything
  // **Validates: Requirements 3.5, 8.3**
  // ==========================================================================

  it('Property 6: Verification Failure Clears Everything', async () => {
    await fc.assert(
      fc.asyncProperty(
        stellarPublicKeyArbitrary,
        stellarPublicKeyArbitrary,
        async (storedKey, differentKey) => {
          // Ensure keys are different
          fc.pre(storedKey !== differentKey);

          // Setup: Pre-populate localStorage with one key
          localStorageMock.setItem(STORAGE_KEY, storedKey);

          // Mock Freighter API to return a different key (verification fails)
          (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);
          (freighterApi.getPublicKey as jest.Mock).mockResolvedValue(differentKey);

          const { getAddress, getIsConnected, unmount } = renderProvider();

          // Assert: State should be cleared and localStorage should be removed
          await waitFor(() => {
            expect(getAddress()).toBe('null');
            expect(getIsConnected()).toBe(false);
            expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();
          });

          unmount();
          jest.clearAllMocks();
          localStorageMock.clear();
        }
      ),
      { numRuns: 100 }
    );
  });

  // ==========================================================================
  // Property 7: Installation Status Reflects Reality
  // **Validates: Requirements 4.3**
  // ==========================================================================

  it('Property 7: Installation Status Reflects Reality', async () => {
    await fc.assert(
      fc.asyncProperty(fc.boolean(), async (isInstalled) => {
        // Setup: Mock installation status
        (freighterApi.isConnected as jest.Mock).mockResolvedValue(isInstalled);

        const { getIsInstalled, unmount } = renderProvider();

        // Assert: isInstalled should match the Freighter API response
        await waitFor(() => {
          expect(getIsInstalled()).toBe(isInstalled);
        });

        unmount();
        jest.clearAllMocks();
        localStorageMock.clear();
      }),
      { numRuns: 100 }
    );
  });

  // ==========================================================================
  // Property 8: Context State Propagates to Children
  // **Validates: Requirements 5.2, 5.3, 5.4**
  // ==========================================================================

  it('Property 8: Context State Propagates to Children', async () => {
    await fc.assert(
      fc.asyncProperty(
        stellarPublicKeyArbitrary,
        fc.boolean(),
        fc.boolean(),
        async (publicKey, shouldConnect, isInstalled) => {
          // Setup: Mock installation status
          (freighterApi.isConnected as jest.Mock).mockResolvedValue(isInstalled);

          if (shouldConnect && isInstalled) {
            (freighterApi.requestAccess as jest.Mock).mockResolvedValue(undefined);
            (freighterApi.getPublicKey as jest.Mock).mockResolvedValue(publicKey);
          }

          const { getAddress, getIsConnected, getIsInstalled, clickConnect, unmount } = renderProvider();

          // Wait for initialization
          await waitFor(() => expect(getIsInstalled()).toBe(isInstalled));

          if (shouldConnect && isInstalled) {
            // Connect
            clickConnect();
            await waitFor(() => expect(getIsConnected()).toBe(true));

            // Assert: Child components should receive the exact state
            expect(getAddress()).toBe(publicKey);
            expect(getIsConnected()).toBe(true);
          } else {
            // Assert: Child components should receive disconnected state
            expect(getAddress()).toBe('null');
            expect(getIsConnected()).toBe(false);
          }

          expect(getIsInstalled()).toBe(isInstalled);

          unmount();
          jest.clearAllMocks();
          localStorageMock.clear();
        }
      ),
      { numRuns: 100 }
    );
  });

  // ==========================================================================
  // Property 9: Connection Rejection Maintains Disconnected State
  // **Validates: Requirements 1.5**
  // ==========================================================================

  it('Property 9: Connection Rejection Maintains Disconnected State', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string(), async (errorMessage) => {
        // Setup: Mock connection rejection
        (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);
        (freighterApi.requestAccess as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const { getAddress, getIsConnected, clickConnect, unmount } = renderProvider();

        await waitFor(() => expect(freighterApi.isConnected).toHaveBeenCalled());

        // Action: Attempt to connect (will be rejected)
        clickConnect();

        // Assert: State should remain disconnected
        await waitFor(() => {
          expect(getAddress()).toBe('null');
          expect(getIsConnected()).toBe(false);
        });

        unmount();
        jest.clearAllMocks();
        localStorageMock.clear();
      }),
      { numRuns: 100 }
    );
  });

  // ==========================================================================
  // Property 10: Error State Propagates to Children
  // **Validates: Requirements 8.4**
  // ==========================================================================

  it('Property 10: Error State Propagates to Children', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string({ minLength: 1 }), async (errorMessage) => {
        // Setup: Mock connection failure with error
        (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);
        (freighterApi.requestAccess as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const { getError, clickConnect, unmount } = renderProvider();

        await waitFor(() => expect(freighterApi.isConnected).toHaveBeenCalled());

        // Action: Attempt to connect (will fail)
        clickConnect();

        // Assert: Error should be accessible to children
        await waitFor(() => {
          const error = getError();
          expect(error).not.toBeNull();
          expect(error).toBe(errorMessage);
        });

        unmount();
        jest.clearAllMocks();
        localStorageMock.clear();
      }),
      { numRuns: 100 }
    );
  });
});
