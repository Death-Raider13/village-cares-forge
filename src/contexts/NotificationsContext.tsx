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
  priority?: number; // 1=normal, 2=important, 3=urgent
  category?: string; // 'post', 'lesson', 'announcement', 'general'
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  urgentCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showNotificationCenter: boolean;
  toggleNotificationCenter: () => void;
  isLoading: boolean;
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

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const realtimeChannel = useRef<RealtimeChannel | null>(null);

  // Transform Supabase data to match our Notification interface
  const transformNotification = (dbNotification: any): Notification => ({
    id: dbNotification.id,
    title: dbNotification.title,
    message: dbNotification.message,
    type: dbNotification.type,
    link: dbNotification.link,
    createdAt: dbNotification.created_at,
    read: dbNotification.read,
    userId: dbNotification.user_id,
    isGlobal: dbNotification.is_global,
    priority: dbNotification.priority || 1,
    category: dbNotification.category || 'general'
  });

  // Load notifications on mount
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      setIsLoading(true);

      try {
        // Fetch user-specific and global notifications from Supabase
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .or(`user_id.eq.${user.id},is_global.eq.true`)
          .order('priority', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(100); // Limit to prevent too many notifications

        if (error) throw error;

        const formattedNotifications = data.map(transformNotification);
        setNotifications(formattedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast({
          title: 'Error loading notifications',
          description: 'Failed to load notifications. Please refresh the page.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [user, toast]);

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user) return;

    const setupRealtimeSubscription = async () => {
      // Clean up existing subscription
      if (realtimeChannel.current) {
        supabase.removeChannel(realtimeChannel.current);
      }

      // Subscribe to notifications channel
      realtimeChannel.current = supabase
        .channel(`notifications:${user.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          const newNotification = transformNotification(payload.new);
          setNotifications(prev => [newNotification, ...prev]);

          // Show toast for new notification with priority styling
          toast({
            title: newNotification.title,
            description: newNotification.message,
            variant: newNotification.type === 'error' ? 'destructive' : 'default',
            className: newNotification.priority && newNotification.priority >= 3
              ? 'border-orange-500 bg-orange-50'
              : undefined,
          });

          // Play sound for urgent notifications (optional)
          if (newNotification.priority && newNotification.priority >= 3) {
            try {
              new Audio('/notification-urgent.mp3').play().catch(() => { });
            } catch (e) {
              // Ignore audio errors
            }
          }
        })
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: 'is_global=eq.true',
        }, (payload) => {
          const newNotification = transformNotification(payload.new);
          setNotifications(prev => [newNotification, ...prev]);

          // Global notifications are always important
          toast({
            title: `📢 ${newNotification.title}`,
            description: newNotification.message,
            variant: 'default',
            className: 'border-blue-500 bg-blue-50',
            duration: newNotification.priority && newNotification.priority >= 3 ? 10000 : 5000,
          });

          // Play sound for global notifications
          try {
            new Audio('/notification-global.mp3').play().catch(() => { });
          } catch (e) {
            // Ignore audio errors
          }
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
        }, (payload) => {
          const updatedNotification = transformNotification(payload.new);
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
          const deletedId = payload.old.id;
          setNotifications(prev =>
            prev.filter(notification => notification.id !== deletedId)
          );
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Real-time notifications connected');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Real-time notifications error');
          }
        });
    };

    setupRealtimeSubscription();

    // Clean up subscription on unmount
    return () => {
      if (realtimeChannel.current) {
        supabase.removeChannel(realtimeChannel.current);
      }
    };
  }, [user, toast]);

  // Add a new notification (for manual notifications)
  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          title: notification.title,
          message: notification.message,
          type: notification.type,
          link: notification.link,
          user_id: user.id,
          is_global: notification.isGlobal || false,
          priority: notification.priority || 1,
          category: notification.category || 'general',
        });

      if (error) throw error;
      // The notification will be added via the real-time subscription
    } catch (error) {
      console.error('Error adding notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to create notification.',
        variant: 'destructive',
      });
    }
  }, [user, toast]);

  // Mark a notification as read
  const markAsRead = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
      // The notification will be updated via the real-time subscription
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Fall back to local state update
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    }
  }, [user]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .or(`user_id.eq.${user.id},is_global.eq.true`)
        .eq('read', false);

      if (error) throw error;
      // The notifications will be updated via the real-time subscription
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Fall back to local state update
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    }
  }, [user]);

  // Delete a notification
  const deleteNotification = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user can only delete their own notifications

      if (error) throw error;
      // The notification will be removed via the real-time subscription
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Fall back to local state update
      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      );
    }
  }, [user]);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      // The notifications will be removed via the real-time subscription
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      // Fall back to local state update
      setNotifications([]);
    }
  }, [user]);

  // Toggle notification center visibility
  const toggleNotificationCenter = useCallback(() => {
    setShowNotificationCenter(prev => !prev);
  }, []);

  // Calculate counts
  const unreadCount = notifications.filter(notification => !notification.read).length;
  const urgentCount = notifications.filter(
    notification => !notification.read && notification.priority && notification.priority >= 3
  ).length;

  const value = {
    notifications,
    unreadCount,
    urgentCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    showNotificationCenter,
    toggleNotificationCenter,
    isLoading,
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};