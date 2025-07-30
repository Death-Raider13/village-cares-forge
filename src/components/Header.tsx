
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onSectionChange }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-vintage-warm-cream/95 backdrop-blur-sm border-b border-vintage-gold/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-vintage-forest-green hover:text-vintage-burgundy transition-colors">
            Andrew Cares Village
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/"
              className={`text-lg font-medium transition-colors hover:text-vintage-forest-green ${
                isActive('/') ? 'text-vintage-forest-green' : 'text-vintage-forest-green/70'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/forex-trading"
              className={`text-lg font-medium transition-colors hover:text-vintage-forest-green ${
                isActive('/forex-trading') ? 'text-vintage-forest-green' : 'text-vintage-forest-green/70'
              }`}
            >
              Forex Training
            </Link>
            <Link 
              to="/fitness-training"
              className={`text-lg font-medium transition-colors hover:text-vintage-forest-green ${
                isActive('/fitness-training') ? 'text-vintage-forest-green' : 'text-vintage-forest-green/70'
              }`}
            >
              Fitness Training
            </Link>
            <Link 
              to="/karate-training"
              className={`text-lg font-medium transition-colors hover:text-vintage-forest-green ${
                isActive('/karate-training') ? 'text-vintage-forest-green' : 'text-vintage-forest-green/70'
              }`}
            >
              Karate Training
            </Link>
            {user && (
              <Link 
                to="/fitness-journey"
                className={`text-lg font-medium transition-colors hover:text-vintage-forest-green ${
                  isActive('/fitness-journey') ? 'text-vintage-forest-green' : 'text-vintage-forest-green/70'
                }`}
              >
                My Journey
              </Link>
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
                  <DropdownMenuItem>
                    <Link to="/fitness-journey" className="w-full">
                      My Journey
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button>
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
