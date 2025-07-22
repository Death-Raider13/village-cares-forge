
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Calendar, Clock, TrendingUp, Award } from 'lucide-react';

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
          .limit(5),
        
        supabase
          .from('training_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('session_date', { ascending: false })
          .limit(5),
        
        supabase
          .from('martial_arts_ranks')
          .select('*')
          .eq('user_id', user.id)
          .order('date_achieved', { ascending: false })
          .limit(3),
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

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">Here's your progress at Andrew Cares Village</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Bookings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.bookings.length > 0 ? (
              data.bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{booking.services?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No upcoming bookings</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Training Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentSessions.length > 0 ? (
              data.recentSessions.map((session) => (
                <div key={session.id} className="p-2 border rounded">
                  <p className="font-medium">{session.title}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {session.session_type} • {session.duration_minutes}min
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(session.session_date).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No recent sessions</p>
            )}
          </CardContent>
        </Card>

        {/* Martial Arts Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.ranks.length > 0 ? (
              data.ranks.map((rank) => (
                <div key={rank.id} className="p-2 border rounded">
                  <p className="font-medium">{rank.rank_name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {rank.discipline}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(rank.date_achieved).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No achievements yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with your training journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              <span>View Forex Signals</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Clock className="h-6 w-6" />
              <span>Book Training Session</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Award className="h-6 w-6" />
              <span>Track Progress</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
