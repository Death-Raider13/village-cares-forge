import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Activity, BookOpen, Target } from 'lucide-react';
import StartJourneyModal from '@/components/fitness/StartJourneyModal';
import FitnessEducationModal from '@/components/fitness/FitnessEducationModal';
const FitnessTraining: React.FC = () => {
  
  const [startJourneyOpen, setStartJourneyOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-warm-cream to-vintage-sage-green/10">
      {/* Enhanced Hero Section */}
      <section className="py-20 bg-gradient-to-br from-vintage-deep-blue via-vintage-forest-green to-vintage-dark-brown relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center text-vintage-warm-cream relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-playfair font-bold text-5xl md:text-7xl mb-6 tracking-tight">
              Elevate Your Fitness Journey
            </h1>
            <p className="font-crimson text-xl md:text-2xl mb-8 leading-relaxed opacity-90">
              Unlock your full potential with personalized fitness programs, expert guidance, and a supportive community
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button size="lg" className="bg-vintage-gold hover:bg-vintage-gold/90 text-vintage-deep-blue font-semibold px-8 py-3" onClick={() => setStartJourneyOpen(true)}>
                <Target className="mr-2 h-5 w-5" />
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-vintage-warm-cream text-vintage-warm-cream hover:bg-vintage-warm-cream hover:text-vintage-deep-blue font-semibold px-8 py-3" onClick={() => setEducationOpen(true)}>
                <BookOpen className="mr-2 h-5 w-5" />
                Fitness Education
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="programs" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="programs" className="font-semibold">Training Programs</TabsTrigger>
            <TabsTrigger value="nutrition" className="font-semibold">Nutrition Plans</TabsTrigger>
            <TabsTrigger value="community" className="font-semibold">Community Hub</TabsTrigger>
            <TabsTrigger value="resources" className="font-semibold">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="space-y-8 mt-8">
            {/* Personalized Training Programs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-playfair text-vintage-deep-blue">
                    <Activity className="h-5 w-5" />
                    Beginner's Bootcamp
                  </CardTitle>
                  <CardDescription>Build a solid fitness foundation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm font-crimson">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Full body workouts 3 times a week</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Focus on fundamental movements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Expert guidance and support</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-vintage-deep-blue hover:bg-vintage-forest-green">
                    Start Program
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-playfair text-vintage-deep-blue">
                    <Activity className="h-5 w-5" />
                    Strength & Conditioning
                  </CardTitle>
                  <CardDescription>Increase strength and endurance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm font-crimson">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Progressive overload training</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Advanced lifting techniques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Personalized coaching</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-vintage-deep-blue hover:bg-vintage-forest-green">
                    Explore Program
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-playfair text-vintage-deep-blue">
                    <Activity className="h-5 w-5" />
                    Cardio Blast
                  </CardTitle>
                  <CardDescription>Improve cardiovascular health</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm font-crimson">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>HIIT and LISS cardio workouts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Heart rate zone training</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Expert guidance and support</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-vintage-deep-blue hover:bg-vintage-forest-green">
                    View Program
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setStartJourneyOpen(true)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-playfair text-vintage-deep-blue">
                    <div className="p-3 rounded-full bg-blue-100">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    Start Your Journey
                  </CardTitle>
                  <CardDescription>Create a personalized fitness plan tailored to your goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-vintage-dark-brown/80 font-crimson mb-4">
                    Get a customized workout plan based on your fitness level, goals, and available equipment.
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold">
                    <span>Begin Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setEducationOpen(true)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-playfair text-vintage-deep-blue">
                    <div className="p-3 rounded-full bg-green-100">
                      <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                    Fitness Education
                  </CardTitle>
                  <CardDescription>Learn the science behind effective training and nutrition</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-vintage-dark-brown/80 font-crimson mb-4">
                    Master the fundamentals of exercise science, nutrition, and recovery for optimal results.
                  </p>
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <span>Start Learning</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Nutrition Plans</h3>
              <p className="text-muted-foreground">Explore our personalized nutrition plans to fuel your fitness journey.</p>
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Community Hub</h3>
              <p className="text-muted-foreground">Connect with fellow fitness enthusiasts and share your progress.</p>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Resources</h3>
              <p className="text-muted-foreground">Access a variety of resources to support your fitness journey.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <StartJourneyModal isOpen={startJourneyOpen} onClose={() => setStartJourneyOpen(false)} />
      <FitnessEducationModal isOpen={educationOpen} onClose={() => setEducationOpen(false)} />
    </div>
  );
};

export default FitnessTraining;
