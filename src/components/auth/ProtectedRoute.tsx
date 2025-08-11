import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

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
      return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }

  // For regular protected routes
  const isAuthenticated = user || isAdminAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check email verification for regular users (not admins)
  if (requireVerification && user && !user.email_confirmed_at && !isAdminAuthenticated()) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};