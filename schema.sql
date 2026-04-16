-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Unified Teams Table (Consolidated for Zero-Constraint failures)
CREATE TABLE IF NOT EXISTS teams (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Section 1: Basic Info
  team_name        TEXT,
  startup_name     TEXT,
  sector           TEXT,
  sector_other     TEXT,
  institution      TEXT,
  team_size        TEXT,
  roles            TEXT,
  interview_date   DATE,
  interviewer      TEXT,
  
  -- Section 2: Problem/Solution
  problem_statement TEXT,
  problem_score     INT DEFAULT 0,
  solution_description TEXT,
  solution_score     INT DEFAULT 0,
  product_type       TEXT,
  product_type_other TEXT,
  unique_value       TEXT,
  unique_value_score INT DEFAULT 0,
  
  -- Section 3: User/Market
  users_tested            INT DEFAULT 0,
  testing_details         TEXT,
  stakeholders_interacted INT DEFAULT 0,
  stakeholder_types       TEXT,
  customer_interview_score INT DEFAULT 0,
  customer_interview_details TEXT,
  competitor_score         INT DEFAULT 0,
  competitor_details       TEXT,
  market_size_score        INT DEFAULT 0,
  market_size_details      TEXT,
  
  -- Section 4: Revenue/BMC
  revenue_model_score   INT DEFAULT 0,
  revenue_model_details TEXT,
  bmc_score            INT DEFAULT 0,
  bmc_details          TEXT,
  revenue_stage        TEXT,
  business_model_type  TEXT,
  bmc_done             TEXT,
  
  -- Section 5: Readiness (TRL/BRL/CRL)
  trl              INT,
  brl              INT,
  crl              INT,
  
  -- Section 6: Pitch/Investor
  pitch_deck_score     INT DEFAULT 0,
  pitch_deck_details   TEXT,
  elevator_score       INT DEFAULT 0,
  elevator_details     TEXT,
  investor_ask_score   INT DEFAULT 0,
  investor_ask_details TEXT,

  -- Section 7: Diagnosis & AI
  p0_need          TEXT,
  p1_need          TEXT,
  p2_need          TEXT,
  barriers         TEXT,
  mentor           TEXT,
  next_checkin     DATE,
  entry_level      TEXT,
  strengths        TEXT,
  gaps             TEXT,
  biz_model_notes  TEXT,
  pitch_notes      TEXT,
  modules          TEXT,
  notes            TEXT,
  
  -- Persistence Columns
  roadmap           JSONB DEFAULT '[]'::jsonb,
  readiness_summary TEXT,
  recommendations   TEXT
);

-- Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'teams' AND policyname = 'Users see own teams'
    ) THEN
        CREATE POLICY "Users see own teams" ON teams FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- Performance Index
CREATE INDEX IF NOT EXISTS idx_teams_user_id ON teams(user_id);
