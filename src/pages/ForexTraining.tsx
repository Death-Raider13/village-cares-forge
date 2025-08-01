import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { TrendingUp, TrendingDown, Star, Clock, Target, AlertCircle, BookOpen, Calculator, DollarSign, Activity, BarChart3 } from 'lucide-react';
import TradingAcademyModal from '@/components/forex/TradingAcademyModal';


const ForexTraining: React.FC = () => {
  const { user } = useAuth();

  // Trading Calculator States
  const [account, setAccount] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [entryPrice, setEntryPrice] = useState(1.0850);
  const [stopLoss, setStopLoss] = useState(1.0800);
  const [takeProfit, setTakeProfit] = useState(1.0950);
  const [lotSize, setLotSize] = useState(0.1);

  const [academyModalOpen, setAcademyModalOpen] = useState(false);

  const calculateRiskReward = (entry: number, stopLoss: number, takeProfit: number) => {
    const risk = Math.abs(entry - stopLoss);
    const reward = Math.abs(takeProfit - entry);
    return reward / risk;
  };

  const calculatePositionSize = () => {
    const riskAmount = (account * riskPercent) / 100;
    const pipValue = Math.abs(entryPrice - stopLoss) * 10000;
    const positionSize = riskAmount / (pipValue * 10);
    return positionSize.toFixed(2);
  };

  const calculatePotentialProfit = () => {
    const pipDiff = Math.abs(takeProfit - entryPrice) * 10000;
    const profit = pipDiff * lotSize * 10;
    return profit.toFixed(2);
  };

  const calculatePotentialLoss = () => {
    const pipDiff = Math.abs(entryPrice - stopLoss) * 10000;
    const loss = pipDiff * lotSize * 10;
    return loss.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-warm-cream to-vintage-sage-green/10">
      {/* Enhanced Hero Section */}
      <section className="py-20 bg-gradient-to-br from-vintage-deep-blue via-vintage-burgundy to-vintage-dark-brown relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center text-vintage-warm-cream relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-playfair font-bold text-5xl md:text-7xl mb-6 tracking-tight">
              Professional Forex Training
            </h1>
            <p className="font-crimson text-xl md:text-2xl mb-8 leading-relaxed opacity-90">
              Master the global currency markets with institutional-grade tools, comprehensive education, and time-tested strategies from market professionals
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button size="lg" className="bg-vintage-gold hover:bg-vintage-gold/90 text-vintage-deep-blue font-semibold px-8 py-3" onClick={() => setAcademyModalOpen(true)}>
                <BookOpen className="mr-2 h-5 w-5" />
                Trading Education
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-vintage-warm-cream text-vintage-warm-cream hover:bg-vintage-warm-cream hover:text-vintage-deep-blue font-semibold px-8 py-3">
                <Target className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="calculator" className="font-semibold">Trading Tools</TabsTrigger>
            <TabsTrigger value="education" className="font-semibold">Education Hub</TabsTrigger>
            <TabsTrigger value="analysis" className="font-semibold">Market Analysis</TabsTrigger>
            <TabsTrigger value="fundamentals" className="font-semibold">Fundamentals</TabsTrigger>
            <TabsTrigger value="community" className="font-semibold">Community</TabsTrigger>
          </TabsList>


          <TabsContent value="calculator" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Position Size Calculator */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                    <Calculator className="h-5 w-5" />
                    Position Size Calculator
                  </CardTitle>
                  <CardDescription>Calculate optimal position sizes based on risk management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="account">Account Balance ($)</Label>
                      <Input
                        id="account"
                        type="number"
                        value={account}
                        onChange={(e) => setAccount(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="risk">Risk Percentage (%)</Label>
                      <Input
                        id="risk"
                        type="number"
                        value={riskPercent}
                        onChange={(e) => setRiskPercent(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="entry">Entry Price</Label>
                      <Input
                        id="entry"
                        type="number"
                        step="0.00001"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sl">Stop Loss</Label>
                      <Input
                        id="sl"
                        type="number"
                        step="0.00001"
                        value={stopLoss}
                        onChange={(e) => setStopLoss(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-vintage-deep-blue/5 rounded-lg">
                    <h4 className="font-semibold text-vintage-deep-blue mb-2">Recommended Position Size</h4>
                    <p className="text-2xl font-bold text-vintage-gold">{calculatePositionSize()} lots</p>
                  </div>
                </CardContent>
              </Card>

              {/* Risk/Reward Calculator */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                    <Target className="h-5 w-5" />
                    Risk/Reward Calculator
                  </CardTitle>
                  <CardDescription>Analyze potential profits and losses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tp">Take Profit</Label>
                      <Input
                        id="tp"
                        type="number"
                        step="0.00001"
                        value={takeProfit}
                        onChange={(e) => setTakeProfit(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lots">Lot Size</Label>
                      <Input
                        id="lots"
                        type="number"
                        step="0.01"
                        value={lotSize}
                        onChange={(e) => setLotSize(Number(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Potential Profit:</span>
                      <span className="text-xl font-bold text-green-600">${calculatePotentialProfit()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">Potential Loss:</span>
                      <span className="text-xl font-bold text-red-600">${calculatePotentialLoss()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-vintage-gold/10 rounded-lg">
                      <span className="font-medium">Risk/Reward Ratio:</span>
                      <span className="text-xl font-bold text-vintage-deep-blue">
                        1:{calculateRiskReward(entryPrice, stopLoss, takeProfit).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                    <Target className="h-5 w-5" />
                    Forex Basics
                  </CardTitle>
                  <CardDescription>Foundation knowledge for beginners</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm font-crimson">
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Understanding currency pairs and quotes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Market sessions and optimal trading times</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Fundamental vs technical analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Risk management principles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Psychology of trading</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-vintage-deep-blue hover:bg-vintage-burgundy" disabled={!user}>
                    {user ? 'Start Learning' : 'Sign in to Access'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                    <BarChart3 className="h-5 w-5" />
                    Technical Analysis
                  </CardTitle>
                  <CardDescription>Chart patterns and indicators mastery</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm font-crimson">
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Support and resistance identification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Japanese candlestick patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Moving averages and trend analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>RSI, MACD, and momentum indicators</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Fibonacci retracements and extensions</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-vintage-deep-blue hover:bg-vintage-burgundy" disabled={!user}>
                    {user ? 'Advanced Course' : 'Sign in to Access'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-playfair text-vintage-deep-blue">
                    <DollarSign className="h-5 w-5" />
                    Risk Management
                  </CardTitle>
                  <CardDescription>Protecting your trading capital</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm font-crimson">
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Position sizing strategies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Stop loss and take profit placement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Risk-reward ratio optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Portfolio diversification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-vintage-gold mt-1 flex-shrink-0" />
                      <span>Emotional discipline techniques</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-vintage-deep-blue hover:bg-vintage-burgundy" disabled={!user}>
                    {user ? 'Master Risk Management' : 'Sign in to Access'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-playfair text-vintage-deep-blue">Professional Market Analysis</CardTitle>
                <CardDescription>Daily insights from certified market analysts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-semibold mb-2 text-vintage-deep-blue">EUR/USD Technical Outlook</h4>
                    <p className="text-sm text-vintage-dark-brown mb-2">
                      <strong>Current Price:</strong> 1.0847 | <strong>Bias:</strong> Bullish
                    </p>
                    <p className="text-sm text-vintage-dark-brown">
                      The EUR/USD pair has successfully broken above the key resistance level at 1.0850, confirming our bullish bias. 
                      The momentum is supported by RSI moving above 60 and MACD showing positive divergence. Next targets are 1.0950 and 1.1000.
                      Support levels remain at 1.0800 and 1.0750.
                    </p>
                  </div>
                  <div className="p-6 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-semibold mb-2 text-vintage-deep-blue">GBP/USD Weekly Analysis</h4>
                    <p className="text-sm text-vintage-dark-brown mb-2">
                      <strong>Current Price:</strong> 1.2341 | <strong>Bias:</strong> Bearish
                    </p>
                    <p className="text-sm text-vintage-dark-brown">
                      GBP/USD is facing strong resistance at the 1.2350-1.2380 zone. Bearish divergence on the 4H chart suggests 
                      a potential pullback to 1.2250 support. Watch for a break below 1.2300 which could accelerate selling toward 1.2200.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fundamentals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-playfair text-vintage-deep-blue">Economic Calendar</CardTitle>
                  <CardDescription>High-impact events this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">US NFP</h4>
                        <p className="text-sm text-muted-foreground">Friday 13:30 UTC</p>
                      </div>
                      <Badge variant="destructive">High Impact</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">ECB Interest Rate</h4>
                        <p className="text-sm text-muted-foreground">Thursday 12:15 UTC</p>
                      </div>
                      <Badge variant="destructive">High Impact</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">UK GDP</h4>
                        <p className="text-sm text-muted-foreground">Wednesday 07:00 UTC</p>
                      </div>
                      <Badge variant="default">Medium Impact</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-playfair text-vintage-deep-blue">Market Sentiment</CardTitle>
                  <CardDescription>Current positioning and outlook</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800">USD Strength</h4>
                      <p className="text-sm text-green-700">
                        Fed hawkish stance supporting dollar strength across major pairs
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-800">EUR Uncertainty</h4>
                      <p className="text-sm text-yellow-700">
                        ECB policy divergence creating volatility in EUR crosses
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800">Risk-On Sentiment</h4>
                      <p className="text-sm text-blue-700">
                        Commodity currencies benefiting from improved risk appetite
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-playfair text-vintage-deep-blue">Trading Community</CardTitle>
                <CardDescription>Connect with fellow traders and mentors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border rounded-lg">
                    <h4 className="font-semibold mb-2">Trading Community</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect with fellow traders and share educational content
                    </p>
                    <Button className="w-full" disabled={!user}>
                      {user ? 'Join Community' : 'Sign in to Access'}
                    </Button>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <h4 className="font-semibold mb-2">Mentorship Program</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      One-on-one guidance from experienced traders
                    </p>
                    <Button className="w-full" disabled={!user}>
                      {user ? 'Apply Now' : 'Sign in to Access'}
                    </Button>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <h4 className="font-semibold mb-2">Discussion Forum</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Share strategies and learn from the community
                    </p>
                    <Button className="w-full" disabled={!user}>
                      {user ? 'Join Discussion' : 'Sign in to Access'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <TradingAcademyModal isOpen={academyModalOpen} onClose={() => setAcademyModalOpen(false)} />
    </div>
  );
};

export default ForexTraining;
