-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('forex', 'fitness', 'karate')),
    type TEXT NOT NULL CHECK (type IN ('course', 'workout', 'tutorial', 'analysis')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    instructor TEXT NOT NULL,
    duration INTEGER NOT NULL,
    url TEXT NOT NULL,
    thumbnail TEXT,
    tags TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for videos table
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Policy for selecting videos (public can view non-premium videos)
CREATE POLICY "Public can view non-premium videos" 
ON public.videos 
FOR SELECT 
USING (is_premium = FALSE OR auth.role() = 'authenticated');

-- Policy for inserting videos (authenticated users only)
CREATE POLICY "Authenticated users can insert videos" 
ON public.videos 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Policy for updating videos (only video owner or admin)
CREATE POLICY "Users can update their own videos" 
ON public.videos 
FOR UPDATE 
TO authenticated 
USING (
    auth.uid() = user_id OR 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Policy for deleting videos (only video owner or admin)
CREATE POLICY "Users can delete their own videos" 
ON public.videos 
FOR DELETE 
TO authenticated 
USING (
    auth.uid() = user_id OR 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Create storage buckets for videos and thumbnails if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for media bucket
CREATE POLICY "Public can view media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Users can update their own media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'media' AND (
    -- Allow if user owns the media or is admin
    EXISTS (
        SELECT 1 FROM public.videos v
        WHERE v.url LIKE '%' || storage.objects.name || '%'
        AND (v.user_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        ))
    )
));

CREATE POLICY "Users can delete their own media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND (
    -- Allow if user owns the media or is admin
    EXISTS (
        SELECT 1 FROM public.videos v
        WHERE v.url LIKE '%' || storage.objects.name || '%'
        AND (v.user_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        ))
    )
));