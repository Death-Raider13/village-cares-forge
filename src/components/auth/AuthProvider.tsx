import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<{ error?: string }>;
  checkEmailVerification: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { checkIfAdminEmail } = useAdminAuth();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle email verification success
        if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Check if user just got verified
          const { data } = await supabase.auth.getUser();
          if (data.user?.email_confirmed_at) {
            setUser(data.user);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Check if this is an admin email
      if (checkIfAdminEmail(email)) {
        // Redirect to admin login page instead of regular auth
        router.push('/admin-login');
        return { error: 'Please use the admin login page for admin access.' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if email is verified
      if (data.user && !data.user.email_confirmed_at) {
        // Redirect to email verification page
        router.push('/verify-email');
        return { error: 'Please verify your email before signing in.' };
      }

      // Explicitly update user state
      if (data.user) {
        setUser(data.user);
        router.replace('/');
      }

      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // Prevent admin emails from signing up through regular flow
      if (checkIfAdminEmail(email)) {
        return { error: 'Admin accounts cannot be created through regular signup.' };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/verification-success`
        }
      });

      if (error) throw error;

      if (data.user) {
        // Check if email confirmation is required
        if (!data.user.email_confirmed_at) {
          // Redirect to email verification page
          router.push('/verify-email');
          return { error: 'Please check your email to verify your account before signing in.' };
        } else {
          // Email is already confirmed (instant confirmation)
          setUser(data.user);
          router.replace('/');
        }
      }

      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/verification-success`
        }
      });

      if (error) throw error;

      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const checkEmailVerification = async (): Promise<boolean> => {
    try {
      const { data } = await supabase.auth.getUser();
      return !!data.user?.email_confirmed_at;
    } catch (error) {
      return false;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resendVerificationEmail,
    checkEmailVerification,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};