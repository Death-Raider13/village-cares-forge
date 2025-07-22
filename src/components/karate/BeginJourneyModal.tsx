
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Zap, Shield, Heart, Target, Star, BookOpen } from 'lucide-react';

interface BeginJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BeginJourneyModal: React.FC<BeginJourneyModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    experience_level: '',
    goals: '',
    preferred_schedule: '',
    discipline: 'karate',
  });
  const { user } = useAuth();

  const belts = [
    { name: 'White Belt', description: 'Beginning of the journey', color: 'bg-white border-2', icon: Star },
    { name: 'Yellow Belt', description: 'First rays of knowledge', color: 'bg-yellow-400', icon: Zap },
    { name: 'Orange Belt', description: 'Growing strength', color: 'bg-orange-400', icon: Shield },
    { name: 'Green Belt', description: 'Flourishing skills', color: 'bg-green-500', icon: Heart },
    { name: 'Blue Belt', description: 'Deepening understanding', color: 'bg-blue-500', icon: Target },
    { name: 'Brown Belt', description: 'Advanced practitioner', color: 'bg-amber-800', icon: BookOpen },
    { name: 'Black Belt', description: 'Master level', color: 'bg-black', icon: Star },
  ];

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to begin your journey');
      return;
    }

    try {
      const { error } = await supabase
        .from('training_sessions')
        .insert({
          user_id: user.id,
          title: 'Karate Journey Begins',
          description: `Starting karate journey with ${formData.experience_level} experience level. Goals: ${formData.goals}`,
          session_type: 'karate',
          duration_minutes: 60,
          completed: false,
        });

      if (error) throw error;

      toast.success('Your karate journey has begun! Welcome to the dojo.');
      onClose();
    } catch (error) {
      console.error('Error starting journey:', error);
      toast.error('Failed to start journey. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Begin Your Karate Journey</DialogTitle>
          <DialogDescription>
            Embark on a transformative martial arts experience rooted in tradition and discipline
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Understanding the Belt System</h3>
              <p className="text-muted-foreground mb-6">
                Each belt represents a milestone in your martial arts journey, embodying not just technique but character development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {belts.map((belt, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${belt.color} flex items-center justify-center`}>
                        <belt.icon className={`h-4 w-4 ${belt.color.includes('black') ? 'text-white' : 'text-gray-800'}`} />
                      </div>
                      <CardTitle className="text-lg">{belt.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{belt.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Button onClick={() => setStep(2)} size="lg" className="px-8">
                Continue Your Journey
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Personalize Your Training</h3>
              <p className="text-muted-foreground">
                Tell us about yourself so we can create the perfect training path for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select value={formData.experience_level} onValueChange={(value) => setFormData({...formData, experience_level: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Complete Beginner</SelectItem>
                    <SelectItem value="some_experience">Some Martial Arts Experience</SelectItem>
                    <SelectItem value="intermediate">Intermediate Level</SelectItem>
                    <SelectItem value="advanced">Advanced Practitioner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Preferred Schedule</Label>
                <Select value={formData.preferred_schedule} onValueChange={(value) => setFormData({...formData, preferred_schedule: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select training frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2_times">1-2 times per week</SelectItem>
                    <SelectItem value="3-4_times">3-4 times per week</SelectItem>
                    <SelectItem value="5+_times">5+ times per week</SelectItem>
                    <SelectItem value="flexible">Flexible schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="goals">Your Goals</Label>
                <Input
                  id="goals"
                  placeholder="e.g., Self-defense, fitness, discipline, competition..."
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={!formData.experience_level || !formData.preferred_schedule}>
                Begin Journey
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BeginJourneyModal;
