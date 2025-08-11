import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const EmailVerification: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
    const [searchParams] = useSearchParams();
    const { user, resendVerificationEmail } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        // Check if user is already verified
        if (user?.email_confirmed_at) {
            setVerificationStatus('success');
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 3000);
        }

        // Set email from user or URL params
        if (user?.email) {
            setEmail(user.email);
        } else {
            const emailParam = searchParams.get('email');
            if (emailParam) {
                setEmail(emailParam);
            }
        }
    }, [user, searchParams, navigate]);

    const handleResendVerification = async () => {
        if (!email) {
            toast({
                title: 'Error',
                description: 'Please enter your email address',
                variant: 'destructive',
            });
            return;
        }

        setIsResending(true);
        try {
            const result = await resendVerificationEmail(email);
            if (result.error) {
                toast({
                    title: 'Error',
                    description: result.error,
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Email Sent',
                    description: 'A new verification email has been sent to your inbox.',
                    variant: 'default',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to resend verification email',
                variant: 'destructive',
            });
        } finally {
            setIsResending(false);
        }
    };

    const handleGoToLogin = () => {
        navigate('/auth');
    };

    if (verificationStatus === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-vintage-warm-cream to-vintage-sage-green/10 flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-2 border-green-200">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <CardTitle className="font-playfair text-2xl text-green-700">
                            Email Verified!
                        </CardTitle>
                        <CardDescription className="font-crimson">
                            Your email has been successfully verified. Redirecting...
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-vintage-warm-cream to-vintage-sage-green/10 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="font-playfair text-4xl font-bold text-vintage-deep-blue mb-2">
                        Verify Your Email
                    </h1>
                    <p className="font-crimson text-vintage-dark-brown/80">
                        Check your inbox to complete your registration
                    </p>
                </div>

                <Card className="bg-white/95 backdrop-blur-sm border-2 border-vintage-gold/20">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-16 h-16 bg-vintage-deep-blue/10 rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 text-vintage-deep-blue" />
                        </div>
                        <CardTitle className="font-playfair text-xl text-vintage-deep-blue">
                            Verify Your Email Address
                        </CardTitle>
                        <CardDescription className="font-crimson">
                            We've sent a verification link to your email address
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Please check your email inbox (including spam folder) and click the verification link to activate your account.
                            </AlertDescription>
                        </Alert>

                        {email && (
                            <div className="text-center p-4 bg-vintage-sage-green/10 rounded-lg">
                                <p className="text-sm text-vintage-dark-brown/70 mb-2">
                                    Verification email sent to:
                                </p>
                                <p className="font-semibold text-vintage-deep-blue">
                                    {email}
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="font-semibold">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="mt-1"
                                />
                            </div>

                            <Button
                                onClick={handleResendVerification}
                                disabled={isResending || !email}
                                className="w-full bg-vintage-deep-blue hover:bg-vintage-burgundy"
                                variant="default"
                            >
                                {isResending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Resend Verification Email'
                                )}
                            </Button>

                            <Button
                                onClick={handleGoToLogin}
                                variant="outline"
                                className="w-full border-vintage-deep-blue text-vintage-deep-blue hover:bg-vintage-deep-blue hover:text-white"
                            >
                                Back to Sign In
                            </Button>
                        </div>

                        <div className="text-center text-sm text-vintage-dark-brown/60">
                            <p>
                                Didn't receive the email? Check your spam folder or click "Resend Verification Email" above.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EmailVerification;