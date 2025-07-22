
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { TrendingUp, TrendingDown, Star, Clock, Target, AlertCircle, BarChart3 } from 'lucide-react';

interface ForexSignal {
  id: string;
  currency_pair: string;
  signal_type: string;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  confidence_level: number;
  description: string;
  status: string;
  created_at: string;
}

const ForexTrading: React.FC = () => {
  const [signals, setSignals] = useState<ForexSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSignals();
  }, []);

  const fetchSignals = async () => {
    try {
      const { data, error } = await supabase
        .from('forex_signals')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSignals(data || []);
    } catch (error) {
      console.error('Error fetching forex signals:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => price.toFixed(5);

  const getSignalIcon = (type: string) => {
    return type === 'buy' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const calculateRiskReward = (entry: number, stopLoss: number, takeProfit: number, type: string) => {
    const risk = Math.abs(entry - stopLoss);
    const reward = Math.abs(takeProfit - entry);
    return reward / risk;
  };

  return (
    <div className="min-h-screen bg-vintage-warm-cream">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-vintage-deep-blue to-vintage-burgundy">
        <div className="container mx-auto px-4 text-center text-vintage-warm-cream">
          <h1 className="font-playfair font-bold text-4xl md:text-6xl mb-4">
            Forex Trading Mastery
          </h1>
          <p className="font-crimson text-xl mb-8 max-w-3xl mx-auto">
            Master the art of currency trading with our expert signals, comprehensive education, and time-tested strategies
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-vintage-gold hover:bg-vintage-gold/90 text-vintage-deep-blue">
              View Live Signals
            </Button>
            <Button size="lg" variant="outline" className="border-vintage-warm-cream text-vintage-warm-cream hover:bg-vintage-warm-cream hover:text-vintage-deep-blue">
              Start Learning
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="signals" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="signals">Live Signals</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
            <TabsTrigger value="tools">Trading Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="signals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-8">Loading signals...</div>
              ) : (
                signals.map((signal) => (
                  <Card key={signal.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {getSignalIcon(signal.signal_type)}
                          {signal.currency_pair}
                        </CardTitle>
                        <Badge variant={signal.signal_type === 'buy' ? 'default' : 'destructive'}>
                          {signal.signal_type.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription>{signal.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Entry:</span>
                          <div className="text-lg font-bold">{formatPrice(signal.entry_price)}</div>
                        </div>
                        <div>
                          <span className="font-medium">Stop Loss:</span>
                          <div className="text-red-600">{formatPrice(signal.stop_loss)}</div>
                        </div>
                        <div>
                          <span className="font-medium">Take Profit:</span>
                          <div className="text-green-600">{formatPrice(signal.take_profit)}</div>
                        </div>
                        <div>
                          <span className="font-medium">R:R Ratio:</span>
                          <div className="font-bold">
                            1:{calculateRiskReward(signal.entry_price, signal.stop_loss, signal.take_profit, signal.signal_type).toFixed(1)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: signal.confidence_level }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(signal.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Forex Fundamentals
                  </CardTitle>
                  <CardDescription>Master the basics of currency trading</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Understanding currency pairs</li>
                    <li>• Market sessions and timing</li>
                    <li>• Risk management principles</li>
                    <li>• Economic indicators impact</li>
                  </ul>
                  <Button className="w-full mt-4" disabled={!user}>
                    {user ? 'Start Learning' : 'Sign in to Access'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Technical Analysis
                  </CardTitle>
                  <CardDescription>Advanced charting and pattern recognition</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Support and resistance levels</li>
                    <li>• Chart patterns and formations</li>
                    <li>• Technical indicators</li>
                    <li>• Price action strategies</li>
                  </ul>
                  <Button className="w-full mt-4" disabled={!user}>
                    {user ? 'Advanced Course' : 'Sign in to Access'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Market Analysis</CardTitle>
                <CardDescription>Expert insights and market outlook</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">EUR/USD Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      The EUR/USD pair is showing strong bullish momentum after breaking above the 1.0850 resistance level. 
                      We expect continued upward movement towards 1.0950 target.
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold mb-2">GBP/USD Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      The GBP/USD is facing strong resistance at 1.2350. A bearish divergence suggests 
                      a potential pullback to 1.2250 support level.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Position Size Calculator</CardTitle>
                  <CardDescription>Calculate optimal position sizes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" disabled={!user}>
                    {user ? 'Use Calculator' : 'Sign in to Access'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk/Reward Calculator</CardTitle>
                  <CardDescription>Analyze trade risk vs reward</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" disabled={!user}>
                    {user ? 'Calculate R:R' : 'Sign in to Access'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Economic Calendar</CardTitle>
                  <CardDescription>Important market events</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" disabled={!user}>
                    {user ? 'View Calendar' : 'Sign in to Access'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ForexTrading;
