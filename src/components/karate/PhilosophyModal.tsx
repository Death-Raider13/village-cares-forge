
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scroll, Heart, Shield, Mountain, Lotus, Sword } from 'lucide-react';

interface PhilosophyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PhilosophyModal: React.FC<PhilosophyModalProps> = ({ isOpen, onClose }) => {
  const philosophies = [
    {
      title: 'Dojo Kun (Training Hall Rules)',
      icon: Scroll,
      principles: [
        'Seek perfection of character',
        'Be faithful and sincere',
        'Cultivate the spirit of effort',
        'Respect others and maintain proper etiquette',
        'Refrain from violent behavior'
      ],
      description: 'The fundamental principles that guide every karateka in their training and daily life.'
    },
    {
      title: 'Bushido - Way of the Warrior',
      icon: Sword,
      principles: [
        'Rectitude (義 - Gi)',
        'Courage (勇 - Yu)',
        'Benevolence (仁 - Jin)',
        'Respect (礼 - Rei)',
        'Honesty (誠 - Makoto)',
        'Honor (名誉 - Meiyo)',
        'Loyalty (忠義 - Chugi)'
      ],
      description: 'The moral code of the samurai, emphasizing honor, discipline, and ethical behavior.'
    },
    {
      title: 'Mind, Body, Spirit Unity',
      icon: Lotus,
      principles: [
        'Mental discipline through focus',
        'Physical strength through practice',
        'Spiritual growth through meditation',
        'Balance in all aspects of life',
        'Continuous self-improvement'
      ],
      description: 'The holistic approach to martial arts training that develops the complete person.'
    }
  ];

  const masters = [
    {
      name: 'Gichin Funakoshi',
      title: 'Father of Modern Karate',
      quote: 'The ultimate aim of karate lies not in victory nor defeat, but in the perfection of the character of its participants.',
      philosophy: 'Emphasized karate as a way of life, not just combat.'
    },
    {
      name: 'Mas Oyama',
      title: 'Founder of Kyokushin',
      quote: 'The heart of our karate is real fighting. There can be no proof without real fighting.',
      philosophy: 'Believed in practical application and mental toughness.'
    },
    {
      name: 'Sensei Miyamoto Musashi',
      title: 'Legendary Swordsman',
      quote: 'Today is victory over yourself of yesterday; tomorrow is your victory over lesser men.',
      philosophy: 'Taught the importance of continuous self-improvement and strategy.'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">Karate Philosophy & Wisdom</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Discover the profound teachings that have guided martial artists for centuries
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Core Philosophies */}
          <section>
            <h3 className="text-2xl font-semibold mb-6 text-center">Core Philosophies</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {philosophies.map((philosophy, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <philosophy.icon className="h-6 w-6 text-orange-600" />
                      {philosophy.title}
                    </CardTitle>
                    <CardDescription>{philosophy.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {philosophy.principles.map((principle, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Badge variant="outline" className="mt-0.5 text-xs">
                            {i + 1}
                          </Badge>
                          <span className="text-sm">{principle}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Famous Masters */}
          <section>
            <h3 className="text-2xl font-semibold mb-6 text-center">Wisdom from the Masters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {masters.map((master, index) => (
                <Card key={index} className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-lg">{master.name}</CardTitle>
                    <Badge variant="secondary">{master.title}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <blockquote className="italic text-sm border-l-4 border-orange-500 pl-4">
                      "{master.quote}"
                    </blockquote>
                    <p className="text-sm text-muted-foreground">{master.philosophy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Traditional Values */}
          <section className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4 text-center">Traditional Values in Modern Life</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Character Development
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• Patience through repetitive practice</li>
                  <li>• Humility in victory and defeat</li>
                  <li>• Perseverance through challenges</li>
                  <li>• Respect for teachers and peers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Mountain className="h-5 w-5 text-green-600" />
                  Life Applications
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• Discipline in daily routines</li>
                  <li>• Conflict resolution without violence</li>
                  <li>• Leadership through example</li>
                  <li>• Mental clarity in decision making</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhilosophyModal;
