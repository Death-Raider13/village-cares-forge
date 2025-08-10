import { useState } from 'react';
import { StreamingService } from '../../utilis/streamingService';

interface Video {
    id: string;
    title: string;
    description?: string;
    category: string;
    type: string;
    difficulty: string;
    tags?: string[];
    thumbnail_url?: string;
    video_url: string;
    duration?: number;
    instructor_name: string;
    rating?: number;
    views?: number;
    upload_date?: string;
    user_id: string;
    storage_path?: string;
}

interface VideoFilter {
    category?: string;
    type?: string;
    difficulty?: string;
    sortBy?: string;
}

interface VideoMetadata {
    title: string;
    description?: string;
    category: string;
    type: string;
    difficulty: string;
    tags?: string[];
}

export const useVideoLibrary = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const streamingService = StreamingService.getInstance();

    const loadVideos = async (filters: VideoFilter = {}) => {
        try {
            setLoading(true);
            setError(null);
            const data = await streamingService.getVideos(filters);
            setVideos(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const uploadVideo = async (file: File, metadata: VideoMetadata) => {
        try {
            setError(null);
            const newVideo = await streamingService.uploadVideo(file, metadata);
            setVideos(prev => [newVideo, ...prev]);
            return newVideo;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        videos,
        loading,
        error,
        loadVideos,
        uploadVideo
    };
};