import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FreighterProvider, useFreighter } from './FreighterContext';
import * as freighterApi from '@stellar/freighter-api';

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
// Test Helpers
// ============================================================================

const STORAGE_KEY = 'freighter_wallet_address';
const MOCK_PUBLIC_KEY = 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const MOCK_PUBLIC_KEY_2 = 'GYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY';

// Test component that uses the hook
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

// ============================================================================
// Tests
// ============================================================================

describe('FreighterContext', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Reset console.error mock
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ==========================================================================
  // 8.2: Provider renders children correctly
  // ==========================================================================
  
  describe('Provider rendering', () => {
    it('should render children correctly', () => {
      (freighterApi.isConnected as jest.Mock).mockResolvedValue(false);

      render(
        <FreighterProvider>
          <div data-testid="test-child">Test Child</div>
        </FreighterProvider>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByTestId('test-child')).toHaveTextContent('Test Child');
    });
  });

  // ==========================================================================
  // 8.3: Hook throws error outside provider
  // ==========================================================================
  
  describe('useFreighter hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useFreighter must be used within a FreighterProvider');

      consoleError.mockRestore();
    });
  });

  // ==========================================================================
  // 8.4: Connect function calls Freighter API
  // ==========================================================================
  
  describe('Connect function', () => {
    it('should call Freighter API and update state on successful connection', async () => {
      (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);
      (freighterApi.requestAccess as jest.Mock).mockResolvedValue(undefined);
      (freighterApi.getPublicKey as jest.Mock).mockResolvedValue(MOCK_PUBLIC_KEY);

      render(
        <FreighterProvider>
          <TestComponent />
        </FreighterProvider>
      );

      // Wait for initialization
      await waitFor(() => {
        expect(screen.getByTestId('isInstalled')).toHaveTextContent('true');
      });

      // Click connect button
      const connectButton = screen.getByTestId('connect-button');
      act(() => {
        connectButton.click();
      });

      // Wait for connection to complete
      await waitFor(() => {
        expect(screen.getByTestId('address')).toHaveTextContent(MOCK_PUBLIC_KEY);
      });

      // Verify API calls
      expect(freighterApi.isConnected).toHaveBeenCalled();
      expect(freighterApi.requestAccess).toHaveBeenCalled();
      expect(freighterApi.getPublicKey).toHaveBeenCalled();

      // Verify state updates
      expect(screen.getByTestId('address')).toHaveTextContent(MOCK_PUBLIC_KEY);
      expect(screen.getByTestId('isConnected')).toHaveTextContent('true');
      expect(screen.getByTestId('error')).toHaveTextContent('null');

      // Verify localStorage
      expect(localStorageMock.getItem(STORAGE_KEY)).toBe(MOCK_PUBLIC_KEY);
    });
  });

  // ==========================================================================
  // 8.5: Connect handles Freighter not installed
  // ==========================================================================
  
  describe('Connect error handling - not installed', () => {
    it('should set error when Freighter is not installed', async () => {
      (freighterApi.isConnected as jest.Mock).mockResolvedValue(false);

      render(
        <FreighterProvider>
          <TestComponent />
        </FreighterProvider>
      );

      // Wait for initialization
      await waitFor(() => {
        expect(screen.getByTestId('isInstalled')).toHaveTextContent('false');
      });

      // Click connect button
      const connectButton = screen.getByTestId('connect-button');
      act(() => {
        connectButton.click();
      });

      // Wait for error to be set
      await waitFor(() => {
        expect(screen.getByTestId('error')).not.toHaveTextContent('null');
      });

      // Verify error message
      expect(screen.getByTestId('error')).toHaveTextContent(
        'Freighter wallet extension is not installed'
      );

      // Verify state remains disconnected
      expect(screen.getByTestId('address')).toHaveTextContent('null');
      expect(screen.getByTestId('isConnected')).toHaveTextContent('false');
    });
  });

  // ==========================================================================
  // 8.6: Connect handles user rejection
  // ==========================================================================
  
  describe('Connect error handling - user rejection', () => {
    it('should set error when user rejects connection', async () => {
      (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);
      (freighterApi.requestAccess as jest.Mock).mockRejectedValue(
        new Error('User rejected the request')
      );

      render(
        <FreighterProvider>
          <TestComponent />
        </FreighterProvider>
      );

      // Wait for initialization
      await waitFor(() => {
        expect(screen.getByTestId('isInstalled')).toHaveTextContent('true');
      });

      // Click connect button
      const connectButton = screen.getByTestId('connect-button');
      act(() => {
        connectButton.click();
      });

      // Wait for error to be set
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('User rejected the request');
      });

      // Verify state remains disconnected
      expect(screen.getByTestId('address')).toHaveTextContent('null');
      expect(screen.getByTestId('isConnected')).toHaveTextContent('false');
    });
  });

  // ==========================================================================
  // 8.7: Disconnect clears state and storage
  // ==========================================================================
  
  describe('Disconnect function', () => {
    it('should clear state and localStorage on disconnect', async () => {
      (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);
      (freighterApi.requestAccess as jest.Mock).mockResolvedValue(undefined);
      (freighterApi.getPublicKey as jest.Mock).mockResolvedValue(MOCK_PUBLIC_KEY);

      render(
        <FreighterProvider>
          <TestComponent />
        </FreighterProvider>
      );

      // Wait for initialization
      await waitFor(() => {
        expect(screen.getByTestId('isInstalled')).toHaveTextContent('true');
      });

      // Connect first
      const connectButton = screen.getByTestId('connect-button');
      act(() => {
        connectButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('isConnected')).toHaveTextContent('true');
      });

      // Verify connected state
      expect(screen.getByTestId('address')).toHaveTextContent(MOCK_PUBLIC_KEY);
      expect(localStorageMock.getItem(STORAGE_KEY)).toBe(MOCK_PUBLIC_KEY);

      // Now disconnect
      const disconnectButton = screen.getByTestId('disconnect-button');
      act(() => {
        disconnectButton.click();
      });

      // Verify state is cleared
      await waitFor(() => {
        expect(screen.getByTestId('address')).toHaveTextContent('null');
      });
      expect(screen.getByTestId('isConnected')).toHaveTextContent('false');
      expect(screen.getByTestId('error')).toHaveTextContent('null');

      // Verify localStorage is cleared
      expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  // ==========================================================================
  // 8.8: Initialization restores valid connection
  // ==========================================================================
  
  describe('Initialization - restore valid connection', () => {
    it('should restore connection from localStorage when valid', async () => {
      // Set up localStorage with stored address
      localStorageMock.setItem(STORAGE_KEY, MOCK_PUBLIC_KEY);

      // Mock Freighter API to confirm the connection
      (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);
      (freighterApi.getPublicKey as jest.Mock).mockResolvedValue(MOCK_PUBLIC_KEY);

      render(
        <FreighterProvider>
          <TestComponent />
        </FreighterProvider>
      );

      // Wait for initialization to complete
      await waitFor(() => {
        expect(screen.getByTestId('address')).toHaveTextContent(MOCK_PUBLIC_KEY);
      });

      // Verify state is restored
      expect(screen.getByTestId('isConnected')).toHaveTextContent('true');
      expect(screen.getByTestId('isInstalled')).toHaveTextContent('true');
    });
  });

  // ==========================================================================
  // 8.9: Initialization clears invalid connection
  // ==========================================================================
  
  describe('Initialization - clear invalid connection', () => {
    it('should clear localStorage when stored address does not match', async () => {
      // Set up localStorage with stored address
      localStorageMock.setItem(STORAGE_KEY, MOCK_PUBLIC_KEY);

      // Mock Freighter API to return different key
      (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);
      (freighterApi.getPublicKey as jest.Mock).mockResolvedValue(MOCK_PUBLIC_KEY_2);

      render(
        <FreighterProvider>
          <TestComponent />
        </FreighterProvider>
      );

      // Wait for initialization to complete
      await waitFor(() => {
        expect(screen.getByTestId('isInstalled')).toHaveTextContent('true');
      });

      // Verify state remains disconnected
      expect(screen.getByTestId('address')).toHaveTextContent('null');
      expect(screen.getByTestId('isConnected')).toHaveTextContent('false');

      // Verify localStorage is cleared
      expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should clear localStorage when verification fails', async () => {
      // Set up localStorage with stored address
      localStorageMock.setItem(STORAGE_KEY, MOCK_PUBLIC_KEY);

      // Mock Freighter API to throw error
      (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);
      (freighterApi.getPublicKey as jest.Mock).mockRejectedValue(
        new Error('Verification failed')
      );

      render(
        <FreighterProvider>
          <TestComponent />
        </FreighterProvider>
      );

      // Wait for initialization to complete
      await waitFor(() => {
        expect(screen.getByTestId('isInstalled')).toHaveTextContent('true');
      });

      // Verify state remains disconnected
      expect(screen.getByTestId('address')).toHaveTextContent('null');
      expect(screen.getByTestId('isConnected')).toHaveTextContent('false');

      // Verify localStorage is cleared
      expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();

      // Verify error was logged
      expect(console.error).toHaveBeenCalledWith(
        'Verification error:',
        expect.any(Error)
      );
    });
  });

  // ==========================================================================
  // 8.10: Installation status is detected
  // ==========================================================================
  
  describe('Installation detection', () => {
    it('should detect when Freighter is installed', async () => {
      (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);

      render(
        <FreighterProvider>
          <TestComponent />
        </FreighterProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isInstalled')).toHaveTextContent('true');
      });
    });

    it('should detect when Freighter is not installed', async () => {
      (freighterApi.isConnected as jest.Mock).mockResolvedValue(false);

      render(
        <FreighterProvider>
          <TestComponent />
        </FreighterProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isInstalled')).toHaveTextContent('false');
      });
    });
  });

  // ==========================================================================
  // 8.11: Loading states transition correctly
  // ==========================================================================
  
  describe('Loading states', () => {
    it('should set isLoading to true during connection and false after', async () => {
      (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);
      (freighterApi.requestAccess as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );
      (freighterApi.getPublicKey as jest.Mock).mockResolvedValue(MOCK_PUBLIC_KEY);

      render(
        <FreighterProvider>
          <TestComponent />
        </FreighterProvider>
      );

      // Wait for initialization
      await waitFor(() => {
        expect(screen.getByTestId('isInstalled')).toHaveTextContent('true');
      });

      // Initial state should not be loading
      expect(screen.getByTestId('isLoading')).toHaveTextContent('false');

      // Click connect button
      const connectButton = screen.getByTestId('connect-button');
      act(() => {
        connectButton.click();
      });

      // Should be loading immediately after click
      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('true');
      });

      // Should not be loading after connection completes
      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      }, { timeout: 3000 });

      // Verify connection succeeded
      expect(screen.getByTestId('isConnected')).toHaveTextContent('true');
    });

    it('should set isLoading to false even when connection fails', async () => {
      (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);
      (freighterApi.requestAccess as jest.Mock).mockRejectedValue(
        new Error('Connection failed')
      );

      render(
        <FreighterProvider>
          <TestComponent />
        </FreighterProvider>
      );

      // Wait for initialization
      await waitFor(() => {
        expect(screen.getByTestId('isInstalled')).toHaveTextContent('true');
      });

      // Click connect button
      const connectButton = screen.getByTestId('connect-button');
      act(() => {
        connectButton.click();
      });

      // Wait for error
      await waitFor(() => {
        expect(screen.getByTestId('error')).not.toHaveTextContent('null');
      });

      // Should not be loading after error
      expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
    });
  });

  // ==========================================================================
  // 8.12: Error state is accessible to children
  // ==========================================================================
  
  describe('Error state propagation', () => {
    it('should propagate error state to children components', async () => {
      (freighterApi.isConnected as jest.Mock).mockResolvedValue(false);

      render(
        <FreighterProvider>
          <TestComponent />
        </FreighterProvider>
      );

      // Wait for initialization
      await waitFor(() => {
        expect(screen.getByTestId('isInstalled')).toHaveTextContent('false');
      });

      // Trigger an error by trying to connect without Freighter
      const connectButton = screen.getByTestId('connect-button');
      act(() => {
        connectButton.click();
      });

      // Wait for error to propagate
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(
          'Freighter wallet extension is not installed'
        );
      });

      // Verify the error is accessible through the hook
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    it('should clear error on successful connection', async () => {
      (freighterApi.isConnected as jest.Mock).mockResolvedValue(true);
      (freighterApi.requestAccess as jest.Mock)
        .mockRejectedValueOnce(new Error('First attempt failed'))
        .mockResolvedValueOnce(undefined);
      (freighterApi.getPublicKey as jest.Mock).mockResolvedValue(MOCK_PUBLIC_KEY);

      render(
        <FreighterProvider>
          <TestComponent />
        </FreighterProvider>
      );

      // Wait for initialization
      await waitFor(() => {
        expect(screen.getByTestId('isInstalled')).toHaveTextContent('true');
      });

      const connectButton = screen.getByTestId('connect-button');

      // First attempt - should fail
      act(() => {
        connectButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('First attempt failed');
      });

      // Second attempt - should succeed and clear error
      act(() => {
        connectButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('isConnected')).toHaveTextContent('true');
      });

      // Error should be cleared
      expect(screen.getByTestId('error')).toHaveTextContent('null');
    });
  });
});
