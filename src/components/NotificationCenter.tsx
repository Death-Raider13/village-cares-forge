import React from 'react';
import { useNotifications, Notification } from '@/contexts/NotificationsContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  X, 
  Check, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    showNotificationCenter,
    toggleNotificationCenter
  } = useNotifications();

  if (!showNotificationCenter) return null;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-vintage-deep-blue" />;
    }
  };

  const getNotificationBgColor = (type: Notification['type'], read: boolean) => {
    if (read) return 'bg-vintage-warm-cream/50';
    
    switch (type) {
      case 'info':
        return 'bg-blue-50';
      case 'success':
        return 'bg-green-50';
      case 'warning':
        return 'bg-amber-50';
      case 'error':
        return 'bg-red-50';
      default:
        return 'bg-white';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-white rounded-md shadow-lg border border-vintage-gold/20 z-50 overflow-hidden">
      <div className="p-3 border-b border-vintage-gold/10 flex items-center justify-between bg-vintage-warm-cream/80">
        <h3 className="font-playfair font-semibold text-vintage-deep-blue">Notifications</h3>
        <div className="flex items-center gap-2">
          {notifications.some(n => !n.read) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="h-8 text-xs"
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Mark all read
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleNotificationCenter}
            className="h-7 w-7"
            aria-label="Close notification center"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="max-h-[70vh]">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-8 w-8 mx-auto text-vintage-dark-brown/30 mb-2" />
            <p className="text-vintage-dark-brown/70">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-vintage-gold/10">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 ${getNotificationBgColor(notification.type, notification.read)} hover:bg-vintage-warm-cream/30 transition-colors relative group`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium ${notification.read ? 'text-vintage-dark-brown/80' : 'text-vintage-deep-blue'}`}>
                      {notification.title}
                    </h4>
                    <p className="text-xs text-vintage-dark-brown/70 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-vintage-dark-brown/50">
                        {formatTime(notification.createdAt)}
                      </span>
                      <div className="flex items-center gap-1">
                        {notification.link && (
                          <Link 
                            to={notification.link} 
                            className="text-xs text-vintage-burgundy hover:text-vintage-deep-blue flex items-center"
                            onClick={() => markAsRead(notification.id)}
                          >
                            View <ExternalLink className="h-3 w-3 ml-0.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => markAsRead(notification.id)}
                      aria-label="Mark as read"
                    >
                      <Check className="h-3.5 w-3.5 text-vintage-deep-blue" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => deleteNotification(notification.id)}
                    aria-label="Delete notification"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-vintage-burgundy" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default NotificationCenter;