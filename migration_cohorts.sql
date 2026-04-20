-- Step 1: Create Cohorts Table
CREATE TABLE IF NOT EXISTS cohorts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    admin_id UUID REFERENCES auth.users(id), -- The assigned Administrator
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Update Profiles Table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS requested_cohort_id UUID REFERENCES cohorts(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cohort_id UUID REFERENCES cohorts(id) ON DELETE SET NULL;

-- Step 3: Update Teams Table
ALTER TABLE teams ADD COLUMN IF NOT EXISTS cohort_id UUID REFERENCES cohorts(id) ON DELETE SET NULL;

-- Step 4: Migration & Initial Data
-- 1. Create the Test Cohort
INSERT INTO cohorts (name) VALUES ('Test Cohort') ON CONFLICT (name) DO NOTHING;

-- 2. Identify and Prepare Test Admin (admin1@inunity.in)
-- Note: This assumes the user already exists in auth.users
UPDATE profiles 
SET role = 'admin', status = 'approved'
WHERE email = 'admin1@inunity.in';

-- 3. Assign Test Admin to Test Cohort
UPDATE cohorts 
SET admin_id = (SELECT id FROM profiles WHERE email = 'admin1@inunity.in' LIMIT 1)
WHERE name = 'Test Cohort';

-- 4. Migrate existing startups to Test Cohort
-- This moves all existing startup records to the 'Test Cohort' for continuity
DO $$
DECLARE
    test_cohort_id UUID;
BEGIN
    SELECT id INTO test_cohort_id FROM cohorts WHERE name = 'Test Cohort';
    
    -- Update profiles
    UPDATE profiles 
    SET cohort_id = test_cohort_id 
    WHERE role = 'startup' AND cohort_id IS NULL;
    
    -- Update teams
    UPDATE teams 
    SET cohort_id = test_cohort_id 
    WHERE cohort_id IS NULL;
END $$;

-- Step 5: Update RLS Policies for Teams (Cohort Isolation)
DROP POLICY IF EXISTS "Programme Team and assigned Startups see teams" ON teams;
DROP POLICY IF EXISTS "Admins see cohort teams" ON teams;

-- Startups see their own teams
CREATE POLICY "Startups see own teams" ON teams
  FOR SELECT USING (auth.uid() = startup_user_id);

-- Admins see teams in their assigned cohorts
-- We check if the admin_id in the cohort matches the current user
CREATE POLICY "Admins see cohort teams" ON teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cohorts 
      WHERE cohorts.id = teams.cohort_id 
      AND cohorts.admin_id = auth.uid()
    )
  );

-- Programme Team (Super Admins) see everything
CREATE POLICY "Programme Team see all teams" ON teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'programme_team'
    )
  );

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
