import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import LiveStreamGrid from './LiveStreamGrid';
import VideoLibrary from './VideoLibrary';
import VideoConference from './VideoConference';
import { Video, PlayCircle, Calendar, Users } from 'lucide-react';

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

  const handleStartVideoCall = () => {
    setSelectedSessionId(`${category}-${Date.now()}`);
    setShowVideoCall(true);
  };

  const handleEndVideoCall = () => {
    setShowVideoCall(false);
    setSelectedSessionId('');
  };

  if (showVideoCall) {
    return (
      <VideoConference
        sessionId={selectedSessionId}
        sessionType={category}
        instructorName={categoryInstructors[category]}
        onEndCall={handleEndVideoCall}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
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
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Users className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="font-playfair text-2xl font-semibold text-blue-800">
                      Personal Training Session
                    </h3>
                    <p className="text-gray-600 font-crimson">
                      Start a one-on-one video session with your instructor for personalized guidance and real-time feedback.
                    </p>
                  </div>

                  <div className="bg-white/80 rounded-lg p-6 space-y-4">
                    <h4 className="font-semibold text-blue-800">Session Features:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        High-quality video and audio streaming
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Screen sharing for technique demonstrations
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Real-time chat and messaging
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Session recording for review
                      </li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <Button
                      size="lg"
                      onClick={handleStartVideoCall}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3"
                    >
                      <Video className="w-5 h-5 mr-2" />
                      Start Video Session
                    </Button>
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