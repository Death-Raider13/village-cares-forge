import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Users, 
  Eye,
  Settings,
  MessageCircle
} from 'lucide-react';

interface VideoPlayerProps {
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const categoryColors = {
    fitness: 'bg-green-600',
    karate: 'bg-orange-600', 
    forex: 'bg-blue-600'
  };

  const togglePlay = () => {
    if (videoRef.current) {
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

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  return (
    <Card className="overflow-hidden bg-black">
      <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={thumbnail}
          controls={false}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          {streamUrl && <source src={streamUrl} type="video/mp4" />}
          Your browser does not support the video tag.
        </video>

        {/* Live Badge */}
        {isLive && (
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Badge className="bg-red-600 text-white animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
              LIVE
            </Badge>
            <Badge variant="secondary" className="bg-black/50 text-white">
              <Eye className="w-3 h-3 mr-1" />
              {viewerCount}
            </Badge>
          </div>
        )}

        {/* Category Badge */}
        <Badge className={`absolute top-4 right-4 ${categoryColors[category]} text-white`}>
          {category.toUpperCase()}
        </Badge>

        {/* Play Button Overlay */}
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

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>

              {!isLive && (
                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {showChat && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              )}
              
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <Settings className="w-4 h-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {!isLive && duration > 0 && (
            <div className="mt-2">
              <div className="w-full bg-white/20 rounded-full h-1">
                <div 
                  className="bg-vintage-gold h-1 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Information */}
      <div className="p-4 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-playfair text-lg font-semibold text-vintage-deep-blue mb-1">
              {title}
            </h3>
            {instructor && (
              <p className="text-vintage-dark-brown/70 text-sm font-crimson">
                Instructor: {instructor}
              </p>
            )}
          </div>
          
          {onJoin && (
            <Button 
              onClick={onJoin}
              className="bg-vintage-gold hover:bg-vintage-gold/90 text-vintage-deep-blue font-semibold"
            >
              <Users className="w-4 h-4 mr-2" />
              Join Session
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer;