import React, { useState, useEffect, useMemo } from 'react';
import {
  SecurityEvent,
  SecurityEventType,
  SecurityEventSeverity,
  createSecurityEvent
} from '@/lib/security';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DownloadIcon,
  FilterIcon,
  SearchIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  InfoIcon,
  CheckCircleIcon
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface SecurityAuditLogProps {
  limit?: number;
  showFilters?: boolean;
  adminView?: boolean;
}

export const SecurityAuditLog: React.FC<SecurityAuditLogProps> = ({
  limit = 100,
  showFilters = true,
  adminView = false
}) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [typeFilter, setTypeFilter] = useState<SecurityEventType | 'ALL'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<SecurityEventSeverity | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });

  // Mock security events data
  // Note: This is a temporary implementation until the security_events table is created in the database
  useEffect(() => {
    const fetchMockSecurityEvents = async () => {
      try {
        setLoading(true);

        // Generate mock security events
        const mockEvents: SecurityEvent[] = [
          createSecurityEvent(
            SecurityEventType.LOGIN_SUCCESS,
            "User logged in successfully",
            SecurityEventSeverity.INFO,
            user?.id,
            { method: "password" }
          ),
          createSecurityEvent(
            SecurityEventType.LOGIN_FAILURE,
            "Failed login attempt",
            SecurityEventSeverity.WARNING,
            user?.id,
            { reason: "Invalid password", attempts: 2 }
          ),
          createSecurityEvent(
            SecurityEventType.PASSWORD_CHANGE,
            "Password changed successfully",
            SecurityEventSeverity.INFO,
            user?.id
          ),
          createSecurityEvent(
            SecurityEventType.SUSPICIOUS_ACTIVITY,
            "Unusual login location detected",
            SecurityEventSeverity.ERROR,
            user?.id,
            { location: "Unknown location", previousLocation: "New York, USA" }
          ),
          createSecurityEvent(
            SecurityEventType.SESSION_TIMEOUT,
            "User session timed out due to inactivity",
            SecurityEventSeverity.INFO,
            user?.id
          ),
          createSecurityEvent(
            SecurityEventType.ACCOUNT_UPDATE,
            "User profile information updated",
            SecurityEventSeverity.INFO,
            user?.id,
            { fields: ["email", "name"] }
          ),
          createSecurityEvent(
            SecurityEventType.PERMISSION_CHANGE,
            "User permissions modified",
            SecurityEventSeverity.WARNING,
            user?.id,
            { added: ["admin_dashboard"], removed: [] }
          ),
          createSecurityEvent(
            SecurityEventType.SESSION_REFRESH,
            "Session token refreshed",
            SecurityEventSeverity.INFO,
            user?.id
          ),
          createSecurityEvent(
            SecurityEventType.ADMIN_ACTION,
            "Administrator performed sensitive action",
            SecurityEventSeverity.CRITICAL,
            "admin-user-id",
            { action: "database_reset", target: "production" }
          ),
        ];

        // Add timestamps with different dates for better testing
        const now = new Date();
        mockEvents.forEach((event, index) => {
          // Distribute events over the last 30 days
          const daysAgo = index % 30;
          const hoursAgo = index % 24;
          const date = new Date(now);
          date.setDate(date.getDate() - daysAgo);
          date.setHours(date.getHours() - hoursAgo);
          event.timestamp = date;
        });

        // Filter events for non-admin views
        const filteredEvents = adminView
          ? mockEvents
          : mockEvents.filter(event => event.userId === user?.id);

        setEvents(filteredEvents);
      } catch (err) {
        console.error('Error fetching security events:', err);
        setError('Failed to load security events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMockSecurityEvents();
  }, [limit, adminView, user]);

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Type filter
      if (typeFilter !== 'ALL' && event.type !== typeFilter) {
        return false;
      }

      // Severity filter
      if (severityFilter !== 'ALL' && event.severity !== severityFilter) {
        return false;
      }

      // Search query (check in message and details)
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const messageMatch = event.message.toLowerCase().includes(searchLower);
        const detailsMatch = event.details ?
          JSON.stringify(event.details).toLowerCase().includes(searchLower) :
          false;

        if (!messageMatch && !detailsMatch) {
          return false;
        }
      }

      // Date range filter
      if (dateRange.start && event.timestamp < dateRange.start) {
        return false;
      }

      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999); // End of the day
        if (event.timestamp > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [events, typeFilter, severityFilter, searchQuery, dateRange]);

  // Export events as CSV
  const exportCSV = () => {
    const headers = ['Type', 'Severity', 'Timestamp', 'User ID', 'Message', 'Details'];

    const csvContent = [
      headers.join(','),
      ...filteredEvents.map(event => [
        event.type,
        event.severity,
        event.timestamp.toISOString(),
        event.userId || '',
        `"${event.message.replace(/"/g, '""')}"`,
        event.details ? `"${JSON.stringify(event.details).replace(/"/g, '""')}"` : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `security-audit-log-${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render severity badge with appropriate color
  const renderSeverityBadge = (severity: SecurityEventSeverity) => {
    switch (severity) {
      case SecurityEventSeverity.INFO:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <InfoIcon className="w-3 h-3 mr-1" />
            Info
          </Badge>
        );
      case SecurityEventSeverity.WARNING:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangleIcon className="w-3 h-3 mr-1" />
            Warning
          </Badge>
        );
      case SecurityEventSeverity.ERROR:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircleIcon className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      case SecurityEventSeverity.CRITICAL:
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 font-bold">
            <AlertCircleIcon className="w-3 h-3 mr-1" />
            Critical
          </Badge>
        );
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-playfair text-vintage-deep-blue">
          Security Audit Log
        </CardTitle>
        <CardDescription>
          {adminView
            ? 'View and analyze all security events across the platform'
            : 'View security events related to your account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Event Type</label>
                <Select
                  value={typeFilter}
                  onValueChange={(value) => setTypeFilter(value as SecurityEventType | 'ALL')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    {Object.values(SecurityEventType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Severity</label>
                <Select
                  value={severityFilter}
                  onValueChange={(value) => setSeverityFilter(value as SecurityEventSeverity | 'ALL')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Severities</SelectItem>
                    {Object.values(SecurityEventSeverity).map((severity) => (
                      <SelectItem key={severity} value={severity}>
                        {severity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Search</label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search in messages and details"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex-1 flex items-end">
                <Button
                  variant="outline"
                  className="ml-auto"
                  onClick={exportCSV}
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-deep-blue mx-auto mb-4"></div>
            <p className="text-vintage-dark-brown">Loading security events...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-600">
            <AlertCircleIcon className="w-8 h-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <FilterIcon className="w-8 h-8 mx-auto mb-2" />
            <p>No security events found matching the current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  {adminView && <TableHead>User</TableHead>}
                  <TableHead>Message</TableHead>
                  {adminView && <TableHead>Details</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event, index) => (
                  <TableRow key={`${event.id}-${index}`}>
                    <TableCell className="font-mono text-sm">
                      {event.timestamp.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {event.type.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {renderSeverityBadge(event.severity)}
                    </TableCell>
                    {adminView && (
                      <TableCell className="font-mono text-sm">
                        {event.userId || 'N/A'}
                      </TableCell>
                    )}
                    <TableCell className="max-w-md">
                      <div className="truncate" title={event.message}>
                        {event.message}
                      </div>
                    </TableCell>
                    {adminView && (
                      <TableCell className="max-w-xs">
                        {event.details ? (
                          <details className="cursor-pointer">
                            <summary className="text-xs text-blue-600 hover:text-blue-800">
                              View Details
                            </summary>
                            <pre className="text-xs mt-1 p-2 bg-gray-50 rounded overflow-auto max-h-20">
                              {JSON.stringify(event.details, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          <span className="text-gray-400 text-xs">No details</span>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityAuditLog;