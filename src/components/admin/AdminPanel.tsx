import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Users,
  Settings,
  Bell,
  FileText,
  BarChart,
  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Video,
  Play,
  Upload
} from 'lucide-react';

// Video interface
interface VideoData {
  id: string;
  title: string;
  description: string;
  category: 'forex' | 'fitness' | 'karate';
  url: string;
  thumbnail?: string;
  created_at: string;
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

// Admin emails - these would typically be stored in a more secure way
const ADMIN_EMAILS = ['lateefedidi4@gmail.com', 'Andrewcares556@gmail.com'];
const ADMIN_PASSWORD = 'ADMIN_ANDREWCARES';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    }
  };

  // Mock initial videos (for demonstration purposes)
  useEffect(() => {
    if (isAdmin && uploadedVideos.length === 0) {
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
  }, [isAdmin, uploadedVideos.length]);

  // Admin verification
  useEffect(() => {
    const verifyAdmin = async () => {
      setIsVerifying(true);

      if (!user || !user.email) {
        setIsAdmin(false);
        setIsVerifying(false);
        return;
      }

      // Check if user email is in admin list
      const isAdminEmail = ADMIN_EMAILS.includes(user.email.toLowerCase());
      setIsAdmin(isAdminEmail);
      setIsVerifying(false);
    };

    verifyAdmin();
  }, [user]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!isAdmin) return;

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
      }
    };

    fetchStats();
  }, [isAdmin]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setError('');
      setSuccess('Admin access granted');
    } else {
      setError('Invalid admin password');
      setSuccess('');
    }
  };

  // Function to send a notification to all users
  // Since we don't have a notifications table, we'll simulate it for now
  const sendGlobalNotification = async (title: string, message: string) => {
    try {
      // In a real implementation, you would create a notifications table
      // and insert the notification there

      // For now, we'll just simulate success
      console.log('Sending notification:', { title, message });

      setSuccess('Notification sent successfully (simulated)');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error sending notification:', error);
      setError('Failed to send notification');
      setTimeout(() => setError(''), 3000);
    }
  };

  // If user is not logged in or not an admin and hasn't verified password
  if (!isAdmin && !isVerifying) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Admin Verification
          </CardTitle>
          <CardDescription>
            Enter the admin password to access the control panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Admin Password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">Verify Admin Access</Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Admin panel content
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
        <TabsList className="grid w-full grid-cols-5">
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

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Upload</CardTitle>
              <CardDescription>Upload educational videos for different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get('title') as string;
                const description = formData.get('description') as string;
                const category = formData.get('category') as string;
                const videoFile = formData.get('video') as File;

                if (title && description && category && videoFile) {
                  uploadVideo(title, description, category, videoFile);
                  (e.target as HTMLFormElement).reset();
                }
              }}>
                <div className="space-y-2">
                  <Label htmlFor="video-title">Video Title</Label>
                  <Input
                    id="video-title"
                    name="title"
                    placeholder="Enter video title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video-description">Description</Label>
                  <textarea
                    id="video-description"
                    name="description"
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    placeholder="Enter video description"
                    required
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video-category">Category</Label>
                  <select
                    id="video-category"
                    name="category"
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="forex">Forex</option>
                    <option value="fitness">Fitness</option>
                    <option value="karate">Karate</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video-file">Video File</Label>
                  <Input
                    id="video-file"
                    name="video"
                    type="file"
                    accept="video/*"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">Upload Video</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uploaded Videos</CardTitle>
              <CardDescription>Manage your uploaded videos</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="forex" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="forex">Forex</TabsTrigger>
                  <TabsTrigger value="fitness">Fitness</TabsTrigger>
                  <TabsTrigger value="karate">Karate</TabsTrigger>
                </TabsList>

                <TabsContent value="forex" className="space-y-4 mt-4">
                  {uploadedVideos.filter(video => video.category === 'forex').length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {uploadedVideos
                        .filter(video => video.category === 'forex')
                        .map((video, index) => (
                          <VideoCard key={index} video={video} onDelete={handleDeleteVideo} />
                        ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No forex videos uploaded yet.</p>
                  )}
                </TabsContent>

                <TabsContent value="fitness" className="space-y-4 mt-4">
                  {uploadedVideos.filter(video => video.category === 'fitness').length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {uploadedVideos
                        .filter(video => video.category === 'fitness')
                        .map((video, index) => (
                          <VideoCard key={index} video={video} onDelete={handleDeleteVideo} />
                        ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No fitness videos uploaded yet.</p>
                  )}
                </TabsContent>

                <TabsContent value="karate" className="space-y-4 mt-4">
                  {uploadedVideos.filter(video => video.category === 'karate').length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {uploadedVideos
                        .filter(video => video.category === 'karate')
                        .map((video, index) => (
                          <VideoCard key={index} video={video} onDelete={handleDeleteVideo} />
                        ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No karate videos uploaded yet.</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
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

export default AdminPanel;