import { useState, useCallback } from 'react';

interface PasswordHistoryEntry {
  hashedPassword: string;
  timestamp: Date;
}

const MAX_PASSWORD_HISTORY = 5; // Store last 5 passwords

/**
 * Hook for managing password history to prevent reuse
 * Phase 2 security enhancement
 */
export const usePasswordHistory = (userId?: string) => {
  const [isChecking, setIsChecking] = useState(false);

  const getStorageKey = useCallback((id: string) => `password_history_${id}`, []);

  const getPasswordHistory = useCallback((id: string): PasswordHistoryEntry[] => {
    try {
      const stored = localStorage.getItem(getStorageKey(id));
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, [getStorageKey]);

  const savePasswordHistory = useCallback((id: string, history: PasswordHistoryEntry[]) => {
    try {
      localStorage.setItem(getStorageKey(id), JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save password history:', error);
    }
  }, [getStorageKey]);

  // Simple hash function for client-side password checking
  const simpleHash = useCallback((password: string): string => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }, []);

  const isPasswordReused = useCallback(async (password: string, id: string): Promise<boolean> => {
    if (!id || !password) return false;

    setIsChecking(true);
    try {
      const history = getPasswordHistory(id);
      const hashedPassword = simpleHash(password);
      
      const isReused = history.some(entry => entry.hashedPassword === hashedPassword);
      return isReused;
    } catch (error) {
      console.error('Error checking password history:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [getPasswordHistory, simpleHash]);

  const addPasswordToHistory = useCallback((password: string, id: string) => {
    if (!id || !password) return;

    try {
      const history = getPasswordHistory(id);
      const hashedPassword = simpleHash(password);
      
      const newEntry: PasswordHistoryEntry = {
        hashedPassword,
        timestamp: new Date()
      };

      // Add new password and keep only the last MAX_PASSWORD_HISTORY entries
      const updatedHistory = [newEntry, ...history].slice(0, MAX_PASSWORD_HISTORY);
      savePasswordHistory(id, updatedHistory);
    } catch (error) {
      console.error('Error adding password to history:', error);
    }
  }, [getPasswordHistory, simpleHash, savePasswordHistory]);

  const clearPasswordHistory = useCallback((id: string) => {
    if (!id) return;
    
    try {
      localStorage.removeItem(getStorageKey(id));
    } catch (error) {
      console.error('Error clearing password history:', error);
    }
  }, [getStorageKey]);

  return {
    isPasswordReused,
    addPasswordToHistory,
    clearPasswordHistory,
    isChecking
  };
};
