-- Update training_sessions table schema
ALTER TABLE training_sessions ADD COLUMN IF NOT EXISTS lesson_id TEXT;
ALTER TABLE training_sessions ADD COLUMN IF NOT EXISTS score INTEGER;
ALTER TABLE training_sessions ADD COLUMN IF NOT EXISTS time_spent INTEGER;
ALTER TABLE training_sessions ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE training_sessions ADD COLUMN IF NOT EXISTS discipline TEXT;
ALTER TABLE training_sessions ADD COLUMN IF NOT EXISTS session_data JSONB;
ALTER TABLE training_sessions ALTER COLUMN session_type DROP NOT NULL;
