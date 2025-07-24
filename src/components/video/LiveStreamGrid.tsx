import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VideoPlayer from './VideoPlayer';
import { Search, Filter, Calendar, Clock } from 'lucide-react';

interface LiveStream {
  id: string;
  title: string;
  instructor: string;
  category: 'fitness' | 'karate' | 'forex';
  isLive: boolean;
  viewerCount: number;
  scheduledTime?: string;
  duration?: number;
  thumbnail: string;
  streamUrl?: string;
}

interface LiveStreamGridProps {
  category?: 'fitness' | 'karate' | 'forex' | 'all';
  showScheduled?: boolean;
}

const LiveStreamGrid: React.FC<LiveStreamGridProps> = ({ 
  category = 'all',
  showScheduled = false 
}) => {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [filteredStreams, setFilteredStreams] = useState<LiveStream[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>(category);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  const mockStreams: LiveStream[] = [
    {
      id: '1',
      title: 'Morning HIIT Workout',
      instructor: 'Sarah Mitchell',
      category: 'fitness',
      isLive: true,
      viewerCount: 45,
      thumbnail: '/placeholder.svg',
      streamUrl: 'https://example.com/stream1'
    },
    {
      id: '2', 
      title: 'Advanced Karate Kata',
      instructor: 'Sensei Kenji Tanaka',
      category: 'karate',
      isLive: true,
      viewerCount: 23,
      thumbnail: '/placeholder.svg',
      streamUrl: 'https://example.com/stream2'
    },
    {
      id: '3',
      title: 'EUR/USD Market Analysis',
      instructor: 'Michael Thompson',
      category: 'forex',
      isLive: false,
      viewerCount: 0,
      scheduledTime: '2024-01-24T15:00:00Z',
      thumbnail: '/placeholder.svg'
    },
    {
      id: '4',
      title: 'Beginner Yoga Flow',
      instructor: 'Emma Davis',
      category: 'fitness',
      isLive: true,
      viewerCount: 67,
      thumbnail: '/placeholder.svg',
      streamUrl: 'https://example.com/stream4'
    },
    {
      id: '5',
      title: 'Trading Psychology Workshop',
      instructor: 'David Chen',
      category: 'forex',
      isLive: false,
      viewerCount: 0,
      scheduledTime: '2024-01-24T20:00:00Z',
      thumbnail: '/placeholder.svg'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStreams(mockStreams);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = streams;

    // Filter by category
    if (filterCategory && filterCategory !== 'all') {
      filtered = filtered.filter(stream => stream.category === filterCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(stream => 
        stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stream.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by live status
    if (!showScheduled) {
      filtered = filtered.filter(stream => stream.isLive);
    }

    setFilteredStreams(filtered);
  }, [streams, filterCategory, searchQuery, showScheduled]);

  const handleJoinStream = (streamId: string) => {
    console.log('Joining stream:', streamId);
    // Implement stream joining logic
  };

  const formatScheduledTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-deep-blue"></div>
          <span className="ml-3 text-vintage-dark-brown">Loading streams...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
            <Filter className="h-5 w-5" />
            {showScheduled ? 'All Sessions' : 'Live Sessions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="karate">Karate</SelectItem>
                <SelectItem value="forex">Forex</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stream Grid */}
      {filteredStreams.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-vintage-dark-brown/70">
            {showScheduled ? 'No sessions found.' : 'No live sessions at the moment.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStreams.map((stream) => (
            <div key={stream.id}>
              {stream.isLive ? (
                <VideoPlayer
                  streamUrl={stream.streamUrl}
                  title={stream.title}
                  instructor={stream.instructor}
                  category={stream.category}
                  isLive={stream.isLive}
                  viewerCount={stream.viewerCount}
                  thumbnail={stream.thumbnail}
                  onJoin={() => handleJoinStream(stream.id)}
                  showChat={true}
                />
              ) : (
                <Card className="overflow-hidden">
                  <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
                    <img 
                      src={stream.thumbnail} 
                      alt={stream.title}
                      className="w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                      <Badge className="mb-4 bg-vintage-gold text-vintage-deep-blue">
                        <Calendar className="w-3 h-3 mr-1" />
                        Scheduled
                      </Badge>
                      <div className="text-center text-white">
                        <Clock className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">
                          {stream.scheduledTime && formatScheduledTime(stream.scheduledTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-playfair text-lg font-semibold text-vintage-deep-blue mb-1">
                      {stream.title}
                    </h3>
                    <p className="text-vintage-dark-brown/70 text-sm font-crimson mb-3">
                      Instructor: {stream.instructor}
                    </p>
                    <Button 
                      className="w-full bg-vintage-deep-blue hover:bg-vintage-forest-green"
                      onClick={() => handleJoinStream(stream.id)}
                    >
                      Set Reminder
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveStreamGrid;