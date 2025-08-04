import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';

// Admin emails and password - these would typically be stored in a more secure way
const ADMIN_EMAILS = ['lateefedidi4@gmail.com', 'andrewcares556@gmail.com'];
const ADMIN_PASSWORD = 'ADMIN_ANDREWCARES';

const AdminLogin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const checkAdminEmail = () => {
      setIsLoading(true);

      // If user is logged in, check if they're an admin
      if (user && user.email) {
        // Check if user email is in admin list (case-insensitive)
        const isAdminEmail = ADMIN_EMAILS.some(
          email => email.toLowerCase() === user.email!.toLowerCase()
        );

        setIsAdmin(isAdminEmail);

        // If logged in but not an admin, redirect to home
        if (!isAdminEmail) {
          navigate('/', { replace: true });
        }
      } else {
        // For unauthenticated users, just show the admin login form
        // They'll need to provide both email and password
        setIsAdmin(false);
      }

      setIsLoading(false);
    };

    checkAdminEmail();
  }, [user, navigate]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trim password to remove any whitespace
    const trimmedPassword = password.trim();

    // Log for debugging
    console.log('Attempting admin verification');

    // Compare passwords (case-sensitive)
    if (trimmedPassword === ADMIN_PASSWORD) {
      console.log('Admin password verified successfully');
      setError('');
      setSuccess('Admin access granted');

      // Set admin authentication flag in localStorage
      localStorage.setItem('isAdminAuthenticated', 'true');

      // Redirect to admin page after a short delay
      setTimeout(() => {
        navigate('/admin', { replace: true });
      }, 1000);
    } else {
      console.log('Password verification failed');
      console.log('Entered (trimmed):', trimmedPassword);
      console.log('Expected:', ADMIN_PASSWORD);
      console.log('Length comparison:', trimmedPassword.length, ADMIN_PASSWORD.length);

      // Check if it's just a case issue
      if (trimmedPassword.toLowerCase() === ADMIN_PASSWORD.toLowerCase()) {
        console.log('Case mismatch detected - accepting anyway');
        setError('');
        setSuccess('Admin access granted (note: password case mismatch)');

        // Set admin authentication flag in localStorage
        localStorage.setItem('isAdminAuthenticated', 'true');

        // Redirect to admin page after a short delay
        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 1000);
      } else {
        setError('Invalid admin password');
        setSuccess('');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // For unauthenticated users, show a form to enter both email and password
  if (!user) {
    const handleAdminLogin = (e: React.FormEvent) => {
      e.preventDefault();

      // Check if the entered email is in the admin list
      const isAdminEmail = ADMIN_EMAILS.some(
        email => email.toLowerCase() === adminEmail.trim().toLowerCase()
      );

      if (!isAdminEmail) {
        setError('Invalid admin email address');
        return;
      }

      // If email is valid, check the password
      const trimmedPassword = password.trim();

      if (trimmedPassword === ADMIN_PASSWORD ||
        trimmedPassword.toLowerCase() === ADMIN_PASSWORD.toLowerCase()) {
        setError('');
        setSuccess('Admin access granted');

        // Set admin authentication flag in localStorage
        localStorage.setItem('isAdminAuthenticated', 'true');

        // Redirect to admin page after a short delay
        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 1000);
      } else {
        setError('Invalid admin password');
      }
    };

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
            <CardTitle className="text-center text-2xl font-bold text-white">ADMIN LOGIN</CardTitle>
            <CardDescription className="text-center text-slate-300">
              Secure Area - Enter your admin credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
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

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-white">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter admin email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-white">Admin Password</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter admin password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
              >
                Login as Admin
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                onClick={() => navigate('/', { replace: true })}
              >
                Return to Home
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // For logged-in users who aren't admins
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg border border-red-200">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h1>
          <p className="text-gray-700 mb-4">Your account does not have admin privileges.</p>
          <Button onClick={() => navigate('/', { replace: true })}>Return to Home</Button>
        </div>
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
          <CardTitle className="text-center text-2xl font-bold text-white">ADMIN VERIFICATION</CardTitle>
          <CardDescription className="text-center text-slate-300">
            Secure Area - Enter the admin password to access the control panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
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

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Admin Password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
            >
              Verify Admin Access
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              onClick={() => navigate('/', { replace: true })}
            >
              Return to Home
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;