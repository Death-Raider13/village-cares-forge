-- Add role column to profiles table and create secure admin role management
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';

-- Create a check constraint to ensure only valid roles
ALTER TABLE public.profiles ADD CONSTRAINT valid_roles CHECK (role IN ('user', 'admin', 'moderator'));

-- Create notifications table for the notification system
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add missing RLS policies for admin table
ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;

-- Create admin policies (only admins can access admin table)
CREATE POLICY "Only admins can access admin table" 
ON public.admin 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Add missing RLS policies for auth table
ALTER TABLE public.auth ENABLE ROW LEVEL SECURITY;

-- Create auth policies (only admins can access auth table)
CREATE POLICY "Only admins can access auth table" 
ON public.auth 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Add missing RLS policies for videos table
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create videos policies (public read access for now)
CREATE POLICY "Public can view videos" 
ON public.videos 
FOR SELECT 
USING (true);

-- Create separate policies for videos management
CREATE POLICY "Only admins can insert videos" 
ON public.videos 
FOR INSERT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Only admins can update videos" 
ON public.videos 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Only admins can delete videos" 
ON public.videos 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for notifications updated_at
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = user_uuid LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;