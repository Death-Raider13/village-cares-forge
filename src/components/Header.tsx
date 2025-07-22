
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import AuthModal from '@/components/auth/AuthModal';
import { User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onSectionChange }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-vintage-warm-cream/95 backdrop-blur-sm border-b border-vintage-gold/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-vintage-forest-green">
            Andrew Cares Village
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onSectionChange('home')}
              className={`text-lg font-medium transition-colors hover:text-vintage-forest-green ${
                activeSection === 'home' ? 'text-vintage-forest-green' : 'text-vintage-forest-green/70'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => onSectionChange('forex')}
              className={`text-lg font-medium transition-colors hover:text-vintage-forest-green ${
                activeSection === 'forex' ? 'text-vintage-forest-green' : 'text-vintage-forest-green/70'
              }`}
            >
              Forex Trading
            </button>
            <button 
              onClick={() => onSectionChange('fitness')}
              className={`text-lg font-medium transition-colors hover:text-vintage-forest-green ${
                activeSection === 'fitness' ? 'text-vintage-forest-green' : 'text-vintage-forest-green/70'
              }`}
            >
              Fitness Training
            </button>
            <button 
              onClick={() => onSectionChange('martial-arts')}
              className={`text-lg font-medium transition-colors hover:text-vintage-forest-green ${
                activeSection === 'martial-arts' ? 'text-vintage-forest-green' : 'text-vintage-forest-green/70'
              }`}
            >
              Martial Arts
            </button>
            {user && (
              <button 
                onClick={() => onSectionChange('dashboard')}
                className={`text-lg font-medium transition-colors hover:text-vintage-forest-green ${
                  activeSection === 'dashboard' ? 'text-vintage-forest-green' : 'text-vintage-forest-green/70'
                }`}
              >
                Dashboard
              </button>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onSectionChange('dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setAuthModalOpen(true)}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </header>
  );
};

export default Header;
