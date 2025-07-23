
-- Update the check constraint to include 'karate' as a valid session type
ALTER TABLE public.training_sessions 
DROP CONSTRAINT IF EXISTS training_sessions_session_type_check;

-- Add the updated constraint with 'karate' included
ALTER TABLE public.training_sessions 
ADD CONSTRAINT training_sessions_session_type_check 
CHECK (session_type IN ('fitness', 'martial_arts', 'karate', 'forex', 'general'));
