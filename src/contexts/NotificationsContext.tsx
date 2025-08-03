import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  createdAt: string;
  read: boolean;
  userId?: string;
  isGlobal?: boolean;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showNotificationCenter: boolean;
  toggleNotificationCenter: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

interface NotificationsProviderProps {
  children: React.ReactNode;
}

// Local storage key for notifications (fallback when Supabase table is not available)
const STORAGE_KEY = 'andrew-cares-notifications';

// Flag to indicate if we should use Supabase for notifications
// Set to false for now until the notifications table is created in Supabase
const USE_SUPABASE = false;

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const realtimeChannel = useRef<RealtimeChannel | null>(null);

  // Load notifications on mount
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      setIsLoading(true);

      if (USE_SUPABASE) {
        try {
          // Fetch user-specific and global notifications from Supabase
          // Note: This requires a 'notifications' table to be created in Supabase
          // with columns: id, title, message, type, link, created_at, read, user_id, is_global
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .or(`user_id.eq.${user.id},is_global.eq.true`)
            .order('created_at', { ascending: false });

          if (error) throw error;

          // Transform Supabase data to match our Notification interface
          const formattedNotifications = data.map((notification: any) => ({
            id: notification.id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            link: notification.link,
            createdAt: notification.created_at,
            read: notification.read,
            userId: notification.user_id,
            isGlobal: notification.is_global
          }));

          setNotifications(formattedNotifications);
        } catch (error) {
          console.error('Error fetching notifications from Supabase:', error);
          // Fall back to localStorage if Supabase fails
          loadFromLocalStorage();
        } finally {
          setIsLoading(false);
        }
      } else {
        // Use localStorage as fallback
        loadFromLocalStorage();
        setIsLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
      const storedNotifications = localStorage.getItem(`${STORAGE_KEY}-${user.id}`);
      if (storedNotifications) {
        try {
          const parsedNotifications = JSON.parse(storedNotifications);
          setNotifications(parsedNotifications);
        } catch (error) {
          console.error('Error parsing stored notifications:', error);
          setNotifications([]);
        }
      }
    };

    fetchNotifications();
  }, [user]);

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user || !USE_SUPABASE) return;

    // Subscribe to notifications channel
    const setupRealtimeSubscription = async () => {
      // Subscribe to notifications for this user and global notifications
      realtimeChannel.current = supabase
        .channel('notifications')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          // Handle new notification for this user
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);

          // Show toast for new notification
          toast({
            title: newNotification.title,
            description: newNotification.message,
            variant: newNotification.type === 'error' ? 'destructive' : 'default',
          });
        })
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: 'is_global=eq.true',
        }, (payload) => {
          // Handle new global notification
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);

          // Show toast for new notification
          toast({
            title: newNotification.title,
            description: newNotification.message,
            variant: newNotification.type === 'error' ? 'destructive' : 'default',
          });
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
        }, (payload) => {
          // Handle updated notification (e.g., marked as read)
          const updatedNotification = payload.new as Notification;
          setNotifications(prev =>
            prev.map(notification =>
              notification.id === updatedNotification.id ? updatedNotification : notification
            )
          );
        })
        .on('postgres_changes', {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
        }, (payload) => {
          // Handle deleted notification
          const deletedNotification = payload.old as Notification;
          setNotifications(prev =>
            prev.filter(notification => notification.id !== deletedNotification.id)
          );
        })
        .subscribe();
    };

    setupRealtimeSubscription();

    // Clean up subscription on unmount
    return () => {
      if (realtimeChannel.current) {
        supabase.removeChannel(realtimeChannel.current);
      }
    };
  }, [user, toast]);

  // Save notifications to localStorage as fallback
  useEffect(() => {
    if (user && notifications.length > 0 && !USE_SUPABASE) {
      localStorage.setItem(`${STORAGE_KEY}-${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  // Add a new notification
  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      read: false,
      userId: user?.id,
    };

    if (USE_SUPABASE && user) {
      try {
        // Add notification to Supabase
        const { error } = await supabase
          .from('notifications')
          .insert({
            id: newNotification.id,
            title: newNotification.title,
            message: newNotification.message,
            type: newNotification.type,
            link: newNotification.link,
            created_at: newNotification.createdAt,
            read: newNotification.read,
            user_id: user.id,
            is_global: notification.isGlobal || false,
          });

        if (error) throw error;

        // The notification will be added via the real-time subscription
      } catch (error) {
        console.error('Error adding notification to Supabase:', error);
        // Fall back to local state if Supabase fails
        setNotifications(prev => [newNotification, ...prev]);
      }
    } else {
      // Use local state
      setNotifications(prev => [newNotification, ...prev]);

      // Show toast for new notification
      toast({
        title: newNotification.title,
        description: newNotification.message,
        variant: newNotification.type === 'error' ? 'destructive' : 'default',
      });
    }
  }, [toast, user]);

  // Mark a notification as read
  const markAsRead = useCallback(async (id: string) => {
    if (USE_SUPABASE && user) {
      try {
        // Update notification in Supabase
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', id);

        if (error) throw error;

        // The notification will be updated via the real-time subscription
      } catch (error) {
        console.error('Error marking notification as read in Supabase:', error);
        // Fall back to local state if Supabase fails
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
      }
    } else {
      // Use local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    }
  }, [user]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (USE_SUPABASE && user) {
      try {
        // Update all user's notifications in Supabase
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .or(`user_id.eq.${user.id},is_global.eq.true`);

        if (error) throw error;

        // The notifications will be updated via the real-time subscription
      } catch (error) {
        console.error('Error marking all notifications as read in Supabase:', error);
        // Fall back to local state if Supabase fails
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );
      }
    } else {
      // Use local state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    }
  }, [user]);

  // Delete a notification
  const deleteNotification = useCallback(async (id: string) => {
    if (USE_SUPABASE && user) {
      try {
        // Delete notification from Supabase
        const { error } = await supabase
          .from('notifications')
          .delete()
          .eq('id', id);

        if (error) throw error;

        // The notification will be removed via the real-time subscription
      } catch (error) {
        console.error('Error deleting notification from Supabase:', error);
        // Fall back to local state if Supabase fails
        setNotifications(prev =>
          prev.filter(notification => notification.id !== id)
        );
      }
    } else {
      // Use local state
      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      );
    }
  }, [user]);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    if (USE_SUPABASE && user) {
      try {
        // Delete all user's notifications from Supabase
        const { error } = await supabase
          .from('notifications')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;

        // The notifications will be removed via the real-time subscription
      } catch (error) {
        console.error('Error clearing all notifications from Supabase:', error);
        // Fall back to local state if Supabase fails
        setNotifications([]);
        localStorage.removeItem(`${STORAGE_KEY}-${user.id}`);
      }
    } else {
      // Use local state
      setNotifications([]);
      if (user) {
        localStorage.removeItem(`${STORAGE_KEY}-${user.id}`);
      }
    }
  }, [user]);

  // Toggle notification center visibility
  const toggleNotificationCenter = useCallback(() => {
    setShowNotificationCenter(prev => !prev);
  }, []);

  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Add demo notifications for new users
  useEffect(() => {
    if (user && notifications.length === 0 && !isLoading) {
      // Add welcome notification
      addNotification({
        title: 'Welcome to Andrew Cares Village',
        message: 'Thank you for joining our community. Explore our services to start your journey.',
        type: 'info',
        link: '/',
      });

      // Add feature notification
      setTimeout(() => {
        addNotification({
          title: 'New Features Available',
          message: 'We\'ve added dark mode and search functionality to enhance your experience.',
          type: 'success',
        });
      }, 3000);
    }
  }, [user, notifications.length, addNotification, isLoading]);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    showNotificationCenter,
    toggleNotificationCenter,
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};