
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, Target, Trophy, Shield, Star, Book, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface KarateLesson {
  id: string;
  title: string;
  description: string;
  belt: string;
  techniques: string[];
  duration: number;
  prerequisites: string[];
}

const KarateJourney: React.FC = () => {
  const { user } = useAuth();
  const [currentBelt, setCurrentBelt] = useState('white');
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalLessons, setTotalLessons] = useState(48);
  const [currentLesson, setCurrentLesson] = useState<KarateLesson | null>(null);
  const [userProgress, setUserProgress] = useState<any>(null);

  const karateProgression = {
    white: {
      name: 'White Belt',
      color: 'bg-gray-100',
      lessons: [
        {
          id: 'wb1',
          title: 'Karate Foundations & History',
          description: 'Learn the origins of karate, its philosophy, and basic etiquette',
          belt: 'white',
          duration: 45,
          techniques: ['Basic bow', 'Dojo etiquette', 'Karate history', 'Gichin Funakoshi'],
          prerequisites: []
        },
        {
          id: 'wb2',
          title: 'Basic Stances (Dachi)',
          description: 'Master the fundamental stances that form the foundation of karate',
          belt: 'white',
          duration: 60,
          techniques: ['Musubi-dachi', 'Heiko-dachi', 'Hachiji-dachi', 'Zenkutsu-dachi'],
          prerequisites: ['wb1']
        },
        {
          id: 'wb3',
          title: 'Basic Punches (Tsuki)',
          description: 'Learn proper punching techniques and hand formations',
          belt: 'white',
          duration: 50,
          techniques: ['Seiza', 'Choku-zuki', 'Oi-zuki', 'Gyaku-zuki'],
          prerequisites: ['wb2']
        }
      ]
    },
    yellow: {
      name: 'Yellow Belt',
      color: 'bg-yellow-100',
      lessons: [
        {
          id: 'yb1',
          title: 'Basic Blocks (Uke)',
          description: 'Master defensive techniques and blocking methods',
          belt: 'yellow',
          duration: 55,
          techniques: ['Gedan-barai', 'Age-uke', 'Soto-uke', 'Uchi-uke'],
          prerequisites: ['wb3']
        },
        {
          id: 'yb2',
          title: 'Basic Kicks (Geri)',
          description: 'Learn fundamental kicking techniques',
          belt: 'yellow',
          duration: 60,
          techniques: ['Mae-geri', 'Yoko-geri', 'Mawashi-geri', 'Ushiro-geri'],
          prerequisites: ['yb1']
        }
      ]
    },
    green: {
      name: 'Green Belt',
      color: 'bg-green-100',
      lessons: [
        {
          id: 'gb1',
          title: 'Kata - Heian Shodan',
          description: 'Learn your first kata (form) - the foundation of karate practice',
          belt: 'green',
          duration: 75,
          techniques: ['Heian Shodan', 'Kata principles', 'Breathing', 'Timing'],
          prerequisites: ['yb2']
        }
      ]
    }
  };

  const philosophyLessons = [
    {
      title: 'The Twenty Precepts of Gichin Funakoshi',
      content: `1. Karate-do begins with courtesy and ends with courtesy
2. There is no first strike in karate
3. Karate is an aid to justice
4. First control yourself before attempting to control others
5. Spirit first, technique second`
    },
    {
      title: 'The Five Dojo Kun',
      content: `1. Seek perfection of character
2. Be faithful
3. Endeavor to excel
4. Respect others
5. Refrain from violent behavior`
    }
  ];

  useEffect(() => {
    if (user) {
      fetchUserProgress();
      setCurrentLesson(karateProgression.white.lessons[0]);
    }
  }, [user]);

  const fetchUserProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('session_type', 'karate')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const sessions = data.filter(session => session.completed);
        setCompletedLessons(sessions.length);
        
        // Determine current belt based on completed lessons
        if (sessions.length >= 8) setCurrentBelt('green');
        else if (sessions.length >= 5) setCurrentBelt('yellow');
        else setCurrentBelt('white');
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const completeLesson = async (lesson: KarateLesson) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('training_sessions')
        .insert({
          user_id: user.id,
          title: `Completed: ${lesson.title}`,
          description: `Finished ${lesson.title} - ${lesson.duration} minutes`,
          session_type: 'karate',
          duration_minutes: lesson.duration,
          completed: true,
        });

      if (error) throw error;

      setCompletedLessons(prev => prev + 1);
      toast.success('Lesson completed! Great progress!');
      await fetchUserProgress();
    } catch (error) {
      console.error('Error completing lesson:', error);
      toast.error('Failed to record lesson completion');
    }
  };

  const getBeltColor = (belt: string) => {
    switch (belt) {
      case 'white': return 'bg-gray-100 text-gray-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'green': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <CardContent>
            <p>Please sign in to access your karate journey.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-warm-cream to-vintage-sage-green/10 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-playfair font-bold text-4xl text-vintage-deep-blue mb-2">Your Karate Journey</h1>
          <p className="font-crimson text-lg text-vintage-dark-brown/80">Master the way of the empty hand</p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-vintage-gold" />
                Current Belt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Badge className={getBeltColor(currentBelt)}>
                  {karateProgression[currentBelt as keyof typeof karateProgression]?.name}
                </Badge>
                <div className="flex-1">
                  <Progress value={(completedLessons / totalLessons) * 100} />
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedLessons}/{totalLessons} lessons completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-vintage-deep-blue" />
                Next Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">
                  {currentBelt === 'white' ? 'Yellow Belt' : 
                   currentBelt === 'yellow' ? 'Green Belt' : 'Brown Belt'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentBelt === 'white' ? '5 lessons to complete' : 
                   currentBelt === 'yellow' ? '3 lessons to complete' : 'Advanced training required'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-green-600" />
                Training Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-green-600">{completedLessons * 55}</p>
                <p className="text-sm text-muted-foreground">Minutes trained</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="current">Current Lesson</TabsTrigger>
            <TabsTrigger value="philosophy">Philosophy</TabsTrigger>
            <TabsTrigger value="techniques">Techniques</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            {currentLesson && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{currentLesson.title}</CardTitle>
                      <CardDescription className="mt-2">{currentLesson.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getBeltColor(currentLesson.belt)}>
                        {currentLesson.belt} belt
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {currentLesson.duration} min
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">What you'll learn:</h4>
                      <div className="grid gap-3">
                        {currentLesson.techniques.map((technique, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="h-4 w-4 text-vintage-gold" />
                              <h5 className="font-semibold">{technique}</h5>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {technique.includes('dachi') && 'Stance: Learn proper body positioning and weight distribution'}
                              {technique.includes('zuki') && 'Punch: Master proper fist formation and striking technique'}
                              {technique.includes('uke') && 'Block: Defensive technique to intercept attacks'}
                              {technique.includes('geri') && 'Kick: Powerful leg technique for striking'}
                              {technique.includes('kata') && 'Form: Choreographed sequence of techniques'}
                              {technique.includes('etiquette') && 'Respect: Traditional customs and behavior in the dojo'}
                              {technique.includes('history') && 'Background: Understanding the origins and development of karate'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={() => completeLesson(currentLesson)} 
                      className="w-full bg-vintage-deep-blue hover:bg-vintage-forest-green"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Lesson
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="philosophy">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Karate Philosophy
                  </CardTitle>
                  <CardDescription>Understanding the deeper meaning behind the martial art</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {philosophyLessons.map((lesson, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-3">{lesson.title}</h4>
                        <div className="whitespace-pre-line text-sm text-muted-foreground">
                          {lesson.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="techniques">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technique Library</CardTitle>
                  <CardDescription>Master the fundamental techniques of karate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(karateProgression).map(([belt, progression]) => (
                      <div key={belt} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getBeltColor(belt)}>
                            {progression.name}
                          </Badge>
                        </div>
                        <div className="grid gap-3">
                          {progression.lessons.map((lesson, index) => (
                            <div key={index} className="bg-gray-50 rounded p-3">
                              <h5 className="font-semibold">{lesson.title}</h5>
                              <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                              <div className="flex gap-2 mt-2 flex-wrap">
                                {lesson.techniques.map((technique, techIndex) => (
                                  <Badge key={techIndex} variant="outline" className="text-xs">
                                    {technique}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>Track your journey through the belt system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Belt Progression</h4>
                    <div className="space-y-3">
                      {Object.entries(karateProgression).map(([belt, progression]) => (
                        <div key={belt} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className={`w-8 h-8 rounded-full ${progression.color} flex items-center justify-center`}>
                            {belt === currentBelt && <Star className="h-4 w-4 text-vintage-gold" />}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold">{progression.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              {progression.lessons.length} lessons
                            </p>
                          </div>
                          <Badge variant={belt === currentBelt ? "default" : "outline"}>
                            {belt === currentBelt ? "Current" : "Upcoming"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Karate Community
                </CardTitle>
                <CardDescription>Connect with fellow practitioners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Training Partners</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Find practice partners in your area
                    </p>
                    <Button className="w-full">Find Partners</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Local Dojos</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect with traditional training facilities
                    </p>
                    <Button className="w-full">Find Dojos</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KarateJourney;
