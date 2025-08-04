// hooks/useAdminAuth.ts
import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Your Supabase client

interface AdminUser {
    id: string;
    email: string;
}

interface AdminAuthResult {
    user: AdminUser | null;
    error: string | null;
}

export const useAdminAuth = () => {
    const [loading, setLoading] = useState(false);

    const verifyAdminLogin = async (email: string, password: string): Promise<AdminAuthResult> => {
        setLoading(true);

        try {
            const { data, error } = await supabase
                .rpc('verify_admin_login', {
                    admin_email: email,
                    admin_password: password
                });

            if (error) {
                throw error;
            }

            if (data && data.length > 0 && data[0].is_valid) {
                const adminUser = {
                    id: data[0].id,
                    email: data[0].email
                };

                // Store admin session in sessionStorage (more secure than localStorage for admin)
                sessionStorage.setItem('adminUser', JSON.stringify(adminUser));
                sessionStorage.setItem('isAdminAuthenticated', 'true');

                return { user: adminUser, error: null };
            } else {
                return { user: null, error: 'Invalid admin credentials' };
            }
        } catch (error) {
            console.error('Admin login error:', error);
            return { user: null, error: 'Login failed. Please try again.' };
        } finally {
            setLoading(false);
        }
    };

    const checkIfAdminEmail = (email: string): boolean => {
        const adminEmails = ['lateefedidi4@gmail.com', 'andrewcares556@gmail.com'];
        return adminEmails.includes(email.toLowerCase());
    };

    const getStoredAdminUser = (): AdminUser | null => {
        try {
            const storedUser = sessionStorage.getItem('adminUser');
            const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';

            if (storedUser && isAuthenticated) {
                return JSON.parse(storedUser);
            }
        } catch (error) {
            console.error('Error reading admin user from storage:', error);
        }
        return null;
    };

    const logoutAdmin = () => {
        sessionStorage.removeItem('adminUser');
        sessionStorage.removeItem('isAdminAuthenticated');
    };

    const isAdminAuthenticated = (): boolean => {
        return sessionStorage.getItem('isAdminAuthenticated') === 'true';
    };

    return {
        verifyAdminLogin,
        checkIfAdminEmail,
        getStoredAdminUser,
        logoutAdmin,
        isAdminAuthenticated,
        loading
    };
};