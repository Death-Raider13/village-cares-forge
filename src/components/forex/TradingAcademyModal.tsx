import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, BarChart3, Shield, Award, Clock, Target, DollarSign, Download, ExternalLink } from 'lucide-react';
import TradingCourse from './TradingCourse';

interface TradingAcademyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TradingAcademyModal: React.FC<TradingAcademyModalProps> = ({ isOpen, onClose }) => {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set<string>());
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

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
            { title: 'What is Forex Trading?', duration: '15 min', completed: false, content: '' },
            { title: 'Currency Pairs Explained', duration: '20 min', completed: false, content: '' },
            { title: 'Market Sessions and Timing', duration: '18 min', completed: false, content: '' },
            { title: 'Forex Terminology', duration: '12 min', completed: false, content: '' }
          ]
        },
        {
          title: 'Basic Analysis',
          lessons: [
            { title: 'Reading Forex Charts', duration: '25 min', completed: false, content: '' },
            { title: 'Support and Resistance', duration: '20 min', completed: false, content: '' },
            { title: 'Trend Identification', duration: '18 min', completed: false, content: '' },
            { title: 'Basic Chart Patterns', duration: '22 min', completed: false, content: '' }
          ]
        },
        {
          title: 'Risk Management',
          lessons: [
            { title: 'Position Sizing Basics', duration: '20 min', completed: false, content: '' },
            { title: 'Stop Loss and Take Profit', duration: '18 min', completed: false, content: '' },
            { title: 'Risk-Reward Ratios', duration: '15 min', completed: false, content: '' },
            { title: 'Money Management Rules', duration: '25 min', completed: false, content: '' }
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
      description: 'Advanced chart reading and technical indicators for professional trading',
      modules: [
        {
          title: 'Advanced Chart Patterns',
          lessons: [
            { title: 'Head and Shoulders Pattern', duration: '25 min', completed: false, content: '' },
            { title: 'Double Top/Bottom Patterns', duration: '20 min', completed: false, content: '' },
            { title: 'Triangle Patterns', duration: '22 min', completed: false, content: '' },
            { title: 'Flag and Pennant Patterns', duration: '18 min', completed: false, content: '' }
          ]
        },
        {
          title: 'Technical Indicators',
          lessons: [
            { title: 'Moving Averages Deep Dive', duration: '30 min', completed: false, content: '' },
            { title: 'RSI and Stochastic Oscillators', duration: '25 min', completed: false, content: '' },
            { title: 'MACD and Signal Lines', duration: '28 min', completed: false, content: '' },
            { title: 'Bollinger Bands Strategy', duration: '22 min', completed: false, content: '' }
          ]
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Institutional Trading Strategies',
      level: 'Advanced',
      duration: '8 weeks',
      icon: Target,
      color: 'bg-purple-500',
      description: 'Professional-level strategies used by banks and hedge funds',
      modules: [
        {
          title: 'Market Structure',
          lessons: [
            { title: 'Order Flow Analysis', duration: '35 min', completed: false, content: '' },
            { title: 'Supply and Demand Zones', duration: '30 min', completed: false, content: '' },
            { title: 'Smart Money Concepts', duration: '40 min', completed: false, content: '' },
            { title: 'Liquidity Pool Trading', duration: '45 min', completed: false, content: '' }
          ]
        }
      ]
    }
  ];

  const tools = [
    { name: 'Position Size Calculator', description: 'Calculate optimal position sizes based on risk', available: true, url: '/tools/position-calculator' },
    { name: 'Risk-Reward Calculator', description: 'Analyze potential trades before execution', available: true, url: '/tools/risk-reward' },
    { name: 'Pip Value Calculator', description: 'Calculate pip values for any currency pair', available: true, url: '/tools/pip-calculator' },
    { name: 'Economic Calendar', description: 'Track important economic events and releases', available: true, url: '/tools/economic-calendar' },
    { name: 'Currency Correlation Matrix', description: 'Understand relationships between currency pairs', available: true, url: '/tools/correlation-matrix' },
    { name: 'Volatility Calculator', description: 'Measure market volatility for better timing', available: true, url: '/tools/volatility-calculator' },
    { name: 'Fibonacci Calculator', description: 'Calculate key Fibonacci retracement levels', available: true, url: '/tools/fibonacci' },
    { name: 'Support/Resistance Finder', description: 'Identify key price levels automatically', available: true, url: '/tools/support-resistance' }
  ];

  const resources = [
    { 
      name: 'Complete Trading Plan Template', 
      type: 'PDF', 
      size: '2.1 MB',
      description: 'A comprehensive template to create your personal trading plan',
      category: 'Planning'
    },
    { 
      name: 'Risk Management Checklist', 
      type: 'PDF', 
      size: '0.8 MB',
      description: 'Daily checklist to ensure proper risk management',
      category: 'Risk Management'
    },
    { 
      name: 'Chart Pattern Recognition Guide', 
      type: 'PDF', 
      size: '3.2 MB',
      description: 'Visual guide to identifying profitable chart patterns',
      category: 'Technical Analysis'
    },
    { 
      name: 'Economic Indicators Handbook', 
      type: 'PDF', 
      size: '1.8 MB',
      description: 'Understanding how economic news affects currency markets',
      category: 'Fundamental Analysis'
    },
    { 
      name: 'Trading Psychology Workbook', 
      type: 'PDF', 
      size: '1.5 MB',
      description: 'Exercises to develop mental discipline and emotional control',
      category: 'Psychology'
    },
    { 
      name: 'MetaTrader 4/5 Setup Guide', 
      type: 'PDF', 
      size: '2.8 MB',
      description: 'Complete guide to setting up and customizing MT4/MT5',
      category: 'Platforms'
    }
  ];

  const certifications = [
    {
      title: 'Forex Fundamentals Certificate',
      description: 'Demonstrates mastery of basic forex trading concepts and risk management',
      icon: Award,
      color: 'text-green-600',
      requirements: [
        'Complete all Forex Fundamentals modules',
        'Pass final examination with 85% or higher',
        'Submit a detailed trading plan',
        'Complete 10 demo trades with documented analysis'
      ],
      available: true,
      estimatedTime: '40 hours'
    },
    {
      title: 'Technical Analysis Professional',
      description: 'Advanced certification in chart reading and technical indicator analysis',
      icon: BarChart3,
      color: 'text-blue-600',
      requirements: [
        'Complete Technical Analysis Mastery course',
        'Analyze and present 25 different chart setups',
        'Pass advanced technical analysis exam (90%+)',
        'Conduct live trading demonstration'
      ],
      available: true,
      estimatedTime: '80 hours'
    },
    {
      title: 'Advanced Trading Strategist',
      description: 'Expert-level certification in institutional trading strategies',
      icon: Target,
      color: 'text-purple-600',
      requirements: [
        'Complete Institutional Trading Strategies course',
        'Maintain profitable trading journal for 6 months',
        'Present advanced trading strategy to panel',
        'Mentor junior traders for 3 months'
      ],
      available: true,
      estimatedTime: '200 hours'
    },
    {
      title: 'Certified Forex Educator',
      description: 'Qualification to teach forex trading concepts to others',
      icon: BookOpen,
      color: 'text-orange-600',
      requirements: [
        'Hold all previous certifications',
        'Complete educator training program',
        'Demonstrate teaching abilities',
        'Pass comprehensive final assessment'
      ],
      available: false,
      estimatedTime: '120 hours'
    }
  ];

  const handleLessonComplete = (courseId: string, moduleIndex: number, lessonIndex: number) => {
    const lessonKey = `${courseId}-${moduleIndex}-${lessonIndex}`;
    const newCompleted = new Set(completedLessons);
    
    if (!newCompleted.has(lessonKey)) {
      newCompleted.add(lessonKey);
      setCompletedLessons(newCompleted);
    }
  };

  const downloadResource = (resourceName: string) => {
    // Simulate download with more realistic behavior
    console.log(`Downloading ${resourceName}...`);
    // In a real app, this would trigger an actual file download
    const link = document.createElement('a');
    link.href = '#';
    link.download = resourceName.toLowerCase().replace(/\s+/g, '-') + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openTool = (toolName: string, url?: string) => {
    console.log(`Opening ${toolName}...`);
    if (url) {
      // In a real app, this would navigate to the tool page
      window.open(url, '_blank');
    }
  };

  const startCertification = (certTitle: string) => {
    console.log(`Starting certification: ${certTitle}`);
    // In a real app, this would begin the certification process
  };

  if (selectedCourse) {
    const course = courses.find(c => c.id === selectedCourse);
    if (course) {
      return (
        <Dialog open={isOpen} onOpenChange={() => {
          setSelectedCourse(null);
          onClose();
        }}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold">{course.title}</DialogTitle>
                  <DialogDescription>{course.description}</DialogDescription>
                </div>
                <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                  Back to Academy
                </Button>
              </div>
            </DialogHeader>
            <TradingCourse 
              course={course} 
              onLessonComplete={handleLessonComplete}
              completedLessons={completedLessons}
            />
          </DialogContent>
        </Dialog>
      );
    }
  }

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="tools">Trading Tools</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedCourse(course.id)}>
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
                  <CardContent>
                    <Button className="w-full">Start Course</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tools.map((tool, index) => (
                <Card key={index} className={`hover:shadow-lg transition-shadow ${tool.available ? 'cursor-pointer' : 'opacity-50'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{tool.name}</span>
                      {!tool.available && <Badge variant="outline">Coming Soon</Badge>}
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => tool.available && openTool(tool.name, tool.url)}
                      disabled={!tool.available}
                    >
                      {tool.available ? (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Tool
                        </>
                      ) : (
                        'Coming Soon'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{resource.name}</span>
                      <div className="flex gap-2">
                        <Badge variant="outline">{resource.category}</Badge>
                        <Badge variant="secondary">{resource.type}</Badge>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {resource.description}
                      <br />
                      <span className="text-xs text-muted-foreground">Size: {resource.size}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" onClick={() => downloadResource(resource.name)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <Card key={index} className={`hover:shadow-lg transition-shadow ${!cert.available ? 'opacity-50' : ''}`}>
                  <CardHeader className="text-center">
                    <div className={`mx-auto p-3 rounded-full bg-gray-100 w-fit mb-3`}>
                      <cert.icon className={`h-8 w-8 ${cert.color}`} />
                    </div>
                    <CardTitle className="text-lg">{cert.title}</CardTitle>
                    <CardDescription>{cert.description}</CardDescription>
                    {cert.estimatedTime && (
                      <Badge variant="outline" className="mx-auto w-fit">
                        <Clock className="h-3 w-3 mr-1" />
                        {cert.estimatedTime}
                      </Badge>
                    )}
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
                      <Button 
                        className="w-full" 
                        disabled={!cert.available}
                        onClick={() => cert.available && startCertification(cert.title)}
                      >
                        {cert.available ? 'Start Certification' : 'Coming Soon'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TradingAcademyModal;
