import React from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, Trash2, X, Info, AlertTriangle, MessageSquare, BookOpen, Megaphone, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const NotificationCenter: React.FC = () => {
  const {
    notifications,
    showNotificationCenter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    toggleNotificationCenter,
    isLoading,
    urgentCount
  } = useNotifications();

  const navigate = useNavigate();

  if (!showNotificationCenter) {
    return null;
  }

  const getNotificationIcon = (type: string, category?: string, priority?: number) => {
    // Priority override for urgent notifications
    if (priority && priority >= 3) {
      return <Zap className="h-4 w-4 text-orange-500" />;
    }

    // Category-based icons
    if (category) {
      switch (category) {
        case 'post':
          return <MessageSquare className="h-4 w-4 text-blue-500" />;
        case 'lesson':
          return <BookOpen className="h-4 w-4 text-green-500" />;
        case 'announcement':
          return <Megaphone className="h-4 w-4 text-purple-500" />;
      }
    }

    // Fallback to type-based icons
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityBadge = (priority?: number, isGlobal?: boolean) => {
    if (isGlobal) {
      return (
        <Badge variant="secondary" className="text-xs px-1 py-0 h-5 bg-blue-100 text-blue-700">
          Global
        </Badge>
      );
    }

    if (priority && priority >= 3) {
      return (
        <Badge variant="destructive" className="text-xs px-1 py-0 h-5 bg-orange-100 text-orange-700">
          Urgent
        </Badge>
      );
    }

    if (priority && priority >= 2) {
      return (
        <Badge variant="secondary" className="text-xs px-1 py-0 h-5 bg-yellow-100 text-yellow-700">
          Important
        </Badge>
      );
    }

    return null;
  };

  const getCategoryBadge = (category?: string) => {
    if (!category || category === 'general') return null;

    const categoryLabels = {
      post: 'Community',
      lesson: 'Learning',
      announcement: 'News'
    };

    return (
      <Badge variant="outline" className="text-xs px-1 py-0 h-5">
        {categoryLabels[category as keyof typeof categoryLabels] || category}
      </Badge>
    );
  };

  const handleViewDetails = (notification: any) => {
    // Mark as read first
    markAsRead(notification.id);

    // Navigate to the link if provided
    if (notification.link) {
      // Close the notification center
      toggleNotificationCenter();

      // Navigate to the link
      if (notification.link.startsWith('/')) {
        navigate(notification.link);
      } else {
        window.open(notification.link, '_blank');
      }
    }
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    // First by read status (unread first)
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }
    // Then by priority (highest first)
    const aPriority = a.priority || 1;
    const bPriority = b.priority || 1;
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    // Finally by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50">
      <Card className="border shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <CardTitle className="text-lg">Notifications</CardTitle>
              {urgentCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {urgentCount} urgent
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs h-8"
                  title="Mark all as read"
                  disabled={isLoading}
                >
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleNotificationCenter}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            {isLoading ? (
              'Loading notifications...'
            ) : notifications.length === 0 ? (
              'No notifications'
            ) : (
              `${notifications.filter(n => !n.read).length} unread of ${notifications.length} total`
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p>You have no notifications</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 rounded-md border transition-colors relative",
                    notification.read
                      ? "bg-background"
                      : "bg-muted/50 border-muted-foreground/20",
                    notification.priority && notification.priority >= 3 && !notification.read
                      ? "border-orange-200 bg-orange-50 shadow-sm"
                      : "",
                    notification.isGlobal && !notification.read
                      ? "border-blue-200 bg-blue-50 shadow-sm"
                      : ""
                  )}
                >
                  {/* Priority indicator */}
                  {notification.priority && notification.priority >= 3 && !notification.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-md"></div>
                  )}
                  {notification.isGlobal && !notification.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-md"></div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      {getNotificationIcon(notification.type, notification.category, notification.priority)}
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "text-sm font-medium leading-tight",
                          !notification.read && "font-semibold"
                        )}>
                          {notification.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </Badge>
                          {getPriorityBadge(notification.priority, notification.isGlobal)}
                          {getCategoryBadge(notification.category)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => markAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteNotification(notification.id)}
                        title="Delete notification"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {notification.link && (
                    <div className="mt-2">
                      <Button
                        variant="link"
                        className="text-xs h-6 p-0 font-medium"
                        onClick={() => handleViewDetails(notification)}
                      >
                        View details →
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {notifications.length > 0 && (
            <div className="mt-4 pt-2 border-t flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="text-xs text-muted-foreground hover:text-destructive"
                disabled={isLoading}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear all
              </Button>
              {notifications.length >= 100 && (
                <p className="text-xs text-muted-foreground">
                  Showing 100 most recent
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;