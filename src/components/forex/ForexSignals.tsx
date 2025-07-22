
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';

interface ForexSignal {
  id: string;
  currency_pair: string;
  signal_type: 'buy' | 'sell';
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  confidence_level: number;
  description: string;
  status: string;
  created_at: string;
}

const ForexSignals: React.FC = () => {
  const [signals, setSignals] = useState<ForexSignal[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getSignalIcon = (type: 'buy' | 'sell') => {
    return type === 'buy' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getConfidenceColor = (level: number) => {
    if (level >= 4) return 'bg-green-100 text-green-800';
    if (level >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return <div className="text-center py-8">Loading forex signals...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Live Forex Signals</h2>
        <p className="text-muted-foreground">Professional trading signals with detailed analysis</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {signals.map((signal) => (
          <Card key={signal.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getSignalIcon(signal.signal_type)}
                  {signal.currency_pair}
                </CardTitle>
                <Badge 
                  variant={signal.signal_type === 'buy' ? 'default' : 'destructive'}
                  className="uppercase"
                >
                  {signal.signal_type}
                </Badge>
              </div>
              <CardDescription>{signal.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Entry:</span>
                  <div>{formatPrice(signal.entry_price)}</div>
                </div>
                <div>
                  <span className="font-medium">Stop Loss:</span>
                  <div>{formatPrice(signal.stop_loss)}</div>
                </div>
                <div>
                  <span className="font-medium">Take Profit:</span>
                  <div>{formatPrice(signal.take_profit)}</div>
                </div>
                <div>
                  <span className="font-medium">Confidence:</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: signal.confidence_level }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  Posted: {new Date(signal.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ForexSignals;
