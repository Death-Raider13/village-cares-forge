import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  iconColor?: string;
  background?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable Section component for consistent section styling across the application
 */
const Section: React.FC<SectionProps> = ({
  title,
  description,
  icon: Icon,
  iconColor = 'text-vintage-deep-blue',
  background = 'bg-gradient-to-b from-vintage-warm-cream to-white',
  children,
  className = '',
}) => {
  return (
    <section className={`py-16 ${background} ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          {Icon && (
            <div className="flex justify-center mb-6">
              <Icon className={`${iconColor} mb-4`} size={64} />
            </div>
          )}
          
          <h2 className="font-playfair font-bold text-4xl md:text-5xl text-vintage-deep-blue mb-6">
            {title}
          </h2>
          
          <div className="w-24 h-1 bg-vintage-gold mx-auto mb-6 ornate-divider"></div>
          
          <p className="font-crimson text-xl text-vintage-dark-brown max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {children}
      </div>
    </section>
  );
};

export default Section;