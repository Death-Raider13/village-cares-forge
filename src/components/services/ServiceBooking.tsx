
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  category: string;
}

interface ServiceBookingProps {
  service: Service;
  onBookingComplete: () => void;
}

const ServiceBooking: React.FC<ServiceBookingProps> = ({ service, onBookingComplete }) => {
  const [bookingDate, setBookingDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          service_id: service.id,
          booking_date: new Date(bookingDate).toISOString(),
          notes,
        });

      if (error) throw error;

      toast({
        title: "Booking confirmed!",
        description: `Your ${service.name} session has been booked.`,
      });

      onBookingComplete();
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">{formatPrice(service.price)}</span>
          <span className="text-sm text-muted-foreground">
            {service.duration_minutes} minutes
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBooking} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="booking-date">Preferred Date & Time</Label>
            <Input
              id="booking-date"
              type="datetime-local"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements or questions..."
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || !user}>
            {loading ? 'Booking...' : 'Book Session'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceBooking;
