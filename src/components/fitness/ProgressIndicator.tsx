import React from 'react';
import { Progress } from '@/components/ui/progress';
import { calculateProgressPercentage } from '@/services/workoutData';

interface ProgressIndicatorProps {
  completed: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

/**
 * Reusable component for displaying progress with optional label and percentage
 */
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  completed,
  total,
  label,
  showPercentage = true,
  className = '',
}) => {
  const progressPercentage = calculateProgressPercentage(completed, total);

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span>{completed}/{total}</span>
        </div>
      )}
      
      <Progress value={progressPercentage} />
      
      {showPercentage && (
        <p className="text-xs text-muted-foreground">
          {progressPercentage.toFixed(1)}% Complete
        </p>
      )}
    </div>
  );
};

export default ProgressIndicator;