
import React from 'react';
import { ArrowRight, Shield, TrendingUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onExploreServices: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onExploreServices }) => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-vintage-warm-cream via-white to-vintage-warm-cream">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="vintage-border h-full w-full"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Main heading */}
          <h1 className="font-playfair font-bold text-5xl md:text-7xl text-vintage-deep-blue mb-6 leading-tight">
            Welcome to
            <br />
            <span className="text-vintage-gold">Andrew Cares Village</span>
          </h1>

          {/* Subtitle */}
          <p className="font-crimson text-xl md:text-2xl text-vintage-dark-brown mb-8 leading-relaxed">
            Where tradition meets excellence in <em>Financial Mastery</em>, <em>Physical Strength</em>, and <em>Martial Discipline</em>
          </p>

          {/* Decorative divider */}
          <div className="w-32 h-1 bg-vintage-gold mx-auto mb-8 ornate-divider"></div>

          {/* Value propositions */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center p-6 bg-white/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <TrendingUp className="text-vintage-deep-blue mb-4" size={48} />
              <h3 className="font-playfair font-semibold text-xl text-vintage-deep-blue mb-2">
                Master the Markets
              </h3>
              <p className="font-crimson text-vintage-dark-brown text-center">
                Learn and master candle sticks pattern, market structure, and a tested strategy to build consistency in the market
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Heart className="text-vintage-burgundy mb-4" size={48} />
              <h3 className="font-playfair font-semibold text-xl text-vintage-deep-blue mb-2">
                Strengthen Your Body
              </h3>
              <p className="font-crimson text-vintage-dark-brown text-center">
                Build enduring strength through time-tested fitness methodologies
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Shield className="text-vintage-sage-green mb-4" size={48} />
              <h3 className="font-playfair font-semibold text-xl text-vintage-deep-blue mb-2">
                Train Your Mind
              </h3>
              <p className="font-crimson text-vintage-dark-brown text-center">
                Cultivate discipline and focus through traditional martial arts
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button
              onClick={onExploreServices}
              size="lg"
              className="bg-vintage-deep-blue hover:bg-vintage-burgundy text-vintage-gold font-playfair font-semibold text-lg px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Explore Our Services
              <ArrowRight className="ml-2" size={20} />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-vintage-gold text-vintage-deep-blue hover:bg-vintage-gold hover:text-vintage-deep-blue font-playfair font-semibold text-lg px-8 py-3 rounded-lg"
            >
              Begin Your Journey
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
