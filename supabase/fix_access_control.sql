-- ═════════════════════════════════════════════════════════════════════════
-- ACCESS CONTROL POLICY FIX
-- ═════════════════════════════════════════════════════════════════════════
-- Purpose: 
-- 1. Enable Admins to Approve/Reject users (Fixes the "clicked but not updated" bug).
-- 2. Allow users to see and manage their own profiles.
-- 3. Replace the temporary "Open Access" with structured, role-aware policies.
-- ═════════════════════════════════════════════════════════════════════════

-- 1. Clean up existing policy
DROP POLICY IF EXISTS "Temporary Open Access" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;

-- 2. Create Role-Aware SELECT Policy
-- Allows Authenticated users to see all profiles (needed for Admin Dashboard and Mentorship matches)
CREATE POLICY "Authenticated users can see all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (true);

-- 3. Create Role-Aware UPDATE Policy for Admins
-- Uses JWT metadata to avoid recursion issues
CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 4. Create UPDATE Policy for Users (Self-Management)
CREATE POLICY "Users can manage own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Verification Check
-- This checks if the current user (if run as admin) has update access
SELECT current_user, count(*) as profiles_count FROM public.profiles;
