import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  Upload, 
  Radio, 
  Library, 
  Users, 
  Settings,
  BarChart3,
  Calendar,
  FileText,
  Play,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import VideoUploadManager from './videoUpload';
import LiveStreamManager from './LiveStreamGrid';
import VideoLibraryManager from './VideoLibrary';
import ConferenceManager from './VideoConference';
import AdminNotes from './AdminNotes';
import { AdminAnalytics } from "AdminAnalytics";

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalVideos: 0,
    liveStreams: 0,
    activeUsers: 0,
    totalViews: 0,
    scheduledSessions: 0,
    uploadedToday: 0
  });

  useEffect(() => {
    // Load dashboard statistics
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    // Mock data - replace with actual API calls
    setStats({
      totalVideos: 156,
      liveStreams: 3,
      activeUsers: 47,
      totalViews: 12450,
      scheduledSessions: 8,
      uploadedToday: 5
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-vintage-deep-blue rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-playfair text-2xl font-bold text-vintage-deep-blue">
                Admin Dashboard
              </h1>
              <p className="text-sm text-vintage-dark-brown/70">
                Manage video content and streaming services
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close Dashboard
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-7 w-full bg-gray-50">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="live" className="flex items-center gap-2">
                <Radio className="w-4 h-4" />
                Live Streams
              </TabsTrigger>
              <TabsTrigger value="library" className="flex items-center gap-2">
                <Library className="w-4 h-4" />
                Video Library
              </TabsTrigger>
              <TabsTrigger value="conference" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Conferences
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {/* Stats Cards */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                      <Video className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalVideos}</div>
                      <p className="text-xs text-muted-foreground">
                        +{stats.uploadedToday} uploaded today
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Live Streams</CardTitle>
                      <Radio className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.liveStreams}</div>
                      <p className="text-xs text-muted-foreground">
                        Currently broadcasting
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                      <Users className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.activeUsers}</div>
                      <p className="text-xs text-muted-foreground">
                        Online right now
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                      <Play className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        All time views
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Scheduled Sessions</CardTitle>
                      <Calendar className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.scheduledSessions}</div>
                      <p className="text-xs text-muted-foreground">
                        This week
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                      <PlusCircle className="h-4 w-4 text-vintage-gold" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button size="sm" className="w-full" onClick={() => setActiveTab('upload')}>
                        Upload Video
                      </Button>
                      <Button size="sm" variant="outline" className="w-full" onClick={() => setActiveTab('live')}>
                        Start Live Stream
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-800">Upload</Badge>
                        <span className="text-sm">New fitness video uploaded: "Core Strength Training"</span>
                        <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-red-100 text-red-800">Live</Badge>
                        <span className="text-sm">Live stream started: "Forex Market Analysis"</span>
                        <span className="text-xs text-gray-500 ml-auto">4 hours ago</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-100 text-blue-800">Conference</Badge>
                        <span className="text-sm">New 1-on-1 session scheduled for tomorrow</span>
                        <span className="text-xs text-gray-500 ml-auto">6 hours ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upload" className="mt-0">
                <VideoUploadManager />
              </TabsContent>

              <TabsContent value="live" className="mt-0">
                <LiveStreamManager />
              </TabsContent>

              <TabsContent value="library" className="mt-0">
                <VideoLibraryManager />
              </TabsContent>

              <TabsContent value="conference" className="mt-0">
                <ConferenceManager />
              </TabsContent>

              <TabsContent value="notes" className="mt-0">
                <AdminNotes />
              </TabsContent>

            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;