import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export class StreamingService {
    private static instance: StreamingService;

    static getInstance(): StreamingService {
        if (!StreamingService.instance) {
            StreamingService.instance = new StreamingService();
        }
        return StreamingService.instance;
    }

    // Create a new live stream
    async createStream(streamData: {
        title: string;
        description?: string;
        category: 'fitness' | 'karate' | 'forex';
        scheduledTime?: string;
    }) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const streamKey = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const { data, error } = await supabase
                .from('streams')
                .insert([{
                    user_id: user.id,
                    ...streamData,
                    stream_key: streamKey,
                    instructor_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Instructor',
                    status: streamData.scheduledTime ? 'inactive' : 'active',
                    is_live: !streamData.scheduledTime,
                    started_at: streamData.scheduledTime ? null : new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error ending stream:', error);
            throw error;
        }
    }

    // Get all streams
    async getStreams(filters: {
        category?: string;
        isLive?: boolean;
        showScheduled?: boolean;
    } = {}) {
        try {
            let query = supabase
                .from('streams')
                .select('*')
                .order('created_at', { ascending: false });

            if (filters.category && filters.category !== 'all') {
                query = query.eq('category', filters.category);
            }

            if (filters.isLive !== undefined) {
                query = query.eq('is_live', filters.isLive);
            }

            if (!filters.showScheduled) {
                query = query.neq('status', 'inactive');
            }

            const { data, error } = await query;
            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error fetching streams:', error);
            throw error;
        }
    }

    // Update viewer count
    async updateViewerCount(streamId: string, increment: boolean = true) {
        try {
            const { data, error } = await supabase.rpc('update_viewer_count', {
                stream_id: streamId,
                increment: increment
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating viewer count:', error);
        }
    }

    // Send chat message
    async sendChatMessage(streamId: string, message: string) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('stream_messages')
                .insert([{
                    stream_id: streamId,
                    user_id: user.id,
                    message: message.trim(),
                    user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous'
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    // Get chat messages
    async getChatMessages(streamId: string, limit: number = 50) {
        try {
            const { data, error } = await supabase
                .from('stream_messages')
                .select('*')
                .eq('stream_id', streamId)
                .order('created_at', { ascending: true })
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    // Video library methods
    async getVideos(filters: {
        category?: string;
        type?: string;
        difficulty?: string;
        sortBy?: string;
    } = {}) {
        try {
            let query = supabase
                .from('videos')
                .select('*');

            if (filters.category && filters.category !== 'all') {
                query = query.eq('category', filters.category);
            }

            if (filters.type && filters.type !== 'all') {
                query = query.eq('type', filters.type);
            }

            if (filters.difficulty && filters.difficulty !== 'all') {
                query = query.eq('difficulty', filters.difficulty);
            }

            // Apply sorting
            switch (filters.sortBy) {
                case 'popular':
                    query = query.order('views', { ascending: false });
                    break;
                case 'rating':
                    query = query.order('rating', { ascending: false });
                    break;
                case 'duration':
                    query = query.order('duration', { ascending: true });
                    break;
                default:
                    query = query.order('upload_date', { ascending: false });
            }

            const { data, error } = await query;
            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error fetching videos:', error);
            throw error;
        }
    }

    // Upload video
    async uploadVideo(file: File, metadata: {
        title: string;
        description?: string;
        category: string;
        type: string;
        difficulty: string;
        tags?: string[];
    }) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            // Upload video file
            const fileName = `${user.id}/${Date.now()}_${file.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('videos')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // Get video URL
            const { data: urlData } = supabase.storage
                .from('videos')
                .getPublicUrl(fileName);

            // Save video metadata
            const { data, error } = await supabase
                .from('videos')
                .insert([{
                    user_id: user.id,
                    ...metadata,
                    storage_path: uploadData.path,
                    video_url: urlData.publicUrl,
                    instructor_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Instructor'
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error uploading video:', error);
            throw error;
        }
    }
}