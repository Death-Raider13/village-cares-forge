
import React from 'react';
import { Dumbbell, Timer, Target, Award, Activity, Users2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FitnessSection: React.FC = () => {
  const programs = [
    {
      icon: Dumbbell,
      title: 'Strength & Conditioning',
      description: 'Build functional strength through classical bodybuilding and powerlifting methodologies',
      duration: '45-60 min sessions'
    },
    {
      icon: Timer,
      title: 'Endurance Training',
      description: 'Develop cardiovascular fitness using time-tested athletic training principles',
      duration: '30-90 min sessions'
    },
    {
      icon: Target,
      title: 'Precision Movement',
      description: 'Master body mechanics and movement patterns for optimal performance and injury prevention',
      duration: '60 min sessions'
    },
    {
      icon: Award,
      title: 'Competition Prep',
      description: 'Elite coaching for those seeking to compete in strength sports and fitness competitions',
      duration: 'Custom programs'
    },
    {
      icon: Activity,
      title: 'Rehabilitation',
      description: 'Therapeutic exercise programs designed to restore function and prevent re-injury',
      duration: '45 min sessions'
    },
    {
      icon: Users2,
      title: 'Group Classes',
      description: 'Community-driven fitness sessions that combine camaraderie with classical training methods',
      duration: '60 min classes'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-vintage-warm-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <Dumbbell className="text-vintage-burgundy mb-4" size={64} />
          </div>
          
          <h2 className="font-playfair font-bold text-4xl md:text-5xl text-vintage-deep-blue mb-6">
            Fitness Training Excellence
          </h2>
          
          <div className="w-24 h-1 bg-vintage-gold mx-auto mb-6 ornate-divider"></div>
          
          <p className="font-crimson text-xl text-vintage-dark-brown max-w-3xl mx-auto leading-relaxed">
            Forge your body through timeless training principles that have built champions for generations. 
            Our approach honors the classical methods of physical development while incorporating 
            modern scientific understanding of human performance.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <Card key={index} className="bg-white/90 border-2 border-vintage-burgundy/20 hover:border-vintage-burgundy/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-vintage-burgundy rounded-full w-fit">
                    <Icon className="text-vintage-warm-cream" size={32} />
                  </div>
                  <CardTitle className="font-playfair text-xl text-vintage-deep-blue">
                    {program.title}
                  </CardTitle>
                  <CardDescription className="font-crimson text-vintage-gold font-semibold">
                    {program.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-crimson text-vintage-dark-brown text-center leading-relaxed">
                    {program.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Training Philosophy */}
        <div className="bg-gradient-to-r from-vintage-burgundy to-vintage-deep-blue rounded-lg shadow-xl p-8 mb-12 text-vintage-warm-cream">
          <div className="text-center mb-8">
            <h3 className="font-playfair font-bold text-3xl mb-4">
              Our Training Philosophy
            </h3>
            <div className="w-20 h-1 bg-vintage-gold mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h4 className="font-playfair font-semibold text-xl mb-3 text-vintage-gold">
                Foundation First
              </h4>
              <p className="font-crimson leading-relaxed">
                Build a solid foundation of movement quality, stability, and basic strength before advancing to complex techniques.
              </p>
            </div>
            
            <div className="text-center">
              <h4 className="font-playfair font-semibold text-xl mb-3 text-vintage-gold">
                Progressive Mastery
              </h4>
              <p className="font-crimson leading-relaxed">
                Each program follows the classical principle of progressive overload, gradually increasing challenges as your body adapts.
              </p>
            </div>
            
            <div className="text-center">
              <h4 className="font-playfair font-semibold text-xl mb-3 text-vintage-gold">
                Holistic Health
              </h4>
              <p className="font-crimson leading-relaxed">
                True fitness encompasses not just physical strength, but mental resilience, emotional balance, and spiritual well-being.
              </p>
            </div>
          </div>
        </div>

        {/* Training Schedule */}
        <div className="bg-white rounded-lg shadow-xl border-4 border-vintage-gold/30 p-8 mb-12">
          <h3 className="font-playfair font-bold text-3xl text-vintage-deep-blue text-center mb-8">
            Weekly Training Schedule
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
              <div key={day} className="bg-vintage-warm-cream rounded-lg p-4 text-center border-2 border-vintage-gold/20">
                <h4 className="font-playfair font-semibold text-vintage-deep-blue mb-2">{day}</h4>
                <p className="font-crimson text-sm text-vintage-dark-brown">
                  {index % 2 === 0 ? 'Strength Training' : index === 6 ? 'Active Recovery' : 'Conditioning'}
                </p>
                <p className="font-crimson text-xs text-vintage-dark-brown mt-1">
                  {index === 6 ? '30 min' : '60 min'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-vintage-burgundy hover:bg-vintage-deep-blue text-vintage-warm-cream font-playfair font-semibold text-lg px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Begin Your Transformation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FitnessSection;
