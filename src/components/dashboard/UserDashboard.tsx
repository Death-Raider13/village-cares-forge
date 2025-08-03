
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Calendar, Clock, TrendingUp, Award, Activity, BookOpen } from 'lucide-react';
import StatsCards from './StatsCards';
import ProgressChart from './ProgressChart';

interface DashboardData {
  bookings: any[];
  recentSessions: any[];
  ranks: any[];
}

const UserDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    bookings: [],
    recentSessions: [],
    ranks: [],
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      const [bookingsResponse, sessionsResponse, ranksResponse] = await Promise.all([
        supabase
          .from('bookings')
          .select(`
            *,
            services (name, category)
          `)
          .eq('user_id', user.id)
          .order('booking_date', { ascending: true })
          .limit(10),
        
        supabase
          .from('training_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('session_date', { ascending: false })
          .limit(10),
        
        supabase
          .from('martial_arts_ranks')
          .select('*')
          .eq('user_id', user.id)
          .order('date_achieved', { ascending: false })
          .limit(5),
      ]);

      setData({
        bookings: bookingsResponse.data || [],
        recentSessions: sessionsResponse.data || [],
        ranks: ranksResponse.data || [],
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookingClick = (booking: any) => {
    setSelectedBooking(booking);
  };

  const handleSessionClick = (session: any) => {
    setSelectedSession(session);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vintage-warm-cream to-vintage-sage-green/10 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-4">Welcome to Andrew Cares Village</h2>
            <p className="text-muted-foreground mb-6">Please sign in to access your personalized dashboard and training programs.</p>
            <Button className="w-full">Sign In to Continue</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vintage-warm-cream to-vintage-sage-green/10 p-8">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-10 w-1/4" />
              </Card>
            ))}
          </div>

          {/* Main Content Skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-8 w-2/3 mb-4" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Actions Skeleton */}
          <Card className="mt-8 p-6">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </Card>

          {/* Motivational Quote Skeleton */}
          <Card className="mt-8 p-6">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-1/3 mx-auto" />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-warm-cream to-vintage-sage-green/10">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="font-playfair text-4xl font-bold text-vintage-deep-blue mb-2">
            Welcome back, {user.email?.split('@')[0]}!
          </h1>
          <p className="font-crimson text-xl text-vintage-dark-brown/80">
            Continue your journey of growth and excellence at Andrew Cares Village
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards data={data} />

        {/* Progress Charts */}
        {data.recentSessions.length > 0 && <ProgressChart data={data} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Bookings */}
          <Card className="hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                <Calendar className="h-5 w-5" />
                Upcoming Bookings
              </CardTitle>
              <CardDescription>Your scheduled training sessions and appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.bookings.length > 0 ? (
                data.bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <p className="font-semibold text-vintage-deep-blue">{booking.services?.name || 'Training Session'}</p>
                      <p className="text-sm text-vintage-dark-brown/70 font-crimson">
                        {new Date(booking.booking_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-vintage-dark-brown/50 capitalize">
                        {booking.services?.category} Training
                      </p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-vintage-dark-brown/30" />
                  <p className="text-vintage-dark-brown/60 font-crimson">No upcoming bookings</p>
                  <p className="text-sm text-vintage-dark-brown/50">Book a session to get started</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Training Sessions */}
          <Card className="hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                <Clock className="h-5 w-5" />
                Recent Sessions
              </CardTitle>
              <CardDescription>Your latest training activities and progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.recentSessions.length > 0 ? (
                data.recentSessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleSessionClick(session)}>
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-vintage-deep-blue">{session.title}</p>
                      {session.completed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-vintage-dark-brown/70 font-crimson capitalize mb-1">
                      {session.session_type} • {session.duration_minutes}min
                    </p>
                    <p className="text-xs text-vintage-dark-brown/50">
                      {new Date(session.session_date).toLocaleDateString()}
                    </p>
                    {session.description && (
                      <p className="text-xs text-vintage-dark-brown/60 mt-2 line-clamp-2">
                        {session.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-vintage-dark-brown/30" />
                  <p className="text-vintage-dark-brown/60 font-crimson">No recent sessions</p>
                  <p className="text-sm text-vintage-dark-brown/50">Start your first training session</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Martial Arts Achievements */}
          <Card className="hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                <Award className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
              <CardDescription>Your martial arts ranks and accomplishments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.ranks.length > 0 ? (
                data.ranks.map((rank) => (
                  <div key={rank.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-vintage-gold rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-vintage-deep-blue" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-vintage-deep-blue">{rank.rank_name}</p>
                        <p className="text-sm text-vintage-dark-brown/70 font-crimson capitalize">
                          {rank.discipline}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-vintage-dark-brown/50">
                      Achieved: {new Date(rank.date_achieved).toLocaleDateString()}
                    </p>
                    {rank.instructor && (
                      <p className="text-xs text-vintage-dark-brown/60 mt-1">
                        Instructor: {rank.instructor}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 mx-auto mb-4 text-vintage-dark-brown/30" />
                  <p className="text-vintage-dark-brown/60 font-crimson">No achievements yet</p>
                  <p className="text-sm text-vintage-dark-brown/50">Start training to earn your first rank</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
        <Card className="mt-8 hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-playfair text-vintage-deep-blue">Explore Your Training Programs</CardTitle>
            <CardDescription>Access comprehensive training in forex, fitness, and martial arts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group">
                <Button 
                  variant="outline" 
                  className="h-auto p-6 flex flex-col items-center gap-4 w-full hover:shadow-lg transition-all duration-300 hover:border-vintage-gold border-2"
                  onClick={() => window.location.href = '/forex-trading'}
                >
                  <div className="p-4 rounded-full bg-vintage-deep-blue/5 group-hover:bg-vintage-deep-blue/10 transition-colors">
                    <TrendingUp className="h-8 w-8 text-vintage-deep-blue" />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold text-vintage-deep-blue block mb-1">Professional Forex Trading</span>
                    <span className="text-sm text-vintage-dark-brown/70">Live signals, analysis & education</span>
                  </div>
                </Button>
              </div>
              
              <div className="group">
                <Button 
                  variant="outline" 
                  className="h-auto p-6 flex flex-col items-center gap-4 w-full hover:shadow-lg transition-all duration-300 hover:border-vintage-gold border-2"
                  onClick={() => window.location.href = '/fitness-training'}
                >
                  <div className="p-4 rounded-full bg-vintage-burgundy/5 group-hover:bg-vintage-burgundy/10 transition-colors">
                    <Activity className="h-8 w-8 text-vintage-burgundy" />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold text-vintage-burgundy block mb-1">Fitness Training</span>
                    <span className="text-sm text-vintage-dark-brown/70">Personalized programs for all levels</span>
                  </div>
                </Button>
              </div>
              
              <div className="group">
                <Button 
                  variant="outline" 
                  className="h-auto p-6 flex flex-col items-center gap-4 w-full hover:shadow-lg transition-all duration-300 hover:border-vintage-gold border-2"
                  onClick={() => window.location.href = '/karate-training'}
                >
                  <div className="p-4 rounded-full bg-vintage-gold/10 group-hover:bg-vintage-gold/20 transition-colors">
                    <Award className="h-8 w-8 text-vintage-gold" />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold text-vintage-gold block mb-1">Karate Training</span>
                    <span className="text-sm text-vintage-dark-brown/70">Traditional martial arts & philosophy</span>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivational Quote */}
        <Card className="mt-8 bg-gradient-to-r from-vintage-gold/10 to-vintage-burgundy/10 border-vintage-gold/30">
          <CardContent className="text-center py-8">
            <blockquote className="font-playfair text-2xl text-vintage-deep-blue italic mb-4">
              "The journey of a thousand miles begins with one step."
            </blockquote>
            <p className="font-crimson text-vintage-dark-brown/70">
              Ancient Chinese Proverb
            </p>
          </CardContent>
        </Card>
      </div>
    </div>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedBooking?.services?.name || 'Booking Details'}</DialogTitle>
            <DialogDescription>
              Detailed information about your upcoming booking.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-gray-700">Service:</p>
                <p className="col-span-3 text-sm text-gray-900">{selectedBooking.services?.name || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-gray-700">Category:</p>
                <p className="col-span-3 text-sm text-gray-900 capitalize">{selectedBooking.services?.category || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-gray-700">Date:</p>
                <p className="col-span-3 text-sm text-gray-900">
                  {new Date(selectedBooking.booking_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                  })}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-gray-700">Status:</p>
                <Badge className={getStatusColor(selectedBooking.status)}>
                  {selectedBooking.status}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Session Details Dialog */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedSession?.title || 'Session Details'}</DialogTitle>
            <DialogDescription>
              Detailed information about your recent training session.
            </DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-gray-700">Title:</p>
                <p className="col-span-3 text-sm text-gray-900">{selectedSession.title || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-gray-700">Type:</p>
                <p className="col-span-3 text-sm text-gray-900 capitalize">{selectedSession.session_type || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-gray-700">Duration:</p>
                <p className="col-span-3 text-sm text-gray-900">{selectedSession.duration_minutes} minutes</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-gray-700">Date:</p>
                <p className="col-span-3 text-sm text-gray-900">
                  {new Date(selectedSession.session_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              {selectedSession.description && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <p className="text-sm font-medium text-gray-700">Notes:</p>
                  <p className="col-span-3 text-sm text-gray-900">{selectedSession.description}</p>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-gray-700">Completed:</p>
                <Badge className={selectedSession.completed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {selectedSession.completed ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
