-- ═════════════════════════════════════════════════════════════════════════
-- MEGA-FIX: PLATFORM INFRASTRUCTURE & ACCESS REPAIR
-- ═════════════════════════════════════════════════════════════════════════
-- Purpose:
-- 1. Synchronise physical schema with code requirements (p8_team_members, roadmap).
-- 2. Restore Admin approval functionality (Fixes RLS "clicked but not updated").
-- 3. Resolve Startup session creation hangs.
-- 4. Repair corrupted or missing profile records.
-- ═════════════════════════════════════════════════════════════════════════

-- 1. Schema Synchronisation (Teams Table)
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS p8_team_members JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS roadmap JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS submission_status TEXT DEFAULT 'draft';
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS diagnosis_visible BOOLEAN DEFAULT FALSE;

-- 2. Account & Profile Repair
-- This ensures test1@inunity.in and others have valid records linked to auth.users
INSERT INTO public.profiles (id, email, full_name, role, status)
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'full_name', 
  COALESCE(raw_user_meta_data->>'role', 'startup'),
  CASE 
    WHEN (raw_user_meta_data->>'role' = 'admin' OR raw_user_meta_data->>'role' = 'programme_team') THEN 'approved'
    ELSE 'pending'
  END
FROM auth.users
ON CONFLICT (id) DO UPDATE 
SET 
  email = COALESCE(public.profiles.email, EXCLUDED.email),
  role = COALESCE(public.profiles.role, EXCLUDED.role),
  status = COALESCE(public.profiles.status, EXCLUDED.status);

-- 3. Profiles Security (Access Control Fix)
-- Use JWT metadata for non-recursive Admin check
DROP POLICY IF EXISTS "Temporary Open Access" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can see all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;

CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' )
  WITH CHECK ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );

CREATE POLICY "Users can update own details" ON public.profiles
  FOR UPDATE TO authenticated
  USING ( auth.uid() = id )
  WITH CHECK ( auth.uid() = id );

-- 4. Teams Security (Creation & Ownership Fix)
DROP POLICY IF EXISTS "Programme Team and assigned Startups see teams" ON public.teams;
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.teams;
DROP POLICY IF EXISTS "Programme Team and assigned Startups can update" ON public.teams;
DROP POLICY IF EXISTS "Creators can delete sessions" ON public.teams;

CREATE POLICY "Role-based visibility on teams" ON public.teams
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id OR 
    auth.uid() = startup_user_id OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'programme_team')
  );

CREATE POLICY "Authorized creators can insert sessions" ON public.teams
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id OR
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'programme_team')
  );

CREATE POLICY "Authorized editors can update sessions" ON public.teams
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = user_id OR 
    auth.uid() = startup_user_id OR
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'programme_team')
  );

CREATE POLICY "Creators can remove sessions" ON public.teams
  FOR DELETE TO authenticated
  USING (
    auth.uid() = user_id OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 5. Verification Check
SELECT 'Repair Successful' as status, count(*) as total_profiles FROM public.profiles;
