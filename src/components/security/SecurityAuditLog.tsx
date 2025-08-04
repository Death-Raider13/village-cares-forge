import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Clock, User, Activity, Trash2 } from 'lucide-react';
import { getStoredSecurityEvents, SecurityEvent } from '@/lib/security';
import { useAuth } from '@/components/auth/AuthProvider';
import { formatDistanceToNow } from 'date-fns';

export const SecurityAuditLog: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadEvents = () => {
      const allEvents = getStoredSecurityEvents();
      // Filter events for current user
      const userEvents = user 
        ? allEvents.filter(event => event.userId === user.id || event.email === user.email)
        : [];
      setEvents(userEvents);
    };

    loadEvents();
    
    // Refresh every 10 seconds
    const interval = setInterval(loadEvents, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'auth_success':
        return <Shield className="h-4 w-4 text-green-600" />;
      case 'auth_failure':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'session_timeout':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const getEventBadgeVariant = (type: string) => {
    switch (type) {
      case 'auth_success':
        return 'default';
      case 'auth_failure':
      case 'suspicious_activity':
        return 'destructive';
      case 'session_timeout':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getEventTitle = (type: string) => {
    switch (type) {
      case 'auth_attempt':
        return 'Authentication Attempt';
      case 'auth_success':
        return 'Successful Login';
      case 'auth_failure':
        return 'Failed Login';
      case 'session_timeout':
        return 'Session Timeout';
      case 'suspicious_activity':
        return 'Suspicious Activity';
      default:
        return 'Security Event';
    }
  };

  const clearLogs = () => {
    localStorage.removeItem('security_events');
    setEvents([]);
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please sign in to view your security audit log.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Audit Log
        </CardTitle>
        {events.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearLogs}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Logs
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No security events recorded yet.
          </p>
        ) : (
          <div className="space-y-4">
            {events.slice(0, 20).map((event, index) => (
              <div
                key={`${event.timestamp}-${index}`}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  {getEventIcon(event.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{getEventTitle(event.type)}</span>
                      <Badge variant={getEventBadgeVariant(event.type)}>
                        {event.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.email && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {event.email}
                        </span>
                      )}
                      {event.details && (
                        <div className="mt-1">
                          {Object.entries(event.details).map(([key, value]) => (
                            <span key={key} className="mr-2">
                              {key}: {String(value)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                </div>
              </div>
            ))}
            {events.length > 20 && (
              <p className="text-sm text-muted-foreground text-center">
                Showing 20 most recent events of {events.length} total
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};