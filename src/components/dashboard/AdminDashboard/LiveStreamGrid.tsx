import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Radio, 
  VideoOff, 
  Video, 
  Mic, 
  MicOff, 
  Monitor,
  Users,
  Settings,
  Calendar,
  Play,
  Square,
  Eye,
  MessageSquare,
  Clock,
  Share2,
  Copy
} from 'lucide-react';

interface LiveStream {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'karate' | 'forex';
  status: 'scheduled' | 'live' | 'ended';
  scheduledTime?: Date;
  startTime?: Date;
  endTime?: Date;
  streamKey: string;
  streamUrl: string;
  viewerCount: number;
  maxViewers: number;
  isRecording: boolean;
  chatEnabled: boolean;
  isPrivate: boolean;
}

const LiveStreamManager: React.FC = () => {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [currentStream, setCurrentStream] = useState<LiveStream | null>(null);
  const [isCreatingStream, setIsCreatingStream] = useState(false);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  
  // New stream form state
  const [newStream, setNewStream] = useState({
    title: '',
    description: '',
    category: 'fitness' as 'fitness' | 'karate' | 'forex',
    scheduledTime: '',
    isPrivate: false,
    chatEnabled: true,
    recordingEnabled: true
  });

  useEffect(() => {
    // Load existing streams
    loadStreams();
    
    // Initialize preview stream
    initializePreview();
    
    return () => {
      // Cleanup
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const loadStreams = () => {
    // Mock data - replace with actual API call
    const mockStreams: LiveStream[] = [
      {
        id: '1',
        title: 'Morning HIIT Workout',
        description: 'High-intensity interval training session',
        category: 'fitness',
        status: 'live',
        startTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 minutes ago
        streamKey: 'sk_1234567890',
        streamUrl: 'rtmp://streaming.example.com/live/sk_1234567890',
        viewerCount: 45,
        maxViewers: 67,
        isRecording: true,
        chatEnabled: true,
        isPrivate: false
      },
      {
        id: '2',
        title: 'Forex Market Analysis',
        description: 'Weekly market outlook and trading strategies',
        category: 'forex',
        status: 'scheduled',
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // In 2 hours
        streamKey: 'sk_0987654321',
        streamUrl: 'rtmp://streaming.example.com/live/sk_0987654321',
        viewerCount: 0,
        maxViewers: 0,
        isRecording: true,
        chatEnabled: true,
        isPrivate: false
      }
    ];
    
    setStreams(mockStreams);
  };

  const initializePreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setPreviewStream(stream);
      
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const createStream = async () => {
    if (!newStream.title.trim()) return;

    const stream: LiveStream = {
      id: Date.now().toString(),
      title: newStream.title,
      description: newStream.description,
      category: newStream.category,
      status: newStream.scheduledTime ? 'scheduled' : 'live',
      scheduledTime: newStream.scheduledTime ? new Date(newStream.scheduledTime) : undefined,
      startTime: !newStream.scheduledTime ? new Date() : undefined,
      streamKey: `sk_${Math.random().toString(36).substr(2, 10)}`,
      streamUrl: `rtmp://streaming.example.com/live/sk_${Math.random().toString(36).substr(2, 10)}`,
      viewerCount: 0,
      maxViewers: 0,
      isRecording: newStream.recordingEnabled,
      chatEnabled: newStream.chatEnabled,
      isPrivate: newStream.isPrivate
    };

    setStreams(prev => [...prev, stream]);
    
    if (!newStream.scheduledTime) {
      setCurrentStream(stream);
    }
    
    // Reset form
    setNewStream({
      title: '',
      description: '',
      category: 'fitness',
      scheduledTime: '',
      isPrivate: false,
      chatEnabled: true,
      recordingEnabled: true
    });
    
    setIsCreatingStream(false);
  };

  const startStream = async (streamId: string) => {
    const stream = streams.find(s => s.id === streamId);
    if (!stream) return;

    const updatedStream = {
      ...stream,
      status: 'live' as const,
      startTime: new Date()
    };
    
    setStreams(prev => prev.map(s => s.id === streamId ? updatedStream : s));
    setCurrentStream(updatedStream);
  };

  const endStream = (streamId: string) => {
    const updatedStream = streams.find(s => s.id === streamId);
    if (!updatedStream) return;

    const endedStream = {
      ...updatedStream,
      status: 'ended' as const,
      endTime: new Date()
    };
    
    setStreams(prev => prev.map(s => s.id === streamId ? endedStream : s));
    
    if (currentStream?.id === streamId) {
      setCurrentStream(null);
    }
  };

  const toggleVideo = () => {
    if (previewStream) {
      const videoTrack = previewStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const toggleAudio = () => {
    if (previewStream) {
      const audioTrack = previewStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = screenStream;
        }
        
        setIsScreenSharing(true);
      } else {
        // Return to camera
        await initializePreview();
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const copyStreamKey = (streamKey: string) => {
    navigator.clipboard.writeText(streamKey);
    // You might want to show a toast notification here
  };

  const copyStreamUrl = (streamUrl: string) => {
    navigator.clipboard.writeText(streamUrl);
    // You might want to show a toast notification here
  };

  const getStatusColor = (status: LiveStream['status']) => {
    switch (status) {
      case 'live': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString();
  };

  const formatDuration = (startTime: Date, endTime?: Date) => {
    const end = endTime || new Date();
    const duration = Math.floor((end.getTime() - startTime.getTime()) / 1000 / 60);
    return `${duration} minutes`;
  };

  return (
    <div className="space-y-6">
      {/* Stream Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            Live Stream Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Preview */}
            <div className="space-y-4">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                {!isVideoEnabled && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <VideoOff className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Stream Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant={isVideoEnabled ? "default" : "destructive"}
                  onClick={toggleVideo}
                  className="rounded-full w-12 h-12"
                >
                  {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>

                <Button
                  size="lg"
                  variant={isAudioEnabled ? "default" : "destructive"}
                  onClick={toggleAudio}
                  className="rounded-full w-12 h-12"
                >
                  {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>

                <Button
                  size="lg"
                  variant={isScreenSharing ? "secondary" : "outline"}
                  onClick={toggleScreenShare}
                  className="rounded-full w-12 h-12"
                >
                  <Monitor className="w-5 h-5" />
                </Button>

                <Button
                  size="lg"
                  onClick={() => setIsCreatingStream(true)}
                  className="bg-vintage-gold hover:bg-vintage-gold/90 text-vintage-deep-blue"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Create Stream
                </Button>
              </div>
            </div>

            {/* Current Stream Info */}
            <div className="space-y-4">
              {currentStream ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-red-800">LIVE</span>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => endStream(currentStream.id)}
                    >
                      <Square className="w-4 h-4 mr-2" />
                      End Stream
                    </Button>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{currentStream.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{currentStream.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Viewers:</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {currentStream.viewerCount} (Peak: {currentStream.maxViewers})
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {currentStream.startTime && formatDuration(currentStream.startTime)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <Radio className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Active Stream</h3>
                  <p className="text-gray-600">Create a new stream to start broadcasting</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Stream Modal */}
      {isCreatingStream && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stream-title">Title *</Label>
                <Input
                  id="stream-title"
                  value={newStream.title}
                  onChange={(e) => setNewStream(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter stream title"
                />
              </div>

              <div>
                <Label htmlFor="stream-category">Category</Label>
                <Select
                  value={newStream.category}
                  onValueChange={(value: 'fitness' | 'karate' | 'forex') => 
                    setNewStream(prev => ({ ...prev, category: value }))
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

              <div className="md:col-span-2">
                <Label htmlFor="stream-description">Description</Label>
                <Textarea
                  id="stream-description"
                  value={newStream.description}
                  onChange={(e) => setNewStream(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your stream..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="scheduled-time">Schedule Time (Optional)</Label>
                <Input
                  id="scheduled-time"
                  type="datetime-local"
                  value={newStream.scheduledTime}
                  onChange={(e) => setNewStream(prev => ({ ...prev, scheduledTime: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="chat-enabled">Enable Chat</Label>
                  <Switch
                    id="chat-enabled"
                    checked={newStream.chatEnabled}
                    onCheckedChange={(checked) => 
                      setNewStream(prev => ({ ...prev, chatEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="recording-enabled">Record Stream</Label>
                  <Switch
                    id="recording-enabled"
                    checked={newStream.recordingEnabled}
                    onCheckedChange={(checked) => 
                      setNewStream(prev => ({ ...prev, recordingEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="private-stream">Private Stream</Label>
                  <Switch
                    id="private-stream"
                    checked={newStream.isPrivate}
                    onCheckedChange={(checked) => 
                      setNewStream(prev => ({ ...prev, isPrivate: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={createStream}
                disabled={!newStream.title.trim()}
                className="bg-vintage-deep-blue hover:bg-vintage-burgundy"
              >
                {newStream.scheduledTime ? 'Schedule Stream' : 'Start Stream Now'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreatingStream(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Streams List */}
      <Card>
        <CardHeader>
          <CardTitle>All Streams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {streams.map((stream) => (
              <div key={stream.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{stream.title}</h3>
                      <Badge className={getStatusColor(stream.status)}>
                        {stream.status.toUpperCase()}
                      </Badge>
                      {stream.status === 'live' && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Eye className="w-4 h-4" />
                          {stream.viewerCount}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{stream.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Category:</span>
                        <div className="capitalize">{stream.category}</div>
                      </div>
                      
                      {stream.scheduledTime && (
                        <div>
                          <span className="font-medium">Scheduled:</span>
                          <div>{formatDateTime(stream.scheduledTime)}</div>
                        </div>
                      )}
                      
                      {stream.startTime && (
                        <div>
                          <span className="font-medium">Started:</span>
                          <div>{formatDateTime(stream.startTime)}</div>
                        </div>
                      )}
                      
                      {stream.endTime && (
                        <div>
                          <span className="font-medium">Duration:</span>
                          <div>{formatDuration(stream.startTime!, stream.endTime)}</div>
                        </div>
                      )}
                    </div>

                    {/* Stream Keys */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Stream Key:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {stream.streamKey}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyStreamKey(stream.streamKey)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Stream URL:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {stream.streamUrl}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyStreamUrl(stream.streamUrl)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {stream.status === 'scheduled' && (
                      <Button
                        size="sm"
                        onClick={() => startStream(stream.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    )}
                    
                    {stream.status === 'live' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => endStream(stream.id)}
                      >
                        <Square className="w-4 h-4 mr-1" />
                        End
                      </Button>
                    )}
                    
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {streams.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No streams created yet. Create your first stream to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveStreamManager;