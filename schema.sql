-- Step 1: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create teams table with ALL columns
CREATE TABLE IF NOT EXISTS teams (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW(),
  user_id                     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  team_name                   TEXT DEFAULT '',
  startup_name                TEXT DEFAULT '',
  sector                      TEXT DEFAULT '',
  institution                 TEXT DEFAULT '',
  team_size                   TEXT DEFAULT '',
  roles                       TEXT DEFAULT '',
  interview_date              DATE,
  interviewer                 TEXT DEFAULT '',
  problem_statement           TEXT DEFAULT '',
  problem_score               INT DEFAULT 0 CHECK (problem_score BETWEEN 0 AND 5),
  solution_description        TEXT DEFAULT '',
  solution_score              INT DEFAULT 0 CHECK (solution_score BETWEEN 0 AND 5),
  product_type                TEXT DEFAULT '',
  product_type_other          TEXT DEFAULT '',
  unique_value                TEXT DEFAULT '',
  unique_value_score          INT DEFAULT 0 CHECK (unique_value_score BETWEEN 0 AND 5),
  users_tested                INT DEFAULT 0,
  testing_details             TEXT DEFAULT '',
  stakeholders_interacted     INT DEFAULT 0,
  stakeholder_types           TEXT DEFAULT '',
  customer_interview_details  TEXT DEFAULT '',
  customer_interview_score    INT DEFAULT 0 CHECK (customer_interview_score BETWEEN 0 AND 5),
  competitor_details          TEXT DEFAULT '',
  competitor_score            INT DEFAULT 0 CHECK (competitor_score BETWEEN 0 AND 5),
  market_size_details         TEXT DEFAULT '',
  market_size_score           INT DEFAULT 0 CHECK (market_size_score BETWEEN 0 AND 5),
  revenue_model_details       TEXT DEFAULT '',
  revenue_model_score         INT DEFAULT 0 CHECK (revenue_model_score BETWEEN 0 AND 5),
  bmc_details                 TEXT DEFAULT '',
  bmc_score                   INT DEFAULT 0 CHECK (bmc_score BETWEEN 0 AND 5),
  revenue_stage               TEXT DEFAULT '',
  business_model_type         TEXT DEFAULT '',
  bmc_done                    TEXT DEFAULT '',
  trl                         INT,
  brl                         INT,
  crl                         INT,
  pitch_deck_details          TEXT DEFAULT '',
  pitch_deck_score            INT DEFAULT 0 CHECK (pitch_deck_score BETWEEN 0 AND 5),
  elevator_details            TEXT DEFAULT '',
  elevator_score              INT DEFAULT 0 CHECK (elevator_score BETWEEN 0 AND 5),
  investor_ask_details        TEXT DEFAULT '',
  investor_ask_score          INT DEFAULT 0 CHECK (investor_ask_score BETWEEN 0 AND 5),
  strengths                   TEXT DEFAULT '',
  gaps                        TEXT DEFAULT '',
  modules                     TEXT DEFAULT '',
  p0_need                     TEXT DEFAULT '',
  p1_need                     TEXT DEFAULT '',
  p2_need                     TEXT DEFAULT '',
  barriers                    TEXT DEFAULT '',
  mentor                      TEXT DEFAULT '',
  next_checkin                DATE,
  notes                       TEXT DEFAULT '',
  roadmap                     JSONB DEFAULT '[]'::jsonb
);

-- Step 3: Add any missing columns to existing table
ALTER TABLE teams ADD COLUMN IF NOT EXISTS roadmap JSONB DEFAULT '[]'::jsonb;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS problem_statement TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS problem_score INT DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS solution_description TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS solution_score INT DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS product_type_other TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS unique_value TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS unique_value_score INT DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS users_tested INT DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS testing_details TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS stakeholders_interacted INT DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS stakeholder_types TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS customer_interview_details TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS customer_interview_score INT DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS competitor_details TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS competitor_score INT DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS market_size_details TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS market_size_score INT DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS revenue_model_details TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS revenue_model_score INT DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS bmc_details TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS bmc_score INT DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS pitch_deck_details TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS pitch_deck_score INT DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS elevator_details TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS elevator_score INT DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS investor_ask_details TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS investor_ask_score INT DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS strengths TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS gaps TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS modules TEXT DEFAULT '';

-- Step 4: Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop and recreate RLS policies cleanly
DROP POLICY IF EXISTS "Users see own teams" ON teams;
DROP POLICY IF EXISTS "Users can insert own teams" ON teams;
DROP POLICY IF EXISTS "Users can update own teams" ON teams;
DROP POLICY IF EXISTS "Users can delete own teams" ON teams;

CREATE POLICY "Users see own teams" ON teams
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own teams" ON teams
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own teams" ON teams
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own teams" ON teams
  FOR DELETE USING (auth.uid() = user_id);

-- Step 6: Create index for performance
CREATE INDEX IF NOT EXISTS teams_user_id_idx ON teams(user_id);
CREATE INDEX IF NOT EXISTS teams_created_at_idx ON teams(created_at DESC);

-- Step 7: Verify everything worked
SELECT COUNT(*) as total_teams FROM teams;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'teams'
ORDER BY ordinal_position;
