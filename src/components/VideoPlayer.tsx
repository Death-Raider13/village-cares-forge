import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@supabase/supabase-js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Users,
  Eye,
  Settings,
  MessageCircle,
  Send
} from 'lucide-react';

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

interface VideoPlayerProps {
  streamId?: string;
  streamUrl?: string;
  title: string;
  isLive?: boolean;
  viewerCount?: number;
  onJoin?: () => void;
  showChat?: boolean;
  instructor?: string;
  category: 'fitness' | 'karate' | 'forex';
  thumbnail?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  streamId,
  streamUrl,
  title,
  isLive = false,
  viewerCount = 0,
  onJoin,
  showChat = false,
  instructor,
  category,
  thumbnail
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [currentViewerCount, setCurrentViewerCount] = useState(viewerCount);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Subscribe to real-time messages if streamId exists
    if (streamId && showChat) {
      const messagesSubscription = supabase
        .channel(`stream_${streamId}_messages`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'stream_messages',
          filter: `stream_id=eq.${streamId}`
        }, (payload) => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();

      // Load existing messages
      loadMessages();

      return () => messagesSubscription.unsubscribe();
    }
  }, [streamId, showChat]);

  useEffect(() => {
    // Initialize video stream
    if (streamUrl && videoRef.current) {
      // For HLS streams (recommended for live streaming)
      if (streamUrl.includes('.m3u8')) {
        if ('MediaSource' in window && MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"')) {
          // Use HLS.js for HLS streams
          import('hls.js').then(({ default: Hls }) => {
            if (Hls.isSupported()) {
              const hls = new Hls();
              hls.loadSource(streamUrl);
              hls.attachMedia(videoRef.current!);
              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (isLive) {
                  videoRef.current?.play();
                  setIsPlaying(true);
                }
              });
            }
          });
        }
      } else {
        // Regular video source
        videoRef.current.src = streamUrl;
        if (isLive) {
          videoRef.current.play();
          setIsPlaying(true);
        }
      }
    }
  }, [streamUrl, isLive]);

  const loadMessages = async () => {
    if (!streamId) return;

    const { data, error } = await supabase
      .from('stream_messages')
      .select('*')
      .eq('stream_id', streamId)
      .order('created_at', { ascending: true })
      .limit(50);

    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !streamId || !user) return;

    const { error } = await supabase
      .from('stream_messages')
      .insert([{
        stream_id: streamId,
        user_id: user.id,
        message: newMessage.trim(),
        user_name: user.email?.split('@')[0] || 'Anonymous'
      }]);

    if (!error) setNewMessage('');
  };

  const togglePlay = () => {
    if (videoRef.current && !isLive) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="flex gap-4">
      <Card className="flex-1 overflow-hidden bg-black">
        <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={thumbnail}
            controls={false}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            playsInline
          />

          {/* Live Badge */}
          {isLive && (
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Badge className="bg-red-600 text-white animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                LIVE
              </Badge>
              <Badge variant="secondary" className="bg-black/50 text-white">
                <Eye className="w-3 h-3 mr-1" />
                {currentViewerCount}
              </Badge>
            </div>
          )}

          {/* Play Button for non-live content */}
          {!isPlaying && !isLive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Button
                size="lg"
                onClick={togglePlay}
                className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </Button>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                {!isLive && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                )}

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {onJoin && (
                  <Button
                    onClick={onJoin}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Join
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white">
          <h3 className="font-semibold text-lg text-blue-800">{title}</h3>
          {instructor && <p className="text-gray-600">Instructor: {instructor}</p>}
        </div>
      </Card>

      {/* Chat Panel */}
      {showChat && (
        <Card className="w-80 flex flex-col h-[500px]">
          <div className="p-3 border-b">
            <h4 className="font-semibold flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Live Chat
            </h4>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="text-sm">
                <span className="font-medium text-blue-600">{msg.user_name}: </span>
                <span>{msg.message}</span>
              </div>
            ))}
          </div>

          {user && (
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-2 py-1 border rounded text-sm"
                />
                <Button size="sm" onClick={sendMessage}>
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
export default VideoPlayer;