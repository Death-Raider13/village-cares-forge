import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Video,
  Play,
  Upload,
  Trash2,
  Edit3,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Filter,
  Search,
  RefreshCw,
  PlusCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Video interface
interface VideoData {
  id: string;
  title: string;
  description: string;
  category: 'forex' | 'fitness' | 'karate';
  type: 'course' | 'workout' | 'tutorial' | 'analysis';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  url: string;
  thumbnail?: string;
  instructor: string;
  duration: number; // in minutes
  created_at: string;
  updated_at?: string;
  tags?: string[];
  is_featured?: boolean;
  is_premium?: boolean;
}

// VideoCard component
interface VideoCardProps {
  video: VideoData;
  onDelete: (id: string) => void;
  onEdit: (video: VideoData) => void;
  onToggleFeature: (id: string, isFeatured: boolean) => void;
  onTogglePremium: (id: string, isPremium: boolean) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onDelete,
  onEdit,
  onToggleFeature,
  onTogglePremium
}) => {
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

        {/* Badges for premium and featured */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {video.is_premium && (
            <Badge className="bg-amber-500 text-white">Premium</Badge>
          )}
          {video.is_featured && (
            <Badge className="bg-indigo-500 text-white">Featured</Badge>
          )}
        </div>

        {/* Duration Badge */}
        <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
          {formatDuration(video.duration)}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-start">
          <span className="line-clamp-1">{video.title}</span>
          <Badge variant="outline" className="ml-2 capitalize">
            {video.category}
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs flex justify-between">
          <span>{new Date(video.created_at).toLocaleDateString()}</span>
          <Badge className={getDifficultyColor(video.difficulty)}>
            {video.difficulty}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
        <p className="text-xs text-muted-foreground">Instructor: {video.instructor}</p>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {video.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {video.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{video.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleFeature(video.id, !video.is_featured)}
              title={video.is_featured ? "Remove from featured" : "Add to featured"}
              className={video.is_featured ? "text-indigo-500 border-indigo-200" : ""}
            >
              {video.is_featured ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTogglePremium(video.id, !video.is_premium)}
              title={video.is_premium ? "Make free" : "Make premium"}
              className={video.is_premium ? "text-amber-500 border-amber-200" : ""}
            >
              {video.is_premium ? "Premium" : "Free"}
            </Button>
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(video)}
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(video.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions
const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'advanced': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Main component
const VideoManagement: React.FC = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('forex');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  // Edit dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<'forex' | 'fitness' | 'karate'>('forex');
  const [editType, setEditType] = useState<'course' | 'workout' | 'tutorial' | 'analysis'>('tutorial');
  const [editDifficulty, setEditDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [editInstructor, setEditInstructor] = useState('');
  const [editDuration, setEditDuration] = useState(0);
  const [editTags, setEditTags] = useState('');
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editIsPremium, setEditIsPremium] = useState(false);

  // Fetch videos from Supabase
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setVideos(data || []);
    } catch (error: any) {
      console.error('Error fetching videos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchVideos();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = videos;

    // Filter by category (tab)
    if (activeTab !== 'all') {
      filtered = filtered.filter(video => video.category === activeTab);
    }

    // Filter by type
    if (filterType && filterType !== 'all') {
      filtered = filtered.filter(video => video.type === filterType);
    }

    // Filter by difficulty
    if (filterDifficulty && filterDifficulty !== 'all') {
      filtered = filtered.filter(video => video.difficulty === filterDifficulty);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (video.tags && video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    // Sort videos
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'duration':
        filtered.sort((a, b) => a.duration - b.duration);
        break;
    }

    setFilteredVideos(filtered);
  }, [videos, activeTab, filterType, filterDifficulty, searchQuery, sortBy]);

  // Upload video to Supabase Storage and create record
  const uploadVideo = async (
    title: string,
    description: string,
    category: 'forex' | 'fitness' | 'karate',
    type: 'course' | 'workout' | 'tutorial' | 'analysis',
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    instructor: string,
    duration: number,
    tags: string,
    videoFile: File,
    thumbnailFile?: File
  ) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError('');

      // Initialize variables for video and thumbnail URLs
      let videoUrl = null;
      let thumbnailUrl = null;

      try {
        // 1. Upload video file to Supabase Storage
        const videoFileName = `${Date.now()}-${videoFile.name}`;
        const videoPath = `videos/${category}/${videoFileName}`;

        console.log('Attempting to upload video to path:', videoPath);

        // Upload video file
        const { data: videoData, error: videoError } = await supabase.storage
          .from('media')
          .upload(videoPath, videoFile, {
            cacheControl: '3600',
            upsert: true // Changed to true to overwrite if file exists
          });

        if (videoError) {
          console.error('Video upload error details:', videoError);
          throw videoError;
        }

        console.log('Video upload successful:', videoData);

        // Get public URL for the video
        const { data: videoUrlData } = supabase.storage
          .from('media')
          .getPublicUrl(videoPath);

        videoUrl = videoUrlData.publicUrl;
        console.log('Video URL generated:', videoUrl);

        // 2. Upload thumbnail if provided
        if (thumbnailFile) {
          const thumbnailFileName = `${Date.now()}-${thumbnailFile.name}`;
          const thumbnailPath = `thumbnails/${category}/${thumbnailFileName}`;

          console.log('Attempting to upload thumbnail to path:', thumbnailPath);

          try {
            const { error: thumbnailError } = await supabase.storage
              .from('media')
              .upload(thumbnailPath, thumbnailFile, {
                cacheControl: '3600',
                upsert: true // Changed to true to overwrite if file exists
              });

            if (thumbnailError) {
              console.error('Thumbnail upload error details:', thumbnailError);
              throw thumbnailError;
            }

            // Get public URL for the thumbnail
            const { data: thumbUrl } = supabase.storage
              .from('media')
              .getPublicUrl(thumbnailPath);

            thumbnailUrl = thumbUrl.publicUrl;
            console.log('Thumbnail URL generated:', thumbnailUrl);
          } catch (thumbErr) {
            console.error('Thumbnail upload failed:', thumbErr);
            // Continue without thumbnail if it fails
          }
        }

        // 3. Create video record in the database
        const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

        const { data: videoRecord, error: recordError } = await supabase
          .from('videos')
          .insert({
            title,
            description,
            category,
            type,
            difficulty,
            instructor,
            duration,
            tags: tagArray,
            url: videoUrl,
            thumbnail: thumbnailUrl,
            user_id: user?.id,
            is_featured: false,
            is_premium: false
          })
          .select();

        if (recordError) throw recordError;

        // 4. Update videos state
        setVideos(prevVideos => [videoRecord[0], ...prevVideos]);

        setSuccess('Video uploaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error: any) {
        console.error('Error uploading video:', error);
        setError(`Failed to upload video: ${error.message}`);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    } catch (error: any) {
      console.error('Error uploading video:', error);
      setError(`Failed to upload video: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Delete video
  const handleDeleteVideo = async (id: string) => {
    try {
      // Find the video to get its storage path
      const videoToDelete = videos.find(v => v.id === id);
      if (!videoToDelete) return;

      // 1. Delete from Supabase database
      const { error: deleteError } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // 2. Delete video file from storage (if we can extract the path)
      // This is a simplified approach - in a real app, you'd store the storage path in the database
      if (videoToDelete.url) {
        const urlParts = videoToDelete.url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `videos/${videoToDelete.category}/${fileName}`;

        await supabase.storage
          .from('media')
          .remove([filePath]);
      }

      // 3. Delete thumbnail if it exists
      if (videoToDelete.thumbnail) {
        const urlParts = videoToDelete.thumbnail.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `thumbnails/${videoToDelete.category}/${fileName}`;

        await supabase.storage
          .from('media')
          .remove([filePath]);
      }

      // 4. Update videos state
      setVideos(prevVideos => prevVideos.filter(video => video.id !== id));

      setSuccess('Video deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      console.error('Error deleting video:', error);
      setError(`Failed to delete video: ${error.message}`);
    }
  };

  // Open edit dialog
  const handleEditVideo = (video: VideoData) => {
    setCurrentVideo(video);
    setEditTitle(video.title);
    setEditDescription(video.description);
    setEditCategory(video.category);
    setEditType(video.type);
    setEditDifficulty(video.difficulty);
    setEditInstructor(video.instructor);
    setEditDuration(video.duration);
    setEditTags(video.tags ? video.tags.join(', ') : '');
    setEditIsFeatured(video.is_featured || false);
    setEditIsPremium(video.is_premium || false);
    setEditDialogOpen(true);
  };

  // Save edited video
  const saveEditedVideo = async () => {
    if (!currentVideo) return;

    try {
      const tagArray = editTags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const { error } = await supabase
        .from('videos')
        .update({
          title: editTitle,
          description: editDescription,
          category: editCategory,
          type: editType,
          difficulty: editDifficulty,
          instructor: editInstructor,
          duration: editDuration,
          tags: tagArray,
          is_featured: editIsFeatured,
          is_premium: editIsPremium,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentVideo.id);

      if (error) throw error;

      // Update videos state
      setVideos(prevVideos =>
        prevVideos.map(video =>
          video.id === currentVideo.id
            ? {
              ...video,
              title: editTitle,
              description: editDescription,
              category: editCategory,
              type: editType,
              difficulty: editDifficulty,
              instructor: editInstructor,
              duration: editDuration,
              tags: tagArray,
              is_featured: editIsFeatured,
              is_premium: editIsPremium,
              updated_at: new Date().toISOString()
            }
            : video
        )
      );

      setSuccess('Video updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setEditDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating video:', error);
      setError(`Failed to update video: ${error.message}`);
    }
  };

  // Toggle featured status
  const handleToggleFeature = async (id: string, isFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('videos')
        .update({ is_featured: isFeatured })
        .eq('id', id);

      if (error) throw error;

      // Update videos state
      setVideos(prevVideos =>
        prevVideos.map(video =>
          video.id === id
            ? { ...video, is_featured: isFeatured }
            : video
        )
      );

      setSuccess(`Video ${isFeatured ? 'featured' : 'unfeatured'} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      console.error('Error updating featured status:', error);
      setError(`Failed to update featured status: ${error.message}`);
    }
  };

  // Toggle premium status
  const handleTogglePremium = async (id: string, isPremium: boolean) => {
    try {
      const { error } = await supabase
        .from('videos')
        .update({ is_premium: isPremium })
        .eq('id', id);

      if (error) throw error;

      // Update videos state
      setVideos(prevVideos =>
        prevVideos.map(video =>
          video.id === id
            ? { ...video, is_premium: isPremium }
            : video
        )
      );

      setSuccess(`Video set to ${isPremium ? 'premium' : 'free'} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      console.error('Error updating premium status:', error);
      setError(`Failed to update premium status: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Video Management</CardTitle>
          <CardDescription>Upload, edit, and manage educational videos for different categories</CardDescription>
        </CardHeader>
        <CardContent>
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

          {/* Upload Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Upload New Video</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get('title') as string;
                const description = formData.get('description') as string;
                const category = formData.get('category') as 'forex' | 'fitness' | 'karate';
                const type = formData.get('type') as 'course' | 'workout' | 'tutorial' | 'analysis';
                const difficulty = formData.get('difficulty') as 'beginner' | 'intermediate' | 'advanced';
                const instructor = formData.get('instructor') as string;
                const duration = parseInt(formData.get('duration') as string);
                const tags = formData.get('tags') as string;
                const videoFile = formData.get('video') as File;
                const thumbnailFile = formData.get('thumbnail') as File || undefined;

                if (title && description && category && type && difficulty && instructor && !isNaN(duration) && videoFile) {
                  uploadVideo(
                    title,
                    description,
                    category,
                    type,
                    difficulty,
                    instructor,
                    duration,
                    tags,
                    videoFile,
                    thumbnailFile
                  );
                  (e.target as HTMLFormElement).reset();
                }
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="video-instructor">Instructor</Label>
                    <Input
                      id="video-instructor"
                      name="instructor"
                      placeholder="Enter instructor name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video-description">Description</Label>
                  <Textarea
                    id="video-description"
                    name="description"
                    className="min-h-[100px]"
                    placeholder="Enter video description"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="video-category">Category</Label>
                    <Select name="category" defaultValue="forex">
                      <SelectTrigger id="video-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="forex">Forex</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="karate">Karate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="video-type">Type</Label>
                    <Select name="type" defaultValue="tutorial">
                      <SelectTrigger id="video-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course">Course</SelectItem>
                        <SelectItem value="workout">Workout</SelectItem>
                        <SelectItem value="tutorial">Tutorial</SelectItem>
                        <SelectItem value="analysis">Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="video-difficulty">Difficulty</Label>
                    <Select name="difficulty" defaultValue="beginner">
                      <SelectTrigger id="video-difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="video-duration">Duration (minutes)</Label>
                    <Input
                      id="video-duration"
                      name="duration"
                      type="number"
                      min="1"
                      placeholder="Enter duration in minutes"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="video-tags">Tags (comma separated)</Label>
                    <Input
                      id="video-tags"
                      name="tags"
                      placeholder="e.g. beginner, forex basics, strategy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="thumbnail-file">Thumbnail Image (optional)</Label>
                    <Input
                      id="thumbnail-file"
                      name="thumbnail"
                      type="file"
                      accept="image/*"
                    />
                  </div>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <Label>Upload Progress</Label>
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-center">{uploadProgress}%</p>
                  </div>
                )}

                <Button type="submit" disabled={isUploading} className="w-full">
                  {isUploading ? 'Uploading...' : 'Upload Video'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Video Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Manage Videos</h3>
              <Button variant="outline" size="sm" onClick={fetchVideos}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="course">Courses</SelectItem>
                  <SelectItem value="workout">Workouts</SelectItem>
                  <SelectItem value="tutorial">Tutorials</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="duration">Duration (Short to Long)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabs for categories */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="forex">Forex</TabsTrigger>
                <TabsTrigger value="fitness">Fitness</TabsTrigger>
                <TabsTrigger value="karate">Karate</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                {renderVideoGrid()}
              </TabsContent>

              <TabsContent value="forex" className="mt-4">
                {renderVideoGrid()}
              </TabsContent>

              <TabsContent value="fitness" className="mt-4">
                {renderVideoGrid()}
              </TabsContent>

              <TabsContent value="karate" className="mt-4">
                {renderVideoGrid()}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Edit Video Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
            <DialogDescription>
              Update video details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-instructor">Instructor</Label>
                <Input
                  id="edit-instructor"
                  value={editInstructor}
                  onChange={(e) => setEditInstructor(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editCategory}
                  onValueChange={(value) => setEditCategory(value as 'forex' | 'fitness' | 'karate')}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="forex">Forex</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="karate">Karate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <Select
                  value={editType}
                  onValueChange={(value) => setEditType(value as 'course' | 'workout' | 'tutorial' | 'analysis')}
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="workout">Workout</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-difficulty">Difficulty</Label>
                <Select
                  value={editDifficulty}
                  onValueChange={(value) => setEditDifficulty(value as 'beginner' | 'intermediate' | 'advanced')}
                >
                  <SelectTrigger id="edit-difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration (minutes)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  min="1"
                  value={editDuration}
                  onChange={(e) => setEditDuration(parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input
                  id="edit-tags"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="e.g. beginner, forex basics, strategy"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={editIsFeatured}
                  onChange={(e) => setEditIsFeatured(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="edit-featured">Featured Video</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-premium"
                  checked={editIsPremium}
                  onChange={(e) => setEditIsPremium(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="edit-premium">Premium Content</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedVideo}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  // Helper function to render video grid
  function renderVideoGrid() {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-deep-blue"></div>
          <span className="ml-3 text-vintage-dark-brown">Loading videos...</span>
        </div>
      );
    }

    if (filteredVideos.length === 0) {
      return (
        <div className="text-center py-8">
          <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No videos found</p>
          {activeTab !== 'all' && (
            <Button variant="outline" className="mt-4" onClick={() => setActiveTab('all')}>
              View All Videos
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onDelete={handleDeleteVideo}
            onEdit={handleEditVideo}
            onToggleFeature={handleToggleFeature}
            onTogglePremium={handleTogglePremium}
          />
        ))}
      </div>
    );
  }
};

export default VideoManagement;