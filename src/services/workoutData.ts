import { WorkoutPlan, Exercise } from '@/types/fitness';

/**
 * Sample workout data
 */
const workouts: WorkoutPlan[] = [
  // Strength workouts
  {
    id: 'strength-beginner',
    title: 'Beginner Strength Foundations',
    description: 'Build foundational strength with basic compound movements',
    exercises: [
      {
        name: 'Bodyweight Squat',
        sets: 3,
        reps: '12-15',
        description: 'A fundamental lower body exercise',
        instructions: 'Stand with feet shoulder-width apart. Lower your body as if sitting in a chair, keeping your chest up and knees behind toes. Return to standing.',
        tips: ['Keep your weight in your heels', 'Maintain a neutral spine', 'Drive through your heels to stand']
      },
      {
        name: 'Push-Up (Modified if needed)',
        sets: 3,
        reps: '8-12',
        description: 'Upper body pushing movement',
        instructions: 'Start in a plank position with hands slightly wider than shoulders. Lower your chest to the floor while keeping your body in a straight line. Push back up to the starting position.',
        tips: ['Keep your core engaged', 'Don\'t let your hips sag', 'Modify on knees if needed']
      },
      {
        name: 'Dumbbell Row',
        sets: 3,
        reps: '10-12 each side',
        description: 'Upper body pulling movement',
        instructions: 'With a dumbbell in one hand, hinge forward with a flat back. Pull the weight toward your hip while keeping your elbow close to your body.',
        tips: ['Keep your back flat', 'Squeeze your shoulder blade at the top', 'Control the weight on the way down']
      }
    ],
    duration: 45,
    difficulty: 'beginner',
    focus: ['Strength', 'Form', 'Foundation'],
    equipment: ['Dumbbells', 'Bench']
  },
  {
    id: 'strength-intermediate',
    title: 'Intermediate Strength Builder',
    description: 'Progress your strength with more challenging variations',
    exercises: [
      {
        name: 'Goblet Squat',
        sets: 4,
        reps: '10-12',
        description: 'Weighted squat variation',
        instructions: 'Hold a dumbbell or kettlebell close to your chest. Perform a squat while keeping the weight close to your body.',
        tips: ['Keep your chest up', 'Sit back into the squat', 'Drive through heels to stand']
      },
      {
        name: 'Dumbbell Bench Press',
        sets: 4,
        reps: '8-10',
        description: 'Horizontal pressing movement',
        instructions: 'Lie on a bench with dumbbells in each hand at chest level. Press the weights up until arms are extended, then lower back to start.',
        tips: ['Keep wrists straight', 'Don\'t arch your back excessively', 'Control the weights throughout']
      },
      {
        name: 'Bent-Over Row',
        sets: 4,
        reps: '10-12',
        description: 'Compound back exercise',
        instructions: 'Hinge at the hips with dumbbells in hand. Pull the weights toward your ribcage while keeping your back flat.',
        tips: ['Keep your core engaged', 'Don\'t round your back', 'Squeeze your shoulder blades together']
      }
    ],
    duration: 60,
    difficulty: 'intermediate',
    focus: ['Strength', 'Hypertrophy', 'Power'],
    equipment: ['Dumbbells', 'Bench', 'Kettlebell']
  },
  {
    id: 'strength-advanced',
    title: 'Advanced Strength Protocol',
    description: 'Maximize strength gains with complex movements and higher intensity',
    exercises: [
      {
        name: 'Barbell Back Squat',
        sets: 5,
        reps: '5-8',
        description: 'Fundamental barbell strength exercise',
        instructions: 'Place a barbell across your upper back. Squat down until thighs are parallel to the floor, then drive back up.',
        tips: ['Maintain a braced core', 'Keep a neutral spine', 'Drive knees out as you descend']
      },
      {
        name: 'Weighted Pull-Up',
        sets: 4,
        reps: '6-8',
        description: 'Advanced upper body pulling',
        instructions: 'Attach weight to a belt or hold between feet. Perform pull-ups with full range of motion.',
        tips: ['Initiate with shoulder blades', 'Pull chin over the bar', 'Lower with control']
      },
      {
        name: 'Barbell Bench Press',
        sets: 5,
        reps: '5-8',
        description: 'Classic strength building exercise',
        instructions: 'Lie on a bench with feet planted. Grip the barbell and lower to chest, then press back up to full extension.',
        tips: ['Keep wrists stacked over elbows', 'Drive feet into the floor', 'Maintain shoulder blade retraction']
      }
    ],
    duration: 75,
    difficulty: 'advanced',
    focus: ['Strength', 'Power', 'Muscle Mass'],
    equipment: ['Barbell', 'Rack', 'Bench', 'Weight Belt']
  },

  // Cardio workouts
  {
    id: 'cardio-beginner',
    title: 'Beginner Cardio Foundations',
    description: 'Build cardiovascular endurance with low-impact exercises',
    exercises: [
      {
        name: 'Brisk Walking',
        sets: 1,
        reps: '20 minutes',
        duration: 20,
        description: 'Low-impact cardiovascular exercise',
        instructions: 'Walk at a pace that elevates your heart rate but still allows you to hold a conversation.',
        tips: ['Maintain good posture', 'Swing arms naturally', 'Take full strides']
      },
      {
        name: 'Step-Ups',
        sets: 3,
        reps: '10 each leg',
        description: 'Lower body exercise that elevates heart rate',
        instructions: 'Using a sturdy bench or step, place one foot on the surface and step up. Alternate legs.',
        tips: ['Start with a lower step height', 'Maintain an upright posture', 'Control the movement']
      },
      {
        name: 'Stationary Bike',
        sets: 1,
        reps: '10 minutes',
        duration: 10,
        description: 'Low-impact cardio machine',
        instructions: 'Adjust the seat height so your knee is slightly bent at the bottom of the pedal stroke. Pedal at a moderate resistance.',
        tips: ['Maintain good posture', 'Don\'t grip the handlebars too tightly', 'Focus on smooth pedaling']
      }
    ],
    duration: 40,
    difficulty: 'beginner',
    focus: ['Endurance', 'Cardiovascular Health', 'Mobility'],
    equipment: ['Step Platform', 'Stationary Bike']
  },
  {
    id: 'cardio-intermediate',
    title: 'Intermediate Cardio Circuit',
    description: 'Elevate your cardiovascular fitness with interval training',
    exercises: [
      {
        name: 'Jogging Intervals',
        sets: 5,
        reps: '3 min jog, 2 min walk',
        duration: 25,
        description: 'Alternating between jogging and walking',
        instructions: 'Jog at a moderate pace for 3 minutes, then walk for 2 minutes to recover. Repeat.',
        tips: ['Focus on breathing rhythm', 'Land midfoot, not heel', 'Maintain good posture']
      },
      {
        name: 'Jumping Jacks',
        sets: 3,
        reps: '30 seconds',
        description: 'Full body cardio movement',
        instructions: 'Start with feet together and arms at sides. Jump to a position with legs apart and arms overhead, then return to start.',
        tips: ['Land softly', 'Keep a rhythm', 'Modify by stepping if needed']
      },
      {
        name: 'Mountain Climbers',
        sets: 3,
        reps: '30 seconds',
        description: 'Dynamic core and cardio exercise',
        instructions: 'Start in a push-up position. Alternately bring knees toward chest in a running motion.',
        tips: ['Keep hips level', 'Maintain a strong plank position', 'Control your breathing']
      }
    ],
    duration: 45,
    difficulty: 'intermediate',
    focus: ['Endurance', 'Stamina', 'Cardiovascular Health'],
    equipment: ['None']
  },
  {
    id: 'cardio-advanced',
    title: 'Advanced HIIT Protocol',
    description: 'Maximize cardiovascular capacity with high-intensity interval training',
    exercises: [
      {
        name: 'Sprints',
        sets: 8,
        reps: '30 sec sprint, 90 sec rest',
        duration: 20,
        description: 'Maximum effort running intervals',
        instructions: 'Sprint at 90-100% effort for 30 seconds, then walk or jog slowly for 90 seconds to recover.',
        tips: ['Drive with arms and knees', 'Maintain proper running form', 'Focus on full recovery between sprints']
      },
      {
        name: 'Burpees',
        sets: 4,
        reps: '15',
        description: 'Full body high-intensity movement',
        instructions: 'Start standing, drop to a squat position, kick feet back to a plank, perform a push-up, jump feet back to squat, then explode up into a jump.',
        tips: ['Focus on form over speed', 'Scale by removing the push-up if needed', 'Land softly from the jump']
      },
      {
        name: 'Box Jumps',
        sets: 4,
        reps: '12',
        description: 'Explosive lower body exercise',
        instructions: 'Stand in front of a sturdy box. Hinge at hips slightly and jump onto the box, landing softly. Step back down and repeat.',
        tips: ['Land softly with knees bent', 'Use arms for momentum', 'Start with a lower box height if needed']
      }
    ],
    duration: 60,
    difficulty: 'advanced',
    focus: ['Endurance', 'Speed', 'Power', 'Recovery'],
    equipment: ['Box', 'Timer']
  },

  // Flexibility workouts
  {
    id: 'flexibility-beginner',
    title: 'Beginner Flexibility Foundations',
    description: 'Improve range of motion with basic stretching routines',
    exercises: [
      {
        name: 'Standing Hamstring Stretch',
        sets: 2,
        reps: '30 seconds each leg',
        description: 'Stretches the back of the legs',
        instructions: 'Place one foot on an elevated surface with leg straight. Hinge at hips while keeping back flat until you feel a stretch.',
        tips: ['Don\'t round your back', 'Keep the stretching leg straight', 'Breathe deeply']
      },
      {
        name: 'Chest Opener',
        sets: 2,
        reps: '30 seconds',
        description: 'Stretches chest and anterior shoulders',
        instructions: 'Clasp hands behind back and gently lift arms while squeezing shoulder blades together.',
        tips: ['Keep chin level', 'Stand tall', 'Don\'t force the movement']
      },
      {
        name: 'Cat-Cow Stretch',
        sets: 1,
        reps: '10 repetitions',
        description: 'Mobilizes the spine',
        instructions: 'Start on hands and knees. Alternate between arching back (cow) and rounding back (cat).',
        tips: ['Move with your breath', 'Keep wrists under shoulders', 'Keep knees under hips']
      }
    ],
    duration: 30,
    difficulty: 'beginner',
    focus: ['Flexibility', 'Mobility', 'Recovery'],
    equipment: ['Yoga Mat', 'Foam Roller']
  }
];

/**
 * Returns a workout plan based on the user's primary goal and fitness level
 * 
 * @param goal The primary fitness goal (e.g., 'strength', 'cardio', 'flexibility')
 * @param level The user's fitness level (e.g., 'beginner', 'intermediate', 'advanced')
 * @returns A workout plan matching the goal and level, or null if none found
 */
export const getWorkoutByGoalAndLevel = (goal: string, level: string): WorkoutPlan | null => {
  // Normalize inputs to handle case variations
  const normalizedGoal = goal.toLowerCase().trim();
  const normalizedLevel = level.toLowerCase().trim();

  // Find a workout that matches both goal and level
  const workout = workouts.find(w => {
    const workoutId = w.id.toLowerCase();
    return workoutId.includes(normalizedGoal) && workoutId.includes(normalizedLevel);
  });

  return workout || null;
};

/**
 * Calculates the progress percentage based on completed and total workouts
 * 
 * @param completed Number of completed workouts
 * @param total Total number of workouts in the program
 * @returns Progress percentage (0-100)
 */
export const calculateProgressPercentage = (completed: number, total: number): number => {
  if (total <= 0) return 0;
  const percentage = (completed / total) * 100;
  return Math.min(Math.max(percentage, 0), 100); // Ensure value is between 0-100
};

/**
 * Returns a color based on the difficulty level
 * 
 * @param difficulty The difficulty level ('beginner', 'intermediate', 'advanced')
 * @returns A color string (hex, rgb, or named color)
 */
export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return '#4ade80'; // green
    case 'intermediate':
      return '#facc15'; // yellow
    case 'advanced':
      return '#f87171'; // red
    default:
      return '#a3a3a3'; // gray (default)
  }
};

/**
 * Returns a list of sample workout plans
 * 
 * @returns Array of workout plans
 */
export const getSampleWorkouts = (): WorkoutPlan[] => {
  return [...workouts];
};

/**
 * Generates a workout plan based on user preferences
 * 
 * @param goals User's fitness goals
 * @param level User's fitness level
 * @param duration Preferred workout duration in minutes
 * @returns A customized workout plan
 */
export const generateCustomWorkout = (
  goals: string[],
  level: string,
  duration: number
): WorkoutPlan | null => {
  // If we have a primary goal, try to find a matching workout
  if (goals.length > 0) {
    const primaryGoal = goals[0];
    const workout = getWorkoutByGoalAndLevel(primaryGoal, level);

    if (workout) {
      // If the workout duration is significantly different from preferred duration,
      // we could adjust the number of exercises or sets here
      return workout;
    }
  }

  // Fallback to a default workout based on level
  const fallbackWorkouts = workouts.filter(w => w.id.includes(level.toLowerCase()));
  return fallbackWorkouts.length > 0 ? fallbackWorkouts[0] : null;
};