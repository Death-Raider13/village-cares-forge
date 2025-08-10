import { useState, useEffect, useRef } from 'react';
import { StreamingService } from '../utils/streamingService';

export const useStreaming = () => {
    const [streams, setStreams] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const streamingService = StreamingService.getInstance();

    const loadStreams = async (filters: any = {}) => {
        try {
            setLoading(true);
            setError(null);
            const data = await streamingService.getStreams(filters);
            setStreams(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createStream = async (streamData: any) => {
        try {
            setError(null);
            const newStream = await streamingService.createStream(streamData);
            setStreams(prev => [newStream, ...prev]);
            return newStream;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const startStream = async (streamId: string, streamUrl: string) => {
        try {
            setError(null);
            const updatedStream = await streamingService.startStream(streamId, streamUrl);
            setStreams(prev => prev.map(s => s.id === streamId ? updatedStream : s));
            return updatedStream;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const endStream = async (streamId: string) => {
        try {
            setError(null);
            const updatedStream = await streamingService.endStream(streamId);
            setStreams(prev => prev.map(s => s.id === streamId ? updatedStream : s));
            return updatedStream;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        streams,
        loading,
        error,
        loadStreams,
        createStream,
        startStream,
        endStream
    };
};