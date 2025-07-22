
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Shield, Award, Target, Clock, Book, Users, Star, TrendingUp, Heart, Activity, BookOpen } from 'lucide-react';

interface MartialArtsRank {
  id: string;
  discipline: string;
  rank_name: string;
  rank_level: number;
  date_achieved: string;
  instructor: string;
}

const karateRanks = [
  { level: 1, name: '10th Kyu', belt: 'White', color: 'bg-white border-2 border-gray-300', meaning: 'Purity and beginning' },
  { level: 2, name: '9th Kyu', belt: 'Yellow', color: 'bg-yellow-400', meaning: 'First ray of sunlight' },
  { level: 3, name: '8th Kyu', belt: 'Orange', color: 'bg-orange-400', meaning: 'Growing strength' },
  { level: 4, name: '7th Kyu', belt: 'Green', color: 'bg-green-500', meaning: 'Growth and development' },
  { level: 5, name: '6th Kyu', belt: 'Blue', color: 'bg-blue-500', meaning: 'Sky - limitless potential' },
  { level: 6, name: '5th Kyu', belt: 'Purple', color: 'bg-purple-500', meaning: 'Dawn before the darkness' },
  { level: 7, name: '4th Kyu', belt: 'Brown', color: 'bg-amber-800', meaning: 'Maturity and harvest' },
  { level: 8, name: '3rd Kyu', belt: 'Brown', color: 'bg-amber-900', meaning: 'Deepening knowledge' },
  { level: 9, name: '2nd Kyu', belt: 'Brown', color: 'bg-yellow-900', meaning: 'Preparation for mastery' },
  { level: 10, name: '1st Kyu', belt: 'Brown', color: 'bg-yellow-800', meaning: 'Final step before black' },
  { level: 11, name: '1st Dan', belt: 'Black', color: 'bg-black', meaning: 'Beginning of true learning' },
];

const karateTechniques = [
  {
    category: 'Basic Stances (Dachi-waza)',
    techniques: [
      { name: 'Zenkutsu-dachi', translation: 'Forward stance', description: 'Foundation for attacking techniques' },
      { name: 'Kokutsu-dachi', translation: 'Back stance', description: 'Defensive stance with mobility' },
      { name: 'Kiba-dachi', translation: 'Horse stance', description: 'Strength and stability training' },
      { name: 'Nekoashi-dachi', translation: 'Cat stance', description: 'Light and ready position' }
    ]
  },
  {
    category: 'Punching Techniques (Tsuki-waza)',
    techniques: [
      { name: 'Oi-tsuki', translation: 'Lunge punch', description: 'Basic stepping punch' },
      { name: 'Gyaku-tsuki', translation: 'Reverse punch', description: 'Most fundamental punch' },
      { name: 'Kagi-tsuki', translation: 'Hook punch', description: 'Close-range technique' },
      { name: 'Uraken-uchi', translation: 'Back fist strike', description: 'Snapping technique' }
    ]
  },
  {
    category: 'Blocking Techniques (Uke-waza)',
    techniques: [
      { name: 'Age-uke', translation: 'Rising block', description: 'Upper level defense' },
      { name: 'Soto-uke', translation: 'Outside block', description: 'Outside-to-inside defense' },
      { name: 'Uchi-uke', translation: 'Inside block', description: 'Inside-to-outside defense' },
      { name: 'Gedan-barai', translation: 'Downward block', description: 'Lower level defense' }
    ]
  },
  {
    category: 'Kicking Techniques (Geri-waza)',
    techniques: [
      { name: 'Mae-geri', translation: 'Front kick', description: 'Straight forward kick' },
      { name: 'Yoko-geri', translation: 'Side kick', description: 'Powerful side thrust' },
      { name: 'Mawashi-geri', translation: 'Roundhouse kick', description: 'Circular kicking technique' },
      { name: 'Ushiro-geri', translation: 'Back kick', description: 'Reverse thrust kick' }
    ]
  }
];

const karateKata = [
  {
    name: 'Heian Shodan',
    translation: 'Peaceful Mind First Level',
    movements: 21,
    level: 'Beginner',
    description: 'The first kata taught to students. Emphasizes basic blocks, punches, and forward stances.',
    focus: 'Foundation techniques and timing',
    history: 'Created by Anko Itosu to introduce students to karate basics'
  },
  {
    name: 'Heian Nidan',
    translation: 'Peaceful Mind Second Level',
    movements: 26,
    level: 'Beginner',
    description: 'Introduces side kicks and hammer fist strikes. Develops balance and coordination.',
    focus: 'Side techniques and varied stances',
    history: 'Builds upon Shodan with more complex movements'
  },
  {
    name: 'Heian Sandan',
    translation: 'Peaceful Mind Third Level', 
    movements: 20,
    level: 'Intermediate',
    description: 'Features twin blocks and complex hand techniques. Develops timing and flow.',
    focus: 'Simultaneous techniques and rhythm',
    history: 'Introduces advanced coordination concepts'
  },
  {
    name: 'Bassai Dai',
    translation: 'To Storm a Fortress',
    movements: 42,
    level: 'Advanced',
    description: 'A powerful kata representing the breaking down of barriers and obstacles.',
    focus: 'Power, determination, and breaking through',
    history: 'Ancient kata representing overcoming challenges'
  }
];

const dojoKun = [
  {
    japanese: 'Hitotsu! Jinkaku kansei ni tsutomuru koto!',
    english: 'Seek perfection of character',
    meaning: 'Continuously strive to improve yourself as a person, not just as a martial artist.'
  },
  {
    japanese: 'Hitotsu! Makoto no michi wo mamoru koto!',
    english: 'Be faithful',
    meaning: 'Be true to yourself, your training, and your commitments.'
  },
  {
    japanese: 'Hitotsu! Doryoku no seishin wo yashinau koto!',
    english: 'Endeavor to excel',
    meaning: 'Always put forth your best effort in everything you do.'
  },
  {
    japanese: 'Hitotsu! Reigi wo omonzuru koto!',
    english: 'Respect others',
    meaning: 'Show proper respect and courtesy to all people.'
  },
  {
    japanese: 'Hitotsu! Kekki no yu wo imashimuru koto!',
    english: 'Refrain from violent behavior',
    meaning: 'Control your temper and avoid unnecessary conflict.'
  }
];

const KarateTraining: React.FC = () => {
  const [userRanks, setUserRanks] = useState<MartialArtsRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAge, setSelectedAge] = useState('adult');
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

  const getAgeAppropriateTraining = () => {
    const training = {
      kids: {
        title: 'Little Dragons (Ages 4-7)',
        focus: 'Fun, discipline, and basic motor skills',
        techniques: ['Basic stances', 'Simple blocks', 'Counting in Japanese', 'Respect and bowing'],
        goals: ['Following instructions', 'Balance and coordination', 'Social skills', 'Basic self-defense awareness']
      },
      youth: {
        title: 'Youth Karate (Ages 8-12)',
        focus: 'Technique development and character building',
        techniques: ['All basic techniques', 'Simple kata forms', 'Light sparring', 'Traditional etiquette'],
        goals: ['Technical proficiency', 'Physical fitness', 'Mental discipline', 'Leadership skills']
      },
      teen: {
        title: 'Teen Karate (Ages 13-17)',
        focus: 'Advanced techniques and competition preparation',
        techniques: ['Complex kata', 'Full-contact sparring', 'Advanced combinations', 'Weapons training'],
        goals: ['Tournament competition', 'Teaching younger students', 'Physical conditioning', 'Mental toughness']
      },
      adult: {
        title: 'Adult Karate (Ages 18+)',
        focus: 'Complete martial arts mastery',
        techniques: ['All traditional techniques', 'Advanced kata', 'Full sparring', 'Self-defense applications'],
        goals: ['Black belt achievement', 'Teaching others', 'Physical fitness', 'Spiritual development']
      }
    };
    return training[selectedAge as keyof typeof training] || training.adult;
  };

  const currentRank = getCurrentRank();
  const nextRank = getNextRank();

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-warm-cream to-vintage-dark-brown/10">
      {/* Enhanced Hero Section */}
      <section className="py-20 bg-gradient-to-br from-vintage-dark-brown via-vintage-burgundy to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 text-center text-vintage-warm-cream relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-playfair font-bold text-5xl md:text-7xl mb-6 tracking-tight">
              Traditional Karate-Do
            </h1>
            <p className="font-crimson text-xl md:text-2xl mb-8 leading-relaxed opacity-90">
              "The ultimate aim of karate lies not in victory nor defeat, but in the perfection of the character of its participants."
              <br />
              <span className="text-lg opacity-80">- Gichin Funakoshi, Founder of Shotokan Karate</span>
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button size="lg" className="bg-vintage-gold hover:bg-vintage-gold/90 text-vintage-deep-blue font-semibold px-8 py-3">
                <Shield className="mr-2 h-5 w-5" />
                Begin Your Journey
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-vintage-warm-cream text-vintage-warm-cream hover:bg-vintage-warm-cream hover:text-vintage-deep-blue font-semibold px-8 py-3">
                <BookOpen className="mr-2 h-5 w-5" />
                Learn Philosophy
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Age Group Selection */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm border-2 border-vintage-gold/20">
          <CardHeader className="text-center">
            <CardTitle className="font-playfair text-2xl text-vintage-deep-blue">Choose Your Training Path</CardTitle>
            <CardDescription>Karate training adapted for every age and skill level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
              <Select value={selectedAge} onValueChange={setSelectedAge}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kids">Little Dragons (4-7 years)</SelectItem>
                  <SelectItem value="youth">Youth (8-12 years)</SelectItem>
                  <SelectItem value="teen">Teens (13-17 years)</SelectItem>
                  <SelectItem value="adult">Adults (18+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-vintage-deep-blue mb-2">
                {getAgeAppropriateTraining().title}
              </h3>
              <p className="text-vintage-dark-brown font-crimson mb-4">
                Focus: {getAgeAppropriateTraining().focus}
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="font-semibold">Overview</TabsTrigger>
            <TabsTrigger value="techniques" className="font-semibold">Techniques</TabsTrigger>
            <TabsTrigger value="kata" className="font-semibold">Kata Forms</TabsTrigger>
            <TabsTrigger value="ranks" className="font-semibold">Belt System</TabsTrigger>
            <TabsTrigger value="philosophy" className="font-semibold">Philosophy</TabsTrigger>
            <TabsTrigger value="community" className="font-semibold">Dojo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Progress */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                    <Shield className="h-5 w-5" />
                    Your Karate Journey
                  </CardTitle>
                  <CardDescription>Current progress and achievements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user ? (
                    <>
                      <div className="flex items-center justify-between p-3 bg-vintage-warm-cream/30 rounded-lg">
                        <span className="font-medium">Current Rank:</span>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-6 rounded ${currentRank.color}`}></div>
                          <span className="font-semibold">{currentRank.belt} Belt</span>
                        </div>
                      </div>
                      <div className="text-center p-3 bg-vintage-deep-blue/5 rounded-lg">
                        <p className="text-sm text-vintage-dark-brown italic">
                          "{currentRank.meaning}"
                        </p>
                      </div>
                      {nextRank && (
                        <div className="flex items-center justify-between p-3 bg-vintage-gold/10 rounded-lg">
                          <span className="font-medium">Next Goal:</span>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-6 rounded ${nextRank.color}`}></div>
                            <span>{nextRank.belt} Belt</span>
                          </div>
                        </div>
                      )}
                      <Progress value={65} className="mt-4" />
                      <p className="text-sm text-vintage-dark-brown text-center">65% progress to next rank</p>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <Shield className="h-12 w-12 mx-auto mb-4 text-vintage-deep-blue" />
                      <p className="mb-4 text-vintage-dark-brown">Begin your martial arts journey</p>
                      <Button className="bg-vintage-deep-blue hover:bg-vintage-burgundy">Start Training</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Age-Appropriate Training Focus */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                    <Target className="h-5 w-5" />
                    Training Focus
                  </CardTitle>
                  <CardDescription>{getAgeAppropriateTraining().title}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-vintage-deep-blue">Key Techniques:</h4>
                    <ul className="space-y-2">
                      {getAgeAppropriateTraining().techniques.map((technique, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-vintage-gold flex-shrink-0" />
                          <span className="text-sm text-vintage-dark-brown">{technique}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-vintage-deep-blue">Learning Goals:</h4>
                    <ul className="space-y-2">
                      {getAgeAppropriateTraining().goals.map((goal, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Target className="h-3 w-3 text-vintage-burgundy flex-shrink-0" />
                          <span className="text-sm text-vintage-dark-brown">{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Training Schedule */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-playfair text-vintage-deep-blue">Dojo Training Schedule</CardTitle>
                <CardDescription>Weekly classes for all levels and ages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border border-vintage-gold/20 rounded-lg bg-vintage-warm-cream/20">
                    <h4 className="font-semibold text-vintage-deep-blue mb-2">Little Dragons</h4>
                    <p className="text-sm text-vintage-dark-brown mb-1">Ages 4-7</p>
                    <p className="text-sm text-vintage-dark-brown mb-2">Sat: 9:00-9:45 AM</p>
                    <p className="text-xs text-vintage-dark-brown">Fun-based learning with basic techniques</p>
                  </div>
                  <div className="p-4 border border-vintage-gold/20 rounded-lg bg-vintage-warm-cream/20">
                    <h4 className="font-semibold text-vintage-deep-blue mb-2">Youth Classes</h4>
                    <p className="text-sm text-vintage-dark-brown mb-1">Ages 8-12</p>
                    <p className="text-sm text-vintage-dark-brown mb-2">Tue, Thu: 5:00-6:00 PM</p>
                    <p className="text-xs text-vintage-dark-brown">Traditional karate with character development</p>
                  </div>
                  <div className="p-4 border border-vintage-gold/20 rounded-lg bg-vintage-warm-cream/20">
                    <h4 className="font-semibold text-vintage-deep-blue mb-2">Teen Classes</h4>
                    <p className="text-sm text-vintage-dark-brown mb-1">Ages 13-17</p>
                    <p className="text-sm text-vintage-dark-brown mb-2">Mon, Wed, Fri: 6:30-7:30 PM</p>
                    <p className="text-xs text-vintage-dark-brown">Advanced techniques and competition training</p>
                  </div>
                  <div className="p-4 border border-vintage-gold/20 rounded-lg bg-vintage-warm-cream/20">
                    <h4 className="font-semibold text-vintage-deep-blue mb-2">Adult Classes</h4>
                    <p className="text-sm text-vintage-dark-brown mb-1">Ages 18+</p>
                    <p className="text-sm text-vintage-dark-brown mb-2">Mon, Wed, Fri: 7:45-8:45 PM</p>
                    <p className="text-xs text-vintage-dark-brown">Complete traditional karate training</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="techniques" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {karateTechniques.map((category, index) => (
                <Card key={index} className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="font-playfair text-vintage-deep-blue">{category.category}</CardTitle>
                    <CardDescription>Fundamental techniques for this category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.techniques.map((technique, techIndex) => (
                        <div key={techIndex} className="p-3 border border-vintage-gold/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-vintage-deep-blue">{technique.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {technique.translation}
                            </Badge>
                          </div>
                          <p className="text-sm text-vintage-dark-brown">{technique.description}</p>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-6 bg-vintage-deep-blue hover:bg-vintage-burgundy" disabled={!user}>
                      {user ? 'Practice Techniques' : 'Sign in to Learn'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="kata" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {karateKata.map((kata, index) => (
                <Card key={index} className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="font-playfair text-vintage-deep-blue">{kata.name}</CardTitle>
                      <Badge className={kata.level === 'Beginner' ? 'bg-green-100 text-green-800' : 
                                     kata.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                                     'bg-red-100 text-red-800'}>
                        {kata.level}
                      </Badge>
                    </div>
                    <CardDescription className="italic text-vintage-burgundy">
                      "{kata.translation}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-vintage-dark-brown">Movements:</span>
                        <div className="text-lg font-bold text-vintage-deep-blue">{kata.movements}</div>
                      </div>
                      <div>
                        <span className="font-medium text-vintage-dark-brown">Focus:</span>
                        <div className="text-sm text-vintage-dark-brown">{kata.focus}</div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-vintage-dark-brown mb-2">{kata.description}</p>
                      <p className="text-xs text-vintage-dark-brown/70 italic">{kata.history}</p>
                    </div>
                    <Button className="w-full bg-vintage-deep-blue hover:bg-vintage-burgundy" disabled={!user}>
                      {user ? 'Learn Kata' : 'Sign in to Access'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ranks" className="space-y-8 mt-8">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-playfair text-vintage-deep-blue">The Karate Belt Ranking System</CardTitle>
                <CardDescription>Understanding the traditional path of progression in Shotokan Karate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {karateRanks.map((rank) => (
                    <div key={rank.level} className="flex items-center gap-4 p-4 border border-vintage-gold/20 rounded-lg hover:bg-vintage-warm-cream/10 transition-colors">
                      <div className={`w-12 h-8 rounded ${rank.color} flex-shrink-0`}></div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-vintage-deep-blue">{rank.belt} Belt</h4>
                          {userRanks.some(ur => ur.rank_level === rank.level) && (
                            <Award className="h-4 w-4 text-vintage-gold" />
                          )}
                        </div>
                        <p className="text-sm text-vintage-dark-brown">{rank.name}</p>
                        <p className="text-xs text-vintage-dark-brown/70 italic">{rank.meaning}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="philosophy" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Dojo Kun */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-playfair text-vintage-deep-blue">The Dojo Kun</CardTitle>
                  <CardDescription>Five principles that guide all karate training</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dojoKun.map((principle, index) => (
                    <div key={index} className="p-4 bg-vintage-warm-cream/30 rounded-lg">
                      <h4 className="font-semibold text-vintage-deep-blue mb-2">{principle.english}</h4>
                      <p className="text-sm text-vintage-burgundy italic mb-2">{principle.japanese}</p>
                      <p className="text-sm text-vintage-dark-brown">{principle.meaning}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Karate Philosophy */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-playfair text-vintage-deep-blue">Karate-Do Philosophy</CardTitle>
                  <CardDescription>The way of the empty hand and peaceful heart</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-vintage-deep-blue flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Discipline (Kiritsu)
                    </h4>
                    <p className="text-sm text-vintage-dark-brown">
                      Self-control and dedication to continuous improvement through consistent practice and mindful training.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-vintage-deep-blue flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Respect (Rei)
                    </h4>
                    <p className="text-sm text-vintage-dark-brown">
                      Showing honor and courtesy to instructors, fellow students, ancestors, and the art itself.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-vintage-deep-blue flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Humility (Kansha)
                    </h4>
                    <p className="text-sm text-vintage-dark-brown">
                      Understanding that mastery is a lifelong journey requiring constant learning and self-reflection.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-vintage-deep-blue flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Perseverance (Nintai)
                    </h4>
                    <p className="text-sm text-vintage-dark-brown">
                      "Nana korobi ya oki" - Fall down seven times, get up eight. Never giving up in the face of challenges.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Traditional Wisdom */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-playfair text-vintage-deep-blue">Words of Wisdom</CardTitle>
                <CardDescription>Teachings from karate masters throughout history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-vintage-deep-blue/5 rounded-lg border-l-4 border-vintage-gold">
                    <blockquote className="text-vintage-dark-brown italic mb-2">
                      "Karate-do begins and ends with courtesy."
                    </blockquote>
                    <cite className="text-sm text-vintage-burgundy">- Gichin Funakoshi</cite>
                  </div>
                  <div className="p-6 bg-vintage-deep-blue/5 rounded-lg border-l-4 border-vintage-gold">
                    <blockquote className="text-vintage-dark-brown italic mb-2">
                      "The mind is everything. What you think you become."
                    </blockquote>
                    <cite className="text-sm text-vintage-burgundy">- Buddha (Zen influence on Karate)</cite>
                  </div>
                  <div className="p-6 bg-vintage-deep-blue/5 rounded-lg border-l-4 border-vintage-gold">
                    <blockquote className="text-vintage-dark-brown italic mb-2">
                      "There is no first attack in karate."
                    </blockquote>
                    <cite className="text-sm text-vintage-burgundy">- Gichin Funakoshi</cite>
                  </div>
                  <div className="p-6 bg-vintage-deep-blue/5 rounded-lg border-l-4 border-vintage-gold">
                    <blockquote className="text-vintage-dark-brown italic mb-2">
                      "Karate is not about winning or losing, but about the person you become."
                    </blockquote>
                    <cite className="text-sm text-vintage-burgundy">- Traditional Teaching</cite>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-8 mt-8">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-playfair text-vintage-deep-blue">Our Dojo Community</CardTitle>
                <CardDescription>Join a family of martial artists dedicated to excellence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border border-vintage-gold/20 rounded-lg hover:bg-vintage-warm-cream/10 transition-colors">
                    <Users className="h-12 w-12 mx-auto mb-4 text-vintage-deep-blue" />
                    <h4 className="font-semibold mb-2 text-vintage-deep-blue">Traditional Classes</h4>
                    <p className="text-sm text-vintage-dark-brown mb-4">
                      Learn authentic Shotokan Karate in a respectful, traditional environment
                    </p>
                    <Button className="w-full bg-vintage-deep-blue hover:bg-vintage-burgundy" disabled={!user}>
                      {user ? 'Join Dojo' : 'Sign in to Join'}
                    </Button>
                  </div>
                  <div className="text-center p-6 border border-vintage-gold/20 rounded-lg hover:bg-vintage-warm-cream/10 transition-colors">
                    <Award className="h-12 w-12 mx-auto mb-4 text-vintage-deep-blue" />
                    <h4 className="font-semibold mb-2 text-vintage-deep-blue">Belt Testing</h4>
                    <p className="text-sm text-vintage-dark-brown mb-4">
                      Regular testing opportunities to advance through the traditional belt system
                    </p>
                    <Button className="w-full bg-vintage-deep-blue hover:bg-vintage-burgundy" disabled={!user}>
                      {user ? 'Test Schedule' : 'Sign in to Access'}
                    </Button>
                  </div>
                  <div className="text-center p-6 border border-vintage-gold/20 rounded-lg hover:bg-vintage-warm-cream/10 transition-colors">
                    <Book className="h-12 w-12 mx-auto mb-4 text-vintage-deep-blue" />
                    <h4 className="font-semibold mb-2 text-vintage-deep-blue">Tournaments</h4>
                    <p className="text-sm text-vintage-dark-brown mb-4">
                      Compete in kata and kumite divisions at local and regional tournaments
                    </p>
                    <Button className="w-full bg-vintage-deep-blue hover:bg-vintage-burgundy" disabled={!user}>
                      {user ? 'Competition Info' : 'Sign in to Access'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dojo Etiquette */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-playfair text-vintage-deep-blue">Dojo Etiquette</CardTitle>
                <CardDescription>Traditional customs and respectful behavior in the training hall</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-4 text-vintage-deep-blue">Before Entering the Dojo:</h4>
                    <ul className="space-y-2 text-sm text-vintage-dark-brown">
                      <li className="flex items-start gap-2">
                        <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                        <span>Bow before entering the training area</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                        <span>Remove shoes and place them neatly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                        <span>Ensure your gi (uniform) is clean and properly tied</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                        <span>Arrive on time and prepared to train</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4 text-vintage-deep-blue">During Training:</h4>
                    <ul className="space-y-2 text-sm text-vintage-dark-brown">
                      <li className="flex items-start gap-2">
                        <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                        <span>Address instructors as "Sensei" with respect</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                        <span>Bow to partners before and after practice</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                        <span>Listen carefully and follow instructions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                        <span>Help lower ranks and accept guidance from higher ranks</span>
                      </li>
                    </ul>
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

export default KarateTraining;
