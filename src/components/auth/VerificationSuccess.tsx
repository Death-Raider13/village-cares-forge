import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Home, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

const VerificationSuccess: React.FC = () => {
    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
    const [countdown, setCountdown] = useState(5);
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        const handleEmailVerification = async () => {
            try {
                // Get token from URL params
                const token = router.query.token;
                const type = router.query.type;

                if (!token || type !== 'email') {
                    setVerificationStatus('error');
                    return;
                }

                // Verify the email with Supabase
                const { data, error } = await supabase.auth.verifyOtp({
                    token_hash: token as string,
                    type: 'email'
                });

                if (error) {
                    console.error('Verification error:', error);
                    if (error.message.includes('expired') || error.message.includes('invalid')) {
                        setVerificationStatus('expired');
                    } else {
                        setVerificationStatus('error');
                    }
                    return;
                }

                if (data.user) {
                    setVerificationStatus('success');
                    toast({
                        title: 'Email Verified!',
                        description: 'Your email has been successfully verified.',
                        variant: 'default',
                    });

                    // Start countdown for redirect
                    const timer = setInterval(() => {
                        setCountdown((prev) => {
                            if (prev <= 1) {
                                clearInterval(timer);
                                router.replace('/');
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);

                    return () => clearInterval(timer);
                }
            } catch (error) {
                console.error('Verification process error:', error);
                setVerificationStatus('error');
            }
        };

        // Only run when router is ready and has query params
        if (router.isReady) {
            handleEmailVerification();
        }
    }, [router, toast]);

    const handleGoHome = () => {
        router.replace('/');
    };

    const handleResendVerification = () => {
        router.push('/verify-email');
    };

    const renderContent = () => {
        switch (verificationStatus) {
            case 'loading':
                return (
                    <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-2 border-vintage-gold/20">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 w-16 h-16 bg-vintage-deep-blue/10 rounded-full flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-vintage-deep-blue animate-spin" />
                            </div>
                            <CardTitle className="font-playfair text-2xl text-vintage-deep-blue">
                                Verifying Email
                            </CardTitle>
                            <CardDescription className="font-crimson">
                                Please wait while we verify your email address...
                            </CardDescription>
                        </CardHeader>
                    </Card>
                );

            case 'success':
                return (
                    <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-2 border-green-200">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <CardTitle className="font-playfair text-2xl text-green-700">
                                Email Verified Successfully!
                            </CardTitle>
                            <CardDescription className="font-crimson">
                                Welcome to Andrew Cares Village! Your account is now active.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert className="border-green-200 bg-green-50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    Your email has been successfully verified. You can now access all features of the platform.
                                </AlertDescription>
                            </Alert>

                            <div className="text-center p-4 bg-vintage-sage-green/10 rounded-lg">
                                <p className="text-sm text-vintage-dark-brown/70 mb-1">
                                    Redirecting to homepage in
                                </p>
                                <p className="text-2xl font-bold text-vintage-deep-blue">
                                    {countdown}
                                </p>
                            </div>

                            <Button
                                onClick={handleGoHome}
                                className="w-full bg-vintage-deep-blue hover:bg-vintage-burgundy"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Go to Homepage Now
                            </Button>
                        </CardContent>
                    </Card>
                );

            case 'expired':
                return (
                    <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-2 border-orange-200">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-orange-600" />
                            </div>
                            <CardTitle className="font-playfair text-2xl text-orange-700">
                                Verification Link Expired
                            </CardTitle>
                            <CardDescription className="font-crimson">
                                The verification link has expired or is invalid.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert className="border-orange-200 bg-orange-50">
                                <AlertCircle className="h-4 w-4 text-orange-600" />
                                <AlertDescription className="text-orange-800">
                                    This verification link has expired. Please request a new verification email.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-3">
                                <Button
                                    onClick={handleResendVerification}
                                    className="w-full bg-vintage-deep-blue hover:bg-vintage-burgundy"
                                >
                                    Request New Verification Email
                                </Button>

                                <Button
                                    onClick={() => router.push('/auth')}
                                    variant="outline"
                                    className="w-full border-vintage-deep-blue text-vintage-deep-blue hover:bg-vintage-deep-blue hover:text-white"
                                >
                                    Back to Login
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );

            case 'error':
            default:
                return (
                    <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-2 border-red-200">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <CardTitle className="font-playfair text-2xl text-red-700">
                                Verification Failed
                            </CardTitle>
                            <CardDescription className="font-crimson">
                                There was an error verifying your email address.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert className="border-red-200 bg-red-50">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800">
                                    The verification link is invalid or has already been used. Please try again.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-3">
                                <Button
                                    onClick={handleResendVerification}
                                    className="w-full bg-vintage-deep-blue hover:bg-vintage-burgundy"
                                >
                                    Request New Verification Email
                                </Button>

                                <Button
                                    onClick={() => router.push('/auth')}
                                    variant="outline"
                                    className="w-full border-vintage-deep-blue text-vintage-deep-blue hover:bg-vintage-deep-blue hover:text-white"
                                >
                                    Back to Login
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-vintage-warm-cream to-vintage-sage-green/10 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="font-playfair text-4xl font-bold text-vintage-deep-blue mb-2">
                        Email Verification
                    </h1>
                    <p className="font-crimson text-vintage-dark-brown/80">
                        Andrew Cares Village
                    </p>
                </div>

                {renderContent()}
            </div>
        </div>
    );
};

export default VerificationSuccess;