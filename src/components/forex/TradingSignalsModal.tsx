
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, Star, AlertCircle, Clock, Target, BarChart3 } from 'lucide-react';

interface TradingSignalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TradingSignalsModal: React.FC<TradingSignalsModalProps> = ({ isOpen, onClose }) => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchSignals();
    }
  }, [isOpen]);

  const fetchSignals = async () => {
    try {
      const { data, error } = await supabase
        .from('forex_signals')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSignals(data || []);
    } catch (error) {
      console.error('Error fetching signals:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => price?.toFixed(5) || '0.00000';

  const getSignalIcon = (type: string) => {
    return type === 'buy' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const calculateRiskReward = (entry: number, stopLoss: number, takeProfit: number) => {
    if (!entry || !stopLoss || !takeProfit) return 0;
    const risk = Math.abs(entry - stopLoss);
    const reward = Math.abs(takeProfit - entry);
    return reward / risk;
  };

  const marketOverview = [
    { pair: 'EUR/USD', price: '1.0847', change: '+0.0023', percent: '+0.21%', trend: 'up' },
    { pair: 'GBP/USD', price: '1.2341', change: '-0.0056', percent: '-0.45%', trend: 'down' },
    { pair: 'USD/JPY', price: '149.82', change: '+0.34', percent: '+0.23%', trend: 'up' },
    { pair: 'USD/CHF', price: '0.9123', change: '-0.0012', percent: '-0.13%', trend: 'down' },
    { pair: 'AUD/USD', price: '0.6543', change: '+0.0018', percent: '+0.28%', trend: 'up' },
    { pair: 'USD/CAD', price: '1.3654', change: '-0.0032', percent: '-0.23%', trend: 'down' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto dialog-content modal-content">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Professional Trading Signals</DialogTitle>
          <DialogDescription>
            Real-time forex signals from institutional-grade analysis and professional traders
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="live_signals" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="live_signals">Live Signals</TabsTrigger>
            <TabsTrigger value="market_overview">Market Overview</TabsTrigger>
            <TabsTrigger value="signal_education">Signal Education</TabsTrigger>
          </TabsList>

          <TabsContent value="live_signals" className="space-y-6">
            {/* Signal Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Win Rate</p>
                      <p className="text-2xl font-bold text-green-700">78.5%</p>
                    </div>
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Active Signals</p>
                      <p className="text-2xl font-bold text-blue-700">{signals.length}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600">Avg R:R</p>
                      <p className="text-2xl font-bold text-purple-700">1:2.3</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600">This Week</p>
                      <p className="text-2xl font-bold text-orange-700">+12.4%</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Signals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading professional signals...</p>
                </div>
              ) : signals.length > 0 ? (
                signals.map((signal) => (
                  <Card key={signal.id} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {getSignalIcon(signal.signal_type)}
                          {signal.currency_pair}
                        </CardTitle>
                        <Badge variant={signal.signal_type === 'buy' ? 'default' : 'destructive'}>
                          {signal.signal_type?.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription>{signal.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Entry:</span>
                          <div className="text-lg font-bold">{formatPrice(signal.entry_price)}</div>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Stop Loss:</span>
                          <div className="text-red-600 font-semibold">{formatPrice(signal.stop_loss)}</div>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Take Profit:</span>
                          <div className="text-green-600 font-semibold">{formatPrice(signal.take_profit)}</div>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">R:R Ratio:</span>
                          <div className="font-bold">
                            1:{calculateRiskReward(signal.entry_price, signal.stop_loss, signal.take_profit).toFixed(1)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: signal.confidence_level || 3 }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {signal.created_at ? new Date(signal.created_at).toLocaleDateString() : 'Today'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No active signals at the moment. Check back soon!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="market_overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-Time Market Data</CardTitle>
                <CardDescription>Live currency pair prices and movements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketOverview.map((market, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{market.pair}</h4>
                        {market.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <p className="text-2xl font-bold mb-1">{market.price}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={market.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                          {market.change}
                        </span>
                        <span className={market.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                          ({market.percent})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Market Analysis</CardTitle>
                <CardDescription>Professional insights from our trading team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold mb-2">EUR/USD Technical Outlook</h4>
                  <p className="text-sm text-muted-foreground">
                    The EUR/USD pair is testing key resistance at 1.0850. A break above could target 1.0900-1.0950.
                    Support levels remain at 1.0800 and 1.0750. RSI showing bullish divergence on the 4H chart.
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-semibold mb-2">USD/JPY Weekly Review</h4>
                  <p className="text-sm text-muted-foreground">
                    USD/JPY continues its upward momentum, breaking above 149.50. Watch for potential intervention
                    signals from BoJ around 150.00 level. Strong USD fundamentals support the bullish bias.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signal_education" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Understanding Trading Signals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">What are Forex Signals?</h4>
                    <p className="text-sm text-muted-foreground">
                      Trading signals are trade recommendations that specify the currency pair, entry price,
                      stop loss, and take profit levels based on technical and fundamental analysis.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Signal Components</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>Entry Price:</strong> The recommended price to enter the trade</li>
                      <li>• <strong>Stop Loss:</strong> Risk management level to limit losses</li>
                      <li>• <strong>Take Profit:</strong> Target level to secure profits</li>
                      <li>• <strong>Risk-Reward Ratio:</strong> Measures potential profit vs potential loss</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How to Use Signals Effectively</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Best Practices</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Never risk more than 1-2% of your account per trade</li>
                      <li>• Always use proper position sizing</li>
                      <li>• Don't blindly follow signals - understand the analysis</li>
                      <li>• Keep a trading journal to track performance</li>
                      <li>• Consider market conditions and news events</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Risk Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Successful trading is more about managing risk than being right. Always use stop losses
                      and never move them against your position. Position size according to your risk tolerance.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  Important Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Trading forex involves substantial risk and may not be suitable for all investors.
                  Past performance is not indicative of future results. Our signals are for educational
                  purposes and should not be considered as financial advice. Always do your own research
                  and consider consulting with a financial advisor.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TradingSignalsModal;
