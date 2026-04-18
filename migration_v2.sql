-- Phase 1: Data Clearance & Schema V2.0 Update

-- 1. Clear old diagnostic data (Keep profiles)
TRUNCATE TABLE teams CASCADE;

-- 2. Add V2.0 specific columns to teams
ALTER TABLE teams ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL; -- Soft Delete
ALTER TABLE teams ADD COLUMN IF NOT EXISTS submission_number INT DEFAULT 1;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS diagnosis_released BOOLEAN DEFAULT FALSE;

-- 3. Create submission_comments table
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

-- 4. Set up RLS for comments
ALTER TABLE submission_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comments visible to Programme Team and Admin" ON submission_comments;
CREATE POLICY "Comments visible to Programme Team and Admin" ON submission_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('programme_team', 'admin')
    )
  );

DROP POLICY IF EXISTS "Programme Team and Admin can insert comments" ON submission_comments;
CREATE POLICY "Programme Team and Admin can insert comments" ON submission_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('programme_team', 'admin')
    )
  );

DROP POLICY IF EXISTS "Commenters can update own comments" ON submission_comments;
CREATE POLICY "Commenters can update own comments" ON submission_comments
  FOR UPDATE USING (auth.uid() = commenter_id);

-- 5. Ensure admin_notes is secure (Handled via RLS or specific API filtering)
-- We'll enforce the API filter in the route logic as well.

-- 6. Add soft-delete filter to default select (Optional, we'll handle in queries)
CREATE INDEX IF NOT EXISTS teams_deleted_at_idx ON teams(deleted_at) WHERE deleted_at IS NULL;
