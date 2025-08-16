import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Dumbbell, Heart, Target, Zap, Clock, Trophy } from 'lucide-react';
import { useRouter } from 'next/router';

interface StartJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StartJourneyModal: React.FC<StartJourneyModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fitness_level: '',
    goals: [],
    workout_frequency: '',
    preferred_duration: '',
    available_equipment: [],
    health_conditions: '',
  });
  const { user } = useAuth();
  const router = useRouter();

  const fitnessGoals = [
    { id: 'weight_loss', label: 'Weight Loss', icon: Target },
    { id: 'muscle_gain', label: 'Muscle Building', icon: Dumbbell },
    { id: 'endurance', label: 'Cardiovascular Health', icon: Heart },
    { id: 'strength', label: 'Strength Training', icon: Zap },
    { id: 'flexibility', label: 'Flexibility & Mobility', icon: Clock },
    { id: 'general', label: 'General Fitness', icon: Trophy },
  ];

  const equipment = [
    'Dumbbells', 'Resistance Bands', 'Yoga Mat', 'Pull-up Bar',
    'Kettlebells', 'Exercise Ball', 'Jump Rope', 'No Equipment'
  ];

  const handleGoalChange = (goalId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      goals: checked
        ? [...prev.goals, goalId]
        : prev.goals.filter(g => g !== goalId)
    }));
  };

  const handleEquipmentChange = (equipmentItem: string, checked: boolean | string) => {
    const isChecked = checked === true;
    setFormData(prev => ({
      ...prev,
      available_equipment: isChecked
        ? [...prev.available_equipment, equipmentItem]
        : prev.available_equipment.filter(e => e !== equipmentItem)
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to start your fitness journey');
      return;
    }

    try {
      const { error } = await supabase
        .from('training_sessions')
        .insert({
          user_id: user.id,
          title: 'Fitness Journey Begins',
          description: `Starting fitness journey with ${formData.fitness_level} level. Goals: ${formData.goals.join(', ')}. Frequency: ${formData.workout_frequency}. Equipment: ${formData.available_equipment.join(', ')}`,
          session_type: 'fitness',
          duration_minutes: parseInt(formData.preferred_duration) || 30,
          completed: false,
        });

      if (error) throw error;

      toast.success('Your fitness journey has started! Redirecting to your personalized dashboard...');
      onClose();

      // Redirect to fitness journey page
      router.push('/fitness-journey');

    } catch (error) {
      console.error('Error starting journey:', error);
      toast.error('Failed to start journey. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dialog-content modal-content">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Start Your Fitness Journey</DialogTitle>
          <DialogDescription>
            Let's create a personalized workout plan that fits your lifestyle and goals
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">What Are Your Fitness Goals?</h3>
              <p className="text-muted-foreground mb-6">
                Select all that apply. We'll customize your program based on your objectives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fitnessGoals.map((goal) => (
                <Card
                  key={goal.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${formData.goals.includes(goal.id) ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                  onClick={() => handleGoalChange(goal.id, !formData.goals.includes(goal.id))}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <goal.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{goal.label}</CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => setStep(2)}
                disabled={formData.goals.length === 0}
                size="lg"
                className="px-8"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Tell Us About Yourself</h3>
              <p className="text-muted-foreground">
                This helps us create the perfect workout intensity and schedule for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fitness_level">Current Fitness Level</Label>
                <Select value={formData.fitness_level} onValueChange={(value) => setFormData({ ...formData, fitness_level: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your fitness level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (New to exercise)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (Regular exercise)</SelectItem>
                    <SelectItem value="advanced">Advanced (Very active)</SelectItem>
                    <SelectItem value="athlete">Athlete (Competitive level)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Workout Frequency</Label>
                <Select value={formData.workout_frequency} onValueChange={(value) => setFormData({ ...formData, workout_frequency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="How often can you workout?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-3_days">2-3 days per week</SelectItem>
                    <SelectItem value="4-5_days">4-5 days per week</SelectItem>
                    <SelectItem value="6+_days">6+ days per week</SelectItem>
                    <SelectItem value="daily">Daily workouts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Preferred Workout Duration</Label>
                <Select value={formData.preferred_duration} onValueChange={(value) => setFormData({ ...formData, preferred_duration: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="How long per session?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15-20 minutes</SelectItem>
                    <SelectItem value="30">30-45 minutes</SelectItem>
                    <SelectItem value="60">60-75 minutes</SelectItem>
                    <SelectItem value="90">90+ minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="health">Health Considerations</Label>
                <Input
                  id="health"
                  placeholder="Any injuries or health conditions?"
                  value={formData.health_conditions}
                  onChange={(e) => setFormData({ ...formData, health_conditions: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Available Equipment</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {equipment.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={item}
                      checked={formData.available_equipment.includes(item)}
                      onCheckedChange={(checked) => handleEquipmentChange(item, checked)}
                    />
                    <Label htmlFor={item} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.fitness_level || !formData.workout_frequency}
                className="bg-vintage-deep-blue hover:bg-vintage-forest-green"
              >
                Start My Journey
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StartJourneyModal;
