-- Add created_at column to videos table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'videos'
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE public.videos
        ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    END IF;
END $$;

-- Add updated_at column to videos table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'videos'
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.videos
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    END IF;
END $$;

-- Comment to explain the purpose of this migration
COMMENT ON TABLE public.videos IS 'Table for storing video content with proper timestamps';