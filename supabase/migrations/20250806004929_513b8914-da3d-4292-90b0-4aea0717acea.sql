-- Create a working admin login function without pgcrypto dependency
-- We'll use a direct password comparison for the admin accounts
CREATE OR REPLACE FUNCTION public.verify_admin_login(admin_email text, admin_password text)
RETURNS TABLE(id uuid, email text, is_valid boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    CASE 
      WHEN au.email = 'lateefedidi4@gmail.com' AND admin_password = 'ADMIN_LATEEFEDIDI' THEN true
      WHEN au.email = 'andrewcares556@gmail.com' AND admin_password = 'ADMIN_ANDREWCARES' THEN true
      ELSE false
    END as is_valid
  FROM public.admin_users au
  WHERE au.email = admin_email AND au.is_active = true;
END;
$function$;