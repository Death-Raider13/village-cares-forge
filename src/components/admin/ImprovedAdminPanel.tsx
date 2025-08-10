import React, { useState, useEffect } from 'react';
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
  AlertTriangle
} from 'lucide-react';
import { CommunityPost } from '@/pages/Community';

// Interfaces
interface VideoData {
  id: string;
  title: string;
  description: string;
  category: 'forex' | 'fitness' | 'karate';
  url: string;
  thumbnail?: string;
  created_at: string;
}

interface CommunityStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
}

interface PostFilter {
  discipline: string;
  sortBy: string;
  search: string;
}

// VideoCard component
interface VideoCardProps {
  video: VideoData;
  onDelete: (id: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDelete }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-gray-100">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black bg-opacity-60 rounded-full p-3 hover:bg-opacity-80 transition-all"
          >
            <Play className="h-8 w-8 text-white" />
          </a>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{video.title}</CardTitle>
        <CardDescription className="text-xs">
          {new Date(video.created_at).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
            {video.category.charAt(0).toUpperCase() + video.category.slice(1)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(video.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface ImprovedAdminPanelProps {
  onClose: () => void;
}

export const ImprovedAdminPanel: React.FC<ImprovedAdminPanelProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Videos state
  const [uploadedVideos, setUploadedVideos] = useState<VideoData[]>([]);

  // Stats for dashboard
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPrograms: 0,
    totalBookings: 0
  });

  // Community management state
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [communityStats, setCommunityStats] = useState<CommunityStats>({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0
  });
  const [postFilter, setPostFilter] = useState<PostFilter>({
    discipline: 'all',
    sortBy: 'recent',
    search: ''
  });

  // Fetch community posts with proper TypeScript typing
  const fetchCommunityPosts = async () => {
    setLoadingPosts(true);
    try {
      // Use type assertion to bypass TypeScript checks
      let query = supabase
        .from('community_posts' as any)
        .select('*') as any;

      // Apply discipline filter
      if (postFilter.discipline !== 'all') {
        query = query.eq('discipline', postFilter.discipline);
      }

      // Apply search filter
      if (postFilter.search) {
        query = query.or(`title.ilike.%${postFilter.search}%,content.ilike.%${postFilter.search}%`);
      }

      // Apply sorting
      if (postFilter.sortBy === 'recent') {
        query = query.order('created_at', { ascending: false });
      } else if (postFilter.sortBy === 'likes') {
        query = query.order('likes_count', { ascending: false });
      } else if (postFilter.sortBy === 'comments') {
        query = query.order('comments_count', { ascending: false });
      }

      const { data, error } = await query.limit(50) as any;

      if (error) {
        throw error;
      }

      // Safely cast data to CommunityPost[]
      const typedData = data as unknown as CommunityPost[];
      setCommunityPosts(typedData);

      // Calculate actual stats from the data
      const totalLikes = typedData.reduce((sum, post) => sum + (post.likes_count || 0), 0);
      const totalComments = typedData.reduce((sum, post) => sum + (post.comments_count || 0), 0);

      setCommunityStats({
        totalPosts: typedData.length,
        totalLikes,
        totalComments
      });

    } catch (error) {
      console.error('Error fetching community posts:', error);
      setError('Failed to fetch community posts');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Delete community post with proper TypeScript typing
  const handleDeletePost = async (postId: string) => {
    try {
      // Delete post with proper typing
      const { error } = await supabase
        .from('community_posts' as any)
        .delete()
        .eq('id', postId) as any;

      if (error) {
        throw error;
      }

      // Update posts list
      const updatedPosts = communityPosts.filter(post => post.id !== postId);
      setCommunityPosts(updatedPosts);

      // Update stats
      setCommunityStats(prev => ({
        ...prev,
        totalPosts: prev.totalPosts - 1,
        totalLikes: prev.totalLikes - (communityPosts.find(p => p.id === postId)?.likes_count || 0),
        totalComments: prev.totalComments - (communityPosts.find(p => p.id === postId)?.comments_count || 0)
      }));

      setSuccess('Post deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Fetch community posts on mount and when filter changes
  useEffect(() => {
    fetchCommunityPosts();
  }, [postFilter]);

  // Mock video upload function (simulated, not actually using Supabase)
  const uploadVideo = async (
    title: string,
    description: string,
    category: string,
    videoFile: File
  ) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError('');

      // Simulate upload progress
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);

            // Create a mock video object
            const newVideo: VideoData = {
              id: Math.random().toString(36).substring(2, 15),
              title,
              description,
              category: category as 'forex' | 'fitness' | 'karate',
              url: URL.createObjectURL(videoFile), // Create a local URL for the video
              created_at: new Date().toISOString(),
            };

            // Add the new video to the state
            setUploadedVideos((prev) => [newVideo, ...prev]);
            setSuccess('Video uploaded successfully!');
            setTimeout(() => setSuccess(''), 3000);
            setIsUploading(false);
          }
        }, 300);
      };

      // Start the simulated upload
      simulateProgress();
    } catch (error) {
      console.error('Error uploading video:', error);
      setError('Failed to upload video. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Mock delete video function
  const handleDeleteVideo = (id: string) => {
    try {
      // Remove the video from the state
      setUploadedVideos((prev) => prev.filter((video) => video.id !== id));
      setSuccess('Video deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting video:', error);
      setError('Failed to delete video. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Mock initial videos (for demonstration purposes)
  useEffect(() => {
    if (uploadedVideos.length === 0) {
      // Add some mock videos for demonstration
      const mockVideos: VideoData[] = [
        {
          id: '1',
          title: 'Forex Trading Basics',
          description: 'Learn the fundamentals of forex trading in this comprehensive guide.',
          category: 'forex',
          url: 'https://example.com/videos/forex-basics.mp4',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        },
        {
          id: '2',
          title: 'Advanced Fitness Workout',
          description: 'High-intensity interval training for advanced fitness enthusiasts.',
          category: 'fitness',
          url: 'https://example.com/videos/advanced-fitness.mp4',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        },
        {
          id: '3',
          title: 'Karate Kata Tutorial',
          description: 'Step-by-step tutorial for the Heian Shodan kata.',
          category: 'karate',
          url: 'https://example.com/videos/karate-kata.mp4',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        },
      ];

      setUploadedVideos(mockVideos);
    }
  }, [uploadedVideos.length]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users count
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // Fetch active users (assuming profiles with recent updates are active)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count: activeCount, error: activeError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gt('updated_at', thirtyDaysAgo.toISOString());

        if (activeError) throw activeError;

        // Fetch fitness programs count
        const { count: fitnessCount, error: fitnessError } = await supabase
          .from('fitness_programs')
          .select('*', { count: 'exact', head: true });

        if (fitnessError) throw fitnessError;

        // Fetch bookings count
        const { count: bookingsCount, error: bookingsError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true });

        if (bookingsError) throw bookingsError;

        setStats({
          totalUsers: usersCount || 0,
          activeUsers: activeCount || 0,
          totalPrograms: fitnessCount || 0,
          totalBookings: bookingsCount || 0
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        setError('Failed to fetch admin stats');
        setTimeout(() => setError(''), 3000);
      }
    };

    fetchStats();
  }, []);

  // Enhanced notification system using Supabase
  const sendGlobalNotification = async (title: string, message: string) => {
    try {
      // Insert global notification into Supabase notifications table
      const { error } = await supabase
        .from('notifications')
        .insert({
          title,
          message,
          type: 'info',
          user_id: null, // Global notifications don't have a specific user
          read: false
        });

      if (error) throw error;

      setSuccess('Global notification sent successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error sending notification:', error);
      setError('Failed to send notification');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="container mx-auto py-6">
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
            Content
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
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
                  {stats.totalUsers > 0
                    ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total users`
                    : '0% of total users'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPrograms}</div>
                <p className="text-xs text-muted-foreground">
                  Fitness, Forex, and Martial Arts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  Service bookings
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
                <Users className="h-5 w-5" />
                <span>Manage Users</span>
              </Button>

              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
                <Bell className="h-5 w-5" />
                <span>Send Notification</span>
              </Button>

              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
                <FileText className="h-5 w-5" />
                <span>Edit Content</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community Management Tab (formerly Content Tab) */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Management</CardTitle>
              <CardDescription>Manage community posts and discussions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Community Posts</h3>
                  <Button variant="outline" size="sm" onClick={() => {
                    // Refresh posts
                    fetchCommunityPosts();
                  }}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                {/* Community Stats */}
                <Card>
                  <CardContent className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-vintage-burgundy" />
                      <div>
                        <div className="text-lg font-semibold">{communityStats.totalPosts || 0}</div>
                        <div className="text-sm text-muted-foreground">Total Posts</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-5 w-5 text-vintage-burgundy" />
                      <div>
                        <div className="text-lg font-semibold">{communityStats.totalLikes || 0}</div>
                        <div className="text-sm text-muted-foreground">Total Likes</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-vintage-burgundy" />
                      <div>
                        <div className="text-lg font-semibold">{communityStats.totalComments || 0}</div>
                        <div className="text-sm text-muted-foreground">Total Comments</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-deep-blue"></div>
                      <span className="ml-3 text-vintage-dark-brown">Loading posts...</span>
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
                              <CardTitle className="text-lg">{post.title}</CardTitle>
                              <Badge variant="outline" className="capitalize">{post.discipline}</Badge>
                            </div>
                            <CardDescription className="text-xs">
                              Posted on {new Date(post.created_at).toLocaleDateString()}
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
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
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

                if (title && message) {
                  sendGlobalNotification(title, message);
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
                  <Label htmlFor="notification-message">Message</Label>
                  <textarea
                    id="notification-message"
                    name="message"
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    placeholder="Enter notification message"
                    required
                  ></textarea>
                </div>

                <Button type="submit">Send Notification</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>View previously sent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Notification history will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academy Tab */}
        <TabsContent value="academy" className="space-y-4">
          <AcademyContentManager />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Settings</CardTitle>
              <CardDescription>Configure global website settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Website settings functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};