
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Clock, Target, Activity, Heart, Dumbbell, Timer, Award, TrendingUp, Users, BookOpen, Star } from 'lucide-react';

interface FitnessProgram {
  id: string;
  name: string;
  level: string;
  program_type: string;
  duration_weeks: number;
  description: string;
  created_at: string;
}

interface TrainingSession {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  completed: boolean;
  session_date: string;
}

const FitnessTraining: React.FC = () => {
  const [programs, setPrograms] = useState<FitnessProgram[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAge, setSelectedAge] = useState('adult');
  const { user } = useAuth();

  useEffect(() => {
    fetchPrograms();
    if (user) {
      fetchUserSessions();
    }
  }, [user]);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('fitness_programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching fitness programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSessions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('session_type', 'fitness')
        .order('session_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching training sessions:', error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strength': return <Dumbbell className="h-5 w-5" />;
      case 'cardio': return <Heart className="h-5 w-5" />;
      case 'flexibility': return <Activity className="h-5 w-5" />;
      case 'balance': return <Target className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getAgeAppropriateWorkouts = () => {
    const workouts = {
      kids: [
        { name: 'Fun Animal Movements', duration: 20, description: 'Bear crawls, frog jumps, and crab walks', level: 'beginner', type: 'movement' },
        { name: 'Playground Fitness', duration: 25, description: 'Monkey bars, swings, and climbing activities', level: 'beginner', type: 'play' },
        { name: 'Dance Party Workout', duration: 15, description: 'High-energy dance moves and rhythmic exercises', level: 'beginner', type: 'dance' },
        { name: 'Superhero Training', duration: 30, description: 'Hero poses, strength moves, and agility challenges', level: 'intermediate', type: 'adventure' }
      ],
      teen: [
        { name: 'Teen Strength Basics', duration: 35, description: 'Bodyweight exercises and light resistance training', level: 'beginner', type: 'strength' },
        { name: 'Sports Performance', duration: 45, description: 'Athletic drills and sport-specific movements', level: 'intermediate', type: 'athletic' },
        { name: 'HIIT for Teens', duration: 25, description: 'High-intensity interval training adapted for teenagers', level: 'intermediate', type: 'cardio' },
        { name: 'Flexibility & Mindfulness', duration: 30, description: 'Yoga flows and stretching with mental wellness', level: 'beginner', type: 'flexibility' }
      ],
      adult: [
        { name: 'Full Body Strength', duration: 45, description: 'Compound movements for muscle building', level: 'intermediate', type: 'strength' },
        { name: 'HIIT Cardio Circuit', duration: 30, description: 'High-intensity metabolic conditioning', level: 'advanced', type: 'cardio' },
        { name: 'Yoga Flow', duration: 60, description: 'Dynamic vinyasa flow for flexibility and strength', level: 'beginner', type: 'flexibility' },
        { name: 'Functional Movement', duration: 40, description: 'Real-world movement patterns and stability', level: 'intermediate', type: 'functional' }
      ],
      senior: [
        { name: 'Gentle Chair Exercises', duration: 25, description: 'Seated movements for mobility and strength', level: 'beginner', type: 'gentle' },
        { name: 'Balance & Stability', duration: 30, description: 'Fall prevention and stability training', level: 'beginner', type: 'balance' },
        { name: 'Water Aerobics', duration: 35, description: 'Low-impact exercises in water', level: 'beginner', type: 'aquatic' },
        { name: 'Tai Chi Flow', duration: 40, description: 'Slow, controlled movements for mind-body wellness', level: 'beginner', type: 'mindful' }
      ]
    };
    return workouts[selectedAge as keyof typeof workouts] || workouts.adult;
  };

  const getAgeGroupInfo = () => {
    const info = {
      kids: { title: 'Kids Fitness (Ages 5-12)', color: 'text-green-600', focus: 'Fun, movement, and play-based activities' },
      teen: { title: 'Teen Fitness (Ages 13-18)', color: 'text-blue-600', focus: 'Sport performance and healthy habits' },
      adult: { title: 'Adult Fitness (Ages 19-64)', color: 'text-purple-600', focus: 'Strength, endurance, and wellness' },
      senior: { title: 'Senior Fitness (Ages 65+)', color: 'text-orange-600', focus: 'Mobility, balance, and independence' }
    };
    return info[selectedAge as keyof typeof info] || info.adult;
  };

  const completedSessions = sessions.filter(s => s.completed).length;
  const totalWorkoutTime = sessions.reduce((total, session) => total + (session.duration_minutes || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-warm-cream to-vintage-sage-green/10">
      {/* Enhanced Hero Section */}
      <section className="py-20 bg-gradient-to-br from-vintage-sage-green via-vintage-deep-blue to-vintage-burgundy relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center text-vintage-warm-cream relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-playfair font-bold text-5xl md:text-7xl mb-6 tracking-tight">
              Fitness for Every Age
            </h1>
            <p className="font-crimson text-xl md:text-2xl mb-8 leading-relaxed opacity-90">
              Transform your health with age-appropriate fitness programs designed by certified trainers. 
              From playful kids workouts to gentle senior exercises - fitness for the whole family.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button size="lg" className="bg-vintage-gold hover:bg-vintage-gold/90 text-vintage-deep-blue font-semibold px-8 py-3">
                <Activity className="mr-2 h-5 w-5" />
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-vintage-warm-cream text-vintage-warm-cream hover:bg-vintage-warm-cream hover:text-vintage-deep-blue font-semibold px-8 py-3">
                <BookOpen className="mr-2 h-5 w-5" />
                Fitness Education
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Age Selection */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm border-2 border-vintage-gold/20">
          <CardHeader className="text-center">
            <CardTitle className="font-playfair text-2xl text-vintage-deep-blue">Choose Your Age Group</CardTitle>
            <CardDescription>Discover fitness programs tailored to your life stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
              <Select value={selectedAge} onValueChange={setSelectedAge}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kids">Kids (5-12 years)</SelectItem>
                  <SelectItem value="teen">Teens (13-18 years)</SelectItem>
                  <SelectItem value="adult">Adults (19-64 years)</SelectItem>
                  <SelectItem value="senior">Seniors (65+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-center">
              <h3 className={`text-xl font-semibold ${getAgeGroupInfo().color} mb-2`}>
                {getAgeGroupInfo().title}
              </h3>
              <p className="text-vintage-dark-brown font-crimson">
                Focus: {getAgeGroupInfo().focus}
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="workouts" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="workouts" className="font-semibold">Workouts</TabsTrigger>
            <TabsTrigger value="education" className="font-semibold">Learn</TabsTrigger>
            <TabsTrigger value="nutrition" className="font-semibold">Nutrition</TabsTrigger>
            <TabsTrigger value="progress" className="font-semibold">Progress</TabsTrigger>
            <TabsTrigger value="community" className="font-semibold">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="workouts" className="space-y-8 mt-8">
            {/* Age-Appropriate Workouts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getAgeAppropriateWorkouts().map((workout, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm border-l-4 border-l-vintage-gold">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                        {getTypeIcon(workout.type)}
                        {workout.name}
                      </CardTitle>
                      <Badge className={getLevelColor(workout.level)}>
                        {workout.level}
                      </Badge>
                    </div>
                    <CardDescription className="font-crimson">{workout.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-vintage-deep-blue" />
                        <span className="font-medium">{workout.duration} minutes</span>
                      </span>
                      <span className="capitalize font-medium text-vintage-dark-brown">
                        {workout.type}
                      </span>
                    </div>
                    <Button className="w-full bg-vintage-deep-blue hover:bg-vintage-burgundy" disabled={!user}>
                      {user ? 'Start Workout' : 'Sign in to Access'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* General Fitness Programs */}
            <div className="mt-12">
              <h3 className="text-2xl font-playfair font-bold text-vintage-deep-blue mb-6">Structured Programs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full text-center py-12">
                    <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-vintage-deep-blue" />
                    <p className="text-vintage-dark-brown">Loading fitness programs...</p>
                  </div>
                ) : (
                  programs.map((program) => (
                    <Card key={program.id} className="hover:shadow-lg transition-shadow bg-white/95 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                            {getTypeIcon(program.program_type)}
                            {program.name}
                          </CardTitle>
                          <Badge className={getLevelColor(program.level)}>
                            {program.level}
                          </Badge>
                        </div>
                        <CardDescription className="font-crimson">{program.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {program.duration_weeks} weeks
                          </span>
                          <span className="capitalize font-medium">
                            {program.program_type}
                          </span>
                        </div>
                        <Button className="w-full bg-vintage-deep-blue hover:bg-vintage-burgundy" disabled={!user}>
                          {user ? 'Start Program' : 'Sign in to Start'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Fitness Fundamentals */}
              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                    <BookOpen className="h-5 w-5" />
                    Fitness Fundamentals
                  </CardTitle>
                  <CardDescription>Essential knowledge for beginners</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm font-crimson">
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Understanding different types of exercise</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>How to warm up and cool down properly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Setting realistic fitness goals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Understanding your body's signals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Building a sustainable routine</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-vintage-deep-blue hover:bg-vintage-burgundy" disabled={!user}>
                    {user ? 'Start Learning' : 'Sign in to Access'}
                  </Button>
                </CardContent>
              </Card>

              {/* Exercise Science */}
              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                    <Target className="h-5 w-5" />
                    Exercise Science
                  </CardTitle>
                  <CardDescription>The science behind effective training</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm font-crimson">
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Muscle growth and adaptation principles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Cardiovascular system responses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Energy systems and metabolism</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Recovery and adaptation cycles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Progressive overload principles</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-vintage-deep-blue hover:bg-vintage-burgundy" disabled={!user}>
                    {user ? 'Explore Science' : 'Sign in to Access'}
                  </Button>
                </CardContent>
              </Card>

              {/* Injury Prevention */}
              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                    <Heart className="h-5 w-5" />
                    Injury Prevention
                  </CardTitle>
                  <CardDescription>Stay safe and train smart</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm font-crimson">
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Proper form and technique mastery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Common exercise mistakes to avoid</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Mobility and flexibility importance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Recovery strategies and techniques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>When to rest and when to push</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-vintage-deep-blue hover:bg-vintage-burgundy" disabled={!user}>
                    {user ? 'Learn Safety' : 'Sign in to Access'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-playfair text-vintage-deep-blue">Age-Specific Nutrition</CardTitle>
                  <CardDescription>Nutrition guidelines for {getAgeGroupInfo().title.toLowerCase()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedAge === 'kids' && (
                    <>
                      <div>
                        <h4 className="font-semibold mb-2 text-vintage-deep-blue">Growing Bodies Need:</h4>
                        <ul className="text-sm text-vintage-dark-brown space-y-1">
                          <li>• Plenty of calcium for strong bones</li>
                          <li>• Protein for muscle development</li>
                          <li>• Iron-rich foods for energy</li>
                          <li>• Colorful fruits and vegetables</li>
                          <li>• Regular meals and healthy snacks</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-vintage-deep-blue">Fun Nutrition Tips:</h4>
                        <p className="text-sm text-vintage-dark-brown">
                          Make eating fun with colorful plates, involve kids in cooking, and teach them about different food groups through games and activities.
                        </p>
                      </div>
                    </>
                  )}
                  {selectedAge === 'teen' && (
                    <>
                      <div>
                        <h4 className="font-semibold mb-2 text-vintage-deep-blue">Teen Nutrition Essentials:</h4>
                        <ul className="text-sm text-vintage-dark-brown space-y-1">
                          <li>• Increased calories for growth spurts</li>
                          <li>• Lean proteins for muscle development</li>
                          <li>• Complex carbs for sustained energy</li>
                          <li>• Healthy fats for brain development</li>
                          <li>• Adequate hydration, especially during sports</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-vintage-deep-blue">Sports Nutrition:</h4>
                        <p className="text-sm text-vintage-dark-brown">
                          Pre-workout: Light carbs 1-2 hours before. Post-workout: Protein and carbs within 30 minutes for recovery.
                        </p>
                      </div>
                    </>
                  )}
                  {selectedAge === 'adult' && (
                    <>
                      <div>
                        <h4 className="font-semibold mb-2 text-vintage-deep-blue">Adult Nutrition Focus:</h4>
                        <ul className="text-sm text-vintage-dark-brown space-y-1">
                          <li>• Balanced macronutrients for energy</li>
                          <li>• Adequate protein for muscle maintenance</li>
                          <li>• Fiber-rich foods for digestive health</li>
                          <li>• Antioxidants for recovery and health</li>
                          <li>• Proper timing around workouts</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-vintage-deep-blue">Meal Timing:</h4>
                        <p className="text-sm text-vintage-dark-brown">
                          Pre-workout: Light meal 2-3 hours before or snack 30-60 minutes before. Post-workout: Protein and carbs within 2 hours.
                        </p>
                      </div>
                    </>
                  )}
                  {selectedAge === 'senior' && (
                    <>
                      <div>
                        <h4 className="font-semibold mb-2 text-vintage-deep-blue">Senior Nutrition Priorities:</h4>
                        <ul className="text-sm text-vintage-dark-brown space-y-1">
                          <li>• Higher protein needs for muscle preservation</li>
                          <li>• Calcium and Vitamin D for bone health</li>
                          <li>• B12 and other essential vitamins</li>
                          <li>• Adequate hydration</li>
                          <li>• Easy-to-digest, nutrient-dense foods</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-vintage-deep-blue">Special Considerations:</h4>
                        <p className="text-sm text-vintage-dark-brown">
                          Smaller, frequent meals may be easier to digest. Focus on nutrient density and consider supplements as recommended by healthcare providers.
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-playfair text-vintage-deep-blue">Hydration Guidelines</CardTitle>
                  <CardDescription>Staying properly hydrated for optimal performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-vintage-deep-blue">Daily Water Needs:</h4>
                    <ul className="text-sm text-vintage-dark-brown space-y-1">
                      <li>• Kids: 4-6 glasses per day</li>
                      <li>• Teens: 6-8 glasses per day</li>
                      <li>• Adults: 8-10 glasses per day</li>
                      <li>• Seniors: 6-8 glasses per day</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-vintage-deep-blue">Exercise Hydration:</h4>
                    <ul className="text-sm text-vintage-dark-brown space-y-1">
                      <li>• Before: 2-3 glasses 2-3 hours prior</li>
                      <li>• During: Small sips every 15-20 minutes</li>
                      <li>• After: 2-3 glasses for every pound lost</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-vintage-deep-blue">Signs of Good Hydration:</h4>
                    <p className="text-sm text-vintage-dark-brown">
                      Light yellow urine, consistent energy levels, and minimal thirst throughout the day.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Award className="h-4 w-4 text-vintage-gold" />
                      Completed Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-vintage-deep-blue">{completedSessions}</div>
                    <p className="text-xs text-vintage-dark-brown">Total workouts</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-vintage-deep-blue" />
                      Total Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-vintage-deep-blue">{Math.round(totalWorkoutTime / 60)}h</div>
                    <p className="text-xs text-vintage-dark-brown">Training hours</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      Current Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">7</div>
                    <p className="text-xs text-vintage-dark-brown">Days active</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-vintage-burgundy" />
                      Goal Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-vintage-burgundy">85%</div>
                    <Progress value={85} className="mt-2" />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-playfair text-vintage-deep-blue">Track Your Fitness Journey</CardTitle>
                  <CardDescription>Sign in to monitor your progress and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="bg-vintage-deep-blue hover:bg-vintage-burgundy">Sign In to View Progress</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-playfair text-vintage-deep-blue">Fitness Community</CardTitle>
                <CardDescription>Connect with others on their fitness journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border border-vintage-gold/20 rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-4 text-vintage-deep-blue" />
                    <h4 className="font-semibold mb-2">Family Challenges</h4>
                    <p className="text-sm text-vintage-dark-brown mb-4">
                      Join fun fitness challenges for the whole family
                    </p>
                    <Button className="w-full bg-vintage-deep-blue hover:bg-vintage-burgundy" disabled={!user}>
                      {user ? 'Join Challenge' : 'Sign in to Access'}
                    </Button>
                  </div>
                  <div className="text-center p-6 border border-vintage-gold/20 rounded-lg">
                    <BookOpen className="h-8 w-8 mx-auto mb-4 text-vintage-deep-blue" />
                    <h4 className="font-semibold mb-2">Success Stories</h4>
                    <p className="text-sm text-vintage-dark-brown mb-4">
                      Read inspiring transformation stories from our community
                    </p>
                    <Button className="w-full bg-vintage-deep-blue hover:bg-vintage-burgundy" disabled={!user}>
                      {user ? 'Read Stories' : 'Sign in to Access'}
                    </Button>
                  </div>
                  <div className="text-center p-6 border border-vintage-gold/20 rounded-lg">
                    <Heart className="h-8 w-8 mx-auto mb-4 text-vintage-deep-blue" />
                    <h4 className="font-semibold mb-2">Support Groups</h4>
                    <p className="text-sm text-vintage-dark-brown mb-4">
                      Find support and motivation from like-minded individuals
                    </p>
                    <Button className="w-full bg-vintage-deep-blue hover:bg-vintage-burgundy" disabled={!user}>
                      {user ? 'Join Group' : 'Sign in to Access'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FitnessTraining;
