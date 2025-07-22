
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Dumbbell, Apple, Moon, Brain, Zap } from 'lucide-react';

interface FitnessEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FitnessEducationModal: React.FC<FitnessEducationModalProps> = ({ isOpen, onClose }) => {
  const [activeLesson, setActiveLesson] = useState(0);

  const educationModules = [
    {
      title: 'Exercise Fundamentals',
      icon: Dumbbell,
      color: 'bg-blue-500',
      lessons: [
        {
          title: 'Understanding Muscle Groups',
          content: 'Learn about major muscle groups and how they work together for optimal movement and strength.',
          keyPoints: [
            'Primary muscle groups: Chest, Back, Shoulders, Arms, Core, Legs',
            'Compound vs isolation exercises',
            'How muscles recover and grow',
            'The importance of balanced training'
          ]
        },
        {
          title: 'Progressive Overload Principle',
          content: 'The foundation of all fitness progress - gradually increasing training demands.',
          keyPoints: [
            'Increase weight, reps, or sets over time',
            'Track your progress consistently',
            'Allow adequate recovery between sessions',
            'Listen to your body for signs of overtraining'
          ]
        }
      ]
    },
    {
      title: 'Cardiovascular Health',
      icon: Heart,
      color: 'bg-red-500',
      lessons: [
        {
          title: 'Heart Rate Zones',
          content: 'Understanding different intensity levels for optimal cardiovascular training.',
          keyPoints: [
            'Zone 1 (50-60%): Active recovery and fat burning',
            'Zone 2 (60-70%): Aerobic base building',
            'Zone 3 (70-80%): Aerobic threshold training',
            'Zone 4 (80-90%): Anaerobic threshold',
            'Zone 5 (90%+): Neuromuscular power'
          ]
        },
        {
          title: 'Types of Cardio Training',
          content: 'Different approaches to cardiovascular exercise and their benefits.',
          keyPoints: [
            'LISS: Low Intensity Steady State',
            'HIIT: High Intensity Interval Training',
            'Circuit training for combined benefits',
            'Sport-specific cardio activities'
          ]
        }
      ]
    },
    {
      title: 'Nutrition Basics',
      icon: Apple,
      color: 'bg-green-500',
      lessons: [
        {
          title: 'Macronutrients Explained',
          content: 'Understanding proteins, carbohydrates, and fats for optimal performance.',
          keyPoints: [
            'Protein: 0.8-1.2g per kg body weight for general health',
            'Carbohydrates: Primary energy source for workouts',
            'Fats: Essential for hormone production and vitamin absorption',
            'Hydration: 8-10 glasses of water daily, more during exercise'
          ]
        },
        {
          title: 'Pre and Post Workout Nutrition',
          content: 'Fueling your body for optimal performance and recovery.',
          keyPoints: [
            'Pre-workout: Carbs 1-3 hours before exercise',
            'During workout: Hydration is key for sessions >60 minutes',
            'Post-workout: Protein + carbs within 30-60 minutes',
            'Listen to your body\'s hunger and energy cues'
          ]
        }
      ]
    },
    {
      title: 'Recovery & Sleep',
      icon: Moon,
      color: 'bg-purple-500',
      lessons: [
        {
          title: 'The Importance of Sleep',
          content: 'How quality sleep impacts your fitness goals and overall health.',
          keyPoints: [
            'Aim for 7-9 hours of quality sleep nightly',
            'Sleep is when muscle recovery and growth occur',
            'Poor sleep affects hormone balance and metabolism',
            'Create a consistent sleep schedule and bedtime routine'
          ]
        },
        {
          title: 'Active Recovery Strategies',
          content: 'Methods to enhance recovery between intense training sessions.',
          keyPoints: [
            'Light walking or gentle yoga on rest days',
            'Foam rolling and stretching routines',
            'Proper hydration and nutrition',
            'Stress management techniques'
          ]
        }
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Fitness Education Hub</DialogTitle>
          <DialogDescription>
            Master the fundamentals of fitness, nutrition, and recovery for lasting results
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="fundamentals" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {educationModules.map((module, index) => (
              <TabsTrigger key={index} value={module.title.toLowerCase().replace(' ', '_')}>
                <module.icon className="h-4 w-4 mr-2" />
                {module.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {educationModules.map((module, moduleIndex) => (
            <TabsContent 
              key={moduleIndex} 
              value={module.title.toLowerCase().replace(' ', '_')}
              className="space-y-6"
            >
              <div className="text-center">
                <div className={`inline-flex p-3 rounded-full ${module.color} mb-4`}>
                  <module.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">{module.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {module.lessons.map((lesson, lessonIndex) => (
                  <Card key={lessonIndex} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {lesson.title}
                        <Badge variant="secondary">Lesson {lessonIndex + 1}</Badge>
                      </CardTitle>
                      <CardDescription>{lesson.content}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Key Learning Points:</h4>
                        <ul className="space-y-2">
                          {lesson.keyPoints.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-start gap-2 text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Tips Section */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    Quick Tips for {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {module.title === 'Exercise Fundamentals' && (
                      <>
                        <div>• Start with basic movements before progressing</div>
                        <div>• Focus on proper form over heavy weight</div>
                        <div>• Include both pushing and pulling exercises</div>
                        <div>• Don't neglect your core and stabilizer muscles</div>
                      </>
                    )}
                    {module.title === 'Cardiovascular Health' && (
                      <>
                        <div>• Mix different types of cardio for variety</div>
                        <div>• Monitor your heart rate during exercise</div>
                        <div>• Build endurance gradually over time</div>
                        <div>• Make cardio enjoyable with music or podcasts</div>
                      </>
                    )}
                    {module.title === 'Nutrition Basics' && (
                      <>
                        <div>• Eat whole foods whenever possible</div>
                        <div>• Plan and prep meals in advance</div>
                        <div>• Don't skip meals, especially breakfast</div>
                        <div>• Stay hydrated throughout the day</div>
                      </>
                    )}
                    {module.title === 'Recovery & Sleep' && (
                      <>
                        <div>• Establish a consistent sleep schedule</div>
                        <div>• Create a relaxing bedtime routine</div>
                        <div>• Take rest days seriously</div>
                        <div>• Listen to your body's recovery signals</div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FitnessEducationModal;
