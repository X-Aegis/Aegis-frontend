import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('next-intl', () => ({
  useTranslations: (namespace?: string) =>
    (key: string, params?: Record<string, unknown>) =>
      `${namespace ? namespace + '.' : ''}${key}` +
      (params ? ` ${JSON.stringify(params)}` : ''),
}));

jest.mock('@/contexts/FreighterContext', () => ({ useFreighter: () => ({ address: null }) }));
jest.mock('@/contexts/NetworkContext', () => ({ useNetwork: () => ({ network: 'testnet' }) }));
jest.mock('@/hooks/useContractAddress', () => ({ useContractAddress: () => 'C'.padEnd(56, 'A') }));

import GovernancePage from './page';

describe('GovernancePage', () => {
  it('renders the governance heading', () => {
    render(<GovernancePage />);
    expect(screen.getByText(/governance.title/)).toBeInTheDocument();
  });

  it('does not render fabricated proposal cards without a wallet read', () => {
    render(<GovernancePage />);
    expect(screen.queryByTestId('proposal-card')).not.toBeInTheDocument();
    expect(screen.getByText(/Connect a wallet/)).toBeInTheDocument();
  });
});
