import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import AdminPanel from '@/components/admin/AdminPanel';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle } from 'lucide-react';

// Admin emails - these would typically be stored in a more secure way
const ADMIN_EMAILS = ['lateefedidi4@gmail.com', 'andrewcares556@gmail.com'];

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = () => {
      setIsLoading(true);

      // Check if user has been authenticated through the AdminLogin page
      const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

      // If user is authenticated through the AdminLogin page, allow access
      if (isAuthenticated) {
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }

      // If not admin-authenticated, check regular auth flow
      if (!user || !user.email) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      // Use a more robust case-insensitive comparison for email
      const isAdminEmail = ADMIN_EMAILS.some(
        email => email.toLowerCase() === user.email.toLowerCase()
      );

      // For regular auth users, require both admin email and authentication
      setIsAdmin(isAdminEmail && isAuthenticated);
      setIsLoading(false);
    };

    checkAdminAccess();
  }, [user]);

  // Redirect non-admin users to the admin login page or home page
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      // If user has admin email but not authenticated, redirect to admin login
      if (user && user.email && ADMIN_EMAILS.some(
        email => email.toLowerCase() === user.email!.toLowerCase()
      )) {
        navigate('/admin-login', { replace: true });
      } else {
        // Otherwise redirect to home
        navigate('/', { replace: true });
      }
    }
  }, [isAdmin, isLoading, navigate, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg border border-red-200">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h1>
          <p className="text-gray-700 mb-4">You don't have permission to access this page.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-vintage-burgundy" />
            <h1 className="text-3xl font-bold">Admin Control Panel</h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>Return to Site</Button>
        </div>

        <AdminPanel isOpen={true} onClose={() => navigate('/')} />
      </div>
    </div>
  );
};

export default AdminPage;