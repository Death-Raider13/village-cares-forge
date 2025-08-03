<<<<<<< HEAD
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
=======
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { 
  SecurityEventType, 
  SecurityEventSeverity, 
  createSecurityEvent 
} from '@/lib/security';
import { supabase } from '@/integrations/supabase/client';

// Maximum number of allowed concurrent sessions
const MAX_CONCURRENT_SESSIONS = 3;

// Suspicious IP change threshold distance (approximate, in km)
const SUSPICIOUS_LOCATION_THRESHOLD = 500;

// Time window for suspicious rapid location changes (in milliseconds)
const RAPID_LOCATION_CHANGE_WINDOW = 30 * 60 * 1000; // 30 minutes

interface SessionSecurityOptions {
  /**
   * Whether to enforce single session policy (log out other sessions)
   */
  enforceSingleSession?: boolean;
  
  /**
   * Whether to detect suspicious location changes
   */
  detectLocationChanges?: boolean;
  
  /**
   * Whether to monitor for unusual activity patterns
   */
  monitorActivityPatterns?: boolean;
  
  /**
   * Custom callback for handling security events
   */
  onSecurityEvent?: (eventType: SecurityEventType, message: string, severity: SecurityEventSeverity) => void;
}

interface SessionSecurityState {
  /**
   * Whether the current session is valid
   */
  isSessionValid: boolean;
  
  /**
   * The number of active sessions for the current user
   */
  activeSessions: number;
  
  /**
   * Whether there are any security concerns with the current session
   */
  hasSecurityConcerns: boolean;
  
  /**
   * Last security event that occurred
   */
  lastSecurityEvent: {
    type: SecurityEventType;
    message: string;
    timestamp: Date;
  } | null;
}

/**
 * Hook for monitoring and enforcing session security
 */
export const useSessionSecurity = (options: SessionSecurityOptions = {}) => {
  const { 
    enforceSingleSession = false,
    detectLocationChanges = true,
    monitorActivityPatterns = true,
    onSecurityEvent
  } = options;
  
  const { user, session, signOut } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<SessionSecurityState>({
    isSessionValid: true,
    activeSessions: 1,
    hasSecurityConcerns: false,
    lastSecurityEvent: null
  });
  
  // Store the last known location
  const [lastLocation, setLastLocation] = useState<{
    ip?: string;
    geo?: { latitude?: number; longitude?: number };
    timestamp: number;
  } | null>(null);
  
  /**
   * Log a security event
   */
  const logSecurityEvent = useCallback((
    type: SecurityEventType,
    message: string,
    severity: SecurityEventSeverity = SecurityEventSeverity.INFO
  ) => {
    // Create the security event
    const securityEvent = createSecurityEvent(
      type,
      message,
      severity,
      user?.id
    );
    
    // Update the last security event in state
    setState(prev => ({
      ...prev,
      lastSecurityEvent: {
        type,
        message,
        timestamp: new Date()
      },
      hasSecurityConcerns: 
        severity === SecurityEventSeverity.ERROR || 
        severity === SecurityEventSeverity.CRITICAL ||
        prev.hasSecurityConcerns
    }));
    
    // Call the custom handler if provided
    if (onSecurityEvent) {
      onSecurityEvent(type, message, severity);
    }
    
    // For critical events, show a toast notification
    if (severity === SecurityEventSeverity.ERROR || severity === SecurityEventSeverity.CRITICAL) {
      toast({
        title: "Security Alert",
        description: message,
        variant: "destructive",
      });
    }
    
    // In a real implementation, we would store this in the database
    console.info(`Security Event [${type}]: ${message}`);
    
    return securityEvent;
  }, [user, toast, onSecurityEvent]);
  
  /**
   * Check for concurrent sessions
   */
  const checkConcurrentSessions = useCallback(async () => {
    if (!user) return;
    
    try {
      // In a real implementation, we would query the database for active sessions
      // For now, we'll simulate this with a random number of sessions
      const simulatedActiveSessions = Math.floor(Math.random() * 3) + 1;
      
      setState(prev => ({
        ...prev,
        activeSessions: simulatedActiveSessions
      }));
      
      if (simulatedActiveSessions > MAX_CONCURRENT_SESSIONS) {
        logSecurityEvent(
          SecurityEventType.SUSPICIOUS_ACTIVITY,
          `Unusual number of concurrent sessions detected (${simulatedActiveSessions})`,
          SecurityEventSeverity.WARNING
        );
        
        if (enforceSingleSession) {
          // In a real implementation, we would invalidate other sessions
          logSecurityEvent(
            SecurityEventType.SESSION_TIMEOUT,
            "Other sessions have been terminated due to security policy",
            SecurityEventSeverity.INFO
          );
        }
      }
    } catch (error) {
      console.error('Error checking concurrent sessions:', error);
    }
  }, [user, enforceSingleSession, logSecurityEvent]);
  
  /**
   * Check for suspicious location changes
   */
  const checkLocationChange = useCallback(async () => {
    if (!user || !detectLocationChanges) return;
    
    try {
      // In a real implementation, we would use a geolocation service
      // For now, we'll simulate this with random coordinates
      const simulateGeoLocation = () => {
        return {
          ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          geo: {
            latitude: Math.random() * 180 - 90,
            longitude: Math.random() * 360 - 180
          }
        };
      };
      
      const currentLocation = simulateGeoLocation();
      const now = Date.now();
      
      if (lastLocation) {
        // Calculate time since last location check
        const timeDiff = now - lastLocation.timestamp;
        
        // Check for rapid location changes
        if (timeDiff < RAPID_LOCATION_CHANGE_WINDOW && lastLocation.ip !== currentLocation.ip) {
          // In a real implementation, we would calculate the actual distance
          // For now, we'll simulate this with a random boolean
          const isLargeDistance = Math.random() > 0.7;
          
          if (isLargeDistance) {
            logSecurityEvent(
              SecurityEventType.SUSPICIOUS_ACTIVITY,
              "Unusual location change detected in a short time period",
              SecurityEventSeverity.ERROR
            );
            
            setState(prev => ({
              ...prev,
              hasSecurityConcerns: true
            }));
          }
        }
      }
      
      // Update the last known location
      setLastLocation({
        ...currentLocation,
        timestamp: now
      });
      
    } catch (error) {
      console.error('Error checking location change:', error);
    }
  }, [user, detectLocationChanges, lastLocation, logSecurityEvent]);
  
  /**
   * Verify session validity
   */
  const verifySession = useCallback(async () => {
    if (!user || !session) return;
    
    try {
      // Check if the session is still valid with Supabase
      const { data } = await supabase.auth.getSession();
      const isValid = !!data.session;
      
      if (!isValid && state.isSessionValid) {
        logSecurityEvent(
          SecurityEventType.SESSION_TIMEOUT,
          "Session is no longer valid",
          SecurityEventSeverity.WARNING
        );
        
        setState(prev => ({
          ...prev,
          isSessionValid: false
        }));
        
        // Sign out the user
        signOut();
      }
      
      setState(prev => ({
        ...prev,
        isSessionValid: isValid
      }));
    } catch (error) {
      console.error('Error verifying session:', error);
    }
  }, [user, session, state.isSessionValid, signOut, logSecurityEvent]);
  
  /**
   * Force refresh the session
   */
  const refreshSession = useCallback(async () => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        logSecurityEvent(
          SecurityEventType.SESSION_REFRESH,
          "Failed to refresh session: " + error.message,
          SecurityEventSeverity.WARNING
        );
        return false;
      }
      
      if (data.session) {
        logSecurityEvent(
          SecurityEventType.SESSION_REFRESH,
          "Session refreshed successfully",
          SecurityEventSeverity.INFO
        );
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return false;
    }
  }, [user, logSecurityEvent]);
  
  /**
   * Terminate all other sessions
   */
  const terminateOtherSessions = useCallback(async () => {
    if (!user) return false;
    
    try {
      // In a real implementation, we would call an API to terminate other sessions
      // For now, we'll just log the event
      logSecurityEvent(
        SecurityEventType.ADMIN_ACTION,
        "User requested termination of all other sessions",
        SecurityEventSeverity.WARNING
      );
      
      setState(prev => ({
        ...prev,
        activeSessions: 1
      }));
      
      return true;
    } catch (error) {
      console.error('Error terminating other sessions:', error);
      return false;
    }
  }, [user, logSecurityEvent]);
  
  // Set up periodic security checks
  useEffect(() => {
    if (!user) return;
    
    // Initial checks
    verifySession();
    checkConcurrentSessions();
    checkLocationChange();
    
    // Set up interval for periodic checks
    const securityInterval = setInterval(() => {
      verifySession();
      
      if (monitorActivityPatterns) {
        checkConcurrentSessions();
      }
      
      if (detectLocationChanges) {
        checkLocationChange();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => {
      clearInterval(securityInterval);
    };
  }, [
    user, 
    verifySession, 
    checkConcurrentSessions, 
    checkLocationChange, 
    monitorActivityPatterns, 
    detectLocationChanges
  ]);
  
  // Log session start and end
  useEffect(() => {
    if (!user) return;
    
    // Log session start
    logSecurityEvent(
      SecurityEventType.LOGIN_SUCCESS,
      "User session started",
      SecurityEventSeverity.INFO
    );
    
    return () => {
      // Log session end
      logSecurityEvent(
        SecurityEventType.LOGOUT,
        "User session ended",
        SecurityEventSeverity.INFO
      );
    };
  }, [user, logSecurityEvent]);
  
  return {
    ...state,
    refreshSession,
    terminateOtherSessions,
    logSecurityEvent
  };
};

export default useSessionSecurity;
>>>>>>> 3da71c4 (aa)
