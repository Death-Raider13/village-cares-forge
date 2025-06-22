
import React from 'react';
import { TrendingUp, Dumbbell, Zap, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onSectionChange }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: null },
    { id: 'forex', label: 'Forex Trading', icon: TrendingUp },
    { id: 'fitness', label: 'Fitness Training', icon: Dumbbell },
    { id: 'martial-arts', label: 'Martial Arts', icon: Zap },
  ];

  return (
    <header className="bg-vintage-warm-cream shadow-lg border-b-4 border-vintage-gold sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-vintage-deep-blue rounded-full flex items-center justify-center">
              <span className="text-vintage-gold font-playfair font-bold text-xl">AC</span>
            </div>
            <div>
              <h1 className="font-playfair font-bold text-2xl text-vintage-deep-blue">
                Andrew Cares Village
              </h1>
              <p className="text-sm text-vintage-dark-brown italic">
                Master • Strengthen • Transform
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-crimson text-lg ${
                    activeSection === item.id
                      ? 'bg-vintage-deep-blue text-vintage-gold shadow-md'
                      : 'text-vintage-dark-brown hover:bg-vintage-gold hover:text-vintage-deep-blue'
                  }`}
                >
                  {Icon && <Icon size={20} />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-vintage-gold animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSectionChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 font-crimson text-lg ${
                      activeSection === item.id
                        ? 'bg-vintage-deep-blue text-vintage-gold'
                        : 'text-vintage-dark-brown hover:bg-vintage-gold hover:text-vintage-deep-blue'
                    }`}
                  >
                    {Icon && <Icon size={20} />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
