
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PasswordStrength } from '@/components/ui/password-strength';
import { useAuth } from '@/components/auth/AuthProvider';
import { signInSchema, signUpSchema, SignInFormData, SignUpFormData } from '@/lib/validation';
import { sanitizeInput } from '@/lib/security';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const Auth: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      const redirectTo = (location.state as any)?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSignIn = async (data: SignInFormData) => {
    try {
      const sanitizedEmail = sanitizeInput(data.email);
      await signIn(sanitizedEmail, data.password);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    try {
      const sanitizedFirstName = sanitizeInput(data.firstName);
      const sanitizedLastName = sanitizeInput(data.lastName);
      const sanitizedEmail = sanitizeInput(data.email);
      
      await signUp(sanitizedEmail, data.password, sanitizedFirstName, sanitizedLastName);
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    signInForm.reset();
    signUpForm.reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

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

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin" className="font-semibold">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="font-semibold">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-vintage-gold/20">
              <CardHeader className="text-center">
                <CardTitle className="font-playfair text-2xl text-vintage-deep-blue">
                  Sign In
                </CardTitle>
                <CardDescription className="font-crimson">
                  Access your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...signInForm}>
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                    <FormField
                      control={signInForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                              <Input
                                type="email"
                                placeholder="Enter your email"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signInForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className="pl-10 pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-vintage-dark-brown/50 hover:text-vintage-dark-brown"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-vintage-deep-blue hover:bg-vintage-burgundy font-semibold py-3"
                      disabled={signInForm.formState.isSubmitting}
                    >
                      {signInForm.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>
                </Form>
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
                <Form {...signUpForm}>
                  <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={signUpForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">First Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                                <Input
                                  type="text"
                                  placeholder="First name"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Last Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                                <Input
                                  type="text"
                                  placeholder="Last name"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={signUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                              <Input
                                type="email"
                                placeholder="Enter your email"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                className="pl-10 pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-vintage-dark-brown/50 hover:text-vintage-dark-brown"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <PasswordStrength password={field.value} className="mt-2" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-vintage-dark-brown/50" />
                              <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                className="pl-10 pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-vintage-dark-brown/50 hover:text-vintage-dark-brown"
                              >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-vintage-deep-blue hover:bg-vintage-burgundy font-semibold py-3"
                      disabled={signUpForm.formState.isSubmitting}
                    >
                      {signUpForm.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <p className="text-sm text-vintage-dark-brown/60">
            By continuing, you agree to our terms of service and privacy policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
