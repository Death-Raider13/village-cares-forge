
import React from 'react';
import { TrendingUp, BarChart3, PieChart, Calculator, BookOpen, Users, Link } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ForexSection: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Advanced Market Analysis',
      description: 'Master the art of technical and fundamental analysis with time-tested methodologies'
    },
    {
      icon: PieChart,
      title: 'Portfolio Management',
      description: 'Learn classical risk management strategies refined through decades of market wisdom'
    },
    {
      icon: Calculator,
      title: 'Trading Calculators',
      description: 'Precision tools for calculating risk, reward, and position sizing with mathematical accuracy'
    },
    {
      icon: BookOpen,
      title: 'Educational Resources',
      description: 'Comprehensive library of trading knowledge from market veterans and historical masters'
    },
    {
      icon: Users,
      title: 'Mentorship Program',
      description: 'Personal guidance from experienced traders who have weathered all market conditions'
    },
    {
      icon: TrendingUp,
      title: 'Live Trading Room',
      description: 'Real-time market analysis and trading discussions in our exclusive community'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-vintage-warm-cream to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <TrendingUp className="text-vintage-deep-blue mb-4" size={64} />
          </div>
          
          <h2 className="font-playfair font-bold text-4xl md:text-5xl text-vintage-deep-blue mb-6">
            Forex Trading Mastery
          </h2>
          
          <div className="w-24 h-1 bg-vintage-gold mx-auto mb-6 ornate-divider"></div>
          
          <p className="font-crimson text-xl text-vintage-dark-brown max-w-3xl mx-auto leading-relaxed">
            Navigate the global currency markets with the wisdom of traditional trading principles 
            combined with cutting-edge analytical tools. Our platform honors the classical approach 
            to financial markets while embracing modern technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="bg-white/80 border-2 border-vintage-gold/20 hover:border-vintage-gold/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-vintage-deep-blue rounded-full w-fit">
                    <Icon className="text-vintage-gold" size={32} />
                  </div>
                  <CardTitle className="font-playfair text-xl text-vintage-deep-blue">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-crimson text-vintage-dark-brown text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trading Platform Preview */}
        <div className="bg-white rounded-lg shadow-xl border-4 border-vintage-gold/30 p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="font-playfair font-bold text-3xl text-vintage-deep-blue mb-4">
              Our Trading Platform
            </h3>
            <p className="font-crimson text-lg text-vintage-dark-brown">
              Experience the elegance of traditional design meets modern functionality
            </p>
          </div>
          
          {/* Simulated trading interface */}
          <div className="bg-vintage-deep-blue rounded-lg p-6 text-vintage-gold">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-vintage-warm-cream/10 rounded-lg p-4 text-center">
                <h4 className="font-playfair font-semibold mb-2">EUR/USD</h4>
                <p className="text-2xl font-bold text-vintage-gold">1.0847</p>
                <p className="text-sm text-green-400">+0.0023 (+0.21%)</p>
              </div>
              <div className="bg-vintage-warm-cream/10 rounded-lg p-4 text-center">
                <h4 className="font-playfair font-semibold mb-2">GBP/USD</h4>
                <p className="text-2xl font-bold text-vintage-gold">1.2341</p>
                <p className="text-sm text-red-400">-0.0056 (-0.45%)</p>
              </div>
              <div className="bg-vintage-warm-cream/10 rounded-lg p-4 text-center">
                <h4 className="font-playfair font-semibold mb-2">USD/JPY</h4>
                <p className="text-2xl font-bold text-vintage-gold">149.82</p>
                <p className="text-sm text-green-400">+0.34 (+0.23%)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          ) : (
          <Link to="/TradingAcademyModal">
          <Button 
            size="lg"
            className="bg-vintage-deep-blue hover:bg-vintage-burgundy text-vintage-gold font-playfair font-semibold text-lg px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Your Trading Journey
          </Button>
          </Link>
          )
        </div>
      </div>
    </section>
  );
};

export default ForexSection;
