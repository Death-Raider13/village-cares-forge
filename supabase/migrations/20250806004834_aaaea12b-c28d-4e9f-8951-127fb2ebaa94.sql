-- Now that pgcrypto is working, let's use proper password verification
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
    -- Use proper bcrypt verification with the pgcrypto extension
    (au.password_hash = public.crypt(admin_password, au.password_hash)) as is_valid
  FROM public.admin_users au
  WHERE au.email = admin_email AND au.is_active = true;
END;
$function$;