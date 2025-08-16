import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Shield, Target, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

interface BeginJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BeginJourneyModal: React.FC<BeginJourneyModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    experience: '',
    goals: [] as string[],
    availability: '',
    physicalCondition: '',
    previousInjuries: '',
    expectations: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const experienceLevels = [
    { value: 'complete_beginner', label: 'Complete Beginner' },
    { value: 'some_experience', label: 'Some Experience' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const karateGoals = [
    { value: 'self_defense', label: 'Self Defense' },
    { value: 'fitness', label: 'Physical Fitness' },
    { value: 'discipline', label: 'Mental Discipline' },
    { value: 'competition', label: 'Competition' },
    { value: 'tradition', label: 'Traditional Study' },
    { value: 'confidence', label: 'Build Confidence' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to begin your journey');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('training_sessions')
        .insert({
          user_id: user.id,
          title: 'Karate Journey Started',
          description: `Goals: ${formData.goals.join(', ')}. Experience: ${formData.experience}. Availability: ${formData.availability}`,
          session_type: 'karate',
          completed: false,
        });

      if (error) throw error;

      toast.success('Your karate journey has begun! Welcome to the dojo.');
      onClose();
      router.push('/karate-journey');
    } catch (error) {
      console.error('Error starting journey:', error);
      toast.error('Failed to start your karate journey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto dialog-content modal-content">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl text-vintage-deep-blue">
            Begin Your Karate Journey
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Your age"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="experience">Martial Arts Experience</Label>
                <Select onValueChange={(value) => handleInputChange('experience', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="physical-condition">Physical Condition</Label>
                <Textarea
                  id="physical-condition"
                  value={formData.physicalCondition}
                  onChange={(e) => handleInputChange('physicalCondition', e.target.value)}
                  placeholder="Describe your current fitness level and any physical limitations..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Goals & Expectations
              </CardTitle>
              <CardDescription>What do you hope to achieve?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Your Karate Goals (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {karateGoals.map(goal => (
                    <div
                      key={goal.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${formData.goals.includes(goal.value)
                          ? 'bg-vintage-deep-blue text-white'
                          : 'hover:bg-gray-50'
                        }`}
                      onClick={() => handleGoalToggle(goal.value)}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">{goal.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="expectations">What are your expectations?</Label>
                <Textarea
                  id="expectations"
                  value={formData.expectations}
                  onChange={(e) => handleInputChange('expectations', e.target.value)}
                  placeholder="What do you hope to learn and achieve through karate training?"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Training Schedule
              </CardTitle>
              <CardDescription>Plan your training routine</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="availability">Training Availability</Label>
                <Select onValueChange={(value) => handleInputChange('availability', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How often can you train?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily (7 days/week)</SelectItem>
                    <SelectItem value="frequent">Frequent (5-6 days/week)</SelectItem>
                    <SelectItem value="regular">Regular (3-4 days/week)</SelectItem>
                    <SelectItem value="occasional">Occasional (1-2 days/week)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="injuries">Previous Injuries or Concerns</Label>
                <Textarea
                  id="injuries"
                  value={formData.previousInjuries}
                  onChange={(e) => handleInputChange('previousInjuries', e.target.value)}
                  placeholder="Any injuries or physical concerns we should know about?"
                  rows={3}
                />
              </div>
              <div className="bg-vintage-sage-green/10 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Your Personalized Journey</h4>
                <p className="text-sm text-muted-foreground">
                  Based on your responses, we'll create a customized training program that matches your
                  experience level, goals, and availability. You'll progress through traditional belt
                  ranks while learning authentic karate techniques and philosophy.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            Previous
          </Button>
          <div className="flex gap-2">
            {[1, 2, 3].map(num => (
              <div
                key={num}
                className={`w-2 h-2 rounded-full ${num === step ? 'bg-vintage-deep-blue' : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>
          {step < 3 ? (
            <Button
              onClick={nextStep}
              disabled={
                (step === 1 && (!formData.name || !formData.age || !formData.experience)) ||
                (step === 2 && formData.goals.length === 0)
              }
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || !formData.availability}
            >
              {loading ? 'Starting Journey...' : 'Begin Journey'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BeginJourneyModal;
