
import React, { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ForexSection from '@/components/ForexSection';
import FitnessSection from '@/components/FitnessSection';
import MartialArtsSection from '@/components/MartialArtsSection';
import Footer from '@/components/Footer';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    
    // Smooth scroll to section
    if (section !== 'home') {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
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

  return (
    <div className="min-h-screen bg-vintage-warm-cream">
      <Header 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      
      <main>
        {/* Hero Section */}
        <section id="home">
          <HeroSection onExploreServices={handleExploreServices} />
        </section>

        {/* Forex Trading Section */}
        <section id="forex">
          <ForexSection />
        </section>

        {/* Fitness Training Section */}
        <section id="fitness">
          <FitnessSection />
        </section>

        {/* Martial Arts Section */}
        <section id="martial-arts">
          <MartialArtsSection />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
