
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CheckCircle, Clock, Dumbbell, Heart, Target, TrendingUp, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration?: number;
  description: string;
}

const FitnessJourney: React.FC = () => {
  const { user } = useAuth();
  const [userGoals, setUserGoals] = useState<string[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(12);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutPlan | null>(null);

  const goalBasedWorkouts: Record<string, WorkoutPlan[]> = {
    weight_loss: [
      {
        id: 'wl1',
        title: 'HIIT Fat Burner',
        description: 'High-intensity interval training to maximize calorie burn',
        duration: 30,
        difficulty: 'intermediate',
        exercises: [
          { name: 'Jumping Jacks', sets: 3, reps: '30 seconds', description: 'Full body cardio movement' },
          { name: 'Burpees', sets: 3, reps: '10-15', description: 'Total body explosive exercise' },
          { name: 'Mountain Climbers', sets: 3, reps: '30 seconds', description: 'Core and cardio combination' },
          { name: 'High Knees', sets: 3, reps: '30 seconds', description: 'Intense cardio movement' }
        ]
      }
    ],
    muscle_gain: [
      {
        id: 'mg1',
        title: 'Upper Body Strength',
        description: 'Build muscle mass in chest, shoulders, and arms',
        duration: 45,
        difficulty: 'intermediate',
        exercises: [
          { name: 'Push-ups', sets: 3, reps: '8-12', description: 'Chest and tricep builder' },
          { name: 'Pike Push-ups', sets: 3, reps: '6-10', description: 'Shoulder development' },
          { name: 'Tricep Dips', sets: 3, reps: '8-12', description: 'Tricep isolation' },
          { name: 'Plank to Push-up', sets: 3, reps: '5-8', description: 'Core and upper body combo' }
        ]
      }
    ],
    endurance: [
      {
        id: 'end1',
        title: 'Cardio Endurance Builder',
        description: 'Improve cardiovascular fitness and stamina',
        duration: 40,
        difficulty: 'beginner',
        exercises: [
          { name: 'Walking/Jogging', sets: 1, reps: '20 minutes', description: 'Steady state cardio' },
          { name: 'Step-ups', sets: 3, reps: '10 each leg', description: 'Lower body endurance' },
          { name: 'Arm Circles', sets: 2, reps: '30 seconds each', description: 'Shoulder endurance' },
          { name: 'Wall Sit', sets: 3, reps: '30-60 seconds', description: 'Leg endurance' }
        ]
      }
    ],
    strength: [
      {
        id: 'str1',
        title: 'Bodyweight Strength',
        description: 'Build functional strength using your body weight',
        duration: 50,
        difficulty: 'intermediate',
        exercises: [
          { name: 'Squats', sets: 4, reps: '12-15', description: 'Lower body strength' },
          { name: 'Push-ups', sets: 4, reps: '8-12', description: 'Upper body strength' },
          { name: 'Lunges', sets: 3, reps: '10 each leg', description: 'Single leg strength' },
          { name: 'Plank', sets: 3, reps: '30-60 seconds', description: 'Core strength' }
        ]
      }
    ],
    flexibility: [
      {
        id: 'flex1',
        title: 'Full Body Flexibility',
        description: 'Improve mobility and reduce muscle tension',
        duration: 25,
        difficulty: 'beginner',
        exercises: [
          { name: 'Cat-Cow Stretch', sets: 2, reps: '10', description: 'Spine mobility' },
          { name: 'Downward Dog', sets: 3, reps: '30 seconds', description: 'Full body stretch' },
          { name: 'Hip Circles', sets: 2, reps: '10 each direction', description: 'Hip mobility' },
          { name: 'Shoulder Rolls', sets: 2, reps: '10 each direction', description: 'Shoulder mobility' }
        ]
      }
    ],
    general: [
      {
        id: 'gen1',
        title: 'Full Body Workout',
        description: 'Balanced workout targeting all muscle groups',
        duration: 35,
        difficulty: 'beginner',
        exercises: [
          { name: 'Bodyweight Squats', sets: 3, reps: '10-12', description: 'Lower body foundation' },
          { name: 'Modified Push-ups', sets: 3, reps: '6-10', description: 'Upper body basics' },
          { name: 'Glute Bridges', sets: 3, reps: '12-15', description: 'Posterior chain' },
          { name: 'Dead Bug', sets: 2, reps: '8 each side', description: 'Core stability' }
        ]
      }
    ]
  };

  useEffect(() => {
    fetchUserJourney();
  }, [user]);

  const fetchUserJourney = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('session_type', 'fitness')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const latestSession = data[0];
        const description = latestSession.description || '';
        const goals = description.match(/Goals: (.+)/)?.[1]?.split(', ') || [];
        setUserGoals(goals);
        
        // Set current workout based on primary goal
        const primaryGoal = goals[0];
        if (primaryGoal && goalBasedWorkouts[primaryGoal]) {
          setCurrentWorkout(goalBasedWorkouts[primaryGoal][0]);
        }
      }
    } catch (error) {
      console.error('Error fetching user journey:', error);
    }
  };

  const completeWorkout = async () => {
    if (!user || !currentWorkout) return;

    try {
      const { error } = await supabase
        .from('training_sessions')
        .insert({
          user_id: user.id,
          title: `Completed: ${currentWorkout.title}`,
          description: `Finished ${currentWorkout.title} - ${currentWorkout.duration} minutes`,
          session_type: 'fitness',
          duration_minutes: currentWorkout.duration,
          completed: true,
        });

      if (error) throw error;

      setCompletedWorkouts(prev => prev + 1);
      toast.success('Workout completed! Great job!');
    } catch (error) {
      console.error('Error completing workout:', error);
      toast.error('Failed to record workout completion');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <CardContent>
            <p>Please sign in to access your fitness journey.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-warm-cream to-vintage-sage-green/10 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-playfair font-bold text-4xl text-vintage-deep-blue mb-2">Your Fitness Journey</h1>
          <p className="font-crimson text-lg text-vintage-dark-brown/80">Track your progress and achieve your goals</p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-vintage-gold" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Workouts Completed</span>
                  <span>{completedWorkouts}/{totalWorkouts}</span>
                </div>
                <Progress value={(completedWorkouts / totalWorkouts) * 100} />
                <p className="text-xs text-muted-foreground">Week {currentWeek} of 12</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-vintage-deep-blue" />
                Your Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userGoals.map((goal, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {goal.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-green-600">3/4</p>
                <p className="text-sm text-muted-foreground">Workouts completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="current">Current Workout</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            {currentWorkout ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{currentWorkout.title}</CardTitle>
                      <CardDescription className="mt-2">{currentWorkout.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getDifficultyColor(currentWorkout.difficulty)}>
                        {currentWorkout.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {currentWorkout.duration} min
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Exercises:</h4>
                    <div className="grid gap-4">
                      {currentWorkout.exercises.map((exercise, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold">{exercise.name}</h5>
                            <Badge variant="outline">{exercise.sets} sets × {exercise.reps}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{exercise.description}</p>
                        </div>
                      ))}
                    </div>
                    <Button onClick={completeWorkout} className="w-full bg-vintage-deep-blue hover:bg-vintage-forest-green">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p>No current workout assigned. Check your goals or contact support.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>Your personalized workout plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                    <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{day}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {index % 2 === 0 ? (
                          <Badge>Workout Day</Badge>
                        ) : index === 6 ? (
                          <Badge variant="outline">Rest Day</Badge>
                        ) : (
                          <Badge variant="secondary">Active Recovery</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>Monitor your fitness journey over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Recent Achievements</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Trophy className="h-5 w-5 text-green-600" />
                        <span>Completed first week of training!</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Heart className="h-5 w-5 text-blue-600" />
                        <span>Improved cardiovascular endurance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition">
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Guidance</CardTitle>
                <CardDescription>Fuel your fitness journey with proper nutrition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Daily Hydration</h4>
                      <p className="text-sm text-muted-foreground">Aim for 8-10 glasses of water daily</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Pre-Workout</h4>
                      <p className="text-sm text-muted-foreground">Light snack 30-60 minutes before exercise</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Post-Workout</h4>
                      <p className="text-sm text-muted-foreground">Protein and carbs within 30 minutes</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Sleep</h4>
                      <p className="text-sm text-muted-foreground">7-9 hours for optimal recovery</p>
                    </div>
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

export default FitnessJourney;
