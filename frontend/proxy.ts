import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import {routing} from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    connect-src 'self' https://horizon.stellar.org https://horizon-testnet.stellar.org https://api.coingecko.com https://open.er-api.com;
  `;

  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  request.headers.set('x-nonce', nonce);
  request.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  const response = intlMiddleware(request);

  if (response) {
    response.headers.set(
      'Content-Security-Policy',
      contentSecurityPolicyHeaderValue
    );
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.svg|logo.png|manifest.json|sw.js|workbox-.*|icons/).*)']
};
