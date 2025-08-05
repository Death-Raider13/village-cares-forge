-- Create custom content table for academy courses
CREATE TABLE public.academy_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discipline text NOT NULL CHECK (discipline IN ('fitness', 'karate', 'forex')),
  content_type text NOT NULL CHECK (content_type IN ('course', 'lesson', 'module')),
  title text NOT NULL,
  description text,
  content text,
  parent_id uuid REFERENCES public.academy_content(id) ON DELETE CASCADE,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(discipline, content_type, title)
);

-- Enable RLS
ALTER TABLE public.academy_content ENABLE ROW LEVEL SECURITY;

-- Create policies for academy content
CREATE POLICY "Anyone can view active academy content"
ON public.academy_content
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage academy content"
ON public.academy_content
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create notifications management table for linking content and notifications
CREATE TABLE public.content_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES public.academy_content(id) ON DELETE CASCADE,
  notification_title text NOT NULL,
  notification_message text NOT NULL,
  target_discipline text CHECK (target_discipline IN ('fitness', 'karate', 'forex', 'all')),
  scheduled_at timestamp with time zone,
  sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS for content notifications
ALTER TABLE public.content_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for content notifications
CREATE POLICY "Admins can manage content notifications"
ON public.content_notifications
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create function to automatically send notifications when content is published
CREATE OR REPLACE FUNCTION public.notify_content_publication()
RETURNS TRIGGER AS $$
BEGIN
  -- If content is being activated (published)
  IF NEW.is_active = true AND (OLD.is_active = false OR OLD.is_active IS NULL) THEN
    -- Insert a notification for the content publication
    INSERT INTO public.content_notifications (
      content_id,
      notification_title,
      notification_message,
      target_discipline,
      created_by
    ) VALUES (
      NEW.id,
      'New ' || INITCAP(NEW.discipline) || ' Content Available',
      'New ' || NEW.content_type || ' "' || NEW.title || '" has been published in the ' || INITCAP(NEW.discipline) || ' Academy.',
      NEW.discipline,
      NEW.created_by
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for content publication notifications
CREATE TRIGGER trigger_notify_content_publication
  AFTER UPDATE OF is_active ON public.academy_content
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_content_publication();

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_academy_content_updated_at
  BEFORE UPDATE ON public.academy_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();