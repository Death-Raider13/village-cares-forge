import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Library, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Star,
  Clock,
  Play,
  MoreHorizontal,
  TrendingUp,
  Users,
  Settings,
  Tag,
  Calendar
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: 'fitness' | 'karate' | 'forex';
  type: 'course' | 'workout' | 'tutorial' | 'analysis';
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  views: number;
  likes: number;
  thumbnail: string;
  videoUrl: string;
  tags: string[];
  uploadDate: string;
  status: 'published' | 'draft' | 'private' | 'archived';
  fileSize: number; // in MB
  resolution: string;
  engagement: {
    watchTime: number; // in minutes
    completionRate: number; // percentage
    comments: number;
    shares: number;
  };
}

const VideoLibraryManager: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: 'fitness' as 'fitness' | 'karate' | 'forex',
    type: 'tutorial' as 'course' | 'workout' | 'tutorial' | 'analysis',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    tags: [] as string[],
    status: 'published' as 'published' | 'draft' | 'private' | 'archived'
  });

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [videos, searchQuery, filterCategory, filterStatus, sortBy]);

  const loadVideos = async () => {
    // Mock data - replace with actual API call
    const mockVideos: Video[] = [
      {
        id: '1',
        title: 'Full Body HIIT Workout - 30 Minutes',
        description: 'High-intensity interval training workout targeting all major muscle groups.',
        instructor: 'Sarah Mitchell',
        category: 'fitness',
        type: 'workout',
        duration: 30,
        difficulty: 'intermediate',
        rating: 4.8,
        views: 1250,
        likes: 98,
        thumbnail: '/placeholder.svg',
        videoUrl: 'https://example.com/video1',
        tags: ['HIIT', 'Full Body', 'Cardio', 'Strength'],
        uploadDate: '2024-01-20',
        status: 'published',
        fileSize: 245,
        resolution: '1080p',
        engagement: {
          watchTime: 28,
          completionRate: 85,
          comments: 23,
          shares: 12
        }
      },
      {
        id: '2',
        title: 'Karate Kata: Heian Shodan Tutorial',
        description: 'Step-by-step guide to mastering the first Heian kata.',
        instructor: 'Sensei Kenji Tanaka',
        category: 'karate',
        type: 'tutorial',
        duration: 45,
        difficulty: 'beginner',
        rating: 4.9,
        views: 890,
        likes: 76,
        thumbnail: '/placeholder.svg',
        videoUrl: 'https://example.com/video2',
        tags: ['Kata', 'Heian', 'Beginner', 'Technique'],
        uploadDate: '2024-01-18',
        status: 'published',
        fileSize: 180,
        resolution: '720p',
        engagement: {
          watchTime: 42,
          completionRate: 92,
          comments: 18,
          shares: 8
        }
      },
      {
        id: '3',
        title: 'Forex Trading Psychology Draft',
        description: 'Understanding the mental aspects of trading.',
        instructor: 'Michael Thompson',
        category: 'forex',
        type: 'course',
        duration: 120,
        difficulty: 'intermediate',
        rating: 0,
        views: 0,
        likes: 0,
        thumbnail: '/placeholder.svg',
        videoUrl: 'https://example.com/video3',
        tags: ['Psychology', 'Trading', 'Mindset'],
        uploadDate: '2024-01-22',
        status: 'draft',
        fileSize: 450,
        resolution: '1080p',
        engagement: {
          watchTime: 0,
          completionRate: 0,
          comments: 0,
          shares: 0
        }
      }
    ];

    setVideos(mockVideos);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = videos;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(video => video.category === filterCategory);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(video => video.status === filterStatus);
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        filtered.sort((a, b) => a.duration - b.duration);
        break;
    }

    setFilteredVideos(filtered);
  };

  const openEditModal = (video: Video) => {
    setSelectedVideo(video);
    setEditForm({
      title: video.title,
      description: video.description,
      category: video.category,
      type: video.type,
      difficulty: video.difficulty,
      tags: video.tags,
      status: video.status
    });
    setIsEditModalOpen(true);
  };

  const saveVideoChanges = () => {
    if (!selectedVideo) return;

    const updatedVideo = {
      ...selectedVideo,
      ...editForm
    };

    setVideos(prev => prev.map(v => v.id === selectedVideo.id ? updatedVideo : v));
    setIsEditModalOpen(false);
    setSelectedVideo(null);
  };

  const deleteVideo = (videoId: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      setVideos(prev => prev.filter(v => v.id !== videoId));
    }
  };

  const toggleVideoStatus = (videoId: string, newStatus: Video['status']) => {
    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, status: newStatus } : v));
  };

  const addTag = (tag: string) => {
    if (tag && !editForm.tags.includes(tag)) {
      setEditForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const getStatusColor = (status: Video['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'private': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: Video['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
    }
  };

  const formatFileSize = (sizeInMB: number) => {
    return sizeInMB > 1024 ? `${(sizeInMB / 1024).toFixed(1)} GB` : `${sizeInMB} MB`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-deep-blue"></div>
          <span className="ml-3 text-vintage-dark-brown">Loading video library...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Library Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Videos</p>
                <p className="text-2xl font-bold">{videos.length}</p>
              </div>
              <Library className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">{videos.reduce((sum, v) => sum + v.views, 0).toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {(videos.filter(v => v.rating > 0).reduce((sum, v) => sum + v.rating, 0) / 
                    videos.filter(v => v.rating > 0).length || 0).toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold">
                  {formatFileSize(videos.reduce((sum, v) => sum + v.fileSize, 0))}
                </p>
              </div>
              <Download className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Video Library Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search videos, instructors, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="karate">Karate</SelectItem>
                <SelectItem value="forex">Forex</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="duration">Shortest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredVideos.length} of {videos.length} videos
          </div>
        </CardContent>
      </Card>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="relative aspect-video bg-gray-900">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover"
              />
              
              {/* Status Badge */}
              <Badge className={`absolute top-2 left-2 ${getStatusColor(video.status)}`}>
                {video.status.toUpperCase()}
              </Badge>

              {/* Duration Badge */}
              <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
                <Clock className="w-3 h-3 mr-1" />
                {formatDuration(video.duration)}
              </Badge>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="lg"
                  className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </Button>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600">by {video.instructor}</p>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(video)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteVideo(video.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {video.category}
                  </Badge>
                  <Badge className={getDifficultyColor(video.difficulty)}>
                    {video.difficulty}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {video.type}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span>{video.views.toLocaleString()} views</span>
                  </div>
                  
                  {video.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{video.rating}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{video.engagement.completionRate}% completion</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4 text-gray-400" />
                    <span>{formatFileSize(video.fileSize)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {video.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {video.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{video.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  Uploaded: {new Date(video.uploadDate).toLocaleDateString()}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  {video.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => toggleVideoStatus(video.id, 'published')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Publish
                    </Button>
                  )}
                  
                  {video.status === 'published' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleVideoStatus(video.id, 'private')}
                    >
                      Make Private
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <Card className="p-8 text-center">
          <Library className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No videos found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </Card>
      )}

      {/* Edit Video Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={editForm.category}
                  onValueChange={(value: 'fitness' | 'karate' | 'forex') => 
                    setEditForm(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="karate">Karate</SelectItem>
                    <SelectItem value="forex">Forex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Type</Label>
                <Select
                  value={editForm.type}
                  onValueChange={(value: 'course' | 'workout' | 'tutorial' | 'analysis') => 
                    setEditForm(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="workout">Workout</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Difficulty</Label>
                <Select
                  value={editForm.difficulty}
                  onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                    setEditForm(prev => ({ ...prev, difficulty: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value: 'published' | 'draft' | 'private' | 'archived') => 
                    setEditForm(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {editForm.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const tag = prompt('Enter tag:');
                    if (tag) addTag(tag);
                  }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  Add Tag
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={saveVideoChanges}
                className="bg-vintage-deep-blue hover:bg-vintage-burgundy"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoLibraryManager;