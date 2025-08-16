import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { ArrowRight, BookOpen, Calendar, Clock, Dumbbell, Heart, Shield, Star, Target, Users, Zap } from 'lucide-react';

import BeginJourneyModal from '@/components/karate/BeginJourneyModal';
import PhilosophyModal from '@/components/karate/PhilosophyModal';

const KarateTraining: React.FC = () => {
  const [beginJourneyOpen, setBeginJourneyOpen] = useState(false);
  const [philosophyOpen, setPhilosophyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-warm-cream to-vintage-sage-green/10">
      {/* Enhanced Hero Section */}
      <section className="py-20 bg-gradient-to-br from-vintage-deep-blue via-vintage-burgundy to-vintage-dark-brown relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center text-vintage-warm-cream relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-playfair font-bold text-5xl md:text-7xl mb-6 tracking-tight">
              Traditional Karate Training
            </h1>
            <p className="font-crimson text-xl md:text-2xl mb-8 leading-relaxed opacity-90">
              Master the art of self-defense, discipline, and mental fortitude with our comprehensive karate programs
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button size="lg" className="bg-vintage-gold hover:bg-vintage-gold/90 text-vintage-deep-blue font-semibold px-8 py-3" onClick={() => setBeginJourneyOpen(true)}>
                <Zap className="mr-2 h-5 w-5" />
                Begin Your Journey
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-vintage-warm-cream text-vintage-warm-cream hover:bg-vintage-warm-cream hover:text-vintage-deep-blue font-semibold px-8 py-3" onClick={() => setPhilosophyOpen(true)}>
                <BookOpen className="mr-2 h-5 w-5" />
                Learn Philosophy
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="font-semibold">Overview</TabsTrigger>
            <TabsTrigger value="programs" className="font-semibold">Training Programs</TabsTrigger>
            <TabsTrigger value="instructors" className="font-semibold">Our Instructors</TabsTrigger>
            <TabsTrigger value="community" className="font-semibold">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 mt-8">
            {/* Belt System */}
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-vintage-gold/20">
              <CardHeader>
                <CardTitle className="font-playfair text-2xl text-vintage-deep-blue">The Belt System</CardTitle>
                <CardDescription>A journey of discipline and growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-700">White Belt</h4>
                    <p className="text-sm text-orange-600">The beginning of your karate journey</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-700">Yellow Belt</h4>
                    <p className="text-sm text-yellow-600">Basic techniques and stances</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-700">Green Belt</h4>
                    <p className="text-sm text-green-600">Intermediate skills and forms</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overview */}
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-vintage-gold/20">
              <CardHeader>
                <CardTitle className="font-playfair text-2xl text-vintage-deep-blue">Karate Overview</CardTitle>
                <CardDescription>A path to self-improvement and mastery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-vintage-dark-brown/80 font-crimson">
                    Karate is a martial art that develops physical fitness, mental discipline, and self-defense skills.
                    Our training programs are designed for all ages and skill levels, from beginners to advanced practitioners.
                  </p>
                  <ul className="list-disc list-inside text-vintage-dark-brown/80 font-crimson">
                    <li>Traditional techniques and forms (kata)</li>
                    <li>Sparring and self-defense applications</li>
                    <li>Physical conditioning and flexibility training</li>
                    <li>Mental focus and discipline</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setBeginJourneyOpen(true)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-playfair text-vintage-deep-blue">
                    <div className="p-3 rounded-full bg-orange-100">
                      <Zap className="h-6 w-6 text-orange-600" />
                    </div>
                    Begin Your Journey
                  </CardTitle>
                  <CardDescription>Start your martial arts training with personalized guidance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-vintage-dark-brown/80 font-crimson mb-4">
                    Take the first step towards mastering karate with our structured beginner program.
                  </p>
                  <div className="flex items-center gap-2 text-orange-600 font-semibold">
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setPhilosophyOpen(true)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-playfair text-vintage-deep-blue">
                    <div className="p-3 rounded-full bg-purple-100">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    Learn Philosophy
                  </CardTitle>
                  <CardDescription>Discover the wisdom and principles behind martial arts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-vintage-dark-brown/80 font-crimson mb-4">
                    Explore the deep philosophical teachings that guide every true martial artist.
                  </p>
                  <div className="flex items-center gap-2 text-purple-600 font-semibold">
                    <span>Learn More</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="programs" className="space-y-8 mt-8">
            {/* Training Programs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                    <Zap className="h-5 w-5" />
                    Beginner Program
                  </CardTitle>
                  <CardDescription>Introduction to basic karate techniques</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm font-crimson">
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Basic stances and movements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Fundamental punches and kicks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Self-defense techniques</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-vintage-deep-blue hover:bg-vintage-burgundy">
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                    <Shield className="h-5 w-5" />
                    Intermediate Program
                  </CardTitle>
                  <CardDescription>Advanced techniques and sparring</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm font-crimson">
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Advanced stances and footwork</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Complex combinations and forms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Sparring techniques and tactics</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-vintage-deep-blue hover:bg-vintage-burgundy">
                    Join Program
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                    <Target className="h-5 w-5" />
                    Advanced Program
                  </CardTitle>
                  <CardDescription>Master level training and competition</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm font-crimson">
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Master level techniques and forms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Competition training and strategy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Instructor certification</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-vintage-deep-blue hover:bg-vintage-burgundy">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="instructors" className="space-y-6">
            {/* Our Instructors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Sensei Kenji Tanaka</CardTitle>
                  <CardDescription>5th Dan Black Belt</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    With over 20 years of experience, Sensei Tanaka is dedicated to teaching traditional karate values and techniques.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Sensei Aiko Nakamura</CardTitle>
                  <CardDescription>4th Dan Black Belt</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Sensei Nakamura specializes in self-defense techniques and sparring, with a focus on practical application.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Sensei Hiroshi Sato</CardTitle>
                  <CardDescription>3rd Dan Black Belt</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Sensei Sato is passionate about teaching the philosophical aspects of karate and promoting mental discipline.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            {/* Community */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-playfair text-vintage-deep-blue">Community</CardTitle>
                <CardDescription>Connect with fellow martial artists</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border rounded-lg">
                    <h4 className="font-semibold mb-2">Discussion Forum</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Share your experiences and learn from others
                    </p>
                    <Button className="w-full">Join Forum</Button>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <h4 className="font-semibold mb-2">Training Events</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Participate in workshops and seminars
                    </p>
                    <Button className="w-full">View Events</Button>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <h4 className="font-semibold mb-2">Social Media</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Stay connected with our community
                    </p>
                    <Button className="w-full">Follow Us</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <BeginJourneyModal isOpen={beginJourneyOpen} onClose={() => setBeginJourneyOpen(false)} />
      <PhilosophyModal isOpen={philosophyOpen} onClose={() => setPhilosophyOpen(false)} />
    </div>
  );
};

export default KarateTraining;
