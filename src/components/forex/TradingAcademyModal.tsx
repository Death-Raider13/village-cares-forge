
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
  const [completedLessons, setCompletedLessons] = useState(new Set());
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
    }
  ];

  const tools = [
    { name: 'Position Size Calculator', description: 'Calculate optimal position sizes', available: true },
    { name: 'Risk-Reward Calculator', description: 'Analyze potential trades', available: true },
    { name: 'Pip Value Calculator', description: 'Calculate pip values for any pair', available: true },
    { name: 'Economic Calendar', description: 'Track important economic events', available: true },
    { name: 'Currency Correlation Matrix', description: 'Understand pair relationships', available: false },
    { name: 'Volatility Calculator', description: 'Measure market volatility', available: false }
  ];

  const resources = [
    { name: 'Trading Plan Template', type: 'PDF', size: '1.2 MB' },
    { name: 'Risk Management Checklist', type: 'PDF', size: '0.8 MB' },
    { name: 'Chart Pattern Guide', type: 'PDF', size: '2.1 MB' },
    { name: 'Economic Indicators Handbook', type: 'PDF', size: '1.5 MB' }
  ];

  const certifications = [
    {
      title: 'Forex Fundamentals Certificate',
      description: 'Complete beginner course and pass final assessment',
      icon: Award,
      color: 'text-green-600',
      requirements: ['Complete all beginner modules', 'Pass final exam (80%+)', 'Submit trading plan'],
      available: true
    },
    {
      title: 'Technical Analysis Professional',
      description: 'Master technical analysis and chart reading',
      icon: BarChart3,
      color: 'text-blue-600',
      requirements: ['Complete intermediate course', 'Analyze 10 trade setups', 'Live trading demo'],
      available: false
    },
    {
      title: 'Advanced Trading Strategist',
      description: 'Professional-level trading competency',
      icon: Target,
      color: 'text-purple-600',
      requirements: ['Complete advanced course', 'Maintain 3-month trading journal', 'Peer review session'],
      available: false
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
    // Simulate download
    console.log(`Downloading ${resourceName}...`);
  };

  const openTool = (toolName: string) => {
    // Simulate opening tool
    console.log(`Opening ${toolName}...`);
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
                      onClick={() => tool.available && openTool(tool.name)}
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
                      <Badge variant="outline">{resource.type}</Badge>
                    </CardTitle>
                    <CardDescription>Size: {resource.size}</CardDescription>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <Card key={index} className={`hover:shadow-lg transition-shadow ${!cert.available ? 'opacity-50' : ''}`}>
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
                      <Button className="w-full" disabled={!cert.available}>
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
