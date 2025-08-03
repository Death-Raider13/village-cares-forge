import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, CheckCircle, Clock, Target, TrendingUp, Trophy, Info } from 'lucide-react';

// Import our new components and hooks
import { FitnessProvider } from '@/contexts/FitnessContext';
import { useFitnessJourney } from '@/hooks/useFitnessJourney';
import ExerciseCard from '@/components/fitness/ExerciseCard';
import ProgressIndicator from '@/components/fitness/ProgressIndicator';
import ProgressChart from '@/components/fitness/ProgressChart';
import WorkoutSummary from '@/components/fitness/WorkoutSummary';
import { getDifficultyColor } from '@/services/workoutData';

/**
 * Wrapper component that provides the FitnessContext
 */
const FitnessJourneyPage: React.FC = () => {
  return (
    <FitnessProvider>
      <FitnessJourneyContent />
    </FitnessProvider>
  );
};

/**
 * Main content component that uses the fitness context
 */
const FitnessJourneyContent: React.FC = () => {
  const { user } = useAuth();
  const {
    // Data
    goals,
    level,
    completedWorkouts,
    totalWorkouts,
    currentWorkout,
    workoutHistory,

    // Derived values
    progressPercentage,
    totalMinutes,
    streak,

    // UI state
    activeTab,
    setActiveTab,
    selectedExercise,
    exerciseModalOpen,

    // Actions
    completeWorkout,
    viewExerciseDetails,
    closeExerciseModal,

    // Loading state
    isLoading,
  } = useFitnessJourney();

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your fitness journey...</p>
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
              <ProgressIndicator
                completed={completedWorkouts}
                total={totalWorkouts}
                label="Workouts Completed"
              />
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
                {goals.map((goal, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {goal.replace('_', ' ')}
                  </Badge>
                ))}
                <Badge variant="outline" className="text-xs">
                  {level}
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="current">Current Workout</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            {currentWorkout ? (
              <div className="space-y-6">
                {/* Use our reusable WorkoutSummary component */}
                <WorkoutSummary
                  workout={currentWorkout}
                  showActions={false}
                />

                {/* Exercise list */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Exercises</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {currentWorkout.exercises.map((exercise, index) => (
                        <ExerciseCard
                          key={index}
                          exercise={exercise}
                          onViewDetails={viewExerciseDetails}
                        />
                      ))}
                    </div>
                    <Button
                      onClick={() => completeWorkout(currentWorkout)}
                      className="w-full mt-6 bg-vintage-deep-blue hover:bg-vintage-forest-green"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  </CardContent>
                </Card>
              </div>
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
                      <p className="text-2xl font-bold text-green-600">{totalMinutes}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800">Streak</h4>
                      <p className="text-2xl font-bold text-purple-600">{streak} days</p>
                    </div>
                  </div>

                  {/* Progress Chart */}
                  <Card className="p-4">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-lg">Workout Progress</CardTitle>
                      <CardDescription>Your fitness activity over time</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      {workoutHistory.length > 0 ? (
                        <ProgressChart
                          data={workoutHistory.slice(0, 10).map(session => ({
                            date: new Date(session.created_at),
                            value: session.duration_minutes || 0
                          }))}
                          height={200}
                          title="Workout Duration (minutes)"
                          lineColor="#4f46e5"
                          backgroundColor="#f5f3ff"
                        />
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          Complete workouts to see your progress chart
                        </p>
                      )}
                    </CardContent>
                  </Card>

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
      <Dialog open={exerciseModalOpen} onOpenChange={closeExerciseModal}>
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

export default FitnessJourneyPage;