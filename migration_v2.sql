-- ============================================================
-- InUnity Profiler — Migration V2.1
-- Complete RLS overhaul with corrected policies
-- Run this in Supabase SQL Editor
-- ============================================================

-- Phase 1: Schema Additions
-- ============================================================

-- Add V2.0 specific columns to teams (safe to re-run)
ALTER TABLE teams ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS submission_number INT DEFAULT 1;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS diagnosis_released BOOLEAN DEFAULT FALSE;

-- Create submission_comments table (safe to re-run)
CREATE TABLE IF NOT EXISTS submission_comments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id        UUID REFERENCES teams(id) ON DELETE CASCADE,
  commenter_id   UUID REFERENCES auth.users(id),
  commenter_name TEXT DEFAULT '',
  comment_text   TEXT NOT NULL,
  parameter_ref  TEXT DEFAULT 'overall', -- 'overall' | 'P1' | 'P2' ... | 'P9'
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Index for soft-delete queries
CREATE INDEX IF NOT EXISTS teams_deleted_at_idx ON teams(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================
-- Phase 2: Enable RLS on all tables
-- ============================================================

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_comments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Phase 3: Helper Functions & Teams RLS Policies
-- Drop all existing policies first for clean slate
-- ============================================================

-- Create helper function to bypass RLS recursion AT THE TOP
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

DROP POLICY IF EXISTS "programme_team_read_all" ON teams;
DROP POLICY IF EXISTS "programme_read_all" ON teams;
DROP POLICY IF EXISTS "startup_read_own" ON teams;
DROP POLICY IF EXISTS "admin_read_all" ON teams;
DROP POLICY IF EXISTS "startup_insert_own" ON teams;
DROP POLICY IF EXISTS "startup_update_own" ON teams;
DROP POLICY IF EXISTS "startup_submit_own_draft" ON teams;
DROP POLICY IF EXISTS "evaluator_update_teams" ON teams;
DROP POLICY IF EXISTS "admin_all_teams" ON teams;

-- SELECT: Startups read own; Programme/Admin read all
CREATE POLICY "startup_read_own" ON teams
  FOR SELECT USING (startup_user_id = auth.uid());

CREATE POLICY "programme_read_all" ON teams
  FOR SELECT USING (
    public.get_my_role() IN ('programme_team', 'admin')
  );

-- INSERT: Only approved startups or staff can create
CREATE POLICY "startup_insert_own" ON teams
  FOR INSERT WITH CHECK (
    (
      auth.uid() = startup_user_id
      AND EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'startup'
        AND profiles.status = 'approved'
      )
    )
    OR
    public.get_my_role() IN ('programme_team', 'admin')
  );

-- UPDATE: Startup can edit own draft (auto-save)
CREATE POLICY "startup_update_own" ON teams
  FOR UPDATE USING (
    startup_user_id = auth.uid()
    AND submission_status = 'draft'
  )
  WITH CHECK (
    startup_user_id = auth.uid()
    AND submission_status = 'draft'
  );

-- UPDATE: Startup can SUBMIT (draft → submitted)
-- This is the key policy which allows status transitions
CREATE POLICY "startup_submit_own_draft" ON teams
  FOR UPDATE USING (
    startup_user_id = auth.uid()
    AND submission_status = 'draft'
  )
  WITH CHECK (
    startup_user_id = auth.uid()
    AND submission_status IN ('draft', 'submitted')
  );

-- UPDATE: Evaluators (Programme Team + Admin) can update anything
CREATE POLICY "evaluator_update_teams" ON teams
  FOR UPDATE USING (
    public.get_my_role() IN ('programme_team', 'admin')
  );

-- ============================================================
-- Phase 4: Profiles RLS Policies (Fixed Recursion)
-- ============================================================

DROP POLICY IF EXISTS "users_select_own_profile" ON profiles;
DROP POLICY IF EXISTS "programme_select_all_profiles" ON profiles;
DROP POLICY IF EXISTS "admin_update_all_profiles" ON profiles;

-- Users select own profile
CREATE POLICY "users_select_own_profile" ON profiles
  FOR SELECT USING (id = auth.uid());

-- Programme team + admin can read all profiles
CREATE POLICY "programme_select_all_profiles" ON profiles
  FOR SELECT USING (
    public.get_my_role() IN ('programme_team', 'admin')
  );

-- Admin can update all profiles (approvals)
CREATE POLICY "admin_update_all_profiles" ON profiles
  FOR UPDATE USING (
    public.get_my_role() = 'admin'
  );

-- ============================================================
-- Phase 5: Submission Comments RLS Policies
-- ============================================================

DROP POLICY IF EXISTS "Comments visible to Programme Team and Admin" ON submission_comments;
DROP POLICY IF EXISTS "Programme Team and Admin can insert comments" ON submission_comments;
DROP POLICY IF EXISTS "Commenters can update own comments" ON submission_comments;
DROP POLICY IF EXISTS "programme_select_comments" ON submission_comments;
DROP POLICY IF EXISTS "programme_insert_comments" ON submission_comments;
DROP POLICY IF EXISTS "commenter_update_own" ON submission_comments;
DROP POLICY IF EXISTS "admin_delete_comments" ON submission_comments;

CREATE POLICY "programme_select_comments" ON submission_comments
  FOR SELECT USING (
    public.get_my_role() IN ('programme_team', 'admin')
  );

CREATE POLICY "programme_insert_comments" ON submission_comments
  FOR INSERT WITH CHECK (
    public.get_my_role() IN ('programme_team', 'admin')
  );

CREATE POLICY "commenter_update_own" ON submission_comments
  FOR UPDATE USING (commenter_id = auth.uid());

CREATE POLICY "admin_delete_comments" ON submission_comments
  FOR DELETE USING (
    public.get_my_role() = 'admin'
  );

-- ============================================================
-- Phase 6: Data Integrity Checks
-- Run these SELECT queries to verify before/after
-- ============================================================

-- Verify RLS is active
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('teams', 'profiles', 'submission_comments');

-- List all policies
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check for null statuses (causes submission 403)
SELECT COUNT(*) as null_status_profiles
FROM profiles WHERE status IS NULL;

-- Fix null statuses if any
UPDATE profiles SET status = 'pending' WHERE status IS NULL;

-- Check for orphaned teams (safe diagnostic)
SELECT COUNT(*) as teams_with_missing_users
FROM teams t
LEFT JOIN auth.users u ON t.startup_user_id = u.id
WHERE u.id IS NULL AND t.startup_user_id IS NOT NULL;
