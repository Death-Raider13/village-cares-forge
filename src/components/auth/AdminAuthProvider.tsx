import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { Eye, EyeOff, Mail, Lock, User, Shield, Settings } from 'lucide-react';
import AdminDashboard from '@/components/dashboard/AdminDashboard/Dashboard';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Admin credentials (in production, this should be handled more securely)
  const ADMIN_CREDENTIALS = {
    email: 'admin@andrewcaresvillage.com',
    password: 'AdminCares2025!',
    firstName: 'Admin',
    lastName: 'User'
  };

  useEffect(() => {
    if (user) {
      // Check if user is admin based on email or role
      const isAdmin = user.email === ADMIN_CREDENTIALS.email || 
                     user.user_metadata?.role === 'admin';
      
      setUserRole(isAdmin ? 'admin' : 'user');
      
      if (!isAdmin) {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Check if this is admin login
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        // Handle admin login (in production, use proper admin authentication)
        setUserRole('admin');
        setIsAdminDashboardOpen(true);
        
        // You might want to create a special admin session here
        // For now, we'll just set the role and open the dashboard
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('adminSession', JSON.stringify({
          email: ADMIN_CREDENTIALS.email,
          name: `${ADMIN_CREDENTIALS.firstName} ${ADMIN_CREDENTIALS.lastName}`,
          loginTime: new Date().toISOString()
        }));
        
        return;
      }
      
      // Regular user login
      await signIn(email, password);
      setUserRole('user');
      
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password, firstName, lastName);
      setUserRole('user');
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAccess = () => {
    setActiveTab('signin');
    setEmail(ADMIN_CREDENTIALS.email);
    setPassword('');
    // Focus on password field
    setTimeout(() => {
      const passwordField = document.getElementById('signin-password');
      if (passwordField) {
        passwordField.focus();
      }
    }, 100);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    resetForm();
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('adminSession');
    setUserRole(null);
    setIsAdminDashboardOpen(false);
    resetForm();
  };

  // Check for existing admin session on component mount
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const adminSession = localStorage.getItem('adminSession');
    
    if (storedRole === 'admin' && adminSession) {
      try {
        const session = JSON.parse(adminSession);
        const loginTime = new Date(session.loginTime);
        const now = new Date();
        const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
        
        // Auto-expire admin session after 8 hours
        if (hoursSinceLogin < 8) {
          setUserRole('admin');
          setIsAdminDashboardOpen(true);
        } else {
          // Session expired
          localStorage.removeItem('userRole');
          localStorage.removeItem('adminSession');
        }
      } catch (error) {
        // Invalid session data
        localStorage.removeItem('userRole');
        localStorage.removeItem('adminSession');
      }
    }
  }, []);

  // If admin dashboard is open, show it
  if (isAdminDashboardOpen && userRole === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vintage-warm-cream to-vintage-sage-green/10">
        <AdminDashboard 
          isOpen={true} 
          onClose={() => {
            setIsAdminDashboardOpen(false);
            handleLogout();
          }} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-warm-cream to-vintage-sage-green/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-4xl font-bold text-vintage-deep-blue mb-2">
            Welcome to Andrew Cares Village
          </h1>
          <p className="font-crimson text-vintage-dark-brown/80">
            Your gateway to excellence in Forex, Fitness, and Martial Arts
          </p>
        </div>

        {/* Admin Access Badge */}
        <div className="mb-6 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdminAccess}
            className="border-vintage-gold text-vintage-deep-blue hover:bg-vintage-gold/10"
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin Access
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin" className="font-semibold">
              {email === ADMIN_CREDENTIALS.email ? (
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Admin Sign In
                </div>
              ) : (
                'Sign In'
              )}
            </TabsTrigger>
            <TabsTrigger value="signup" className="font-semibold">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-vintage-gold/20">
              <CardHeader className="text-center">
                <CardTitle className="font-playfair text-2xl text-vintage-deep-blue flex items-center justify-center gap-2">
                  {email === ADMIN_CREDENTIALS.email && <Shield className="w-6 h-6" />}
                  {email === ADMIN_CREDENTIALS.email ? 'Admin Sign In' : 'Sign In'}
                </CardTitle>
                <CardDescription className="font-crimson">
                  {email === ADMIN_CREDENTIALS.email 
                    ? 'Access the admin dashboard and management tools'
                    : 'Access your learning journey'
                  }
                </CardDescription>
                {email === ADMIN_CREDENTIALS.email && (
                  <Badge className="bg-vintage-gold text-vintage-deep-blue mx-auto">
                    Administrator Access
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="font-semibold">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder={email === ADMIN_CREDENTIALS.email ? 'Admin Email' : 'Enter your email'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        readOnly={email === ADMIN_CREDENTIALS.email}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="font-semibold">
                      Password
                      {email === ADMIN_CREDENTIALS.email && (
                        <span className="text-xs text-vintage-dark-brown/60 ml-2">
                          (Admin credentials required)
                        </span>
                      )}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                      <Input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={email === ADMIN_CREDENTIALS.email ? 'Enter admin password' : 'Enter your password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        autoComplete={email === ADMIN_CREDENTIALS.email ? 'off' : 'current-password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-vintage-dark-brown/50 hover:text-vintage-dark-brown"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Security warning for admin login */}
                  {email === ADMIN_CREDENTIALS.email && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium">Administrator Access</p>
                          <p>You are logging in as an administrator. This session will be monitored and logged.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className={`w-full font-semibold py-3 ${
                      email === ADMIN_CREDENTIALS.email 
                        ? 'bg-vintage-burgundy hover:bg-vintage-deep-blue' 
                        : 'bg-vintage-deep-blue hover:bg-vintage-burgundy'
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      email === ADMIN_CREDENTIALS.email ? 'Authenticating...' : 'Signing In...'
                    ) : (
                      email === ADMIN_CREDENTIALS.email ? (
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Access Admin Dashboard
                        </div>
                      ) : (
                        'Sign In'
                      )
                    )}
                  </Button>

                  {/* Reset admin form */}
                  {email === ADMIN_CREDENTIALS.email && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setEmail('');
                        setPassword('');
                      }}
                    >
                      Back to Regular Login
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-vintage-gold/20">
              <CardHeader className="text-center">
                <CardTitle className="font-playfair text-2xl text-vintage-deep-blue">
                  Create Account
                </CardTitle>
                <CardDescription className="font-crimson">
                  Join our community of learners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="font-semibold">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                        <Input
                          id="first-name"
                          type="text"
                          placeholder="First name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="font-semibold">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                        <Input
                          id="last-name"
                          type="text"
                          placeholder="Last name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="font-semibold">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="font-semibold">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-vintage-dark-brown/50 hover:text-vintage-dark-brown"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800 font-medium mb-1">Password Requirements:</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Contains uppercase and lowercase letters</li>
                      <li>• Contains at least one number</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-vintage-deep-blue hover:bg-vintage-burgundy font-semibold py-3"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <p className="text-sm text-vintage-dark-brown/60">
            By continuing, you agree to our terms of service and privacy policy
          </p>
        </div>

        {/* Admin Info */}
        <div className="mt-8 text-center">
          <details className="text-sm text-vintage-dark-brown/70">
            <summary className="cursor-pointer hover:text-vintage-deep-blue">
              Administrator Information
            </summary>
            <div className="mt-2 p-3 bg-white/50 rounded-lg text-left">
              <p className="font-medium mb-2">For administrators:</p>
              <ul className="space-y-1 text-xs">
                <li>• Use the "Admin Access" button above</li>
                <li>• Admin credentials are required for dashboard access</li>
                <li>• Sessions auto-expire after 8 hours for security</li>
                <li>• All admin activities are logged and monitored</li>
              </ul>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default Auth;