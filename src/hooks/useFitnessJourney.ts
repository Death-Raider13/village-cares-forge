import { useState, useCallback, useMemo } from 'react';
import { useFitness } from '@/contexts/FitnessContext';
import { WorkoutPlan, Exercise } from '@/types/fitness';
import { calculateProgressPercentage } from '@/services/workoutData';

/**
 * Custom hook for managing fitness journey data and actions
 */
export const useFitnessJourney = () => {
  const {
    userFitnessData,
    completeWorkout,
    openExerciseDetails,
    selectedExercise,
    exerciseModalOpen,
    setExerciseModalOpen,
    isLoading,
  } = useFitness();

  const [activeTab, setActiveTab] = useState('current');

  // Memoized values
  const progressPercentage = useMemo(() => {
    return calculateProgressPercentage(
      userFitnessData.completedWorkouts,
      userFitnessData.totalWorkouts
    );
  }, [userFitnessData.completedWorkouts, userFitnessData.totalWorkouts]);

  const totalMinutes = useMemo(() => {
    return userFitnessData.workoutHistory.reduce(
      (total, session) => total + (session.duration_minutes || 0),
      0
    );
  }, [userFitnessData.workoutHistory]);

  const streak = useMemo(() => {
    return Math.min(userFitnessData.completedWorkouts, 7);
  }, [userFitnessData.completedWorkouts]);

  // Callbacks
  const handleCompleteWorkout = useCallback(async () => {
    if (userFitnessData.currentWorkout) {
      await completeWorkout(userFitnessData.currentWorkout);
    }
  }, [completeWorkout, userFitnessData.currentWorkout]);

  const handleViewExerciseDetails = useCallback((exercise: Exercise) => {
    openExerciseDetails(exercise);
  }, [openExerciseDetails]);

  const closeExerciseModal = useCallback(() => {
    setExerciseModalOpen(false);
  }, [setExerciseModalOpen]);

  return {
    // Data
    goals: userFitnessData.goals,
    level: userFitnessData.level,
    completedWorkouts: userFitnessData.completedWorkouts,
    totalWorkouts: userFitnessData.totalWorkouts,
    currentWorkout: userFitnessData.currentWorkout,
    workoutHistory: userFitnessData.workoutHistory,
    
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
    completeWorkout: handleCompleteWorkout,
    viewExerciseDetails: handleViewExerciseDetails,
    closeExerciseModal,
    
    // Loading state
    isLoading,
  };
};