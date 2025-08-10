import React from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, Trash2, X, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const NotificationCenter: React.FC = () => {
  const {
    notifications,
    showNotificationCenter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    toggleNotificationCenter
  } = useNotifications();

  if (!showNotificationCenter) {
    return null;
  }

  const getNotificationIcon = (type: string) => {
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

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50">
      <Card className="border shadow-lg">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
            <CardDescription>
              {notifications.length === 0
                ? 'No notifications'
                : `${notifications.filter(n => !n.read).length} unread of ${notifications.length} total`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-8"
                title="Mark all as read"
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
        </CardHeader>
        <CardContent className="max-h-[70vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p>You have no notifications</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 rounded-md border transition-colors",
                    notification.read
                      ? "bg-background"
                      : "bg-muted/50 border-muted-foreground/20"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      {getNotificationIcon(notification.type)}
                      <div>
                        <h4 className={cn(
                          "text-sm font-medium",
                          !notification.read && "font-semibold"
                        )}>
                          {notification.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </Badge>
                          {notification.isGlobal && (
                            <Badge variant="secondary" className="text-xs px-1 py-0 h-5">
                              Global
                            </Badge>
                          )}
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
                    <Button
                      variant="link"
                      className="text-xs h-6 p-0 mt-1"
                      onClick={() => {
                        markAsRead(notification.id);
                        window.location.href = notification.link || '/';
                      }}
                    >
                      View details
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
          {notifications.length > 0 && (
            <div className="mt-4 pt-2 border-t flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;