import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVideoLibrary } from '@/hooks/useVideoLibrary';
import {
  Search,
  Filter,
  Clock,
  Star,
  Play,
  BookOpen,
  TrendingUp,
  Award,
  Upload,
  X
} from 'lucide-react';

interface VideoLibraryProps {
  category?: 'fitness' | 'karate' | 'forex' | 'all';
}

const VideoLibrary: React.FC<VideoLibraryProps> = ({ category = 'all' }) => {
  const { videos, loading, error, loadVideos, uploadVideo } = useVideoLibrary();
  const [filteredVideos, setFilteredVideos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>(category);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadMetadata, setUploadMetadata] = useState({
    title: '',
    description: '',
    category: 'fitness',
    type: 'tutorial',
    difficulty: 'beginner',
    tags: [] as string[]
  });

  useEffect(() => {
    loadVideos({
      category: category !== 'all' ? category : undefined,
      sortBy
    });
  }, [category, sortBy]);

  useEffect(() => {
    let filtered = videos;

    // Apply filters
    if (filterCategory !== 'all') {
      filtered = filtered.filter(video => video.category === filterCategory);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(video => video.type === filterType);
    }

    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(video => video.difficulty === filterDifficulty);
    }

    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.instructor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredVideos(filtered);
  }, [videos, filterCategory, filterType, filterDifficulty, searchQuery]);

  const handleUploadVideo = async () => {
    if (!uploadFile) return;

    try {
      await uploadVideo(uploadFile, uploadMetadata);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadMetadata({
        title: '',
        description: '',
        category: 'fitness',
        type: 'tutorial',
        difficulty: 'beginner',
        tags: []
      });
      alert('Video uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload video');
    }
  };

  const playVideo = (video: any) => {
    // Open video in modal or navigate to video page
    window.open(`/video/${video.id}`, '_blank');
  };

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'workout': return <Play className="w-4 h-4" />;
      case 'tutorial': return <Award className="w-4 h-4" />;
      case 'analysis': return <TrendingUp className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
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

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-600">Error loading videos: {error}</p>
        <Button onClick={() => loadVideos()} className="mt-4">
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Upload Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-vintage-deep-blue">Video Library</h2>
        <Button
          onClick={() => setShowUploadModal(true)}
          className="bg-vintage-deep-blue hover:bg-vintage-forest-green"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Video
        </Button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Upload New Video</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowUploadModal(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Video File</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={uploadMetadata.title}
                onChange={(e) => setUploadMetadata(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Video title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={uploadMetadata.description}
                onChange={(e) => setUploadMetadata(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Video description..."
                className="w-full p-2 border rounded h-20"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select
                  value={uploadMetadata.category}
                  onValueChange={(value) => setUploadMetadata(prev => ({ ...prev, category: value }))}
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
                <label className="block text-sm font-medium mb-1">Type</label>
                <Select
                  value={uploadMetadata.type}
                  onValueChange={(value) => setUploadMetadata(prev => ({ ...prev, type: value }))}
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
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <Select
                  value={uploadMetadata.difficulty}
                  onValueChange={(value) => setUploadMetadata(prev => ({ ...prev, difficulty: value }))}
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
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleUploadVideo}
                disabled={!uploadFile || !uploadMetadata.title}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Upload Video
              </Button>
              <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className="bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
            <Filter className="h-5 w-5" />
            Video Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search videos, instructors, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="karate">Karate</SelectItem>
                  <SelectItem value="forex">Forex</SelectItem>
                </SelectContent>
              </Select>

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
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="duration">Shortest First</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-vintage-dark-brown/70 flex items-center">
                {filteredVideos.length} videos found
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-vintage-dark-brown/70">No videos found matching your criteria.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video bg-gray-900 cursor-pointer" onClick={() => playVideo(video)}>
                <img
                  src={video.thumbnail_url || '/placeholder.svg'}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="lg"
                    className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </Button>
                </div>

                {/* Duration Badge */}
                {video.duration && (
                  <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDuration(video.duration)}
                  </Badge>
                )}

                {/* Type Badge */}
                <Badge className="absolute top-2 left-2 bg-vintage-gold text-vintage-deep-blue">
                  {getTypeIcon(video.type)}
                  <span className="ml-1 capitalize">{video.type}</span>
                </Badge>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-playfair text-lg font-semibold text-vintage-deep-blue line-clamp-2 mb-1">
                      {video.title}
                    </h3>
                    <p className="text-vintage-dark-brown/70 text-sm font-crimson">
                      by {video.instructor_name}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-vintage-gold text-vintage-gold" />
                        <span className="text-sm font-medium">{video.rating}</span>
                      </div>
                      <span className="text-sm text-vintage-dark-brown/60">
                        {video.views} views
                      </span>
                    </div>
                    <Badge className={getDifficultyColor(video.difficulty)}>
                      {video.difficulty}
                    </Badge>
                  </div>

                  <p className="text-sm text-vintage-dark-brown/80 line-clamp-2">
                    {video.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {video.tags?.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    className="w-full bg-vintage-deep-blue hover:bg-vintage-forest-green"
                    onClick={() => playVideo(video)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};