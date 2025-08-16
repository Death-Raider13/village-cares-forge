import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './AuthProvider';
import { Card, CardContent } from '@/components/ui/card';

interface AuthGuardProps {
    children: React.ReactNode;
    requireVerification?: boolean;
}

/**
 * AuthGuard component to protect routes and ensure email verification
 * This component checks both authentication and email verification status
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
    children,
    requireVerification = true
}) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!loading && !user) {
            router.replace('/auth');
            return;
        }

        // Check email verification if required
        if (!loading && user && requireVerification && !user.email_confirmed_at) {
            router.replace('/verify-email');
            return;
        }
    }, [user, loading, requireVerification, router]);

    // Show loading spinner while checking auth state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vintage-warm-cream to-vintage-sage-green/10">
                <Card className="p-6">
                    <CardContent className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-deep-blue mx-auto mb-4"></div>
                        <p className="text-vintage-dark-brown">Checking authentication...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return null; // Will redirect via useEffect
    }

    // Check email verification if required
    if (requireVerification && !user.email_confirmed_at) {
        return null; // Will redirect via useEffect
    }

    // User is authenticated and verified (if required)
    return <>{children}</>;
};