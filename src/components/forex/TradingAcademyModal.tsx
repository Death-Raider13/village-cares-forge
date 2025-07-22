
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, TrendingUp, BarChart3, Shield, Award, Clock, Target, DollarSign } from 'lucide-react';

interface TradingAcademyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TradingAcademyModal: React.FC<TradingAcademyModalProps> = ({ isOpen, onClose }) => {
  const [completedLessons, setCompletedLessons] = useState(new Set());

  const courses = [
    {
      id: 'beginner',
      title: 'Forex Fundamentals',
      level: 'Beginner',
      duration: '4 weeks',
      icon: BookOpen,
      color: 'bg-green-500',
      description: 'Master the basics of forex trading from currency pairs to market analysis',
      modules: [
        {
          title: 'Introduction to Forex',
          lessons: [
            'What is Forex Trading?',
            'Currency Pairs Explained',
            'Market Sessions and Timing',
            'Forex Terminology'
          ]
        },
        {
          title: 'Basic Analysis',
          lessons: [
            'Reading Forex Charts',
            'Support and Resistance',
            'Trend Identification',
            'Basic Chart Patterns'
          ]
        },
        {
          title: 'Risk Management',
          lessons: [
            'Position Sizing Basics',
            'Stop Loss and Take Profit',
            'Risk-Reward Ratios',
            'Money Management Rules'
          ]
        }
      ]
    },
    {
      id: 'intermediate',
      title: 'Technical Analysis Mastery',
      level: 'Intermediate',
      duration: '6 weeks',
      icon: BarChart3,
      color: 'bg-blue-500',
      description: 'Advanced chart patterns, indicators, and technical analysis strategies',
      modules: [
        {
          title: 'Advanced Chart Patterns',
          lessons: [
            'Head and Shoulders',
            'Double Tops and Bottoms',
            'Triangles and Wedges',
            'Flag and Pennant Patterns'
          ]
        },
        {
          title: 'Technical Indicators',
          lessons: [
            'Moving Averages Strategy',
            'RSI and Stochastic',
            'MACD and Momentum',
            'Fibonacci Analysis'
          ]
        },
        {
          title: 'Multiple Timeframe Analysis',
          lessons: [
            'Top-Down Analysis',
            'Entry and Exit Timing',
            'Confluence Trading',
            'Market Structure'
          ]
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Professional Trading Strategies',
      level: 'Advanced',
      duration: '8 weeks',
      icon: Target,
      color: 'bg-purple-500',
      description: 'Institutional-level strategies and advanced risk management',
      modules: [
        {
          title: 'Advanced Strategies',
          lessons: [
            'Price Action Trading',
            'Smart Money Concepts',
            'Order Flow Analysis',
            'Market Microstructure'
          ]
        },
        {
          title: 'Portfolio Management',
          lessons: [
            'Correlation Analysis',
            'Portfolio Diversification',
            'Drawdown Management',
            'Performance Metrics'
          ]
        },
        {
          title: 'Psychology & Discipline',
          lessons: [
            'Trading Psychology',
            'Emotional Control',
            'Discipline Systems',
            'Performance Review'
          ]
        }
      ]
    }
  ];

  const certifications = [
    {
      title: 'Forex Fundamentals Certificate',
      description: 'Complete beginner course and pass final assessment',
      icon: Award,
      color: 'text-green-600',
      requirements: ['Complete all beginner modules', 'Pass final exam (80%+)', 'Submit trading plan']
    },
    {
      title: 'Technical Analysis Professional',
      description: 'Master technical analysis and chart reading',
      icon: BarChart3,
      color: 'text-blue-600',
      requirements: ['Complete intermediate course', 'Analyze 10 trade setups', 'Live trading demo']
    },
    {
      title: 'Advanced Trading Strategist',
      description: 'Professional-level trading competency',
      icon: Target,
      color: 'text-purple-600',
      requirements: ['Complete advanced course', 'Maintain 3-month trading journal', 'Peer review session']
    }
  ];

  const toggleLesson = (courseId: string, moduleIndex: number, lessonIndex: number) => {
    const lessonKey = `${courseId}-${moduleIndex}-${lessonIndex}`;
    const newCompleted = new Set(completedLessons);
    
    if (newCompleted.has(lessonKey)) {
      newCompleted.delete(lessonKey);
    } else {
      newCompleted.add(lessonKey);
    }
    
    setCompletedLessons(newCompleted);
  };

  const calculateProgress = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;
    
    let totalLessons = 0;
    let completedCount = 0;
    
    course.modules.forEach((module, moduleIndex) => {
      module.lessons.forEach((_, lessonIndex) => {
        totalLessons++;
        const lessonKey = `${courseId}-${moduleIndex}-${lessonIndex}`;
        if (completedLessons.has(lessonKey)) {
          completedCount++;
        }
      });
    });
    
    return totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Trading Academy</DialogTitle>
          <DialogDescription>
            Professional forex education from beginner to advanced institutional strategies
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-full ${course.color}`}>
                        <course.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary">{course.level}</Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {course.duration}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{Math.round(calculateProgress(course.id))}%</span>
                      </div>
                      <Progress value={calculateProgress(course.id)} className="h-2" />
                    </div>

                    {/* Modules */}
                    <div className="space-y-3">
                      {course.modules.map((module, moduleIndex) => (
                        <div key={moduleIndex} className="border rounded-lg p-3">
                          <h4 className="font-semibold mb-2">{module.title}</h4>
                          <div className="space-y-1">
                            {module.lessons.map((lesson, lessonIndex) => {
                              const lessonKey = `${course.id}-${moduleIndex}-${lessonIndex}`;
                              const isCompleted = completedLessons.has(lessonKey);
                              
                              return (
                                <div 
                                  key={lessonIndex}
                                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                                  onClick={() => toggleLesson(course.id, moduleIndex, lessonIndex)}
                                >
                                  <div className={`w-4 h-4 border rounded ${isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                                    {isCompleted && <span className="text-white text-xs">✓</span>}
                                  </div>
                                  <span className={isCompleted ? 'line-through text-gray-500' : ''}>{lesson}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full" variant={calculateProgress(course.id) > 0 ? "default" : "outline"}>
                      {calculateProgress(course.id) > 0 ? 'Continue Course' : 'Start Course'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Professional Certifications</h3>
              <p className="text-muted-foreground">
                Earn industry-recognized certificates to validate your trading expertise
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className={`mx-auto p-3 rounded-full bg-gray-100 w-fit mb-3`}>
                      <cert.icon className={`h-8 w-8 ${cert.color}`} />
                    </div>
                    <CardTitle className="text-lg">{cert.title}</CardTitle>
                    <CardDescription>{cert.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Requirements:</h4>
                      <ul className="space-y-2">
                        {cert.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Trading Library
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Essential Reading</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Technical Analysis of Financial Markets</li>
                      <li>• Trading for a Living by Dr. Alexander Elder</li>
                      <li>• Market Wizards by Jack Schwager</li>
                      <li>• The New Trading for a Living</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Video Tutorials</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Chart Pattern Recognition</li>
                      <li>• Risk Management Masterclass</li>
                      <li>• Live Trading Sessions</li>
                      <li>• Market Analysis Techniques</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Trading Tools & Calculators
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Risk Management Tools</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Position Size Calculator</li>
                      <li>• Risk-Reward Calculator</li>
                      <li>• Pip Value Calculator</li>
                      <li>• Lot Size Calculator</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Analysis Tools</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Economic Calendar</li>
                      <li>• Currency Correlation Matrix</li>
                      <li>• Volatility Calculator</li>
                      <li>• Profit/Loss Calculator</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Community & Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Live Trading Room</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Join daily sessions with professional traders
                      </p>
                      <Button size="sm" variant="outline">Join Room</Button>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">1-on-1 Mentoring</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Personal guidance from experienced mentors
                      </p>
                      <Button size="sm" variant="outline">Book Session</Button>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Community Forum</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Connect with fellow traders worldwide
                      </p>
                      <Button size="sm" variant="outline">Join Discussion</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TradingAcademyModal;
