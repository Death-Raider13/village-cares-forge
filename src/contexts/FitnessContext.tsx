import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { WorkoutPlan, Exercise, UserFitnessData } from '@/types/fitness';
import { getWorkoutByGoalAndLevel } from '@/services/workoutData';

interface FitnessContextType {
  // User fitness data
  userFitnessData: UserFitnessData;
  
  // Actions
  completeWorkout: (workout: WorkoutPlan) => Promise<void>;
  openExerciseDetails: (exercise: Exercise) => void;
  
  // UI state
  selectedExercise: Exercise | null;
  exerciseModalOpen: boolean;
  setExerciseModalOpen: (open: boolean) => void;
  
  // Loading state
  isLoading: boolean;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

interface FitnessProviderProps {
  children: ReactNode;
}

export const FitnessProvider: React.FC<FitnessProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // User fitness data
  const [userFitnessData, setUserFitnessData] = useState<UserFitnessData>({
    goals: [],
    level: 'beginner',
    completedWorkouts: 0,
    totalWorkouts: 12,
    currentWeek: 1,
    currentWorkout: null,
    workoutHistory: [],
  });
  
  // UI state
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserJourney();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchUserJourney = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('session_type', 'fitness')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const workoutHistory = data;
        const completedSessions = data.filter(session => session.completed);
        const completedWorkouts = completedSessions.length;
        
        const latestSession = data[0];
        const description = latestSession.description || '';
        const goals = description.match(/Goals: (.+?)(?:\.|$)/)?.[1]?.split(', ') || [];
        const level = description.match(/Level: (.+?)(?:\.|$)/)?.[1] || 'beginner';
        
        // Get current workout based on primary goal and level
        const primaryGoal = goals[0];
        const currentWorkout = primaryGoal ? getWorkoutByGoalAndLevel(primaryGoal, level) : null;
        
        setUserFitnessData({
          goals,
          level,
          completedWorkouts,
          totalWorkouts: 12, // This could be dynamic based on program
          currentWeek: Math.ceil(completedWorkouts / 3), // Assuming 3 workouts per week
          currentWorkout,
          workoutHistory,
        });
      }
    } catch (error) {
      console.error('Error fetching user journey:', error);
      toast.error('Failed to load your fitness journey');
    } finally {
      setIsLoading(false);
    }
  };

  const completeWorkout = async (workout: WorkoutPlan) => {
    if (!user || !workout) return;

    try {
      const { error } = await supabase
        .from('training_sessions')
        .insert({
          user_id: user.id,
          title: `Completed: ${workout.title}`,
          description: `Finished ${workout.title} - ${workout.duration} minutes`,
          session_type: 'fitness',
          duration_minutes: workout.duration,
          completed: true,
        });

      if (error) throw error;

      setUserFitnessData(prev => ({
        ...prev,
        completedWorkouts: prev.completedWorkouts + 1
      }));
      
      toast.success('Workout completed! Great job!');
      await fetchUserJourney(); // Refresh data
    } catch (error) {
      console.error('Error completing workout:', error);
      toast.error('Failed to record workout completion');
    }
  };

  const openExerciseDetails = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseModalOpen(true);
  };

  const value = {
    userFitnessData,
    completeWorkout,
    openExerciseDetails,
    selectedExercise,
    exerciseModalOpen,
    setExerciseModalOpen,
    isLoading,
  };

  return (
    <FitnessContext.Provider value={value}>
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = (): FitnessContextType => {
  const context = useContext(FitnessContext);
  if (context === undefined) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};