
import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-vintage-dark-brown text-vintage-warm-cream py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-vintage-gold rounded-full flex items-center justify-center">
                <span className="text-vintage-dark-brown font-playfair font-bold text-xl">AC</span>
              </div>
              <div>
                <h3 className="font-playfair font-bold text-2xl text-vintage-gold">
                  Andrew Cares Village
                </h3>
                <p className="text-sm italic">Master • Strengthen • Transform</p>
              </div>
            </div>
            <p className="font-crimson text-vintage-warm-cream/80 leading-relaxed max-w-md">
              Where ancient wisdom meets modern excellence. Join our community of dedicated individuals 
              pursuing mastery in financial markets, physical fitness, and martial arts.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-playfair font-semibold text-xl text-vintage-gold mb-4">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-vintage-gold" />
                <span className="font-crimson">info@andrewcaresvillage.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-vintage-gold" />
                <span className="font-crimson">1-800-VILLAGE</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-vintage-gold" />
                <span className="font-crimson">Traditional Training Center</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-playfair font-semibold text-xl text-vintage-gold mb-4">
              Training Hours
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-vintage-gold" />
                <span className="font-crimson text-sm">Mon-Fri: 5:00 AM - 10:00 PM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-vintage-gold" />
                <span className="font-crimson text-sm">Sat-Sun: 6:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Services Links */}
        <div className="border-t border-vintage-gold/30 pt-8 mb-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h5 className="font-playfair font-semibold text-lg text-vintage-gold mb-3">
                Forex Trading
              </h5>
              <ul className="space-y-2 font-crimson text-sm">
                <li>Market Analysis</li>
                <li>Trading Education</li>
                <li>Risk Management</li>
                <li>Live Trading Room</li>
              </ul>
            </div>
            <div>
              <h5 className="font-playfair font-semibold text-lg text-vintage-gold mb-3">
                Fitness Training
              </h5>
              <ul className="space-y-2 font-crimson text-sm">
                <li>Strength & Conditioning</li>
                <li>Personal Training</li>
                <li>Group Classes</li>
                <li>Rehabilitation</li>
              </ul>
            </div>
            <div>
              <h5 className="font-playfair font-semibold text-lg text-vintage-gold mb-3">
                Martial Arts
              </h5>
              <ul className="space-y-2 font-crimson text-sm">
                <li>Traditional Karate</li>
                <li>Taekwondo</li>
                <li>Kung Fu</li>
                <li>Mixed Martial Arts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-vintage-gold/30 pt-6 text-center">
          <p className="font-crimson text-vintage-warm-cream/60">
            © 2024 Andrew Cares Village. All rights reserved. | Honoring tradition, embracing excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
