import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { Exercise } from '@/types/fitness';

interface ExerciseCardProps {
  exercise: Exercise;
  onViewDetails: (exercise: Exercise) => void;
}

/**
 * Reusable component for displaying exercise details in a card format
 */
const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onViewDetails }) => {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h5 className="font-semibold">{exercise.name}</h5>
        <div className="flex gap-2">
          <Badge variant="outline">{exercise.sets} sets × {exercise.reps}</Badge>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onViewDetails(exercise)}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{exercise.description}</p>
      
      {/* Optional duration display */}
      {exercise.duration && (
        <div className="mt-2 text-xs text-muted-foreground">
          Duration: {exercise.duration} seconds
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;