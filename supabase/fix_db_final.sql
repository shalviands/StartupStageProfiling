-- ═════════════════════════════════════════════════════════════════════════
-- FINAL DATABASE REPAIR & INFRASTRUCTURE SCRIPT
-- ═════════════════════════════════════════════════════════════════════════
-- Purpose: 
-- 1. Add missing AI Roadmap storage.
-- 2. Repair corrupted user profiles after previous system failures.
-- 3. Harden RLS policies for Startup role autonomy.
-- ═════════════════════════════════════════════════════════════════════════

-- 1. Infrastructure: AI Roadmap Support
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS roadmap JSONB DEFAULT '[]'::jsonb;

-- 2. Data Repair: Fix missing profiles for existing Auth users
-- This ensures that accounts like test1@inunity.in have valid profile records
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
  email = EXCLUDED.email,
  role = COALESCE(public.profiles.role, EXCLUDED.role),
  status = COALESCE(public.profiles.status, EXCLUDED.status);

-- 3. RLS Hardening: Explicit Startup Permissions
-- We need to ensure startups can manage their own sessions without being blocked by creator checks

DROP POLICY IF EXISTS "Programme Team and assigned Startups see teams" ON public.teams;
CREATE POLICY "Programme Team and assigned Startups see teams" ON public.teams
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() = startup_user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'programme_team'))
  );

DROP POLICY IF EXISTS "Users can insert own sessions" ON public.teams;
CREATE POLICY "Users can insert own sessions" ON public.teams
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    auth.uid() = startup_user_id
  );

DROP POLICY IF EXISTS "Programme Team and assigned Startups can update" ON public.teams;
CREATE POLICY "Programme Team and assigned Startups can update" ON public.teams
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    auth.uid() = startup_user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'programme_team'))
  );

DROP POLICY IF EXISTS "Creators can delete sessions" ON public.teams;
CREATE POLICY "Creators can delete sessions" ON public.teams
  FOR DELETE USING (
    auth.uid() = user_id OR 
    auth.uid() = startup_user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. Verification Check
SELECT 'Repair Completed' as status, count(*) as total_profiles FROM public.profiles;
