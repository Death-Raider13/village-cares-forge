import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Film, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileVideo,
  Image as ImageIcon,
  Tag
} from 'lucide-react';

interface UploadVideo {
  id: string;
  file: File;
  title: string;
  description: string;
  category: 'fitness' | 'karate' | 'forex';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  thumbnail: File | null;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

const VideoUploadManager: React.FC = () => {
  const [uploadQueue, setUploadQueue] = useState<UploadVideo[]>([]);
  const [currentUpload, setCurrentUpload] = useState<UploadVideo | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const videoFiles = files.filter(file => file.type.startsWith('video/'));
    
    videoFiles.forEach(file => addVideoToQueue(file));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => addVideoToQueue(file));
    e.target.value = '';
  };

  const addVideoToQueue = (file: File) => {
    const newVideo: UploadVideo = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      title: file.name.replace(/\.[^/.]+$/, ''),
      description: '',
      category: 'fitness',
      difficulty: 'beginner',
      tags: [],
      thumbnail: null,
      progress: 0,
      status: 'pending'
    };

    setUploadQueue(prev => [...prev, newVideo]);
  };

  const updateVideo = (id: string, updates: Partial<UploadVideo>) => {
    setUploadQueue(prev => 
      prev.map(video => 
        video.id === id ? { ...video, ...updates } : video
      )
    );
  };

  const removeVideo = (id: string) => {
    setUploadQueue(prev => prev.filter(video => video.id !== id));
  };

  const handleThumbnailUpload = (videoId: string, file: File) => {
    updateVideo(videoId, { thumbnail: file });
  };

  const startUpload = async (video: UploadVideo) => {
    setCurrentUpload(video);
    updateVideo(video.id, { status: 'uploading' });

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        updateVideo(video.id, { progress });
      }

      // Simulate processing
      updateVideo(video.id, { status: 'processing', progress: 100 });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Complete upload
      updateVideo(video.id, { status: 'completed' });
      
      // In real implementation, make API call to upload video
      // const formData = new FormData();
      // formData.append('video', video.file);
      // formData.append('thumbnail', video.thumbnail);
      // formData.append('title', video.title);
      // formData.append('description', video.description);
      // formData.append('category', video.category);
      // formData.append('difficulty', video.difficulty);
      // formData.append('tags', JSON.stringify(video.tags));
      
      // await fetch('/api/videos/upload', {
      //   method: 'POST',
      //   body: formData
      // });

    } catch (error) {
      updateVideo(video.id, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Upload failed' 
      });
    } finally {
      setCurrentUpload(null);
    }
  };

  const bulkUpload = async () => {
    const pendingVideos = uploadQueue.filter(video => video.status === 'pending');
    
    for (const video of pendingVideos) {
      await startUpload(video);
    }
  };

  const getStatusIcon = (status: UploadVideo['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-500" />;
      case 'uploading': return <Upload className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'processing': return <Film className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: UploadVideo['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'uploading': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Video Upload Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-vintage-gold bg-vintage-gold/10' 
                : 'border-gray-300 hover:border-vintage-gold/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FileVideo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-vintage-deep-blue mb-2">
              Drop video files here
            </h3>
            <p className="text-vintage-dark-brown/70 mb-4">
              or click to browse and select files
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-vintage-gold hover:bg-vintage-gold/90 text-vintage-deep-blue"
            >
              Select Videos
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Bulk Actions */}
          {uploadQueue.length > 0 && (
            <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">
                {uploadQueue.length} video(s) in queue
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={bulkUpload}
                  disabled={!!currentUpload || uploadQueue.every(v => v.status !== 'pending')}
                  className="bg-vintage-deep-blue hover:bg-vintage-burgundy"
                >
                  Upload All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setUploadQueue([])}
                >
                  Clear Queue
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Queue */}
      {uploadQueue.map((video) => (
        <Card key={video.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {/* Video Preview */}
              <div className="w-32 h-20 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                {video.thumbnail ? (
                  <img
                    src={URL.createObjectURL(video.thumbnail)}
                    alt="Thumbnail"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <FileVideo className="w-8 h-8 text-gray-400" />
                )}
              </div>

              {/* Video Details Form */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(video.status)}
                    <Badge className={getStatusColor(video.status)}>
                      {video.status.toUpperCase()}
                    </Badge>
                    {video.error && (
                      <span className="text-sm text-red-600">{video.error}</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeVideo(video.id)}
                    disabled={video.status === 'uploading' || video.status === 'processing'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`title-${video.id}`}>Title *</Label>
                    <Input
                      id={`title-${video.id}`}
                      value={video.title}
                      onChange={(e) => updateVideo(video.id, { title: e.target.value })}
                      disabled={video.status === 'uploading' || video.status === 'processing'}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`category-${video.id}`}>Category *</Label>
                    <Select
                      value={video.category}
                      onValueChange={(value: 'fitness' | 'karate' | 'forex') => 
                        updateVideo(video.id, { category: value })
                      }
                      disabled={video.status === 'uploading' || video.status === 'processing'}
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

                  <div>
                    <Label htmlFor={`difficulty-${video.id}`}>Difficulty</Label>
                    <Select
                      value={video.difficulty}
                      onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                        updateVideo(video.id, { difficulty: value })
                      }
                      disabled={video.status === 'uploading' || video.status === 'processing'}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Thumbnail</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => thumbnailInputRef.current?.click()}
                      disabled={video.status === 'uploading' || video.status === 'processing'}
                      className="w-full"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {video.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
                    </Button>
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleThumbnailUpload(video.id, file);
                      }}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`description-${video.id}`}>Description</Label>
                  <Textarea
                    id={`description-${video.id}`}
                    value={video.description}
                    onChange={(e) => updateVideo(video.id, { description: e.target.value })}
                    disabled={video.status === 'uploading' || video.status === 'processing'}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {video.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          onClick={() => updateVideo(video.id, { 
                            tags: video.tags.filter((_, i) => i !== index) 
                          })}
                          disabled={video.status === 'uploading' || video.status === 'processing'}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const tag = prompt('Enter tag:');
                        if (tag && !video.tags.includes(tag)) {
                          updateVideo(video.id, { tags: [...video.tags, tag] });
                        }
                      }}
                      disabled={video.status === 'uploading' || video.status === 'processing'}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      Add Tag
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                {(video.status === 'uploading' || video.status === 'processing') && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {video.status === 'uploading' ? 'Uploading...' : 'Processing...'}
                      </span>
                      <span>{video.progress}%</span>
                    </div>
                    <Progress value={video.progress} className="w-full" />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => startUpload(video)}
                    disabled={
                      video.status !== 'pending' || 
                      !!currentUpload || 
                      !video.title.trim()
                    }
                    className="bg-vintage-deep-blue hover:bg-vintage-burgundy"
                  >
                    Upload Video
                  </Button>
                  {video.status === 'error' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateVideo(video.id, { status: 'pending', error: undefined })}
                    >
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VideoUploadManager;