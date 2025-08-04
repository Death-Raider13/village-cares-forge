import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from '@/lib/security';

const AdminLogin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      setIsLoading(true);

      if (user) {
        try {
          // Check user role from profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching user profile:', error);
            setIsAdmin(false);
          } else {
            const userIsAdmin = profile?.role === 'admin';
            setIsAdmin(userIsAdmin);

            if (userIsAdmin) {
              // Log successful admin access
              logSecurityEvent({
                type: 'auth_success',
                userId: user.id,
                email: user.email,
                details: { action: 'admin_login_verification' }
              });

              setSuccess('Admin access verified');
              setTimeout(() => {
                navigate('/admin', { replace: true });
              }, 1000);
            } else {
              // Log failed admin access attempt
              logSecurityEvent({
                type: 'auth_failure',
                userId: user.id,
                email: user.email,
                details: { 
                  action: 'admin_access_denied',
                  reason: 'insufficient_privileges',
                  userRole: profile?.role || 'unknown'
                }
              });

              setError('Access denied: Admin privileges required');
            }
          }
        } catch (err) {
          console.error('Admin role check error:', err);
          setError('Failed to verify admin privileges');
        }
      } else {
        // User not authenticated, redirect to auth page
        navigate('/auth', { replace: true });
      }

      setIsLoading(false);
    };

    checkAdminRole();
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Admin Banner */}
      <div className="absolute top-0 left-0 right-0 bg-red-600 text-white py-2 px-4 text-center font-bold">
        ADMIN AREA - AUTHORIZED PERSONNEL ONLY
      </div>

      <Card className="w-full max-w-md mx-auto bg-slate-800/90 backdrop-blur-sm border-2 border-amber-500 shadow-lg shadow-amber-500/20">
        <CardHeader className="border-b border-slate-700 pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-amber-500 p-3 rounded-full">
              <Shield className="h-12 w-12 text-slate-900" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold text-white">
            ADMIN ACCESS VERIFICATION
          </CardTitle>
          <CardDescription className="text-center text-slate-300">
            Checking your admin privileges...
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {!isAdmin && (
            <div className="space-y-4">
              <p className="text-slate-300 text-center">
                You need admin privileges to access this area.
              </p>
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                onClick={() => navigate('/', { replace: true })}
              >
                Return to Home
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;