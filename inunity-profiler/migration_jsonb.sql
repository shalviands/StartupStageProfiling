-- Migration: Move roadmap_items to a JSONB column in teams table
-- This simplifies the schema and improves performance for the Next.js app

-- 1. Add the roadmap column to the teams table
ALTER TABLE teams ADD COLUMN IF NOT EXISTS roadmap JSONB DEFAULT '[]'::jsonb;

-- 2. Optional: Migrate existing roadmap items if any exist
-- This part is commented out to avoid errors if the table doesn't exist or is empty
/*
UPDATE teams t
SET roadmap = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'priority', r.priority,
      'action', r.action,
      'supportFrom', r.support_from,
      'byWhen', r.by_when
    )
  )
  FROM roadmap_items r
  WHERE r.team_id = t.id
);
*/

-- 3. Mark the old table for deletion (manual check recommended before dropping)
-- DROP TABLE roadmap_items;
