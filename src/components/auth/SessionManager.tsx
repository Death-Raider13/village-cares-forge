import React, { useEffect } from 'react';
import { useSessionSecurity } from '@/hooks/useSessionSecurity';

interface SessionManagerProps {
  children: React.ReactNode;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
  // Initialize session security with default settings
  useSessionSecurity({
    enableWarnings: true,
    enableAutoLogout: true,
    warningTimeBeforeLogout: 5 * 60 * 1000, // 5 minutes warning
    sessionDuration: 30 * 60 * 1000, // 30 minutes total
  });

  return <>{children}</>;
};