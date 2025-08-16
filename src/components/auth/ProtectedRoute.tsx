import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './AuthProvider';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent } from '@/components/ui/card';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  requireVerification?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
  requireVerification = true
}) => {
  const { user, loading } = useAuth();
  const { isAdminAuthenticated } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    // For admin-only routes
    if (adminOnly && !loading) {
      if (!isAdminAuthenticated()) {
        router.replace('/admin-login');
        return;
      }
    }

    // For regular protected routes
    if (!adminOnly && !loading) {
      const isAuthenticated = user || isAdminAuthenticated();

      if (!isAuthenticated) {
        router.replace('/auth');
        return;
      }

      // Check email verification for regular users (not admins)
      if (requireVerification && user && !user.email_confirmed_at && !isAdminAuthenticated()) {
        router.replace('/verify-email');
        return;
      }
    }
  }, [user, loading, adminOnly, requireVerification, isAdminAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vintage-warm-cream to-vintage-sage-green/10">
        <Card className="p-6">
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-deep-blue mx-auto mb-4"></div>
            <p className="text-vintage-dark-brown">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // For admin-only routes
  if (adminOnly) {
    if (!isAdminAuthenticated()) {
      return null; // Will redirect via useEffect
    }
    return <>{children}</>;
  }

  // For regular protected routes
  const isAuthenticated = user || isAdminAuthenticated();

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  // Check email verification for regular users (not admins)
  if (requireVerification && user && !user.email_confirmed_at && !isAdminAuthenticated()) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
};