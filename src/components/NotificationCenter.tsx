import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit3, Trash2, Send, CheckCircle, AlertTriangle, Wifi, WifiOff } from 'lucide-react';

interface AcademyContent {
  id: string;
  discipline: 'fitness' | 'karate' | 'forex';
  content_type: 'course' | 'lesson' | 'module';
  title: string;
  description?: string;
  content?: string;
  parent_id?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ContentNotification {
  id: string;
  content_id: string;
  notification_title: string;
  notification_message: string;
  target_discipline: 'fitness' | 'karate' | 'forex' | 'all';
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
}

const AcademyContentManager: React.FC = () => {
  const [contents, setContents] = useState<AcademyContent[]>([]);
  const [notifications, setNotifications] = useState<ContentNotification[]>([]);
  const [editingContent, setEditingContent] = useState<AcademyContent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<'fitness' | 'karate' | 'forex'>('fitness');
  const [isConnected, setIsConnected] = useState(true);

  // Refs for cleanup
  const contentSubscriptionRef = useRef<any>(null);
  const notificationSubscriptionRef = useRef<any>(null);

  // Form state for creating/editing content
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    content_type: 'lesson' as 'course' | 'lesson' | 'module',
    discipline: 'fitness' as 'fitness' | 'karate' | 'forex',
    order_index: 0,
    is_active: true
  });

  // Initial fetch of content
  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('academy_content')
        .select('*')
        .order('discipline, order_index');

      if (error) throw error;
      setContents((data || []) as AcademyContent[]);
    } catch (err: any) {
      setError('Failed to fetch content: ' + err.message);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of notifications
  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('content_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications((data || []) as ContentNotification[]);
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err.message);
      setIsConnected(false);
    }
  };

  // Setup real-time subscriptions
  const setupRealtimeSubscriptions = () => {
    // Cleanup existing subscriptions
    if (contentSubscriptionRef.current) {
      contentSubscriptionRef.current.unsubscribe();
    }
    if (notificationSubscriptionRef.current) {
      notificationSubscriptionRef.current.unsubscribe();
    }

    // Academy Content subscription
    contentSubscriptionRef.current = supabase
      .channel('academy-content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'academy_content',
        },
        (payload) => {
          console.log('Academy content change detected:', payload);

          if (payload.eventType === 'INSERT') {
            const newContent = payload.new as AcademyContent;
            setContents(prev => [...prev, newContent].sort((a, b) =>
              a.discipline.localeCompare(b.discipline) || a.order_index - b.order_index
            ));
            setSuccess(`New ${newContent.content_type} "${newContent.title}" was added!`);
          }
          else if (payload.eventType === 'UPDATE') {
            const updatedContent = payload.new as AcademyContent;
            setContents(prev =>
              prev.map(content =>
                content.id === updatedContent.id ? updatedContent : content
              ).sort((a, b) =>
                a.discipline.localeCompare(b.discipline) || a.order_index - b.order_index
              )
            );
            setSuccess(`Content "${updatedContent.title}" was updated!`);
          }
          else if (payload.eventType === 'DELETE') {
            const deletedContent = payload.old as AcademyContent;
            setContents(prev => prev.filter(content => content.id !== deletedContent.id));
            setSuccess(`Content was deleted!`);
          }

          setIsConnected(true);
        }
      )
      .subscribe((status) => {
        console.log('Academy content subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Content Notifications subscription
    notificationSubscriptionRef.current = supabase
      .channel('content-notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_notifications',
        },
        (payload) => {
          console.log('Content notification change detected:', payload);

          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as ContentNotification;
            setNotifications(prev => [newNotification, ...prev]);
            setSuccess(`New notification sent: "${newNotification.notification_title}"`);
          }
          else if (payload.eventType === 'UPDATE') {
            const updatedNotification = payload.new as ContentNotification;
            setNotifications(prev =>
              prev.map(notification =>
                notification.id === updatedNotification.id ? updatedNotification : notification
              )
            );
          }
          else if (payload.eventType === 'DELETE') {
            const deletedNotification = payload.old as ContentNotification;
            setNotifications(prev => prev.filter(notification => notification.id !== deletedNotification.id));
          }

          setIsConnected(true);
        }
      )
      .subscribe((status) => {
        console.log('Content notifications subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });
  };

  useEffect(() => {
    // Initial data fetch
    fetchContent();
    fetchNotifications();

    // Setup real-time subscriptions
    setupRealtimeSubscriptions();

    // Cleanup on unmount
    return () => {
      if (contentSubscriptionRef.current) {
        contentSubscriptionRef.current.unsubscribe();
      }
      if (notificationSubscriptionRef.current) {
        notificationSubscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  // Handle connection status monitoring
  useEffect(() => {
    const checkConnection = () => {
      // Simple connectivity check by trying to get the current session
      supabase.auth.getSession().then(() => {
        setIsConnected(true);
      }).catch(() => {
        setIsConnected(false);
      });
    };

    // Check connection every 30 seconds
    const connectionInterval = setInterval(checkConnection, 30000);

    return () => clearInterval(connectionInterval);
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingContent) {
        // Update existing content
        const { error } = await supabase
          .from('academy_content')
          .update({
            title: formData.title,
            description: formData.description,
            content: formData.content,
            content_type: formData.content_type,
            discipline: formData.discipline,
            order_index: formData.order_index,
            is_active: formData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingContent.id);

        if (error) throw error;
        // Success message will be handled by real-time subscription
      } else {
        // Create new content
        const { error } = await supabase
          .from('academy_content')
          .insert({
            title: formData.title,
            description: formData.description,
            content: formData.content,
            content_type: formData.content_type,
            discipline: formData.discipline,
            order_index: formData.order_index,
            is_active: formData.is_active
          });

        if (error) throw error;
        // Success message will be handled by real-time subscription
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        content: '',
        content_type: 'lesson',
        discipline: 'fitness',
        order_index: 0,
        is_active: true
      });
      setEditingContent(null);
      setIsCreating(false);
      setIsConnected(true);
    } catch (err: any) {
      setError('Failed to save content: ' + err.message);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase
        .from('academy_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      // Success message will be handled by real-time subscription
      setIsConnected(true);
    } catch (err: any) {
      setError('Failed to delete content: ' + err.message);
      setIsConnected(false);
    }
  };

  // Handle edit
  const handleEdit = (content: AcademyContent) => {
    setFormData({
      title: content.title,
      description: content.description || '',
      content: content.content || '',
      content_type: content.content_type,
      discipline: content.discipline,
      order_index: content.order_index,
      is_active: content.is_active
    });
    setEditingContent(content);
    setIsCreating(true);
  };

  // Send custom notification
  const sendCustomNotification = async (contentId: string) => {
    const title = prompt('Enter notification title:');
    const message = prompt('Enter notification message:');

    if (!title || !message) return;

    try {
      const { error } = await supabase
        .from('content_notifications')
        .insert({
          content_id: contentId,
          notification_title: title,
          notification_message: message,
          target_discipline: selectedDiscipline
        });

      if (error) throw error;
      // Success message will be handled by real-time subscription
      setIsConnected(true);
    } catch (err: any) {
      setError('Failed to send notification: ' + err.message);
      setIsConnected(false);
    }
  };

  // Clear messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const filteredContent = contents.filter(c => c.discipline === selectedDiscipline);

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">Real-time connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600">Connection issues detected</span>
            </>
          )}
        </div>
      </div>

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={selectedDiscipline} onValueChange={(value) => setSelectedDiscipline(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
          <TabsTrigger value="karate">Karate</TabsTrigger>
          <TabsTrigger value="forex">Forex</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedDiscipline} className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {selectedDiscipline.charAt(0).toUpperCase() + selectedDiscipline.slice(1)} Academy Content
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredContent.length} items)
              </span>
            </h3>
            <Button onClick={() => setIsCreating(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </div>

          {/* Create/Edit Form */}
          {isCreating && (
            <Card>
              <CardHeader>
                <CardTitle>{editingContent ? 'Edit Content' : 'Create New Content'}</CardTitle>
                <CardDescription>
                  {editingContent ? 'Modify existing academy content' : 'Add new content to the academy'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter content title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content_type">Content Type</Label>
                      <Select
                        value={formData.content_type}
                        onValueChange={(value) => setFormData({ ...formData, content_type: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="course">Course</SelectItem>
                          <SelectItem value="module">Module</SelectItem>
                          <SelectItem value="lesson">Lesson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter content description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Enter the full content (HTML supported)"
                      className="min-h-[200px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="order_index">Order Index</Label>
                      <Input
                        id="order_index"
                        type="number"
                        value={formData.order_index}
                        onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                        placeholder="Order index (0-999)"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      />
                      <Label htmlFor="is_active">Publish immediately</Label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : editingContent ? 'Update' : 'Create'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false);
                        setEditingContent(null);
                        setFormData({
                          title: '',
                          description: '',
                          content: '',
                          content_type: 'lesson',
                          discipline: 'fitness',
                          order_index: 0,
                          is_active: true
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Content List */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Content</CardTitle>
              <CardDescription>Manage existing academy content - updates in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredContent.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No content found for {selectedDiscipline}. Create some content to get started.
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredContent.map((content) => (
                    <div key={content.id} className="border rounded-lg p-4 space-y-2 transition-all duration-200">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-medium">{content.title}</h4>
                          {content.description && (
                            <p className="text-sm text-muted-foreground">{content.description}</p>
                          )}
                          <div className="flex gap-2">
                            <Badge variant="secondary">{content.content_type}</Badge>
                            <Badge variant={content.is_active ? "default" : "outline"}>
                              {content.is_active ? "Published" : "Draft"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Order: {content.order_index}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(content)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendCustomNotification(content.id)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(content.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {content.content && (
                        <details className="mt-2">
                          <summary className="text-sm cursor-pointer text-muted-foreground">
                            Show content preview
                          </summary>
                          <div className="mt-2 p-3 bg-muted rounded text-sm">
                            {content.content.length > 200
                              ? content.content.substring(0, 200) + '...'
                              : content.content}
                          </div>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Recent notifications sent for {selectedDiscipline} content - updates in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.filter(n => n.target_discipline === selectedDiscipline || n.target_discipline === 'all').length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No notifications sent yet.</p>
              ) : (
                <div className="space-y-3">
                  {notifications
                    .filter(n => n.target_discipline === selectedDiscipline || n.target_discipline === 'all')
                    .slice(0, 5)
                    .map((notification) => (
                      <div key={notification.id} className="border rounded p-3 space-y-1 transition-all duration-200">
                        <h5 className="font-medium text-sm">{notification.notification_title}</h5>
                        <p className="text-xs text-muted-foreground">{notification.notification_message}</p>
                        <p className="text-xs text-muted-foreground">
                          Sent: {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AcademyContentManager;