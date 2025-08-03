import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  subtitle?: string;
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * Reusable FeatureCard component for consistent card styling across the application
 */
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  subtitle,
  iconColor = 'text-vintage-warm-cream',
  iconBgColor = 'bg-vintage-deep-blue',
  className = '',
  onClick,
}) => {
  return (
    <Card 
      className={`bg-white/90 border-2 border-vintage-gold/20 hover:border-vintage-gold/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${className}`}
      onClick={onClick}
    >
      <CardHeader className="text-center">
        <div className={`mx-auto mb-4 p-3 ${iconBgColor} rounded-full w-fit`}>
          <Icon className={iconColor} size={32} />
        </div>
        <CardTitle className="font-playfair text-xl text-vintage-deep-blue">
          {title}
        </CardTitle>
        {subtitle && (
          <CardDescription className="font-crimson text-vintage-gold font-semibold">
            {subtitle}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <CardDescription className="font-crimson text-vintage-dark-brown text-center leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;