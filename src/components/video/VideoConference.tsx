import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Monitor,
  MessageSquare,
  Settings,
  Users,
  Maximize
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

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
  const { user } = useAuth();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [participants, setParticipants] = useState<string[]>([instructorName]);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, user: string, message: string, timestamp: Date}>>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const sessionTypeColors = {
    fitness: 'bg-green-600',
    karate: 'bg-orange-600',
    forex: 'bg-blue-600'
  };

  useEffect(() => {
    // Initialize video call
    initializeVideoCall();
    return () => {
      // Cleanup video call
      cleanupVideoCall();
    };
  }, []);

  const initializeVideoCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const cleanupVideoCall = () => {
    // Stop all media tracks
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const toggleAudio = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        // Replace video track with screen share
        setIsScreenSharing(true);
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
    cleanupVideoCall();
    onEndCall?.();
  };

  const sendMessage = () => {
    if (newMessage.trim() && user) {
      const message = {
        id: Date.now().toString(),
        user: user.email || 'User',
        message: newMessage.trim(),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
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
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Users className="w-3 h-3 mr-1" />
            {participants.length} participants
          </Badge>
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
            <p className="text-xs opacity-75">Duration: 00:15:32</p>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-vintage-deep-blue">Session Chat</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-vintage-deep-blue">{msg.user}</span>
                    <span className="text-xs text-gray-500">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-2">{msg.message}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  ref={chatInputRef}
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vintage-gold"
                />
                <Button
                  size="sm"
                  onClick={sendMessage}
                  className="bg-vintage-gold hover:bg-vintage-gold/90 text-vintage-deep-blue"
                >
                  Send
                </Button>
              </div>
            </div>
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

export default VideoConference;