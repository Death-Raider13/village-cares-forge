import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { createSessionManager, logSecurityEvent } from '@/lib/security';

interface UseSessionSecurityOptions {
  enableWarnings?: boolean;
  enableAutoLogout?: boolean;
  warningTimeBeforeLogout?: number; // in milliseconds
  sessionDuration?: number; // in milliseconds
}

export const useSessionSecurity = (options: UseSessionSecurityOptions = {}) => {
  const {
    enableWarnings = true,
    enableAutoLogout = true,
    warningTimeBeforeLogout = 5 * 60 * 1000, // 5 minutes
    sessionDuration = 30 * 60 * 1000, // 30 minutes
  } = options;

  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const sessionManagerRef = useRef(createSessionManager());
  const userActivityRef = useRef<number>(Date.now());

  const handleSessionTimeout = useCallback(async () => {
    if (user) {
      logSecurityEvent({
        type: 'session_timeout',
        userId: user.id,
        email: user.email,
        details: { reason: 'automatic_timeout' }
      });

      toast({
        title: 'Session Expired',
        description: 'Your session has expired for security reasons. Please sign in again.',
        variant: 'destructive',
      });

      await signOut();
    }
  }, [user, signOut, toast]);

  const handleSessionWarning = useCallback(() => {
    if (user && enableWarnings) {
      toast({
        title: 'Session Expiring Soon',
        description: `Your session will expire in ${Math.ceil(warningTimeBeforeLogout / 1000 / 60)} minutes. Move your mouse or click anywhere to stay signed in.`,
        duration: 10000,
      });
    }
  }, [user, enableWarnings, warningTimeBeforeLogout, toast]);

  const resetSession = useCallback(() => {
    if (user && enableAutoLogout) {
      userActivityRef.current = Date.now();
      sessionManagerRef.current.resetTimers(handleSessionWarning, handleSessionTimeout);
    }
  }, [user, enableAutoLogout, handleSessionWarning, handleSessionTimeout]);

  // Activity listeners
  useEffect(() => {
    if (!user || !enableAutoLogout) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleUserActivity = () => {
      const now = Date.now();
      // Only reset if it's been more than 1 minute since last activity to prevent excessive resets
      if (now - userActivityRef.current > 60000) {
        resetSession();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Initial session setup
    resetSession();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
      sessionManagerRef.current.clearTimers();
    };
  }, [user, enableAutoLogout, resetSession]);

  // Cleanup on user logout
  useEffect(() => {
    if (!user) {
      sessionManagerRef.current.clearTimers();
    }
  }, [user]);

  return {
    resetSession,
    isSessionActive: !!user,
    lastActivity: userActivityRef.current,
  };
};