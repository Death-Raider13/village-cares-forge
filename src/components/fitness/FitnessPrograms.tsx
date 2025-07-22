
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Clock, Target, Activity } from 'lucide-react';

interface FitnessProgram {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  program_type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  duration_weeks: number;
  description: string;
  created_at: string;
}

const FitnessPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<FitnessProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('fitness_programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching fitness programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strength': return <Target className="h-4 w-4" />;
      case 'cardio': return <Activity className="h-4 w-4" />;
      case 'flexibility': return <Clock className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading fitness programs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Fitness Programs</h2>
        <p className="text-muted-foreground">Structured training programs for all fitness levels</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <Card key={program.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getTypeIcon(program.program_type)}
                  {program.name}
                </CardTitle>
                <Badge className={getLevelColor(program.level)}>
                  {program.level}
                </Badge>
              </div>
              <CardDescription>{program.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {program.duration_weeks} weeks
                </span>
                <span className="capitalize font-medium">
                  {program.program_type}
                </span>
              </div>
              <Button className="w-full" disabled={!user}>
                {user ? 'Start Program' : 'Sign in to Start'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FitnessPrograms;
