import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { User, LogOut, Menu, X, Sun, Moon, Bell } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import NotificationCenter from '@/components/NotificationCenter';
import { Link } from 'react-router-dom';
import NavLink from '@/components/ui/nav-link';
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
  const { theme, toggleTheme } = useTheme();
  const { unreadCount, toggleNotificationCenter } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-vintage-warm-cream/95 backdrop-blur-sm border-b border-vintage-gold/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-vintage-forest-green hover:text-vintage-burgundy transition-colors">
              Andrew Cares Village
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/forex-training">Forex Training</NavLink>
              <NavLink to="/fitness-training">Fitness Training</NavLink>
              <NavLink to="/karate-training">Karate Training</NavLink>
              {user && <NavLink to="/fitness-journey">My Journey</NavLink>}
            </nav>

            <div className="flex items-center space-x-4">
              {/* Search Bar - Hidden on mobile */}
              <div className="hidden md:block w-64">
                <SearchBar />
              </div>

              {/* Notification Bell */}
              {user && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleNotificationCenter}
                    aria-label="Notifications"
                    className="rounded-full"
                  >
                    <Bell className="h-5 w-5 text-vintage-deep-blue" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-vintage-burgundy text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                  <NotificationCenter />
                </div>
              )}

              {/* Theme Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
                className="rounded-full"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5 text-vintage-gold" /> : <Moon className="h-5 w-5 text-vintage-deep-blue" />}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>

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

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 md:hidden bg-vintage-warm-cream border-t border-vintage-gold/20">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search Bar */}
            <div className="mb-4">
              <SearchBar />
            </div>

            <nav className="flex flex-col space-y-4">
              <NavLink to="/" onClick={closeMobileMenu}>Home</NavLink>
              <NavLink to="/forex-training" onClick={closeMobileMenu}>Forex Training</NavLink>
              <NavLink to="/fitness-training" onClick={closeMobileMenu}>Fitness Training</NavLink>
              <NavLink to="/karate-training" onClick={closeMobileMenu}>Karate Training</NavLink>
              {user && <NavLink to="/fitness-journey" onClick={closeMobileMenu}>My Journey</NavLink>}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;