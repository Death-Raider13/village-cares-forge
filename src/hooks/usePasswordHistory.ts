import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface PasswordHistoryEntry {
  id: string;
  user_id: string;
  password_hash: string;
  created_at: string;
}

const HISTORY_LIMIT = 5; // Number of previous passwords to remember

export const usePasswordHistory = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Simple hash function for client-side password checking
  const simpleHash = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + user?.id);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const checkPasswordHistory = useCallback(async (newPassword: string): Promise<boolean> => {
    if (!user) return true;

    try {
      setLoading(true);
      
      // Get stored password hashes from localStorage (in production, use database)
      const storedHashes = JSON.parse(
        localStorage.getItem(`password_history_${user.id}`) || '[]'
      );

      const newPasswordHash = await simpleHash(newPassword);
      
      const isReused = storedHashes.some((entry: { hash: string }) => 
        entry.hash === newPasswordHash
      );

      if (isReused) {
        toast({
          title: 'Password Previously Used',
          description: `You cannot reuse any of your last ${HISTORY_LIMIT} passwords. Please choose a different password.`,
          variant: 'destructive',
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking password history:', error);
      return true; // Allow password change if check fails
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const addToPasswordHistory = useCallback(async (password: string): Promise<void> => {
    if (!user) return;

    try {
      const passwordHash = await simpleHash(password);
      
      // Get existing history
      const existingHistory = JSON.parse(
        localStorage.getItem(`password_history_${user.id}`) || '[]'
      );

      // Add new password hash
      const newEntry = {
        hash: passwordHash,
        timestamp: new Date().toISOString(),
      };

      const updatedHistory = [newEntry, ...existingHistory].slice(0, HISTORY_LIMIT);
      
      // Store updated history
      localStorage.setItem(
        `password_history_${user.id}`,
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error('Error updating password history:', error);
    }
  }, [user]);

  const clearPasswordHistory = useCallback(() => {
    if (!user) return;
    localStorage.removeItem(`password_history_${user.id}`);
  }, [user]);

  return {
    checkPasswordHistory,
    addToPasswordHistory,
    clearPasswordHistory,
    loading,
  };
};