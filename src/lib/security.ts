// Security utilities for input validation, sanitization, and audit logging

/**
 * Security event types for audit logging
 */
export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_COMPLETE = 'PASSWORD_RESET_COMPLETE',
  ACCOUNT_CREATION = 'ACCOUNT_CREATION',
  ACCOUNT_UPDATE = 'ACCOUNT_UPDATE',
  ACCOUNT_DELETION = 'ACCOUNT_DELETION',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  SESSION_TIMEOUT = 'SESSION_TIMEOUT',
  SESSION_REFRESH = 'SESSION_REFRESH',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  ADMIN_ACTION = 'ADMIN_ACTION',
}

/**
 * Security event severity levels
 */
export enum SecurityEventSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

/**
 * Security event interface for audit logging
 */
export interface SecurityEvent {
  id: any;
  type: SecurityEventType;
  severity: SecurityEventSeverity;
  timestamp: Date;
  userId?: string;
  username?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  message: string;
  email?: string;
  ip?: string;
}

/**
 * Creates a new security event for audit logging
 * @param type The type of security event
 * @param message A description of the security event
 * @param severity The severity of the security event
 * @param userId The ID of the user associated with the event
 * @param details Additional details about the security event
 * @returns A new security event
 */
export const createSecurityEvent = (
  type: SecurityEventType,
  message: string,
  severity: SecurityEventSeverity = SecurityEventSeverity.INFO,
  userId?: string,
  details?: Record<string, unknown>
): SecurityEvent => ({
  type,
  severity,
  timestamp: new Date(),
  userId,
  message,
  details,
  id: undefined
});

/**
 * Validates a password against security requirements
 * 
 * @param password The password to validate
 * @returns An object with isValid flag and error message if invalid
 */
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter'
    };
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }

  if (!/(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }

  return { isValid: true };
};

/**
 * Sanitizes user input by removing potentially dangerous HTML tags and characters
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Validates password strength
 */
export const validatePasswordStrength = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Additional security checks
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters long');
  }

  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain more than 2 consecutive identical characters');
  }

  // Check for common patterns
  const commonPatterns = [
    /123+|abc+|qwe+/i,
    /password|admin|user|login/i,
    /^[0-9]+$/,
    /^[a-zA-Z]+$/
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    errors.push('Password cannot contain common patterns or be purely numeric/alphabetic');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Rate limiting helper (client-side basic implementation)
 */
export const createRateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts = new Map<string, { count: number; resetTime: number; lastAttempt: number }>();

  return (key: string): { allowed: boolean; retryAfter?: number; attempts: number } => {
    const now = Date.now();
    const userAttempts = attempts.get(key);

    if (!userAttempts || now > userAttempts.resetTime) {
      attempts.set(key, { count: 1, resetTime: now + windowMs, lastAttempt: now });
      return { allowed: true, attempts: 1 };
    }

    if (userAttempts.count >= maxAttempts) {
      // Progressive delay based on attempt count
      const baseDelay = 1000; // 1 second
      const progressiveDelay = Math.min(baseDelay * Math.pow(2, userAttempts.count - maxAttempts), 300000); // Max 5 minutes
      const retryAfter = Math.max(0, userAttempts.resetTime - now + progressiveDelay);
      
      return { 
        allowed: false, 
        retryAfter: Math.ceil(retryAfter / 1000),
        attempts: userAttempts.count 
      };
    }

    userAttempts.count++;
    userAttempts.lastAttempt = now;
    return { allowed: true, attempts: userAttempts.count };
  };
};

/**
 * Logs a security event to the browser's local storage, up to a maximum of 100 events.
 * The logged event will include the current timestamp.
 * @param {Object} event - The security event to log. Must contain the following properties:
 *   - type: The type of security event (e.g. 'auth_attempt', 'auth_success', 'auth_failure', etc.)
 *   - userId: The ID of the user associated with the event (optional)
 *   - email: The email address of the user associated with the event (optional)
 *   - ip: The IP address of the user associated with the event (optional)
 *   - userAgent: The user agent string of the user associated with the event (optional)
 *   - details: Additional details about the event (optional)
 */
export const logSecurityEvent = ({ type, userId, email, ip, userAgent, details }: Omit<SecurityEvent, 'timestamp' | 'severity' | 'message' | 'id'>): void => {
  const securityEvent: SecurityEvent = {
    type,
    userId,
    email,
    ip,
    userAgent,
    details,
    timestamp: new Date(),
    id: undefined,
    severity: SecurityEventSeverity.INFO,
    message: ""
  };

  try {
    const storedEvents = getStoredSecurityEvents();
    const events = [securityEvent, ...storedEvents.slice(0, 99)];
    localStorage.setItem('security_events', JSON.stringify(events));
  } catch (error) {
    console.error('Error logging security event:', error);
  }
};

export const getStoredSecurityEvents = (): SecurityEvent[] => {
  try {
    const stored = localStorage.getItem('security_events');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Session security utilities
 */
export const SESSION_TIMEOUT_WARNING = 5 * 60 * 1000; // 5 minutes
export const SESSION_TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes

export const createSessionManager = () => {
  let timeoutId: NodeJS.Timeout | null = null;
  let warningId: NodeJS.Timeout | null = null;
  
  const resetTimers = (onWarning: () => void, onTimeout: () => void) => {
    if (timeoutId) clearTimeout(timeoutId);
    if (warningId) clearTimeout(warningId);
    
    warningId = setTimeout(onWarning, SESSION_TIMEOUT_DURATION - SESSION_TIMEOUT_WARNING);
    timeoutId = setTimeout(onTimeout, SESSION_TIMEOUT_DURATION);
  };
  
  const clearTimers = () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (warningId) clearTimeout(warningId);
  };
  
  return { resetTimers, clearTimers };
};