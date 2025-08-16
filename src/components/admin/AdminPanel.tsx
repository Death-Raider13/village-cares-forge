import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AcademyContentManager from './AcademyContentManager';
import VideoManagement from './VideoManagement';
import {
  Users,
  Settings,
  Bell,
  FileText,
  BarChart,
  Shield,
  CheckCircle,
  Trash2,
  Video,
  Play,
  BookOpen,
  ThumbsUp,
  MessageSquare,
  RefreshCw,
  Search,
  AlertTriangle,
  UserCheck,
  UserX,
  Crown
} from 'lucide-react';

// Enhanced interfaces with proper typing
interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin' | 'moderator';
  created_at: string;
  updated_at: string;
  email?: string; // From auth.users
  email_confirmed_at?: string; // From auth.users
  last_sign_in_at?: string; // From auth.users
}

interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  discipline: 'fitness' | 'karate' | 'forex' | 'general';
  category: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  };
}

interface VideoData {
  id: string;
  title: string;
  description: string | null;
  category: 'forex' | 'fitness' | 'karate' | null;
  type: 'course' | 'workout' | 'tutorial' | 'analysis' | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null;
  url: string | null;
  thumbnail: string | null;
  instructor: string | null;
  duration: number | null;
  created_at: string;
  updated_at: string | null;
  tags: string[] | null;
  is_featured: boolean | null;
  is_premium: boolean | null;
  user_id: string | null;
}

interface AcademyContent {
  id: string;
  discipline: 'fitness' | 'karate' | 'forex';
  content_type: 'course' | 'lesson' | 'module';
  title: string;
  description: string | null;
  content: string | null;
  parent_id: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

interface ContentNotification {
  id: string;
  content_id: string | null;
  notification_title: string;
  notification_message: string;
  target_discipline: 'fitness' | 'karate' | 'forex' | 'all' | null;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
  created_by: string | null;
}

interface Notification {
  id: string;
  user_id: string | null;
  title: string;
  message: string;
  type: string | null;
  read: boolean | null;
  link: string | null;
  is_global: boolean | null;
  priority: number | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

interface CommunityStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalUsers: number;
}

interface PostFilter {
  discipline: string;
  sortBy: string;
  search: string;
  published: string;
}

interface AdminPanelProps {
  onClose: () => void;
}

export const RealTimeAdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // User management state
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Stats for dashboard
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPrograms: 0,
    totalBookings: 0,
    totalVideos: 0,
    totalPosts: 0
  });

  // Community management state
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [communityStats, setCommunityStats] = useState<CommunityStats>({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    totalUsers: 0
  });
  const [postFilter, setPostFilter] = useState<PostFilter>({
    discipline: 'all',
    sortBy: 'recent',
    search: '',
    published: 'all'
  });

  // Notification management
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Real-time subscriptions
  useEffect(() => {
    const subscriptions: any[] = [];

    // Subscribe to profile changes
    const profilesSubscription = supabase
      .channel('profiles_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        console.log('Profile change detected:', payload);
        fetchUsers(); // Refetch users when profiles change
        fetchStats(); // Update stats
      })
      .subscribe();

    // Subscribe to community posts changes
    const postsSubscription = supabase
      .channel('community_posts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, (payload) => {
        console.log('Community post change detected:', payload);
        fetchCommunityPosts(); // Refetch posts
        fetchStats(); // Update stats
      })
      .subscribe();

    // Subscribe to video changes
    const videosSubscription = supabase
      .channel('videos_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'videos' }, (payload) => {
        console.log('Video change detected:', payload);
        fetchStats(); // Update stats
      })
      .subscribe();

    // Subscribe to notification changes
    const notificationsSubscription = supabase
      .channel('notifications_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, (payload) => {
        console.log('Notification change detected:', payload);
        fetchNotifications();
      })
      .subscribe();

    subscriptions.push(profilesSubscription, postsSubscription, videosSubscription, notificationsSubscription);

    return () => {
      subscriptions.forEach(sub => {
        supabase.removeChannel(sub);
      });
    };
  }, []);

  // Fetch users with proper error handling and typing
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      // Query auth.users joined with profiles
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) throw authError;

      // Get profiles for these users
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*');

      if (profileError) throw profileError;

      // Combine auth data with profile data
      const combinedUsers: UserProfile[] = authUsers.users.map(authUser => {
        const profile = profiles.find(p => p.id === authUser.id);
        return {
          id: authUser.id,
          first_name: profile?.first_name || null,
          last_name: profile?.last_name || null,
          phone: profile?.phone || null,
          avatar_url: profile?.avatar_url || null,
          role: profile?.role || 'user',
          created_at: profile?.created_at || authUser.created_at,
          updated_at: profile?.updated_at || authUser.updated_at,
          email: authUser.email,
          email_confirmed_at: authUser.email_confirmed_at,
          last_sign_in_at: authUser.last_sign_in_at
        };
      });

      setUsers(combinedUsers);
      console.log('Users fetched successfully:', combinedUsers.length);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(`Failed to fetch users: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Fetch community posts with proper error handling
  const fetchCommunityPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name
          )
        `);

      // Apply filters
      if (postFilter.discipline !== 'all') {
        query = query.eq('discipline', postFilter.discipline);
      }

      if (postFilter.published !== 'all') {
        query = query.eq('is_published', postFilter.published === 'published');
      }

      if (postFilter.search) {
        query = query.or(`title.ilike.%${postFilter.search}%,content.ilike.%${postFilter.search}%`);
      }

      // Apply sorting
      switch (postFilter.sortBy) {
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        case 'likes':
          query = query.order('likes_count', { ascending: false });
          break;
        case 'comments':
          query = query.order('comments_count', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      setCommunityPosts(data as CommunityPost[]);

      // Calculate stats
      const totalLikes = (data || []).reduce((sum, post) => sum + (post.likes_count || 0), 0);
      const totalComments = (data || []).reduce((sum, post) => sum + (post.comments_count || 0), 0);
      const uniqueUsers = new Set((data || []).map(post => post.user_id)).size;

      setCommunityStats({
        totalPosts: data?.length || 0,
        totalLikes,
        totalComments,
        totalUsers: uniqueUsers
      });

      console.log('Community posts fetched successfully:', data?.length || 0);
    } catch (error: any) {
      console.error('Error fetching community posts:', error);
      setError(`Failed to fetch community posts: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoadingPosts(false);
    }
  }, [postFilter]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setLoadingNotifications(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setNotifications(data || []);
      console.log('Notifications fetched successfully:', data?.length || 0);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      setError(`Failed to fetch notifications: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  // Fetch comprehensive stats
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);

      // Parallel fetch all stats
      const [
        { count: usersCount },
        { count: activeCount },
        { count: programsCount },
        { count: bookingsCount },
        { count: videosCount },
        { count: postsCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles')
          .select('*', { count: 'exact', head: true })
          .gt('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('fitness_programs').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('videos').select('*', { count: 'exact', head: true }),
        supabase.from('community_posts').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalUsers: usersCount || 0,
        activeUsers: activeCount || 0,
        totalPrograms: programsCount || 0,
        totalBookings: bookingsCount || 0,
        totalVideos: videosCount || 0,
        totalPosts: postsCount || 0
      });

      console.log('Stats updated successfully');
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      setError(`Failed to fetch stats: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchCommunityPosts();
    fetchNotifications();
  }, [fetchStats, fetchUsers, fetchCommunityPosts, fetchNotifications]);

  // Refetch community posts when filter changes
  useEffect(() => {
    fetchCommunityPosts();
  }, [fetchCommunityPosts]);

  // Delete community post
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setSuccess('Post deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      // Real-time subscription will handle the UI update
    } catch (error: any) {
      console.error('Error deleting post:', error);
      setError(`Failed to delete post: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    }
  };

  // Toggle post publication status
  const handleTogglePostPublication = async (postId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ is_published: !currentStatus })
        .eq('id', postId);

      if (error) throw error;

      setSuccess(`Post ${!currentStatus ? 'published' : 'unpublished'} successfully`);
      setTimeout(() => setSuccess(''), 3000);
      // Real-time subscription will handle the UI update
    } catch (error: any) {
      console.error('Error updating post status:', error);
      setError(`Failed to update post status: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    }
  };

  // Pin/Unpin post
  const handleTogglePostPin = async (postId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ is_pinned: !currentStatus })
        .eq('id', postId);

      if (error) throw error;

      setSuccess(`Post ${!currentStatus ? 'pinned' : 'unpinned'} successfully`);
      setTimeout(() => setSuccess(''), 3000);
      // Real-time subscription will handle the UI update
    } catch (error: any) {
      console.error('Error updating post pin status:', error);
      setError(`Failed to update post pin status: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    }
  };

  // Update user role
  const handleUpdateUserRole = async (userId: string, newRole: 'user' | 'admin' | 'moderator') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setSuccess(`User role updated to ${newRole} successfully`);
      setTimeout(() => setSuccess(''), 3000);
      // Real-time subscription will handle the UI update
    } catch (error: any) {
      console.error('Error updating user role:', error);
      setError(`Failed to update user role: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    }
  };

  // Send global notification
  const sendGlobalNotification = async (title: string, message: string, type: string = 'info') => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          title,
          message,
          type,
          user_id: null, // Global notification
          is_global: true,
          priority: 2,
          category: 'admin'
        });

      if (error) throw error;

      setSuccess('Global notification sent successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      console.error('Error sending notification:', error);
      setError(`Failed to send notification: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    }
  };

  const formatUserName = (user: UserProfile) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.email || 'Unknown User';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Control Panel</h1>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>

      {success && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard">
            <BarChart className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="h-4 w-4 mr-2" />
            Community
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="h-4 w-4 mr-2" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="academy">
            <BookOpen className="h-4 w-4 mr-2" />
            Academy
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Registered users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPrograms}</div>
                <p className="text-xs text-muted-foreground">
                  Fitness programs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  Service bookings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVideos}</div>
                <p className="text-xs text-muted-foreground">
                  Educational content
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPosts}</div>
                <p className="text-xs text-muted-foreground">
                  Community posts
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest user activity and system events</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading activity...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Real-time activity tracking active</p>
                    <div className="text-xs text-green-600">✓ Connected to real-time updates</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Application health and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Real-time Updates</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">File Storage</span>
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>User Management</span>
                <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loadingUsers}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loadingUsers ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardTitle>
              <CardDescription>View and manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-3">Loading users...</span>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No users found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user) => (
                      <Card key={user.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg flex items-center gap-2">
                              {formatUserName(user)}
                              {user.role === 'admin' && <Crown className="h-4 w-4 text-yellow-500" />}
                            </CardTitle>
                            <Badge className={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs">
                            {user.email}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-xs text-muted-foreground">
                            <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                            {user.last_sign_in_at && (
                              <p>Last seen: {new Date(user.last_sign_in_at).toLocaleDateString()}</p>
                            )}
                            <p className="flex items-center gap-1">
                              Email:
                              {user.email_confirmed_at ? (
                                <UserCheck className="h-3 w-3 text-green-500" />
                              ) : (
                                <UserX className="h-3 w-3 text-red-500" />
                              )}
                              {user.email_confirmed_at ? 'Verified' : 'Unverified'}
                            </p>
                          </div>

                          <div className="flex gap-1">
                            <Select
                              value={user.role}
                              onValueChange={(newRole: 'user' | 'admin' | 'moderator') =>
                                handleUpdateUserRole(user.id, newRole)
                              }
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="moderator">Moderator</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community Management Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Community Management</span>
                <Button variant="outline" size="sm" onClick={fetchCommunityPosts} disabled={loadingPosts}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loadingPosts ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardTitle>
              <CardDescription>Manage community posts and discussions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Community Stats */}
                <Card>
                  <CardContent className="py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-lg font-semibold">{communityStats.totalPosts}</div>
                        <div className="text-sm text-muted-foreground">Total Posts</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="text-lg font-semibold">{communityStats.totalLikes}</div>
                        <div className="text-sm text-muted-foreground">Total Likes</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-purple-500" />
                      <div>
                        <div className="text-lg font-semibold">{communityStats.totalComments}</div>
                        <div className="text-sm text-muted-foreground">Total Comments</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-orange-500" />
                      <div>
                        <div className="text-lg font-semibold">{communityStats.totalUsers}</div>
                        <div className="text-sm text-muted-foreground">Active Contributors</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="post-discipline">Filter by Discipline</Label>
                    <Select
                      value={postFilter.discipline}
                      onValueChange={(value) => setPostFilter({ ...postFilter, discipline: value })}
                    >
                      <SelectTrigger id="post-discipline">
                        <SelectValue placeholder="All Disciplines" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Disciplines</SelectItem>
                        <SelectItem value="forex">Forex</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="karate">Karate</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="post-published">Publication Status</Label>
                    <Select
                      value={postFilter.published}
                      onValueChange={(value) => setPostFilter({ ...postFilter, published: value })}
                    >
                      <SelectTrigger id="post-published">
                        <SelectValue placeholder="All Posts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Posts</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Drafts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="post-sort">Sort By</Label>
                    <Select
                      value={postFilter.sortBy}
                      onValueChange={(value) => setPostFilter({ ...postFilter, sortBy: value })}
                    >
                      <SelectTrigger id="post-sort">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="likes">Most Liked</SelectItem>
                        <SelectItem value="comments">Most Comments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="post-search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="post-search"
                        placeholder="Search posts..."
                        value={postFilter.search}
                        onChange={(e) => setPostFilter({ ...postFilter, search: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Posts List */}
                <div className="space-y-4">
                  {loadingPosts ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-3">Loading posts...</span>
                    </div>
                  ) : communityPosts.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">No community posts found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {communityPosts.map((post) => (
                        <Card key={post.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-lg">{post.title}</CardTitle>
                                {post.is_pinned && (
                                  <Badge className="bg-yellow-100 text-yellow-800">Pinned</Badge>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Badge variant="outline" className="capitalize">{post.discipline}</Badge>
                                <Badge className={post.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                  {post.is_published ? 'Published' : 'Draft'}
                                </Badge>
                              </div>
                            </div>
                            <CardDescription className="text-xs">
                              By {post.profiles?.first_name} {post.profiles?.last_name} on {new Date(post.created_at).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">{post.content}</p>
                            <div className="flex justify-between items-center">
                              <div className="flex gap-2">
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" /> {post.likes_count || 0}
                                </Badge>
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" /> {post.comments_count || 0}
                                </Badge>
                                {post.tags && post.tags.length > 0 && (
                                  <Badge variant="secondary">
                                    Tags: {post.tags.slice(0, 2).join(', ')}
                                    {post.tags.length > 2 && '...'}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleTogglePostPin(post.id, post.is_pinned)}
                                  title={post.is_pinned ? "Unpin post" : "Pin post"}
                                  className={post.is_pinned ? "text-yellow-600 border-yellow-200" : ""}
                                >
                                  {post.is_pinned ? "Unpin" : "Pin"}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleTogglePostPublication(post.id, post.is_published)}
                                  className={post.is_published ? "text-gray-600" : "text-green-600"}
                                >
                                  {post.is_published ? "Unpublish" : "Publish"}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeletePost(post.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-4">
          <VideoManagement />
        </TabsContent>

        {/* Academy Tab */}
        <TabsContent value="academy" className="space-y-4">
          <AcademyContentManager />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Send Global Notification</CardTitle>
                <CardDescription>Send a notification to all users</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const title = formData.get('title') as string;
                  const message = formData.get('message') as string;
                  const type = formData.get('type') as string;

                  if (title && message) {
                    sendGlobalNotification(title, message, type);
                    (e.target as HTMLFormElement).reset();
                  }
                }}>
                  <div className="space-y-2">
                    <Label htmlFor="notification-title">Notification Title</Label>
                    <Input
                      id="notification-title"
                      name="title"
                      placeholder="Enter notification title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notification-type">Type</Label>
                    <Select name="type" defaultValue="info">
                      <SelectTrigger id="notification-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notification-message">Message</Label>
                    <textarea
                      id="notification-message"
                      name="message"
                      className="w-full min-h-[100px] p-2 border rounded-md resize-none"
                      placeholder="Enter notification message"
                      required
                    ></textarea>
                  </div>

                  <Button type="submit" className="w-full">
                    <Bell className="h-4 w-4 mr-2" />
                    Send Notification
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Notifications</span>
                  <Button variant="outline" size="sm" onClick={fetchNotifications} disabled={loadingNotifications}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loadingNotifications ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </CardTitle>
                <CardDescription>Recently sent notifications</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingNotifications ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading notifications...</span>
                  </div>
                ) : notifications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No notifications sent yet.</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="border rounded p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-sm">{notification.title}</h5>
                          <Badge className={
                            notification.type === 'success' ? 'bg-green-100 text-green-800' :
                              notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                notification.type === 'error' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                          }>
                            {notification.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                          {notification.is_global && (
                            <Badge variant="outline">Global</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Real-time Updates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Community Posts</span>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">User Profiles</span>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Videos</span>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Notifications</span>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Database Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Connection</span>
                          <Badge className="bg-green-100 text-green-800">Connected</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">RLS Policies</span>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Admin Access</span>
                          <Badge className="bg-green-100 text-green-800">Verified</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <Button variant="outline" onClick={fetchStats}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh All Stats
                      </Button>
                      <Button variant="outline" onClick={fetchUsers}>
                        <Users className="h-4 w-4 mr-2" />
                        Reload Users
                      </Button>
                      <Button variant="outline" onClick={fetchCommunityPosts}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Reload Posts
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};