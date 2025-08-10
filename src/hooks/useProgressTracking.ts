import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Progress {
    totalWorkouts: number;
    streakDays: number;
    achievements: Achievement[];
    personalBests: Record<string, PersonalBest>;
    completedLessons: Record<string, CompletedLesson>;
    currentLevel: { [discipline: string]: string };
    experiencePoints: { [discipline: string]: number };
}

interface Achievement {
    id: string;
    name: string;
    description: string;
    unlockedAt: string;
    discipline: string;
}

interface PersonalBest {
    value: number;
    date: string;
    exercise: string;
}

interface CompletedLesson {
    lessonId: string;
    completedAt: string;
    score: number;
    timeSpent: number;
}

interface WorkoutData {
    discipline: string;
    exercises: {
        name: string;
        sets: number;
        reps: number;
        weight?: number;
        duration?: number;
        distance?: number;
    }[];
    totalDuration: number;
    caloriesBurned?: number;
}

export const useProgressTracking = (userId: string) => {
    const [progress, setProgress] = useState<Progress>({
        totalWorkouts: 0,
        streakDays: 0,
        achievements: [],
        personalBests: {},
        completedLessons: {},
        currentLevel: {},
        experiencePoints: {}
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [channel, setChannel] = useState<any>(null);

    useEffect(() => {
        fetchUserProgress();
        const newChannel = subscribeToProgressUpdates();
        setChannel(newChannel);

        return () => {
            if (channel) channel.unsubscribe();
        };
    }, [userId]);

    const fetchBasicProgress = async () => {
        const { data, error } = await supabase
            .from('training_sessions')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;

        const workouts = data || [];
        const streakData = calculateStreak(workouts);

        return {
            totalWorkouts: workouts.length,
            streakDays: streakData.currentStreak,
            experiencePoints: updateExperiencePointsExperiencePoints(workouts)
        };
    };

    const calculateStreak = (workouts: any[]) => {
        const dates = workouts.map(w => new Date(w.completed_at).toISOString().split('T')[0]);
        dates.sort();

        let currentStreak = 0;
        let maxStreak = 0;
        let lastDate = new Date();

        for (const date of dates) {
            const diff = Math.abs(
                (new Date(date).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (diff === 1) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else if (diff > 1) {
                currentStreak = 1;
            }

            lastDate = new Date(date);
        }

        return { currentStreak, maxStreak };
    };

    const fetchAchievements = async () => {
        const { data, error } = await supabase
            .from('achievements')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return data || [];
    };

    const fetchCompletedLessons = async () => {
        const { data, error } = await supabase
            .from('training_sessions')
            .select('*')
            .eq('user_id', userId)
            .eq('type', 'lesson');

        if (error) throw error;

        const lessonsMap: Record<string, CompletedLesson> = {};
        (data || []).forEach(lesson => {
            lessonsMap[lesson.lesson_id] = {
                lessonId: lesson.lesson_id,
                completedAt: lesson.completed_at,
                score: lesson.score || 0,
                timeSpent: lesson.time_spent || 0
            };
        });

        return lessonsMap;
    };

    const subscribeToProgressUpdates = () => {
        return supabase
            .channel('progress_updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'training_sessions',
                filter: `user_id=eq.${userId}`
            }, (payload) => {
                fetchUserProgress();
            })
            .subscribe();
    };

    const fetchUserProgress = async () => {
        try {
            setLoading(true);
            const [progressData, achievementsData, lessonsData] = await Promise.all([
                fetchBasicProgress(),
                fetchAchievements(),
                fetchCompletedLessons()
            ]);

            setProgress(prev => ({
                ...prev,
                ...progressData,
                achievements: achievementsData,
                completedLessons: lessonsData
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch progress');
        } finally {
            setLoading(false);
        }
    };

    const updatePersonalBests = async (workoutData: WorkoutData) => {
        const newBests: Record<string, PersonalBest> = { ...progress.personalBests };

        for (const exercise of workoutData.exercises) {
            const key = `${workoutData.discipline}_${exercise.name}`;
            const currentBest = newBests[key];

            if (exercise.weight && (!currentBest || exercise.weight > currentBest.value)) {
                newBests[key] = {
                    value: exercise.weight,
                    date: new Date().toISOString(),
                    exercise: exercise.name
                };
            }
        }

        await supabase
            .from('profiles')
            .update({ personal_bests: newBests })
            .eq('id', userId);

        return newBests;
    };

    const checkAchievements = async (discipline: string) => {
        const { data: newAchievements, error } = await supabase
            .rpc('check_user_achievements', {
                p_user_id: userId,
                p_discipline: discipline
            });

        if (error) throw error;
        return newAchievements;
    };

    const updateExperiencePoints = async (workoutData: WorkoutData) => {
        const baseXP = 100;
        const durationMultiplier = Math.floor(workoutData.totalDuration / 60) * 10;
        const exerciseMultiplier = workoutData.exercises.length * 5;

        const totalXP = baseXP + durationMultiplier + exerciseMultiplier;

        const { error } = await supabase
            .from('profiles')
            .update({
                [`${workoutData.discipline}_xp`]: supabase.sql`${workoutData.discipline}_xp + ${totalXP}`
            })
            .eq('id', userId);

        if (error) throw error;
        return totalXP;
    };

    const trackWorkout = async (workoutData: WorkoutData) => {
        try {
            const { error } = await supabase
                .from('training_sessions')
                .insert({
                    user_id: userId,
                    session_data: workoutData,
                    completed_at: new Date().toISOString(),
                    discipline: workoutData.discipline,
                    type: 'workout'
                });

            if (error) throw error;

            // Update personal bests
            const newBests = await updatePersonalBests(workoutData);

            // Check and award achievements
            const newAchievements = await checkAchievements(workoutData.discipline);

            // Update experience points
            const earnedXP = await updateExperiencePoints(workoutData);

            await fetchUserProgress();

            return {
                personalBests: newBests,
                achievements: newAchievements,
                experiencePoints: earnedXP
            };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to track workout');
            throw err;
        }
    };

    const trackLesson = async (lessonId: string, score: number, timeSpent: number, discipline: string) => {
        try {
            const { error } = await supabase
                .from('training_sessions')
                .insert({
                    user_id: userId,
                    lesson_id: lessonId,
                    completed_at: new Date().toISOString(),
                    score,
                    time_spent: timeSpent,
                    discipline,
                    type: 'lesson'
                });

            if (error) throw error;

            // Award experience points for lesson completion
            const lessonXP = Math.floor(score * 10) + Math.floor(timeSpent / 60) * 5;
            await updateExperiencePoints({
                discipline,
                exercises: [],
                totalDuration: timeSpent,
                caloriesBurned: 0
            });

            await fetchUserProgress();

            return { earnedXP: lessonXP };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to track lesson');
            throw err;
        }
    };

    const getDisciplineProgress = (discipline: string) => {
        const disciplineAchievements = progress.achievements.filter(
            a => a.discipline === discipline
        );

        const disciplineLessons = Object.values(progress.completedLessons).filter(
            l => l.lessonId.startsWith(discipline)
        );

        return {
            level: progress.currentLevel[discipline] || 'Beginner',
            xp: progress.experiencePoints[discipline] || 0,
            achievements: disciplineAchievements,
            completedLessons: disciplineLessons
        };
    };

    return {
        progress,
        loading,
        error,
        trackWorkout,
        trackLesson,
        getDisciplineProgress
    };
};
function updateExperiencePointsExperiencePoints(workouts: { completed: boolean | null; created_at: string; description: string | null; duration_minutes: number | null; id: string; session_date: string; session_type: string; title: string; user_id: string; }[]) {
    const experiencePoints: { [discipline: string]: number } = {};

    workouts.forEach(workout => {
        // Extract discipline from session_type or title if available
        const discipline = workout.session_type.toLowerCase();
        
        // Calculate base XP for each workout
        let xp = 100; // Base XP for completing a workout

        // Add XP based on duration if available
        if (workout.duration_minutes) {
            xp += Math.floor(workout.duration_minutes / 10) * 5;
        }

        // Only count XP for completed workouts
        if (workout.completed) {
            experiencePoints[discipline] = (experiencePoints[discipline] || 0) + xp;
        }
    });

    return experiencePoints;
}
