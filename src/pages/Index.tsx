
import React, { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ForexSection from '@/components/ForexSection';
import FitnessSection from '@/components/FitnessSection';
import MartialArtsSection from '@/components/MartialArtsSection';
import Footer from '@/components/Footer';
import UserDashboard from '@/components/dashboard/UserDashboard';
import ForexSignals from '@/components/forex/ForexSignals';
import FitnessPrograms from '@/components/fitness/FitnessPrograms';
import MartialArtsTracker from '@/components/martial-arts/MartialArtsTracker';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    
    // Smooth scroll to section
    if (section !== 'home' && section !== 'dashboard') {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExploreServices = () => {
    const forexElement = document.getElementById('forex');
    if (forexElement) {
      forexElement.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection('forex');
  };

  const renderContent = () => {
    if (activeSection === 'dashboard') {
      return (
        <div className="min-h-screen bg-vintage-warm-cream pt-24">
          <div className="container mx-auto px-4 py-8">
            <UserDashboard />
          </div>
        </div>
      );
    }

    return (
      <main>
        {/* Hero Section */}
        <section id="home">
          <HeroSection onExploreServices={handleExploreServices} />
        </section>

        {/* Forex Trading Section */}
        <section id="forex" className="py-16 bg-gradient-to-br from-vintage-warm-cream to-vintage-sage-green/10">
          <div className="container mx-auto px-4">
            <ForexSection />
            <div className="mt-12">
              <ForexSignals />
            </div>
          </div>
        </section>

        {/* Fitness Training Section */}
        <section id="fitness" className="py-16 bg-vintage-warm-cream">
          <div className="container mx-auto px-4">
            <FitnessSection />
            <div className="mt-12">
              <FitnessPrograms />
            </div>
          </div>
        </section>

        {/* Martial Arts Section */}
        <section id="martial-arts" className="py-16 bg-gradient-to-br from-vintage-sage-green/10 to-vintage-warm-cream">
          <div className="container mx-auto px-4">
            <MartialArtsSection />
            <div className="mt-12">
              <MartialArtsTracker />
            </div>
          </div>
        </section>
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-vintage-warm-cream">
      <Header 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      
      {renderContent()}

      {activeSection !== 'dashboard' && <Footer />}
    </div>
  );
};

export default Index;
