
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Lock, Play, Clock, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  level: string;
  duration: string;
  modules: Module[];
  description: string;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  title: string;
  duration: string;
  completed: boolean;
  content: string;
}

interface TradingCourseProps {
  course: Course;
  onLessonComplete: (courseId: string, moduleIndex: number, lessonIndex: number) => void;
  completedLessons: Set<string>;
}

const TradingCourse: React.FC<TradingCourseProps> = ({ course, onLessonComplete, completedLessons }) => {
  const [selectedLesson, setSelectedLesson] = useState<{ moduleIndex: number; lessonIndex: number } | null>(null);

  const getLessonContent = (lesson: Lesson) => {
    // Sample lesson content based on lesson title
    const contents: Record<string, string> = {
      'What is Forex Trading?': `
        Forex (Foreign Exchange) is the global marketplace for trading currencies. It's the largest financial market in the world, with over $6 trillion traded daily.

        Key Points:
        • Currencies are traded in pairs (EUR/USD, GBP/JPY, etc.)
        • Market operates 24/5 across different time zones
        • Traders profit from currency value fluctuations
        • High liquidity makes it accessible to retail traders

        The forex market consists of major participants including central banks, commercial banks, corporations, and individual traders like yourself.
      `,
      'Currency Pairs Explained': `
        Currency pairs are the foundation of forex trading. Every trade involves buying one currency and selling another.

        Major Pairs (most liquid):
        • EUR/USD - Euro vs US Dollar
        • GBP/USD - British Pound vs US Dollar  
        • USD/JPY - US Dollar vs Japanese Yen
        • USD/CHF - US Dollar vs Swiss Franc

        Minor Pairs: Major currencies without USD
        Exotic Pairs: One major currency + emerging market currency

        Understanding pip values and how currency strength affects pairs is crucial for successful trading.
      `,
      'Reading Forex Charts': `
        Chart analysis is essential for forex trading. Learn to read:

        Candlestick Patterns:
        • Each candle shows open, high, low, close prices
        • Green/white candles = bullish (price up)
        • Red/black candles = bearish (price down)

        Timeframes:
        • M1, M5, M15 - Short-term scalping
        • H1, H4 - Intraday trading
        • D1, W1 - Long-term analysis

        Practice identifying trends, support/resistance levels, and key reversal patterns on different timeframes.
      `,
      'Position Sizing Basics': `
        Proper position sizing is crucial for risk management and long-term success.

        Key Concepts:
        • Never risk more than 1-2% per trade
        • Calculate position size based on stop loss distance
        • Account for currency conversion if needed
        • Use lot sizes appropriate for your account

        Formula: Position Size = (Account Risk ÷ Stop Loss in Pips) ÷ Pip Value

        Always determine your exit strategy before entering a trade!
      `
    };

    return contents[lesson.title] || `Content for "${lesson.title}" - This lesson covers important concepts in forex trading. Practice the techniques discussed and apply them to your trading strategy.`;
  };

  const calculateProgress = () => {
    let totalLessons = 0;
    let completedCount = 0;
    
    course.modules.forEach((module, moduleIndex) => {
      module.lessons.forEach((_, lessonIndex) => {
        totalLessons++;
        const lessonKey = `${course.id}-${moduleIndex}-${lessonIndex}`;
        if (completedLessons.has(lessonKey)) {
          completedCount++;
        }
      });
    });
    
    return totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
  };

  const isLessonUnlocked = (moduleIndex: number, lessonIndex: number) => {
    // First lesson is always unlocked
    if (moduleIndex === 0 && lessonIndex === 0) return true;
    
    // Check if previous lesson is completed
    let prevModuleIndex = moduleIndex;
    let prevLessonIndex = lessonIndex - 1;
    
    if (prevLessonIndex < 0 && moduleIndex > 0) {
      prevModuleIndex = moduleIndex - 1;
      prevLessonIndex = course.modules[prevModuleIndex].lessons.length - 1;
    }
    
    if (prevLessonIndex < 0) return false;
    
    const prevLessonKey = `${course.id}-${prevModuleIndex}-${prevLessonIndex}`;
    return completedLessons.has(prevLessonKey);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Course Structure */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <CardDescription>{course.description}</CardDescription>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{course.level}</Badge>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {course.duration}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{Math.round(calculateProgress())}%</span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </div>

              <div className="space-y-3">
                {course.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex}>
                    <h4 className="font-semibold text-sm mb-2">{module.title}</h4>
                    <div className="space-y-1 ml-4">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const lessonKey = `${course.id}-${moduleIndex}-${lessonIndex}`;
                        const isCompleted = completedLessons.has(lessonKey);
                        const isUnlocked = isLessonUnlocked(moduleIndex, lessonIndex);
                        const isSelected = selectedLesson?.moduleIndex === moduleIndex && selectedLesson?.lessonIndex === lessonIndex;
                        
                        return (
                          <div 
                            key={lessonIndex}
                            className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded transition-colors ${
                              isSelected ? 'bg-blue-100' : 'hover:bg-gray-50'
                            } ${!isUnlocked ? 'opacity-50' : ''}`}
                            onClick={() => isUnlocked && setSelectedLesson({ moduleIndex, lessonIndex })}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : isUnlocked ? (
                              <Play className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Lock className="h-4 w-4 text-gray-400" />
                            )}
                            <span className={isCompleted ? 'line-through text-gray-500' : ''}>{lesson.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lesson Content */}
      <div className="lg:col-span-2">
        {selectedLesson ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {course.modules[selectedLesson.moduleIndex].lessons[selectedLesson.lessonIndex].title}
              </CardTitle>
              <CardDescription>
                Module {selectedLesson.moduleIndex + 1}: {course.modules[selectedLesson.moduleIndex].title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line">
                    {getLessonContent(course.modules[selectedLesson.moduleIndex].lessons[selectedLesson.lessonIndex])}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <Badge variant="outline">
                    {course.modules[selectedLesson.moduleIndex].lessons[selectedLesson.lessonIndex].duration || '15 min'}
                  </Badge>
                  <Button 
                    onClick={() => onLessonComplete(course.id, selectedLesson.moduleIndex, selectedLesson.lessonIndex)}
                    disabled={completedLessons.has(`${course.id}-${selectedLesson.moduleIndex}-${selectedLesson.lessonIndex}`)}
                  >
                    {completedLessons.has(`${course.id}-${selectedLesson.moduleIndex}-${selectedLesson.lessonIndex}`) 
                      ? 'Completed' 
                      : 'Mark Complete'
                    }
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a Lesson</h3>
              <p className="text-muted-foreground">Choose a lesson from the course structure to begin learning</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TradingCourse;
