import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoPlayer from './VideoPlayer';
import { 
  Search, 
  Filter, 
  Clock, 
  Star, 
  Play,
  BookOpen,
  TrendingUp,
  Award
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  instructor: string;
  category: 'fitness' | 'karate' | 'forex';
  type: 'course' | 'workout' | 'tutorial' | 'analysis';
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  views: number;
  thumbnail: string;
  videoUrl: string;
  description: string;
  tags: string[];
  uploadDate: string;
}

interface VideoLibraryProps {
  category?: 'fitness' | 'karate' | 'forex' | 'all';
}

const VideoLibrary: React.FC<VideoLibraryProps> = ({ category = 'all' }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>(category);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  const mockVideos: Video[] = [
    {
      id: '1',
      title: 'Full Body HIIT Workout - 30 Minutes',
      instructor: 'Sarah Mitchell',
      category: 'fitness',
      type: 'workout',
      duration: 30,
      difficulty: 'intermediate',
      rating: 4.8,
      views: 1250,
      thumbnail: '/placeholder.svg',
      videoUrl: 'https://example.com/video1',
      description: 'High-intensity interval training workout targeting all major muscle groups.',
      tags: ['HIIT', 'Full Body', 'Cardio', 'Strength'],
      uploadDate: '2024-01-20'
    },
    {
      id: '2',
      title: 'Karate Kata: Heian Shodan Tutorial',
      instructor: 'Sensei Kenji Tanaka',
      category: 'karate',
      type: 'tutorial',
      duration: 45,
      difficulty: 'beginner',
      rating: 4.9,
      views: 890,
      thumbnail: '/placeholder.svg',
      videoUrl: 'https://example.com/video2',
      description: 'Step-by-step guide to mastering the first Heian kata.',
      tags: ['Kata', 'Heian', 'Beginner', 'Technique'],
      uploadDate: '2024-01-18'
    },
    {
      id: '3',
      title: 'Forex Trading Psychology Masterclass',
      instructor: 'Michael Thompson',
      category: 'forex',
      type: 'course',
      duration: 120,
      difficulty: 'intermediate',
      rating: 4.7,
      views: 2150,
      thumbnail: '/placeholder.svg',
      videoUrl: 'https://example.com/video3',
      description: 'Master the psychological aspects of successful forex trading.',
      tags: ['Psychology', 'Risk Management', 'Trading', 'Mindset'],
      uploadDate: '2024-01-15'
    },
    {
      id: '4',
      title: 'Advanced Kumite Techniques',
      instructor: 'Sensei Aiko Nakamura',
      category: 'karate',
      type: 'tutorial',
      duration: 60,
      difficulty: 'advanced',
      rating: 4.8,
      views: 650,
      thumbnail: '/placeholder.svg',
      videoUrl: 'https://example.com/video4',
      description: 'Advanced sparring techniques and strategies for competition.',
      tags: ['Kumite', 'Sparring', 'Advanced', 'Competition'],
      uploadDate: '2024-01-12'
    },
    {
      id: '5',
      title: 'EUR/USD Technical Analysis - Weekly Review',
      instructor: 'David Chen',
      category: 'forex',
      type: 'analysis',
      duration: 25,
      difficulty: 'intermediate',
      rating: 4.6,
      views: 1800,
      thumbnail: '/placeholder.svg',
      videoUrl: 'https://example.com/video5',
      description: 'Weekly technical analysis of the EUR/USD currency pair.',
      tags: ['Technical Analysis', 'EUR/USD', 'Weekly', 'Charts'],
      uploadDate: '2024-01-22'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVideos(mockVideos);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = videos;

    // Filter by category
    if (filterCategory && filterCategory !== 'all') {
      filtered = filtered.filter(video => video.category === filterCategory);
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
        video.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort videos
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
      case 'popular':
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
  }, [videos, filterCategory, filterType, filterDifficulty, searchQuery, sortBy]);

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

  return (
    <div className="space-y-6">
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
              <div className="relative aspect-video bg-gray-900">
                <img 
                  src={video.thumbnail} 
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
                <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDuration(video.duration)}
                </Badge>

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
                      by {video.instructor}
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
                    {video.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full bg-vintage-deep-blue hover:bg-vintage-forest-green">
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

export default VideoLibrary;