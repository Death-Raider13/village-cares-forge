import React from 'react';
import { useSessionSecurity } from '@/hooks/useSessionSecurity';

/**
 * SessionManager component provides automatic session timeout and security monitoring
 * Phase 4: Security Infrastructure
 */
export const SessionManager: React.FC = () => {
  // Initialize session security with default settings
  useSessionSecurity({
    enableWarnings: true,
    enableAutoLogout: true,
    warningTimeBeforeLogout: 5 * 60 * 1000, // 5 minutes warning
    sessionDuration: 30 * 60 * 1000, // 30 minutes session
  });

  // This component doesn't render anything visible
  return null;
};