-- Fix RLS policies for academy_content to work with admin_users table
-- Drop existing policies that reference profiles table
DROP POLICY IF EXISTS "Admins can view all academy content" ON public.academy_content;
DROP POLICY IF EXISTS "Admins can insert academy content" ON public.academy_content;
DROP POLICY IF EXISTS "Admins can update academy content" ON public.academy_content;
DROP POLICY IF EXISTS "Admins can delete academy content" ON public.academy_content;

-- Create new policies that check admin_users table instead
CREATE POLICY "Admins can view all academy content" 
ON public.academy_content FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND is_active = true
  )
);

CREATE POLICY "Admins can insert academy content" 
ON public.academy_content FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND is_active = true
  )
);

CREATE POLICY "Admins can update academy content" 
ON public.academy_content FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND is_active = true
  )
);

CREATE POLICY "Admins can delete academy content" 
ON public.academy_content FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND is_active = true
  )
);

-- Also fix content_notifications policies
DROP POLICY IF EXISTS "Admins can view all notifications" ON public.content_notifications;
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.content_notifications;
DROP POLICY IF EXISTS "Admins can update notifications" ON public.content_notifications;
DROP POLICY IF EXISTS "Admins can delete notifications" ON public.content_notifications;

CREATE POLICY "Admins can view all notifications" 
ON public.content_notifications FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND is_active = true
  )
);

CREATE POLICY "Admins can insert notifications" 
ON public.content_notifications FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND is_active = true
  )
);

CREATE POLICY "Admins can update notifications" 
ON public.content_notifications FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND is_active = true
  )
);

CREATE POLICY "Admins can delete notifications" 
ON public.content_notifications FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND is_active = true
  )
);