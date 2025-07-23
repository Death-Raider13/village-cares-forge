
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Shield, Star } from 'lucide-react';
import { toast } from 'sonner';

const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });

  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return;
        }
        await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
      } else {
        await signIn(formData.email, formData.password);
      }
    } catch (error) {
      // Error handling is done in AuthProvider
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security'
    },
    {
      icon: Star,
      title: 'Personalized Experience',
      description: 'Tailored content based on your goals and preferences'
    },
    {
      icon: ArrowRight,
      title: 'Expert Guidance',
      description: 'Access professional training and trading strategies'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-deep-blue via-vintage-forest-green to-vintage-dark-brown flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Features */}
        <div className="text-center lg:text-left space-y-8 text-vintage-warm-cream">
          <div>
            <h1 className="font-playfair font-bold text-4xl md:text-6xl mb-4">
              Welcome to Your Journey
            </h1>
            <p className="font-crimson text-xl md:text-2xl opacity-90 leading-relaxed">
              Master forex trading, achieve fitness goals, and learn martial arts with expert guidance
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-vintage-gold/20 backdrop-blur-sm">
                  <feature.icon className="h-6 w-6 text-vintage-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-vintage-warm-cream/80">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-playfair text-vintage-deep-blue">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </CardTitle>
              <CardDescription className="text-vintage-dark-brown/70">
                {isSignUp 
                  ? 'Join thousands of learners on their transformation journey' 
                  : 'Sign in to continue your learning journey'
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Tabs value={isSignUp ? 'signup' : 'signin'} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger 
                    value="signin" 
                    onClick={() => setIsSignUp(false)}
                    className="data-[state=active]:bg-vintage-deep-blue data-[state=active]:text-white"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    onClick={() => setIsSignUp(true)}
                    className="data-[state=active]:bg-vintage-deep-blue data-[state=active]:text-white"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <TabsContent value="signup" className="space-y-4 mt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-vintage-dark-brown">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="pl-10 border-vintage-sage-green/30 focus:border-vintage-deep-blue"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-vintage-dark-brown">Last Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="pl-10 border-vintage-sage-green/30 focus:border-vintage-deep-blue"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-vintage-dark-brown">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="pl-10 border-vintage-sage-green/30 focus:border-vintage-deep-blue"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-vintage-dark-brown">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="pl-10 pr-10 border-vintage-sage-green/30 focus:border-vintage-deep-blue"
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

                  <TabsContent value="signup" className="space-y-4 mt-0">
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-vintage-dark-brown">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className="pl-10 border-vintage-sage-green/30 focus:border-vintage-deep-blue"
                          required
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <Button 
                    type="submit" 
                    className="w-full bg-vintage-deep-blue hover:bg-vintage-forest-green text-white font-semibold py-3 transition-colors duration-200"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {isSignUp ? 'Create Account' : 'Sign In'}
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>

                <div className="mt-6">
                  <Separator className="mb-4" />
                  <p className="text-center text-sm text-vintage-dark-brown/70">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-vintage-deep-blue hover:text-vintage-forest-green font-semibold underline"
                    >
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
