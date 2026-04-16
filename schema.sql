-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE teams (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  user_id          UUID NOT NULL, -- Simplified from REFERENCES auth.users(id) for easier migration
  
  team_name        TEXT,
  startup_name     TEXT,
  sector           TEXT,
  sector_other     TEXT,
  institution      TEXT,
  team_size        TEXT,
  roles            TEXT,
  interview_date   DATE,
  interviewer      TEXT,
  
  -- Section 2
  problem_statement TEXT,
  problem_score     INT DEFAULT 0,
  solution_description TEXT,
  solution_score     INT DEFAULT 0,
  product_type       TEXT,
  product_type_other TEXT,
  unique_value       TEXT,
  unique_value_score INT DEFAULT 0,
  
  -- Section 3
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
  
  -- Section 4
  revenue_model_score   INT DEFAULT 0,
  revenue_model_details TEXT,
  bmc_score            INT DEFAULT 0,
  bmc_details          TEXT,
  revenue_stage        TEXT,
  business_model_type  TEXT,
  bmc_done             TEXT,
  
  -- Section 5
  trl              INT,
  brl              INT,
  crl              INT,
  
  -- Section 6
  pitch_deck_score     INT DEFAULT 0,
  pitch_deck_details   TEXT,
  elevator_score       INT DEFAULT 0,
  elevator_details     TEXT,
  investor_ask_score   INT DEFAULT 0,
  investor_ask_details TEXT,

  -- Section 7
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
  
  -- Added for JSONB Roadmap and AI Analysis
  roadmap           JSONB DEFAULT '[]'::jsonb,
  readiness_summary TEXT,
  recommendations   TEXT
);

-- Performance Index
CREATE INDEX IF NOT EXISTS idx_teams_user_id ON teams(user_id);

CREATE TABLE team_scored_fields (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id   UUID REFERENCES teams(id) ON DELETE CASCADE,
  field_key TEXT NOT NULL,
  answer    TEXT,
  score     INT CHECK (score BETWEEN 0 AND 5),
  UNIQUE(team_id, field_key)
);

CREATE TABLE roadmap_items (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id      UUID REFERENCES teams(id) ON DELETE CASCADE,
  priority     TEXT CHECK (priority IN ('P0','P1','P2')),
  action       TEXT,
  support_from TEXT,
  by_when      TEXT,
  position     INT DEFAULT 0
);

CREATE TABLE ai_analyses (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id          UUID REFERENCES teams(id) ON DELETE CASCADE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  model_used       TEXT,
  strengths        TEXT,
  gaps             TEXT,
  recommendations  TEXT,
  readiness_summary TEXT
);

-- Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_scored_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own teams" ON teams
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own scores" ON team_scored_fields
  FOR ALL USING (team_id IN (SELECT id FROM teams WHERE user_id = auth.uid()));
CREATE POLICY "Users see own roadmap" ON roadmap_items
  FOR ALL USING (team_id IN (SELECT id FROM teams WHERE user_id = auth.uid()));
CREATE POLICY "Users see own analysis" ON ai_analyses
  FOR ALL USING (team_id IN (SELECT id FROM teams WHERE user_id = auth.uid()));
