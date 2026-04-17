-- Step 1: Wipe all existing policies on profiles to stop any recursion (500 errors)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Programme Team can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users see own profiles" ON public.profiles;

-- Step 2: Create a simple, non-recursive policy for testing
-- We will tighten this back up once we confirm the 500 error is resolved.
CREATE POLICY "Temporary Open Access" ON public.profiles
  FOR SELECT USING (true);

-- Step 3: Ensure the trigger is also clean and modern
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, startup_name, role, status)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'startup_name',
    COALESCE(new.raw_user_meta_data->>'role', 'startup'),
    CASE 
      WHEN (new.raw_user_meta_data->>'role' = 'admin' OR new.raw_user_meta_data->>'role' = 'programme_team') THEN 'approved'
      ELSE 'pending'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
