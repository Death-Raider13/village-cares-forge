-- Fix security issues for functions by setting search_path

-- Update the existing notify_content_publication function with proper search_path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Update the existing get_user_role function with proper search_path
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = user_uuid LIMIT 1);
END;
$$;