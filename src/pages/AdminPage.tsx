// pages/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '@/components/admin/AdminPanel';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, LogOut } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<{ id: string; email: string } | null>(null);
  const { isAdminAuthenticated, getStoredAdminUser, logoutAdmin } = useAdminAuth();

  useEffect(() => {
    const checkAdminAccess = () => {
      setIsLoading(true);

      // Check if user is authenticated as admin
      if (isAdminAuthenticated()) {
        const storedUser = getStoredAdminUser();
        if (storedUser) {
          setAdminUser(storedUser);
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      setIsLoading(false);
    };

    checkAdminAccess();
  }, [isAdminAuthenticated, getStoredAdminUser]);

  // Redirect non-admin users to the admin login page
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/admin-login', { replace: true });
    }
  }, [isAdmin, isLoading, navigate]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/', { replace: true });
  };

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
            <div>
              <h1 className="text-3xl font-bold">Admin Control Panel</h1>
              {adminUser && (
                <p className="text-sm text-gray-600">Logged in as: {adminUser.email}</p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/')}>
              Return to Site
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <AdminPanel isOpen={true} onClose={() => navigate('/')} />
      </div>
    </div>
  );
};

export default AdminPage;