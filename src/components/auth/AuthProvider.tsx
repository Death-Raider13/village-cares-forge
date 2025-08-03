
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createRateLimiter, validatePassword, logSecurityEvent } from '@/lib/security';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Rate limiter: 5 attempts per 15 minutes
  const authRateLimiter = createRateLimiter(5, 15 * 60 * 1000);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      console.error('Error getting session:', error);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // Password strength validation
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.message);
      }

      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });
    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check rate limiting with enhanced response
    const rateLimitResult = authRateLimiter(cleanEmail);
    if (!rateLimitResult.allowed) {
      logSecurityEvent({
        type: 'auth_failure',
        email: cleanEmail,
        details: { 
          reason: 'rate_limited', 
          attempts: rateLimitResult.attempts,
          retryAfter: rateLimitResult.retryAfter 
        }
      });
      
      toast({
        title: 'Too Many Attempts',
        description: `Please wait ${rateLimitResult.retryAfter || 60} seconds before trying again.`,
        variant: 'destructive',
      });
      throw new Error('Rate limited');
    }

    // Log authentication attempt
    logSecurityEvent({
      type: 'auth_attempt',
      email: cleanEmail,
      details: { attempts: rateLimitResult.attempts }
    });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        console.error('Sign-in error:', error);
        
        // Log failed authentication
        logSecurityEvent({
          type: 'auth_failure',
          email: cleanEmail,
          details: { 
            error: error.message,
            attempts: rateLimitResult.attempts 
          }
        });
        
        let errorMessage = 'Authentication failed. Please check your credentials.';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and confirm your account.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many sign-in attempts. Please try again later';
        }
        
        toast({
          title: 'Sign-in Failed',
          description: errorMessage,
          variant: 'destructive',
        });
        throw error;
      }

      if (data.user) {
        // Log successful authentication
        logSecurityEvent({
          type: 'auth_success',
          userId: data.user.id,
          email: cleanEmail,
          details: { sessionId: data.session?.access_token.substring(0, 8) + '...' }
        });
        
        toast({
          title: 'Welcome Back!',
          description: 'You have successfully signed in.',
        });
      }
    } catch (error) {
      console.error('Unexpected error during sign-in:', error);
      
      logSecurityEvent({
        type: 'auth_failure',
        email: cleanEmail,
        details: { 
          error: 'unexpected_error',
          attempts: rateLimitResult.attempts 
        }
      });
      
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
