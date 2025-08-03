import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, AlertCircle, BookOpen, GraduationCap, BarChart3, Target, Clock } from 'lucide-react';

interface TradingSignalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TradingSignalsModal: React.FC<TradingSignalsModalProps> = ({ isOpen, onClose }) => {
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
          <DialogTitle className="text-2xl font-bold">Forex Trading Education</DialogTitle>
          <DialogDescription>
            Learn about forex trading strategies, market analysis, and best practices
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="trading_education" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trading_education">Trading Education</TabsTrigger>
            <TabsTrigger value="market_overview">Market Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="trading_education" className="space-y-6">
            {/* Trading Education Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Success Rate</p>
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
                      <p className="text-sm text-blue-600">Trading Lessons</p>
                      <p className="text-2xl font-bold text-blue-700">24</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-600" />
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
                      <p className="text-sm text-orange-600">Weekly Updates</p>
                      <p className="text-2xl font-bold text-orange-700">3</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trading Education Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Understanding Trading Strategies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">What are Trading Strategies?</h4>
                    <p className="text-sm text-muted-foreground">
                      Trading strategies are systematic approaches to buying and selling in the forex market
                      based on predefined rules for entries, exits, and risk management.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Strategy Components</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>Entry Rules:</strong> Conditions for entering a trade</li>
                      <li>• <strong>Exit Rules:</strong> Conditions for exiting a trade</li>
                      <li>• <strong>Position Sizing:</strong> How much to risk on each trade</li>
                      <li>• <strong>Risk Management:</strong> How to protect your capital</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How to Trade Effectively</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Best Practices</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Never risk more than 1-2% of your account per trade</li>
                      <li>• Always use proper position sizing</li>
                      <li>• Develop and stick to a trading plan</li>
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

            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Advanced Trading Concepts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Technical Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Learn how to analyze price charts using indicators, patterns, and trend lines to identify
                    potential trading opportunities.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Fundamental Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Understand how economic data, central bank policies, and geopolitical events impact
                    currency prices and market sentiment.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Trading Psychology</h4>
                  <p className="text-sm text-muted-foreground">
                    Develop the mental discipline and emotional control needed to execute your trading plan
                    consistently and avoid common psychological pitfalls.
                  </p>
                </div>
              </CardContent>
            </Card>
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
                  Past performance is not indicative of future results. Our market analysis is for educational
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