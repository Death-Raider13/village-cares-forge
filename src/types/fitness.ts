import React from 'react';

/**
 * Fitness types and interfaces
 */

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration?: number;
  description: string;
  instructions: string;
  tips: string[];
}

export interface FitnessProgram {
  id: string;
  name: string;
  level: string;
  program_type: string;
  duration_weeks: number;
  description: string;
  created_at: string;
}

export interface UserFitnessData {
  goals: string[];
  level: string;
  completedWorkouts: number;
  totalWorkouts: number;
  currentWeek: number;
  currentWorkout: WorkoutPlan | null;
  workoutHistory: any[]; // Consider creating a more specific type for this
}

export interface FitnessJourneyFormData {
  fitness_level: string;
  goals: string[];
  workout_frequency: string;
  preferred_duration: string;
  available_equipment: string[];
  health_conditions: string;
}

export interface EducationModule {
  title: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  lessons: EducationLesson[];
}

export interface EducationLesson {
  title: string;
  content: string;
  keyPoints: string[];
}