import React from 'react';
import type { AppProps } from 'next/app';
import '../src/index.css';
import '../src/theme.css';
import { ErrorBoundary } from '../src/components/ui/error-boundary';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { SearchProvider } from '../src/contexts/SearchContext';
import { NotificationsProvider } from '../src/contexts/NotificationsContext';
import { AuthProvider } from '../src/components/auth/AuthProvider';
import { Toaster } from '../src/components/ui/toaster';
import { SessionManager } from '../src/components/auth/SessionManager';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <NotificationsProvider>
            <SearchProvider>
              <div className="min-h-screen bg-vintage-warm-cream">
                <Component {...pageProps} />
                <SessionManager />
                <Toaster />
              </div>
            </SearchProvider>
          </NotificationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default MyApp;