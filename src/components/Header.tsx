import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useNotifications } from '@/contexts/NotificationsContext';
import { User, LogOut, Menu, X, Bell, ShieldAlert, Zap } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import NotificationCenter from '@/components/NotificationCenter';
import Link from 'next/link';
import NavLink from '@/components/ui/nav-link';
import { cn } from '@/lib/utils';
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
  const { checkIfAdminEmail } = useAdminAuth();
  const {
    unreadCount,
    urgentCount,
    toggleNotificationCenter,
    showNotificationCenter,
    isLoading
  } = useNotifications();
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

  // Enhanced notification button with your existing styling
  const EnhancedNotificationButton = () => {
    const hasNotifications = unreadCount > 0;
    const hasUrgent = urgentCount > 0;

    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleNotificationCenter}
          aria-label={
            isLoading
              ? "Loading notifications..."
              : hasNotifications
                ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}${hasUrgent ? ` (${urgentCount} urgent)` : ''}`
                : "No new notifications"
          }
          className={cn(
            "rounded-full relative overflow-hidden group transition-all duration-200",
            showNotificationCenter && "bg-vintage-gold/20",
            hasUrgent && "animate-pulse"
          )}
        >
          <div className="relative">
            {hasUrgent ? (
              <Zap className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform" />
            ) : (
              <Bell className="h-5 w-5 text-vintage-deep-blue group-hover:scale-110 transition-transform" />
            )}
          </div>

          {/* Your existing hover effect */}
          <span className="absolute inset-0 rounded-full bg-vintage-gold/10 scale-0 group-hover:scale-100 transition-transform duration-300"></span>

          {/* Enhanced notification badge */}
          {hasNotifications && !isLoading && (
            <>
              <span className={cn(
                "absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium",
                hasUrgent
                  ? "bg-orange-500 animate-pulse shadow-lg shadow-orange-500/50"
                  : "bg-vintage-burgundy animate-pulse"
              )}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>

              {/* Additional urgent indicator */}
              {hasUrgent && (
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500/20 animate-ping"></div>
              )}
            </>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute -top-1 -right-1">
              <div className="h-2 w-2 bg-vintage-deep-blue rounded-full animate-pulse"></div>
            </div>
          )}

          {/* Connection indicator */}
          {!isLoading && (
            <div className="absolute -bottom-1 -right-1">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </div>
          )}
        </Button>

        {/* Urgent pulsing ring for extra attention */}
        {hasUrgent && !isLoading && (
          <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
            <div className="h-3 w-3 bg-orange-500 rounded-full animate-bounce shadow-lg">
              <div className="h-full w-full bg-orange-400 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
        )}

        <NotificationCenter />
      </div>
    );
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-vintage-warm-cream/95 backdrop-blur-sm border-b border-vintage-gold/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-vintage-deep-blue hover:text-vintage-burgundy transition-colors">
              Andrew Cares Village
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/forex-training">Forex Training</NavLink>
              <NavLink href="/fitness-training">Fitness Training</NavLink>
              <NavLink href="/karate-training">Karate Training</NavLink>
              {user && <NavLink href="/community">Community</NavLink>}
              {user && <NavLink href="/fitness-journey">My Journey</NavLink>}
            </nav>

            <div className="flex items-center space-x-4">
              {/* Search Bar - Hidden on mobile */}
              <div className="hidden md:block w-64">
                <SearchBar />
              </div>

              {/* Enhanced Notification Bell */}
              {user && <EnhancedNotificationButton />}

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
                      <Link href="/fitness-journey" className="w-full">
                        My Journey
                      </Link>
                    </DropdownMenuItem>
                    {/* Admin Access - Only visible to admin emails */}
                    {user.email && checkIfAdminEmail(user.email.toLowerCase()) && (
                      <DropdownMenuItem>
                        <Link href="/admin" className="w-full flex items-center">
                          <ShieldAlert className="h-4 w-4 mr-2 text-vintage-burgundy" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth">
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
      <div className={`fixed top-16 left-0 right-0 z-40 md:hidden bg-vintage-warm-cream border-t border-vintage-gold/20 transition-all duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}`}>
        <div className="container mx-auto px-4">
          {/* Mobile Search Bar */}
          <div className="mb-4">
            <SearchBar />
          </div>

          {/* Mobile Notification Summary (optional) */}
          {user && (unreadCount > 0 || urgentCount > 0) && (
            <div className="mb-4 p-3 bg-vintage-gold/10 rounded-lg border border-vintage-gold/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {urgentCount > 0 ? (
                    <Zap className="h-4 w-4 text-orange-500" />
                  ) : (
                    <Bell className="h-4 w-4 text-vintage-deep-blue" />
                  )}
                  <span className="text-sm font-medium">
                    {urgentCount > 0
                      ? `${urgentCount} urgent notification${urgentCount === 1 ? '' : 's'}`
                      : `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                    }
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    toggleNotificationCenter();
                    closeMobileMenu();
                  }}
                  className="text-xs"
                >
                  View All
                </Button>
              </div>
            </div>
          )}

          <nav className="flex flex-col space-y-4" role="navigation" aria-label="Mobile navigation">
            <NavLink href="/" onClick={closeMobileMenu}>Home</NavLink>
            <NavLink href="/forex-training" onClick={closeMobileMenu}>Forex Training</NavLink>
            <NavLink href="/fitness-training" onClick={closeMobileMenu}>Fitness Training</NavLink>
            <NavLink href="/karate-training" onClick={closeMobileMenu}>Karate Training</NavLink>
            {user && <NavLink href="/community" onClick={closeMobileMenu}>Community</NavLink>}
            {user && <NavLink href="/fitness-journey" onClick={closeMobileMenu}>My Journey</NavLink>}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
