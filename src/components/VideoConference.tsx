import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useWebRTC } from '@/hooks/useWebRTC';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  MessageSquare,
  Settings,
  Users,
  Send
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface VideoConferenceProps {
  sessionId: string;
  sessionType: 'fitness' | 'karate' | 'forex';
  instructorName: string;
  onEndCall?: () => void;
  isInstructor?: boolean;
}

const VideoConference: React.FC<VideoConferenceProps> = ({
  sessionId,
  sessionType,
  instructorName,
  onEndCall,
  isInstructor = false
}) => {
  const {
    isConnected,
    isVideoOn,
    isAudioOn,
    localStream,
    initializeConnection,
    toggleVideo,
    toggleAudio,
    disconnect
  } = useWebRTC(sessionId);

  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const startTimeRef = useRef<Date>(new Date());

  const sessionTypeColors = {
    fitness: 'bg-green-600',
    karate: 'bg-orange-600',
    forex: 'bg-blue-600'
  };

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Initialize WebRTC connection
    initializeConnection().then((stream) => {
      if (localVideoRef.current && stream) {
        localVideoRef.current.srcObject = stream;
      }
    });

    // Session duration timer
    const timer = setInterval(() => {
      const now = new Date();
      const duration = Math.floor((now.getTime() - startTimeRef.current.getTime()) / 1000);
      setSessionDuration(duration);
    }, 1000);

    // Load chat messages
    loadChatMessages();

    // Subscribe to chat messages
    const messagesChannel = supabase
      .channel(`conference_${sessionId}_messages`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'conference_messages',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      timer();
      messagesChannel.unsubscribe();
      disconnect();
    };
  }, [sessionId]);

  const loadChatMessages = async () => {
    const { data } = await supabase
      .from('conference_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const { error } = await supabase
      .from('conference_messages')
      .insert([{
        session_id: sessionId,
        user_id: user.id,
        message: newMessage.trim(),
        user_name: user.email?.split('@')[0] || 'User'
      }]);

    if (!error) setNewMessage('');
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        // Replace video track with screen share
        setIsScreenSharing(true);
        // Implementation would replace the video track in peer connection
      } else {
        // Return to camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const endCall = () => {
    disconnect();
    onEndCall?.();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge className={`${sessionTypeColors[sessionType]} text-white`}>
            {sessionType.toUpperCase()}
          </Badge>
          <h2 className="font-playfair text-lg font-semibold text-vintage-deep-blue">
            1-on-1 Session with {instructorName}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Users className="w-3 h-3 mr-1" />
            {isConnected ? '2' : '1'} participants
          </Badge>
          <span className="text-sm text-gray-600">
            Duration: {formatDuration(sessionDuration)}
          </span>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 relative bg-gray-900">
          {/* Remote Video (Instructor) */}
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />

          {/* Local Video (Picture in Picture) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            {!isVideoOn && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Session Info Overlay */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
            <p className="text-sm font-medium">Session ID: {sessionId}</p>
            <p className="text-xs opacity-75">
              Status: {isConnected ? 'Connected' : 'Connecting...'}
            </p>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-vintage-deep-blue flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Session Chat
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No messages yet...</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-vintage-deep-blue">{msg.user_name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-2">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
            {user && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button
                    size="sm"
                    onClick={sendMessage}
                    className="bg-vintage-gold hover:bg-vintage-gold/90 text-vintage-deep-blue"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white/95 backdrop-blur-sm p-4">
        <div className="flex items-center justify-center gap-4">
          {/* Audio Control */}
          <Button
            size="lg"
            variant={isAudioOn ? "default" : "destructive"}
            onClick={toggleAudio}
            className="rounded-full w-12 h-12"
          >
            {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>

          {/* Video Control */}
          <Button
            size="lg"
            variant={isVideoOn ? "default" : "destructive"}
            onClick={toggleVideo}
            className="rounded-full w-12 h-12"
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>

          {/* Screen Share */}
          <Button
            size="lg"
            variant={isScreenSharing ? "secondary" : "outline"}
            onClick={toggleScreenShare}
            className="rounded-full w-12 h-12"
          >
            <Monitor className="w-5 h-5" />
          </Button>

          {/* Chat Toggle */}
          <Button
            size="lg"
            variant={showChat ? "secondary" : "outline"}
            onClick={() => setShowChat(!showChat)}
            className="rounded-full w-12 h-12"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>

          {/* Settings */}
          <Button
            size="lg"
            variant="outline"
            className="rounded-full w-12 h-12"
          >
            <Settings className="w-5 h-5" />
          </Button>

          {/* End Call */}
          <Button
            size="lg"
            variant="destructive"
            onClick={endCall}
            className="rounded-full w-12 h-12 bg-red-600 hover:bg-red-700"
          >
            <PhoneOff className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export {  VideoConference }; 