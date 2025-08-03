import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle } from 'lucide-react';
import { WorkoutPlan } from '@/types/fitness';
import { getDifficultyColor } from '@/services/workoutData';

interface WorkoutSummaryProps {
  workout: WorkoutPlan;
  showActions?: boolean;
  onComplete?: () => void;
  className?: string;
}

/**
 * Reusable component for displaying workout summary details
 */
const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({
  workout,
  showActions = true,
  onComplete,
  className = '',
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{workout.title}</CardTitle>
            <CardDescription className="mt-2">{workout.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={getDifficultyColor(workout.difficulty)}>
              {workout.difficulty}
            </Badge>
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              {workout.duration} min
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Exercises</span>
            <span className="font-medium">{workout.exercises.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Focus Areas</span>
            <span className="font-medium">{workout.focus.join(', ')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Equipment Needed</span>
            <span className="font-medium">{workout.equipment.join(', ') || 'None'}</span>
          </div>
          
          {showActions && onComplete && (
            <Button 
              onClick={onComplete} 
              className="w-full mt-4 bg-vintage-deep-blue hover:bg-vintage-forest-green"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutSummary;