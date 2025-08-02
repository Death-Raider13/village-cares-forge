
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { sanitizeInput } from '@/lib/security';
import { Award, Plus } from 'lucide-react';

interface MartialArtsRank {
  id: string;
  discipline: string;
  rank_name: string;
  rank_level: number;
  date_achieved: string;
  instructor: string;
  created_at: string;
}

const MartialArtsTracker: React.FC = () => {
  const [ranks, setRanks] = useState<MartialArtsRank[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    discipline: '',
    rank_name: '',
    rank_level: '',
    date_achieved: '',
    instructor: '',
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchRanks();
    }
  }, [user]);

  const fetchRanks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('martial_arts_ranks')
        .select('*')
        .eq('user_id', user.id)
        .order('date_achieved', { ascending: false });

      if (error) throw error;
      setRanks(data || []);
    } catch (error) {
      console.error('Error fetching ranks:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Input validation and sanitization
      const sanitizedDiscipline = sanitizeInput(formData.discipline);
      const sanitizedRankName = sanitizeInput(formData.rank_name);
      const sanitizedInstructor = formData.instructor ? sanitizeInput(formData.instructor) : '';
      
      if (!sanitizedDiscipline || !sanitizedRankName || !formData.rank_level || !formData.date_achieved) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      const rankLevel = parseInt(formData.rank_level);
      if (isNaN(rankLevel) || rankLevel < 1 || rankLevel > 20) {
        toast({
          title: "Invalid rank level",
          description: "Rank level must be a number between 1 and 20.",
          variant: "destructive",
        });
        return;
      }

      const dateAchieved = new Date(formData.date_achieved);
      if (dateAchieved > new Date()) {
        toast({
          title: "Invalid date",
          description: "Date achieved cannot be in the future.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('martial_arts_ranks')
        .insert({
          user_id: user.id,
          discipline: sanitizedDiscipline,
          rank_name: sanitizedRankName,
          rank_level: rankLevel,
          date_achieved: formData.date_achieved,
          instructor: sanitizedInstructor,
        });

      if (error) throw error;

      toast({
        title: "Rank added!",
        description: `Your ${sanitizedRankName} in ${sanitizedDiscipline} has been recorded.`,
      });

      setFormData({
        discipline: '',
        rank_name: '',
        rank_level: '',
        date_achieved: '',
        instructor: '',
      });
      setShowForm(false);
      fetchRanks();
    } catch (error: any) {
      toast({
        title: "Failed to add rank",
        description: "Unable to save your rank. Please try again.",
        variant: "destructive",
      });
      console.error('Error adding rank:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please sign in to track your martial arts progress.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Martial Arts Progress</h2>
          <p className="text-muted-foreground">Track your belt rankings and achievements</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rank
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Rank</CardTitle>
            <CardDescription>Record your latest martial arts achievement</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discipline">Discipline</Label>
                  <Select
                    value={formData.discipline}
                    onValueChange={(value) => setFormData({ ...formData, discipline: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select discipline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="karate">Karate</SelectItem>
                      <SelectItem value="taekwondo">Taekwondo</SelectItem>
                      <SelectItem value="judo">Judo</SelectItem>
                      <SelectItem value="bjj">Brazilian Jiu-Jitsu</SelectItem>
                      <SelectItem value="muay-thai">Muay Thai</SelectItem>
                      <SelectItem value="kung-fu">Kung Fu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rank_name">Rank/Belt</Label>
                  <Input
                    id="rank_name"
                    value={formData.rank_name}
                    onChange={(e) => setFormData({ ...formData, rank_name: e.target.value })}
                    placeholder="e.g., Black Belt, Brown Belt"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rank_level">Rank Level</Label>
                  <Input
                    id="rank_level"
                    type="number"
                    value={formData.rank_level}
                    onChange={(e) => setFormData({ ...formData, rank_level: e.target.value })}
                    placeholder="e.g., 1, 2, 3"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_achieved">Date Achieved</Label>
                  <Input
                    id="date_achieved"
                    type="date"
                    value={formData.date_achieved}
                    onChange={(e) => setFormData({ ...formData, date_achieved: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  placeholder="Name of your instructor"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Rank'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ranks.map((rank) => (
          <Card key={rank.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                {rank.rank_name}
              </CardTitle>
              <CardDescription className="capitalize">{rank.discipline}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <strong>Level:</strong> {rank.rank_level}
              </div>
              <div className="text-sm">
                <strong>Achieved:</strong> {new Date(rank.date_achieved).toLocaleDateString()}
              </div>
              {rank.instructor && (
                <div className="text-sm">
                  <strong>Instructor:</strong> {rank.instructor}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {ranks.length === 0 && (
        <div className="text-center py-8">
          <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No ranks recorded yet. Add your first achievement!</p>
        </div>
      )}
    </div>
  );
};

export default MartialArtsTracker;
