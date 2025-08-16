// pages/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ImprovedAdminPanel } from '@/components/admin/ImprovedAdminPanel';
import { Button } from '@/components/ui/button';
import { Shield, LogOut } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminPage: React.FC = () => {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ id: string; email: string } | null>(null);
  const { getStoredAdminUser, logoutAdmin } = useAdminAuth();

  useEffect(() => {
    // This page is already protected by ProtectedRoute with adminOnly=true
    // Just get the admin user for display purposes
    const storedUser = getStoredAdminUser();
    if (storedUser) {
      setAdminUser(storedUser);
    }
  }, [getStoredAdminUser]);

  const handleLogout = () => {
    logoutAdmin();
    router.replace('/');
  };

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
            <Button variant="outline" onClick={() => router.push('/')}>
              Return to Site
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <ImprovedAdminPanel onClose={() => router.push('/')} />
      </div>
    </div>
  );
};

export default AdminPage;