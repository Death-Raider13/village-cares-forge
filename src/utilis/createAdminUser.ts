import { supabase } from '@/integrations/supabase/client';

interface CreateAdminUserResult {
  success: boolean;
  message: string;
  user?: any;
  error?: any;
}

export const createAdminUser = async (): Promise<CreateAdminUserResult> => {
  try {
    console.log('Creating admin user...');
    
    // Admin user details
    const adminUserData = {
      email: 'admin@andrewcaresvillage.com',
      password: 'AdminCares2025!',
      user_metadata: {
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin'
      }
    };

    // Note: This requires the service_role key, not the anon key
    // You'll need to use the service_role key for this operation
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminUserData.email,
      password: adminUserData.password,
      user_metadata: adminUserData.user_metadata,
      email_confirm: true // Skip email confirmation for admin
    });

    if (error) {
      console.error('Error creating admin user:', error);
      return {
        success: false,
        message: `Failed to create admin user: ${error.message}`,
        error
      };
    }

    console.log('Admin user created successfully:', data);
    return {
      success: true,
      message: 'Admin user created successfully!',
      user: data.user
    };

  } catch (error: any) {
    console.error('Unexpected error creating admin user:', error);
    return {
      success: false,
      message: `Unexpected error: ${error.message}`,
      error
    };
  }
};

// Alternative method: Create admin user via sign up (if you don't have service_role access)
export const createAdminUserViaSignUp = async (): Promise<CreateAdminUserResult> => {
  try {
    console.log('Creating admin user via sign up...');
    
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@andrewcaresvillage.com',
      password: 'AdminCares2025!',
      options: {
        data: {
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin'
        }
      }
    });

    if (error) {
      return {
        success: false,
        message: `Failed to create admin user: ${error.message}`,
        error
      };
    }

    return {
      success: true,
      message: 'Admin user created successfully! Please check email for confirmation.',
      user: data.user
    };

  } catch (error: any) {
    return {
      success: false,
      message: `Unexpected error: ${error.message}`,
      error
    };
  }
};

// Function to check if admin user already exists
export const checkAdminUserExists = async (): Promise<boolean> => {
  try {
    // This is a workaround since we can't directly query users with anon key
    // We'll try to sign in with admin credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@andrewcaresvillage.com',
      password: 'AdminCares2025!'
    });

    if (data.user) {
      // Sign out immediately after checking
      await supabase.auth.signOut();
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};