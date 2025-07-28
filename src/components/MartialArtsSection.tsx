
import React from 'react';
import { Zap, Shield, Swords, Mountain, Flame, TreePine, Link } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MartialArtsSection: React.FC = () => {
  const disciplines = [
    {
      icon: Swords,
      title: 'Classical Karate',
      description: 'Traditional Shotokan and Kyokushin training focusing on kata, kumite, and spiritual development',
      belt: 'White to Black Belt'
    },
    {
      icon: Mountain,
      title: 'Taekwondo',
      description: 'Korean martial art emphasizing high kicks, jumping techniques, and mental discipline',
      belt: 'Gup to Dan ranking'
    },
    {
      icon: TreePine,
      title: 'Kung Fu',
      description: 'Ancient Chinese martial arts incorporating animal forms, breathing techniques, and meditation',
      belt: 'Sash progression'
    },
    {
      icon: Shield,
      title: 'Jiu-Jitsu',
      description: 'Ground fighting and grappling arts focusing on leverage, technique, and strategic thinking',
      belt: 'White to Black Belt'
    },
    {
      icon: Flame,
      title: 'Muay Thai',
      description: 'The art of eight limbs combining strikes, clinch work, and traditional Thai conditioning',
      belt: 'Mongkol & Prajioud'
    },
    {
      icon: Zap,
      title: 'Mixed Martial Arts',
      description: 'Integration of all fighting disciplines for complete martial arts mastery',
      belt: 'Skill-based levels'
    }
  ];

  const philosophies = [
    {
      title: 'Respect & Humility',
      description: 'Honor your teachers, training partners, and the traditions that came before you'
    },
    {
      title: 'Discipline & Perseverance',
      description: 'Consistent training and mental fortitude overcome natural talent and raw aggression'
    },
    {
      title: 'Mind, Body & Spirit',
      description: 'True martial arts training develops the complete person, not just fighting ability'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-vintage-warm-cream to-vintage-dark-brown/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <Zap className="text-vintage-sage-green mb-4" size={64} />
          </div>
          
          <h2 className="font-playfair font-bold text-4xl md:text-5xl text-vintage-deep-blue mb-6">
            Martial Arts Mastery
          </h2>
          
          <div className="w-24 h-1 bg-vintage-gold mx-auto mb-6 ornate-divider"></div>
          
          <p className="font-crimson text-xl text-vintage-dark-brown max-w-3xl mx-auto leading-relaxed">
            Walk the path of the warrior through ancient martial traditions that have been refined 
            over centuries. Our dojo preserves the classical teachings while adapting to modern 
            training methods, creating complete martial artists of mind, body, and spirit.
          </p>
        </div>

        {/* Disciplines Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {disciplines.map((discipline, index) => {
            const Icon = discipline.icon;
            return (
              <Card key={index} className="bg-white/90 border-2 border-vintage-sage-green/20 hover:border-vintage-sage-green/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-vintage-sage-green rounded-full w-fit">
                    <Icon className="text-vintage-warm-cream" size={32} />
                  </div>
                  <CardTitle className="font-playfair text-xl text-vintage-deep-blue">
                    {discipline.title}
                  </CardTitle>
                  <CardDescription className="font-crimson text-vintage-gold font-semibold">
                    {discipline.belt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-crimson text-vintage-dark-brown text-center leading-relaxed">
                    {discipline.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dojo Philosophy */}
        <div className="bg-gradient-to-r from-vintage-sage-green to-vintage-deep-blue rounded-lg shadow-xl p-8 mb-12 text-vintage-warm-cream">
          <div className="text-center mb-8">
            <h3 className="font-playfair font-bold text-3xl mb-4">
              The Way of the Dojo
            </h3>
            <div className="w-20 h-1 bg-vintage-gold mx-auto mb-6"></div>
            <p className="font-crimson text-lg max-w-2xl mx-auto leading-relaxed">
              "The ultimate aim of martial arts is not having to use them" - Ancient Proverb
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {philosophies.map((philosophy, index) => (
              <div key={index} className="text-center">
                <h4 className="font-playfair font-semibold text-xl mb-3 text-vintage-gold">
                  {philosophy.title}
                </h4>
                <p className="font-crimson leading-relaxed">
                  {philosophy.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Training Levels */}
        <div className="bg-white rounded-lg shadow-xl border-4 border-vintage-gold/30 p-8 mb-12">
          <h3 className="font-playfair font-bold text-3xl text-vintage-deep-blue text-center mb-8">
            Path of Progression
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-vintage-warm-cream rounded-lg border-2 border-vintage-sage-green/30">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-vintage-dark-brown">初</span>
              </div>
              <h4 className="font-playfair font-semibold text-xl text-vintage-deep-blue mb-3">
                Beginner (Shoshinsha)
              </h4>
              <p className="font-crimson text-vintage-dark-brown">
                Learn fundamental stances, basic techniques, and dojo etiquette. Build flexibility and basic conditioning.
              </p>
            </div>
            
            <div className="text-center p-6 bg-vintage-warm-cream rounded-lg border-2 border-vintage-gold/50">
              <div className="w-16 h-16 bg-vintage-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-vintage-deep-blue">中</span>
              </div>
              <h4 className="font-playfair font-semibold text-xl text-vintage-deep-blue mb-3">
                Intermediate (Chukyusha)
              </h4>
              <p className="font-crimson text-vintage-dark-brown">
                Master advanced combinations, sparring techniques, and begin teaching junior students. Develop fighting strategy.
              </p>
            </div>
            
            <div className="text-center p-6 bg-vintage-warm-cream rounded-lg border-2 border-vintage-deep-blue/50">
              <div className="w-16 h-16 bg-vintage-deep-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-vintage-gold">上</span>
              </div>
              <h4 className="font-playfair font-semibold text-xl text-vintage-deep-blue mb-3">
                Advanced (Jokyusha)
              </h4>
              <p className="font-crimson text-vintage-dark-brown">
                Embody the martial way, mentor others, and contribute to the preservation of traditional techniques and philosophy.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          ) : (
           <Link to="/BeginJourneyModal"> 
          <Button 
            size="lg"
            className="bg-vintage-sage-green hover:bg-vintage-deep-blue text-vintage-warm-cream font-playfair font-semibold text-lg px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Begin Your Martial Journey
          </Button>
          </Link>
          )
        </div>
      </div>
    </section>
  );
};

export default MartialArtsSection;
