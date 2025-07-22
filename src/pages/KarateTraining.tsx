
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Shield, Award, Target, Clock, Book, Users, Star, TrendingUp } from 'lucide-react';

interface MartialArtsRank {
  id: string;
  discipline: string;
  rank_name: string;
  rank_level: number;
  date_achieved: string;
  instructor: string;
}

const karateRanks = [
  { level: 1, name: '10th Kyu', belt: 'White', color: 'bg-white border-2 border-gray-300' },
  { level: 2, name: '9th Kyu', belt: 'Yellow', color: 'bg-yellow-400' },
  { level: 3, name: '8th Kyu', belt: 'Orange', color: 'bg-orange-400' },
  { level: 4, name: '7th Kyu', belt: 'Green', color: 'bg-green-500' },
  { level: 5, name: '6th Kyu', belt: 'Blue', color: 'bg-blue-500' },
  { level: 6, name: '5th Kyu', belt: 'Purple', color: 'bg-purple-500' },
  { level: 7, name: '4th Kyu', belt: 'Brown', color: 'bg-amber-800' },
  { level: 8, name: '3rd Kyu', belt: 'Brown', color: 'bg-amber-900' },
  { level: 9, name: '2nd Kyu', belt: 'Brown', color: 'bg-yellow-900' },
  { level: 10, name: '1st Kyu', belt: 'Brown', color: 'bg-yellow-800' },
  { level: 11, name: '1st Dan', belt: 'Black', color: 'bg-black' },
];

const karateTechniques = [
  {
    category: 'Basic Stances (Dachi)',
    techniques: [
      'Zenkutsu-dachi (Forward stance)',
      'Kokutsu-dachi (Back stance)',
      'Kiba-dachi (Horse stance)',
      'Nekoashi-dachi (Cat stance)'
    ]
  },
  {
    category: 'Punching (Tsuki)',
    techniques: [
      'Oi-tsuki (Lunge punch)',
      'Gyaku-tsuki (Reverse punch)',
      'Kagi-tsuki (Hook punch)',
      'Uraken-uchi (Back fist strike)'
    ]
  },
  {
    category: 'Blocking (Uke)',
    techniques: [
      'Age-uke (Rising block)',
      'Soto-uke (Outside block)',
      'Uchi-uke (Inside block)',
      'Gedan-barai (Downward block)'
    ]
  },
  {
    category: 'Kicking (Geri)',
    techniques: [
      'Mae-geri (Front kick)',
      'Yoko-geri (Side kick)',
      'Mawashi-geri (Roundhouse kick)',
      'Ushiro-geri (Back kick)'
    ]
  }
];

const KarateTraining: React.FC = () => {
  const [userRanks, setUserRanks] = useState<MartialArtsRank[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserRanks();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserRanks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('martial_arts_ranks')
        .select('*')
        .eq('user_id', user.id)
        .eq('discipline', 'karate')
        .order('rank_level', { ascending: false });

      if (error) throw error;
      setUserRanks(data || []);
    } catch (error) {
      console.error('Error fetching martial arts ranks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentRank = () => {
    if (userRanks.length === 0) return karateRanks[0];
    const highestRank = userRanks[0];
    return karateRanks.find(r => r.level === highestRank.rank_level) || karateRanks[0];
  };

  const getNextRank = () => {
    const current = getCurrentRank();
    return karateRanks.find(r => r.level === current.level + 1);
  };

  const currentRank = getCurrentRank();
  const nextRank = getNextRank();

  return (
    <div className="min-h-screen bg-vintage-warm-cream">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-vintage-dark-brown to-vintage-burgundy">
        <div className="container mx-auto px-4 text-center text-vintage-warm-cream">
          <h1 className="font-playfair font-bold text-4xl md:text-6xl mb-4">
            Traditional Karate Training
          </h1>
          <p className="font-crimson text-xl mb-8 max-w-3xl mx-auto">
            Master the ancient art of Karate through disciplined practice, traditional techniques, and the way of the warrior
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-vintage-gold hover:bg-vintage-gold/90 text-vintage-deep-blue">
              Start Training
            </Button>
            <Button size="lg" variant="outline" className="border-vintage-warm-cream text-vintage-warm-cream hover:bg-vintage-warm-cream hover:text-vintage-deep-blue">
              Learn Techniques
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="techniques">Techniques</TabsTrigger>
            <TabsTrigger value="ranks">Belt System</TabsTrigger>
            <TabsTrigger value="kata">Kata Forms</TabsTrigger>
            <TabsTrigger value="philosophy">Philosophy</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Your Karate Journey
                  </CardTitle>
                  <CardDescription>Current progress and achievements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span>Current Rank:</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-4 rounded ${currentRank.color}`}></div>
                          <span className="font-semibold">{currentRank.belt} Belt</span>
                        </div>
                      </div>
                      {nextRank && (
                        <div className="flex items-center justify-between">
                          <span>Next Rank:</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-4 rounded ${nextRank.color}`}></div>
                            <span>{nextRank.belt} Belt</span>
                          </div>
                        </div>
                      )}
                      <Progress value={65} className="mt-4" />
                      <p className="text-sm text-muted-foreground">65% progress to next rank</p>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="mb-4">Sign in to track your karate journey</p>
                      <Button>Sign In</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Training Focus
                  </CardTitle>
                  <CardDescription>Essential areas of development</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Basic Techniques</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Kata Forms</span>
                        <span>60%</span>
                      </div>
                      <Progress value={60} className="mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Sparring (Kumite)</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Philosophy</span>
                        <span>70%</span>
                      </div>
                      <Progress value={70} className="mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Class Schedule</CardTitle>
                <CardDescription>Weekly training sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">Beginner Classes</h4>
                    <p className="text-sm text-muted-foreground">Mon, Wed, Fri - 6:00 PM</p>
                    <p className="text-sm">Focus on basic stances and techniques</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">Intermediate Classes</h4>
                    <p className="text-sm text-muted-foreground">Tue, Thu - 7:00 PM</p>
                    <p className="text-sm">Kata practice and sparring fundamentals</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">Advanced Classes</h4>
                    <p className="text-sm text-muted-foreground">Sat - 10:00 AM</p>
                    <p className="text-sm">Advanced techniques and competition prep</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="techniques" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {karateTechniques.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.techniques.map((technique, techIndex) => (
                        <li key={techIndex} className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-vintage-gold" />
                          <span className="text-sm">{technique}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4" disabled={!user}>
                      {user ? 'Practice Techniques' : 'Sign in to Access'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ranks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Karate Belt Ranking System</CardTitle>
                <CardDescription>The traditional path of progression in Karate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {karateRanks.map((rank) => (
                    <div key={rank.level} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`w-8 h-6 rounded ${rank.color}`}></div>
                      <div>
                        <div className="font-medium">{rank.belt} Belt</div>
                        <div className="text-sm text-muted-foreground">{rank.name}</div>
                      </div>
                      {userRanks.some(ur => ur.rank_level === rank.level) && (
                        <Award className="h-4 w-4 text-vintage-gold ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kata" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Heian Shodan</CardTitle>
                  <CardDescription>First form - 21 movements</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    The first kata taught to beginners. Emphasizes basic blocks, punches, and stances.
                  </p>
                  <Button className="w-full" disabled={!user}>
                    {user ? 'Learn Kata' : 'Sign in to Access'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Heian Nidan</CardTitle>
                  <CardDescription>Second form - 26 movements</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Introduces side kicks and hammer fist strikes. Builds on foundation techniques.
                  </p>
                  <Button className="w-full" disabled={!user}>
                    {user ? 'Learn Kata' : 'Sign in to Access'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Heian Sandan</CardTitle>
                  <CardDescription>Third form - 20 movements</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Features twin blocks and complex hand techniques. Develops timing and coordination.
                  </p>
                  <Button className="w-full" disabled={!user}>
                    {user ? 'Learn Kata' : 'Sign in to Access'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="philosophy" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>The Dojo Kun</CardTitle>
                  <CardDescription>Five principles of Karate training</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-vintage-warm-cream/50 rounded">
                    <p className="font-medium">Seek perfection of character</p>
                    <p className="text-sm text-muted-foreground">Hitotsu! Jinkaku kansei ni tsutomuru koto!</p>
                  </div>
                  <div className="p-3 bg-vintage-warm-cream/50 rounded">
                    <p className="font-medium">Be faithful</p>
                    <p className="text-sm text-muted-foreground">Hitotsu! Makoto no michi wo mamoru koto!</p>
                  </div>
                  <div className="p-3 bg-vintage-warm-cream/50 rounded">
                    <p className="font-medium">Endeavor to excel</p>
                    <p className="text-sm text-muted-foreground">Hitotsu! Doryoku no seishin wo yashinau koto!</p>
                  </div>
                  <div className="p-3 bg-vintage-warm-cream/50 rounded">
                    <p className="font-medium">Respect others</p>
                    <p className="text-sm text-muted-foreground">Hitotsu! Reigi wo omonzuru koto!</p>
                  </div>
                  <div className="p-3 bg-vintage-warm-cream/50 rounded">
                    <p className="font-medium">Refrain from violent behavior</p>
                    <p className="text-sm text-muted-foreground">Hitotsu! Kekki no yu wo imashimuru koto!</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Karate Philosophy</CardTitle>
                  <CardDescription>The way of the empty hand</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Discipline (Kiritsu)</h4>
                    <p className="text-sm text-muted-foreground">
                      Self-control and dedication to continuous improvement through consistent practice.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Respect (Rei)</h4>
                    <p className="text-sm text-muted-foreground">
                      Showing honor to instructors, fellow students, and the art itself.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Humility (Kansha)</h4>
                    <p className="text-sm text-muted-foreground">
                      Understanding that mastery is a lifelong journey requiring constant learning.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Perseverance (Nana korobi ya oki)</h4>
                    <p className="text-sm text-muted-foreground">
                      "Fall down seven times, get up eight." Never giving up in the face of challenges.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KarateTraining;
