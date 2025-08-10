import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import LiveStreamGrid from './LiveStreamGrid';
import VideoLibrary from './VideoLibrary';
import VideoConference from '@/components/VideoConference';
import { Video, PlayCircle, Calendar, Users, AlertCircle } from 'lucide-react';

interface VideoStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'fitness' | 'karate' | 'forex';
  defaultTab?: 'live' | 'library' | 'conference' | 'schedule';
}

const VideoStreamModal: React.FC<VideoStreamModalProps> = ({
  isOpen,
  onClose,
  category,
  defaultTab = 'live'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [isStartingCall, setIsStartingCall] = useState(false);

  const categoryTitles = {
    fitness: 'Fitness Video Streaming',
    karate: 'Karate Training Videos',
    forex: 'Forex Education Center'
  };

  const categoryInstructors = {
    fitness: 'Sarah Mitchell',
    karate: 'Sensei Kenji Tanaka',
    forex: 'Michael Thompson'
  };

  const handleStartVideoCall = async () => {
    try {
      setIsStartingCall(true);

      // Check camera/microphone permissions first
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());

      // Generate unique session ID
      const sessionId = `${category}-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setSelectedSessionId(sessionId);
      setShowVideoCall(true);

    } catch (error) {
      console.error('Error starting video call:', error);

      // Handle different permission errors
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          alert('Camera and microphone permissions are required for video calls. Please allow access and try again.');
        } else if (error.name === 'NotFoundError') {
          alert('No camera or microphone found. Please check your devices and try again.');
        } else {
          alert('Failed to start video call. Please check your camera and microphone settings.');
        }
      }
    } finally {
      setIsStartingCall(false);
    }
  };

  const handleEndVideoCall = () => {
    setShowVideoCall(false);
    setSelectedSessionId('');
  };

  // Render VideoConference in full screen when active
  if (showVideoCall) {
    return (
      <VideoConference
        sessionId={selectedSessionId}
        sessionType={category}
        instructorName={categoryInstructors[category]}
        onEndCall={handleEndVideoCall}
        isInstructor={false} // Set to true for instructor accounts
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <DialogTitle className="flex items-center gap-3 font-playfair text-2xl text-blue-800">
            <Video className="h-6 w-6" />
            {categoryTitles[category]}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="h-full flex flex-col">
            <div className="px-6 py-2 border-b bg-white/50">
              <TabsList className="grid w-full grid-cols-4 bg-white/80">
                <TabsTrigger value="live" className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" />
                  Live Sessions
                </TabsTrigger>
                <TabsTrigger value="library" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Video Library
                </TabsTrigger>
                <TabsTrigger value="conference" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  1-on-1 Session
                </TabsTrigger>
                <TabsTrigger value="schedule" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Scheduled
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="live" className="mt-0 h-full">
                <LiveStreamGrid category={category} showScheduled={false} />
              </TabsContent>

              <TabsContent value="library" className="mt-0 h-full">
                <VideoLibrary category={category} />
              </TabsContent>

              <TabsContent value="conference" className="mt-0 h-full">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <Users className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="font-playfair text-2xl font-semibold text-blue-800">
                      Personal Training Session
                    </h3>
                    <p className="text-gray-600 font-crimson">
                      Start a one-on-one video session with <strong>{categoryInstructors[category]}</strong> for personalized guidance and real-time feedback.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-white to-blue-50 rounded-lg p-6 space-y-4 shadow-sm border border-blue-100">
                    <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Session Features:
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        High-quality video and audio streaming (WebRTC)
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Screen sharing for technique demonstrations
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Real-time chat and messaging
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Session duration tracking
                      </li>
                    </ul>
                  </div>

                  {/* Permission Notice */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-800 mb-1">Camera & Microphone Required</p>
                        <p className="text-amber-700">
                          Please allow camera and microphone access when prompted to join the video session.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-3">
                    <Button
                      size="lg"
                      onClick={handleStartVideoCall}
                      disabled={isStartingCall}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 shadow-lg transition-all duration-200"
                    >
                      {isStartingCall ? (
                        <>
                          <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Video className="w-5 h-5 mr-2" />
                          Start Video Session
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500">
                      Session ID will be: {category}-session-{Date.now().toString().slice(-6)}...
                    </p>
                  </div>

                  {/* Instructor Info */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <h5 className="font-medium text-gray-800 mb-2">Your Instructor</h5>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {categoryInstructors[category].split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{categoryInstructors[category]}</p>
                        <p className="text-sm text-gray-600 capitalize">{category} Expert</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="mt-0 h-full">
                <LiveStreamGrid category={category} showScheduled={true} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoStreamModal;