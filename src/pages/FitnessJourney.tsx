
import React, { useState, useEffect } from 'react';
import LazyLoad from 'react-lazy-load';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, CheckCircle, Clock, Dumbbell, Heart, Target, TrendingUp, Trophy, Info } from 'lucide-react';
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
  instructions: string;
  tips: string[];
}

const FitnessJourney: React.FC = () => {
  const { user } = useAuth();
  const [userGoals, setUserGoals] = useState<string[]>([]);
  const [userLevel, setUserLevel] = useState<string>('beginner');
  const [completedWorkouts, setCompletedWorkouts] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(12);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutPlan | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);

  const goalBasedWorkouts: Record<string, WorkoutPlan[]> = {
    weight_loss: [
      {
        id: 'wl1',
        title: 'HIIT Fat Burner',
        description: 'High-intensity interval training to maximize calorie burn',
        duration: 30,
        difficulty: 'intermediate',
        exercises: [
          {
            name: 'Jumping Jacks',
            sets: 3,
            reps: '30 seconds',
            description: 'Full body cardio movement',
            instructions: 'Start with feet together, jump while spreading legs and raising arms overhead, then jump back to starting position.',
            tips: ['Keep your core engaged', 'Land softly on balls of feet', 'Maintain steady breathing rhythm']
          },
          {
            name: 'Burpees',
            sets: 3,
            reps: '10-15',
            description: 'Total body explosive exercise',
            instructions: 'Start standing, squat down and place hands on floor, jump feet back to plank, do push-up, jump feet forward, then jump up with arms overhead.',
            tips: ['Keep your core tight throughout', 'Modify by stepping instead of jumping', 'Focus on smooth transitions']
          },
          {
            name: 'Mountain Climbers',
            sets: 3,
            reps: '30 seconds',
            description: 'Core and cardio combination',
            instructions: 'Start in plank position, alternate bringing knees to chest rapidly while maintaining plank position.',
            tips: ['Keep hips level', 'Maintain straight line from head to heels', 'Drive knees toward chest']
          },
          {
            name: 'High Knees',
            sets: 3,
            reps: '30 seconds',
            description: 'Intense cardio movement',
            instructions: 'Run in place while lifting knees as high as possible, aiming to bring knees to hip level.',
            tips: ['Pump arms actively', 'Stay on balls of feet', 'Keep torso upright']
          }
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
          {
            name: 'Push-ups',
            sets: 3,
            reps: '8-12',
            description: 'Chest and tricep builder',
            instructions: 'Start in plank position, lower body until chest nearly touches floor, push back up to starting position.',
            tips: ['Keep core engaged', 'Maintain straight line from head to heels', 'Control the descent']
          },
          {
            name: 'Pike Push-ups',
            sets: 3,
            reps: '6-10',
            description: 'Shoulder development',
            instructions: 'Start in downward dog position, lower head toward ground between hands, push back up.',
            tips: ['Keep legs straight', 'Focus on shoulder movement', 'Walk feet closer to hands for more difficulty']
          },
          {
            name: 'Tricep Dips',
            sets: 3,
            reps: '8-12',
            description: 'Tricep isolation',
            instructions: 'Sit on chair edge, hands beside hips, lower body by bending elbows, push back up.',
            tips: ['Keep elbows close to body', 'Lower until arms are parallel to floor', 'Engage core throughout']
          },
          {
            name: 'Plank to Push-up',
            sets: 3,
            reps: '5-8',
            description: 'Core and upper body combo',
            instructions: 'Start in plank on forearms, push up to full plank position one arm at a time, return to forearm plank.',
            tips: ['Keep hips stable', 'Alternate leading arm', 'Maintain plank position throughout']
          }
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
          {
            name: 'Walking/Jogging',
            sets: 1,
            reps: '20 minutes',
            description: 'Steady state cardio',
            instructions: 'Maintain a steady pace that allows you to hold a conversation while exercising.',
            tips: ['Start slow and build up', 'Focus on consistent breathing', 'Land midfoot when running']
          },
          {
            name: 'Step-ups',
            sets: 3,
            reps: '10 each leg',
            description: 'Lower body endurance',
            instructions: 'Step up onto sturdy surface with right foot, bring left foot up, step down with right foot first.',
            tips: ['Use full foot on step surface', 'Keep knee aligned over ankle', 'Control the descent']
          },
          {
            name: 'Arm Circles',
            sets: 2,
            reps: '30 seconds each',
            description: 'Shoulder endurance',
            instructions: 'Extend arms parallel to floor, make small circles forward then backward.',
            tips: ['Start with small circles', 'Keep arms straight', 'Gradually increase circle size']
          },
          {
            name: 'Wall Sit',
            sets: 3,
            reps: '30-60 seconds',
            description: 'Leg endurance',
            instructions: 'Lean back against wall, slide down until thighs are parallel to floor, hold position.',
            tips: ['Keep back flat against wall', 'Thighs parallel to floor', 'Distribute weight evenly']
          }
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
          {
            name: 'Squats',
            sets: 4,
            reps: '12-15',
            description: 'Lower body strength',
            instructions: 'Stand with feet shoulder-width apart, lower hips back and down, return to standing.',
            tips: ['Keep knees aligned with toes', 'Lower until thighs are parallel', 'Drive through heels to stand']
          },
          {
            name: 'Push-ups',
            sets: 4,
            reps: '8-12',
            description: 'Upper body strength',
            instructions: 'Start in plank position, lower body until chest nearly touches floor, push back up.',
            tips: ['Keep core engaged', 'Maintain straight line', 'Control the movement']
          },
          {
            name: 'Lunges',
            sets: 3,
            reps: '10 each leg',
            description: 'Single leg strength',
            instructions: 'Step forward with one leg, lower hips until both knees are at 90 degrees, return to start.',
            tips: ['Keep front knee over ankle', 'Lower knee should nearly touch ground', 'Keep torso upright']
          },
          {
            name: 'Plank',
            sets: 3,
            reps: '30-60 seconds',
            description: 'Core strength',
            instructions: 'Hold plank position on forearms and toes, maintaining straight line from head to heels.',
            tips: ['Engage core muscles', 'Keep hips level', 'Breathe steadily']
          }
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
          {
            name: 'Cat-Cow Stretch',
            sets: 2,
            reps: '10',
            description: 'Spine mobility',
            instructions: 'Start on hands and knees, arch back (cow), then round spine (cat), repeat smoothly.',
            tips: ['Move slowly and controlled', 'Focus on spinal articulation', 'Coordinate with breathing']
          },
          {
            name: 'Downward Dog',
            sets: 3,
            reps: '30 seconds',
            description: 'Full body stretch',
            instructions: 'Start on hands and knees, tuck toes under, lift hips up and back into inverted V shape.',
            tips: ['Keep hands shoulder-width apart', 'Pedal feet to stretch calves', 'Lengthen spine']
          },
          {
            name: 'Hip Circles',
            sets: 2,
            reps: '10 each direction',
            description: 'Hip mobility',
            instructions: 'Stand with hands on hips, make large circles with hips in both directions.',
            tips: ['Keep upper body still', 'Make full range circles', 'Control the movement']
          },
          {
            name: 'Shoulder Rolls',
            sets: 2,
            reps: '10 each direction',
            description: 'Shoulder mobility',
            instructions: 'Roll shoulders forward in large circles, then backward.',
            tips: ['Make full circles', 'Keep arms relaxed', 'Focus on shoulder blade movement']
          }
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
          {
            name: 'Bodyweight Squats',
            sets: 3,
            reps: '10-12',
            description: 'Lower body foundation',
            instructions: 'Stand with feet shoulder-width apart, lower hips back and down, return to standing.',
            tips: ['Keep chest up', 'Weight on heels', 'Knees track over toes']
          },
          {
            name: 'Modified Push-ups',
            sets: 3,
            reps: '6-10',
            description: 'Upper body basics',
            instructions: 'Perform push-ups on knees or against wall, maintaining proper form.',
            tips: ['Keep body straight', 'Control the movement', 'Progress to full push-ups']
          },
          {
            name: 'Glute Bridges',
            sets: 3,
            reps: '12-15',
            description: 'Posterior chain',
            instructions: 'Lie on back, lift hips by squeezing glutes, lower back down.',
            tips: ['Drive through heels', 'Squeeze glutes at top', 'Keep core engaged']
          },
          {
            name: 'Dead Bug',
            sets: 2,
            reps: '8 each side',
            description: 'Core stability',
            instructions: 'Lie on back, extend opposite arm and leg, return to start, repeat other side.',
            tips: ['Keep lower back pressed down', 'Move slowly', 'Maintain core engagement']
          }
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
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setWorkoutHistory(data);
        const completedSessions = data.filter(session => session.completed);
        setCompletedWorkouts(completedSessions.length);

        const latestSession = data[0];
        const description = latestSession.description || '';
        const goals = description.match(/Goals: (.+?)(?:\.|$)/)?.[1]?.split(', ') || [];
        const level = description.match(/Level: (.+?)(?:\.|$)/)?.[1] || 'beginner';

        setUserGoals(goals);
        setUserLevel(level);

        // Set current workout based on primary goal and level
        const primaryGoal = goals[0];
        if (primaryGoal && goalBasedWorkouts[primaryGoal]) {
          const workouts = goalBasedWorkouts[primaryGoal];
          const appropriateWorkout = workouts.find(w => w.difficulty === level) || workouts[0];
          setCurrentWorkout(appropriateWorkout);
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
      await fetchUserJourney();
    } catch (error) {
      console.error('Error completing workout:', error);
      toast.error('Failed to record workout completion');
    }
  };

  const openExerciseModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseModalOpen(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressPercentage = () => {
    return Math.min((completedWorkouts / totalWorkouts) * 100, 100);
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
                <Progress value={getProgressPercentage()} />
                <p className="text-xs text-muted-foreground">
                  {getProgressPercentage().toFixed(1)}% Complete
                </p>
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
                <Badge variant="outline" className="text-xs">
                  {userLevel}
                </Badge>
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
                <p className="text-2xl font-bold text-green-600">{completedWorkouts % 7}/7</p>
                <p className="text-sm text-muted-foreground">Weekly goal</p>
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
                        <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold">{exercise.name}</h5>
                            <div className="flex gap-2">
                              <Badge variant="outline">{exercise.sets} sets × {exercise.reps}</Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openExerciseModal(exercise)}
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                            </div>
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
                  <p>No current workout assigned. Please complete your fitness assessment first.</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800">Total Workouts</h4>
                      <p className="text-2xl font-bold text-blue-600">{completedWorkouts}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800">Total Minutes</h4>
                      <p className="text-2xl font-bold text-green-600">
                        {workoutHistory.reduce((total, session) => total + (session.duration_minutes || 0), 0)}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800">Streak</h4>
                      <p className="text-2xl font-bold text-purple-600">
                        {Math.min(completedWorkouts, 7)} days
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Recent Workouts</h4>
                    <div className="space-y-2">
                      {workoutHistory.slice(0, 5).map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{session.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(session.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{session.duration_minutes || 0} min</span>
                            {session.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                        </div>
                      ))}
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

      {/* Exercise Instructions Modal */}
      <Dialog open={exerciseModalOpen} onOpenChange={setExerciseModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedExercise?.name}</DialogTitle>
          </DialogHeader>
          {selectedExercise && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Instructions</h4>
                <p className="text-sm text-muted-foreground">{selectedExercise.instructions}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tips for Success</h4>
                <ul className="space-y-1">
                  {selectedExercise.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-vintage-gold">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-vintage-sage-green/10 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Sets:</strong> {selectedExercise.sets} | <strong>Reps:</strong> {selectedExercise.reps}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FitnessJourney;
