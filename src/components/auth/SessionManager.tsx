<<<<<<< HEAD
import React, { useEffect } from 'react';
import { useSessionSecurity } from '@/hooks/useSessionSecurity';
=======
import React, { useEffect, useState, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { useAuth } from './AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;
// Warning before timeout in milliseconds (5 minutes before timeout)
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000;
// Refresh token threshold in milliseconds (10 minutes)
const REFRESH_THRESHOLD = 10 * 60 * 1000;
>>>>>>> 5b4c829 (changes)

interface SessionManagerProps {
  children: React.ReactNode;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
<<<<<<< HEAD
  // Initialize session security with default settings
  useSessionSecurity({
    enableWarnings: true,
    enableAutoLogout: true,
    warningTimeBeforeLogout: 5 * 60 * 1000, // 5 minutes warning
    sessionDuration: 30 * 60 * 1000, // 30 minutes total
  });

  return <>{children}</>;
};
=======
  const { session, user, signOut } = useAuth();
  const { toast } = useToast();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [warningShown, setWarningShown] = useState<boolean>(false);

  // Update last activity timestamp on user interaction
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
    setWarningShown(false);
  }, []);

  // Check session expiry and show warning
  const checkSessionExpiry = useCallback(() => {
    if (!session || !user) return;

    const inactiveTime = Date.now() - lastActivity;

    // If inactive for too long, log out
    if (inactiveTime >= SESSION_TIMEOUT) {
      signOut();
      toast({
        title: "Session expired",
        description: "You have been logged out due to inactivity.",
        variant: "destructive",
      });
      return;
    }

    // Show warning before timeout
    if (inactiveTime >= SESSION_TIMEOUT - WARNING_BEFORE_TIMEOUT && !warningShown) {
      toast({
        title: "Session expiring soon",
        description: "Your session will expire in 5 minutes due to inactivity.",
        variant: "default",
        duration: 10000,
        action: (
          <button
            onClick={updateActivity}
            className="bg-vintage-deep-blue text-white px-3 py-1 rounded-md text-xs"
          >
            Keep Session Active
          </button>
        ),
      });
      setWarningShown(true);
    }
  }, [session, user, lastActivity, warningShown, signOut, toast, updateActivity]);

  // Refresh session token if needed
  const refreshSessionIfNeeded = useCallback(async () => {
    if (!session) return;

    const expiresAt = session.expires_at;
    if (!expiresAt) return;

    const expiresAtMs = expiresAt * 1000; // Convert to milliseconds
    const timeUntilExpiry = expiresAtMs - Date.now();

    // If token expires soon, refresh it
    if (timeUntilExpiry < REFRESH_THRESHOLD) {
      try {
        const { data, error } = await supabase.auth.refreshSession();
        if (error) throw error;

        // Log refresh for security auditing
        console.info('Session token refreshed successfully');
      } catch (error) {
        console.error('Failed to refresh session:', error);
        // If refresh fails, we'll let the normal expiry process handle it
      }
    }
  }, [session]);

  // Set up event listeners for user activity
  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];

    // Throttled event handler to prevent excessive updates
    let timeout: NodeJS.Timeout | null = null;
    const throttledUpdateActivity = () => {
      if (timeout) return;
      timeout = setTimeout(() => {
        updateActivity();
        timeout = null;
      }, 1000); // Throttle to once per second
    };

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, throttledUpdateActivity);
    });

    // Clean up event listeners
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, throttledUpdateActivity);
      });
      if (timeout) clearTimeout(timeout);
    };
  }, [user, updateActivity]);

  // Set up interval to check session expiry and refresh token
  useEffect(() => {
    if (!user) return;

    // Check every minute
    const interval = setInterval(() => {
      checkSessionExpiry();
      refreshSessionIfNeeded();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [user, checkSessionExpiry, refreshSessionIfNeeded]);

  // Log security-relevant session events
  useEffect(() => {
    if (!session || !user) return;

    // Log session start
    console.info(`Session started for user: ${user.id}`);

    return () => {
      // Log session end
      console.info(`Session ended for user: ${user.id}`);
    };
  }, [session, user]);

  // Detect suspicious session changes
  useEffect(() => {
    if (!user) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // When tab becomes visible again, verify session is still valid
        supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
          if (!currentSession && session) {
            // Session was invalidated while tab was hidden
            toast({
              title: "Session changed",
              description: "Your session appears to have changed. Please sign in again.",
              variant: "destructive",
            });
            signOut();
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, session, signOut, toast]);

  return <>{children}</>;
};

export default SessionManager;
>>>>>>> 5b4c829 (changes)
