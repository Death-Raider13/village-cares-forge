
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Clock, Target, Activity, Heart, Dumbbell, Timer, Award, TrendingUp } from 'lucide-react';

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
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strength': return <Dumbbell className="h-4 w-4" />;
      case 'cardio': return <Heart className="h-4 w-4" />;
      case 'flexibility': return <Activity className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const completedSessions = sessions.filter(s => s.completed).length;
  const totalWorkoutTime = sessions.reduce((total, session) => total + (session.duration_minutes || 0), 0);

  return (
    <div className="min-h-screen bg-vintage-warm-cream">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-vintage-sage-green to-vintage-deep-blue">
        <div className="container mx-auto px-4 text-center text-vintage-warm-cream">
          <h1 className="font-playfair font-bold text-4xl md:text-6xl mb-4">
            Fitness Training Excellence
          </h1>
          <p className="font-crimson text-xl mb-8 max-w-3xl mx-auto">
            Transform your body and mind through structured fitness programs designed for lasting results
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-vintage-gold hover:bg-vintage-gold/90 text-vintage-deep-blue">
              Start Training
            </Button>
            <Button size="lg" variant="outline" className="border-vintage-warm-cream text-vintage-warm-cream hover:bg-vintage-warm-cream hover:text-vintage-deep-blue">
              View Programs
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="programs" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-8">Loading programs...</div>
              ) : (
                programs.map((program) => (
                  <Card key={program.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {getTypeIcon(program.program_type)}
                          {program.name}
                        </CardTitle>
                        <Badge className={getLevelColor(program.level)}>
                          {program.level}
                        </Badge>
                      </div>
                      <CardDescription>{program.description}</CardDescription>
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
                      <Button className="w-full" disabled={!user}>
                        {user ? 'Start Program' : 'Sign in to Start'}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    Upper Body Strength
                  </CardTitle>
                  <CardDescription>45 minutes • Intermediate</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm mb-4">
                    <li>• Push-ups (3x12)</li>
                    <li>• Pull-ups (3x8)</li>
                    <li>• Shoulder press (3x10)</li>
                    <li>• Chest fly (3x12)</li>
                  </ul>
                  <Button className="w-full" disabled={!user}>
                    {user ? 'Start Workout' : 'Sign in to Access'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    HIIT Cardio
                  </CardTitle>
                  <CardDescription>30 minutes • Advanced</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm mb-4">
                    <li>• Burpees (4x30s)</li>
                    <li>• Mountain climbers (4x30s)</li>
                    <li>• Jump squats (4x30s)</li>
                    <li>• High knees (4x30s)</li>
                  </ul>
                  <Button className="w-full" disabled={!user}>
                    {user ? 'Start Workout' : 'Sign in to Access'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Flexibility Flow
                  </CardTitle>
                  <CardDescription>25 minutes • Beginner</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm mb-4">
                    <li>• Forward fold (3x30s)</li>
                    <li>• Pigeon pose (3x30s each)</li>
                    <li>• Spinal twist (3x30s each)</li>
                    <li>• Child's pose (3x30s)</li>
                  </ul>
                  <Button className="w-full" disabled={!user}>
                    {user ? 'Start Workout' : 'Sign in to Access'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{completedSessions}</div>
                    <p className="text-xs text-muted-foreground">Total workouts</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(totalWorkoutTime / 60)}h</div>
                    <p className="text-xs text-muted-foreground">Training hours</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7</div>
                    <p className="text-xs text-muted-foreground">Days active</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85%</div>
                    <Progress value={85} className="mt-2" />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Track Your Progress</CardTitle>
                  <CardDescription>Sign in to see your fitness journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>Sign In to View Progress</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition Guidelines</CardTitle>
                  <CardDescription>Fuel your fitness journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Pre-Workout</h4>
                    <p className="text-sm text-muted-foreground">
                      Light carbs 30-60 minutes before training. Banana, oats, or toast.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Post-Workout</h4>
                    <p className="text-sm text-muted-foreground">
                      Protein and carbs within 2 hours. Greek yogurt, protein shake, or lean meat.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Hydration</h4>
                    <p className="text-sm text-muted-foreground">
                      8-10 glasses daily, more during intense training sessions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Meal Planning</CardTitle>
                  <CardDescription>Sample daily nutrition</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Breakfast</h4>
                    <p className="text-sm text-muted-foreground">
                      Oatmeal with berries and nuts, Greek yogurt
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Lunch</h4>
                    <p className="text-sm text-muted-foreground">
                      Grilled chicken salad with quinoa and vegetables
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Dinner</h4>
                    <p className="text-sm text-muted-foreground">
                      Lean fish with sweet potato and steamed broccoli
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FitnessTraining;
