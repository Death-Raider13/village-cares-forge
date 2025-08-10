import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VideoPlayer from './VideoPlayer';
import { useStreaming } from '@/hooks/useStreaming';
import { Search, Filter, Calendar, Clock, Plus, Video } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LiveStreamGridProps {
  category?: 'fitness' | 'karate' | 'forex' | 'all';
  showScheduled?: boolean;
}

const LiveStreamGrid: React.FC<LiveStreamGridProps> = ({
  category = 'all',
  showScheduled = false
}) => {
  const { streams, loading, error, loadStreams, createStream } = useStreaming();
  const [filteredStreams, setFilteredStreams] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>(category);
  const [user, setUser] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStreamTitle, setNewStreamTitle] = useState('');

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Load streams
    loadStreams({
      category: category !== 'all' ? category : undefined,
      showScheduled
    });

    // Subscribe to real-time updates
    const channel = supabase
      .channel('streams_realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'streams'
      }, () => {
        loadStreams({
          category: category !== 'all' ? category : undefined,
          showScheduled
        });
      })
      .subscribe();

    return () => channel.unsubscribe();
  }, [category, showScheduled]);

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
        stream.instructor_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredStreams(filtered);
  }, [streams, filterCategory, searchQuery]);

  const handleCreateStream = async () => {
    if (!user) {
      alert('Please sign in to create a stream');
      return;
    }

    try {
      const streamData = {
        title: newStreamTitle || 'New Live Stream',
        description: 'Live streaming session',
        category: filterCategory !== 'all' ? filterCategory as any : 'fitness'
      };

      const newStream = await createStream(streamData);
      setShowCreateModal(false);
      setNewStreamTitle('');

      // You would typically redirect to streaming interface here
      alert(`Stream created! Stream ID: ${newStream.id}`);
    } catch (error) {
      console.error('Failed to create stream:', error);
    }
  };

  const handleJoinStream = (streamId: string) => {
    // Navigate to stream view or open in modal
    window.open(`/stream/${streamId}`, '_blank');
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

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-600">Error loading streams: {error}</p>
        <Button onClick={() => loadStreams()} className="mt-4">
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Stream */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-vintage-deep-blue">
          {showScheduled ? 'All Sessions' : 'Live Sessions'}
        </h2>
        {user && (
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Video className="w-4 h-4 mr-2" />
            Go Live
          </Button>
        )}
      </div>

      {/* Create Stream Modal */}
      {showCreateModal && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold mb-4">Create New Stream</h3>
          <div className="space-y-4">
            <Input
              placeholder="Stream title..."
              value={newStreamTitle}
              onChange={(e) => setNewStreamTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateStream} className="bg-blue-600 hover:bg-blue-700">
                Create Stream
              </Button>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

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
              {stream.is_live ? (
                <VideoPlayer
                  streamId={stream.id}
                  streamUrl={stream.stream_url}
                  title={stream.title}
                  instructor={stream.instructor_name}
                  category={stream.category}
                  isLive={stream.is_live}
                  viewerCount={stream.viewer_count}
                  thumbnail={stream.thumbnail_url}
                  onJoin={() => handleJoinStream(stream.id)}
                  showChat={true}
                />
              ) : (
                <Card className="overflow-hidden">
                  <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
                    <img
                      src={stream.thumbnail_url || '/placeholder.svg'}
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
                          {stream.scheduled_time &&
                            new Date(stream.scheduled_time).toLocaleString()
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-playfair text-lg font-semibold text-vintage-deep-blue mb-1">
                      {stream.title}
                    </h3>
                    <p className="text-vintage-dark-brown/70 text-sm font-crimson mb-3">
                      Instructor: {stream.instructor_name}
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