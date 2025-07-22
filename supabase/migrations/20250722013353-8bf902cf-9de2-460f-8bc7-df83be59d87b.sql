
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create services table for the three main offerings
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('forex', 'fitness', 'martial_arts')),
  description TEXT,
  price DECIMAL(10,2),
  duration_minutes INTEGER,
  max_participants INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table for service appointments
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  service_id UUID REFERENCES public.services NOT NULL,
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forex signals table
CREATE TABLE public.forex_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  currency_pair TEXT NOT NULL,
  signal_type TEXT NOT NULL CHECK (signal_type IN ('buy', 'sell')),
  entry_price DECIMAL(10,5),
  stop_loss DECIMAL(10,5),
  take_profit DECIMAL(10,5),
  confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fitness programs table
CREATE TABLE public.fitness_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  program_type TEXT NOT NULL CHECK (program_type IN ('strength', 'cardio', 'flexibility', 'mixed')),
  duration_weeks INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create martial arts belts/ranks table
CREATE TABLE public.martial_arts_ranks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  discipline TEXT NOT NULL,
  rank_name TEXT NOT NULL,
  rank_level INTEGER,
  date_achieved DATE,
  instructor TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create training sessions table
CREATE TABLE public.training_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('forex', 'fitness', 'martial_arts')),
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  completed BOOLEAN DEFAULT false,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.martial_arts_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for bookings
CREATE POLICY "Users can view their own bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
  ON public.bookings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for martial arts ranks
CREATE POLICY "Users can view their own ranks" 
  ON public.martial_arts_ranks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ranks" 
  ON public.martial_arts_ranks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for training sessions
CREATE POLICY "Users can view their own sessions" 
  ON public.training_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" 
  ON public.training_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
  ON public.training_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Public read access for services and forex signals (no auth required)
CREATE POLICY "Public can view services" 
  ON public.services 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Public can view forex signals" 
  ON public.forex_signals 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Public can view fitness programs" 
  ON public.fitness_programs 
  FOR SELECT 
  TO public 
  USING (true);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'first_name', 
    new.raw_user_meta_data ->> 'last_name'
  );
  RETURN new;
END;
$$;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample data for services
INSERT INTO public.services (name, category, description, price, duration_minutes, max_participants) VALUES
('Forex Trading Fundamentals', 'forex', 'Learn the basics of forex trading and market analysis', 199.99, 120, 10),
('Advanced Technical Analysis', 'forex', 'Master advanced charting techniques and trading strategies', 299.99, 90, 8),
('Personal Training Session', 'fitness', 'One-on-one fitness training tailored to your goals', 75.00, 60, 1),
('Group Fitness Class', 'fitness', 'High-energy group workout sessions', 25.00, 45, 15),
('Karate Beginner Class', 'martial_arts', 'Introduction to traditional Karate techniques', 40.00, 60, 12),
('Advanced Sparring Session', 'martial_arts', 'Advanced martial arts sparring and technique refinement', 60.00, 90, 8);

-- Insert sample fitness programs
INSERT INTO public.fitness_programs (name, level, program_type, duration_weeks, description) VALUES
('Strength Foundation', 'beginner', 'strength', 8, 'Build fundamental strength through classical training methods'),
('Endurance Builder', 'intermediate', 'cardio', 6, 'Develop cardiovascular fitness and stamina'),
('Flexibility Master', 'beginner', 'flexibility', 4, 'Improve mobility and flexibility for daily life'),
('Warrior Training', 'advanced', 'mixed', 12, 'Complete fitness program combining strength, cardio, and martial arts');

-- Insert sample forex signals
INSERT INTO public.forex_signals (currency_pair, signal_type, entry_price, stop_loss, take_profit, confidence_level, description) VALUES
('EUR/USD', 'buy', 1.0850, 1.0800, 1.0950, 4, 'Strong bullish momentum with good risk/reward ratio'),
('GBP/USD', 'sell', 1.2350, 1.2400, 1.2250, 3, 'Resistance level reached, expecting pullback'),
('USD/JPY', 'buy', 149.80, 149.30, 150.50, 5, 'Breakout above key resistance, strong upward trend');
