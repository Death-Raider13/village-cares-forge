import React from 'react';
import { Progress } from './progress';
import { validatePasswordStrength } from '@/lib/security';
import { CheckCircle, XCircle } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, className }) => {
  const validation = validatePasswordStrength(password);
  
  const getStrengthScore = () => {
    if (!password) return 0;
    if (validation.valid) return 100;
    
    const criteria = [
      password.length >= 8,
      /(?=.*[a-z])/.test(password),
      /(?=.*[A-Z])/.test(password),
      /(?=.*\d)/.test(password),
      /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password),
    ];
    
    return (criteria.filter(Boolean).length / criteria.length) * 100;
  };

  const getStrengthColor = () => {
    const score = getStrengthScore();
    if (score >= 100) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStrengthText = () => {
    const score = getStrengthScore();
    if (score >= 100) return 'Strong';
    if (score >= 60) return 'Medium';
    if (score > 0) return 'Weak';
    return '';
  };

  if (!password) return null;

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1">
          <Progress value={getStrengthScore()} className="h-2" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {getStrengthText()}
        </span>
      </div>
      
      <div className="space-y-1">
        {[
          { text: 'At least 8 characters', test: password.length >= 8 },
          { text: 'One lowercase letter', test: /(?=.*[a-z])/.test(password) },
          { text: 'One uppercase letter', test: /(?=.*[A-Z])/.test(password) },
          { text: 'One number', test: /(?=.*\d)/.test(password) },
          { text: 'One special character', test: /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password) },
        ].map((criterion, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {criterion.test ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <XCircle className="h-3 w-3 text-red-500" />
            )}
            <span className={criterion.test ? 'text-green-600' : 'text-red-600'}>
              {criterion.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};