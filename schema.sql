-- Step 1: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create teams table with 9-Parameter Engine structure
CREATE TABLE IF NOT EXISTS teams (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW(),
  user_id                     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info (Preserved)
  team_name                   TEXT DEFAULT '',
  startup_name                TEXT DEFAULT '',
  sector                      TEXT DEFAULT '',
  institution                 TEXT DEFAULT '',
  team_size                   TEXT DEFAULT '',
  roles                       TEXT DEFAULT '',
  interview_date              DATE,
  interviewer                 TEXT DEFAULT '',

  -- P1 — Character & Problem Clarity (16%)
  p1_problem_statement        TEXT DEFAULT '',
  p1_problem_score            INT DEFAULT 0 CHECK (p1_problem_score BETWEEN 0 AND 5),
  p1_why_us                   TEXT DEFAULT '',
  p1_why_us_score             INT DEFAULT 0 CHECK (p1_why_us_score BETWEEN 0 AND 5),
  p1_commitment               TEXT DEFAULT '',
  p1_commitment_score         INT DEFAULT 0 CHECK (p1_commitment_score BETWEEN 0 AND 5),
  p1_learning                 TEXT DEFAULT '',
  p1_learning_score           INT DEFAULT 0 CHECK (p1_learning_score BETWEEN 0 AND 5),
  p1_deep_empathy             TEXT DEFAULT '',
  p1_deep_empathy_score       INT DEFAULT 0 CHECK (p1_deep_empathy_score BETWEEN 0 AND 5),
  p1_resilience               TEXT DEFAULT '',
  p1_resilience_score         INT DEFAULT 0 CHECK (p1_resilience_score BETWEEN 0 AND 5),
  p1_sacrifice                TEXT DEFAULT '',
  p1_sacrifice_score          INT DEFAULT 0 CHECK (p1_sacrifice_score BETWEEN 0 AND 5),
  p1_observation              TEXT DEFAULT '',

  -- P2 — Customer Discovery (13%)
  p2_interview_count          INT DEFAULT 0,
  p2_interview_count_score    INT DEFAULT 0 CHECK (p2_interview_count_score BETWEEN 0 AND 5),
  p2_stakeholder_types        TEXT DEFAULT '',
  p2_stakeholder_types_score  INT DEFAULT 0 CHECK (p2_stakeholder_types_score BETWEEN 0 AND 5),
  p2_key_insight              TEXT DEFAULT '',
  p2_key_insight_score        INT DEFAULT 0 CHECK (p2_key_insight_score BETWEEN 0 AND 5),
  p2_pivoted                  TEXT DEFAULT '',
  p2_pivoted_score            INT DEFAULT 0 CHECK (p2_pivoted_score BETWEEN 0 AND 5),
  p2_evidence                 TEXT DEFAULT '',
  p2_evidence_score           INT DEFAULT 0 CHECK (p2_evidence_score BETWEEN 0 AND 5),
  p2_pilot_users              TEXT DEFAULT '',
  p2_pilot_users_score        INT DEFAULT 0 CHECK (p2_pilot_users_score BETWEEN 0 AND 5),
  p2_objections               TEXT DEFAULT '',
  p2_objections_score         INT DEFAULT 0 CHECK (p2_objections_score BETWEEN 0 AND 5),
  p2_observation              TEXT DEFAULT '',

  -- P3 — Product & TRL (14%)
  p3_trl                      INT,
  p3_trl_score                INT DEFAULT 0 CHECK (p3_trl_score BETWEEN 0 AND 5),
  p3_built                    TEXT DEFAULT '',
  p3_built_score              INT DEFAULT 0 CHECK (p3_built_score BETWEEN 0 AND 5),
  p3_product_type             TEXT DEFAULT '',
  p3_external_testing         TEXT DEFAULT '',
  p3_external_testing_score   INT DEFAULT 0 CHECK (p3_external_testing_score BETWEEN 0 AND 5),
  p3_tech_risk                TEXT DEFAULT '',
  p3_tech_risk_score          INT DEFAULT 0 CHECK (p3_tech_risk_score BETWEEN 0 AND 5),
  p3_trl_gap                  TEXT DEFAULT '',
  p3_trl_gap_score            INT DEFAULT 0 CHECK (p3_trl_gap_score BETWEEN 0 AND 5),
  p3_ip                       TEXT DEFAULT '',
  p3_ip_score                 INT DEFAULT 0 CHECK (p3_ip_score BETWEEN 0 AND 5),
  p3_observation              TEXT DEFAULT '',

  -- P4 — Differentiation (7%)
  p4_differentiation          TEXT DEFAULT '',
  p4_differentiation_score    INT DEFAULT 0 CHECK (p4_differentiation_score BETWEEN 0 AND 5),
  p4_competitors              TEXT DEFAULT '',
  p4_competitors_score        INT DEFAULT 0 CHECK (p4_competitors_score BETWEEN 0 AND 5),
  p4_without_us               TEXT DEFAULT '',
  p4_without_us_score         INT DEFAULT 0 CHECK (p4_without_us_score BETWEEN 0 AND 5),
  p4_customer_preference      TEXT DEFAULT '',
  p4_customer_preference_score INT DEFAULT 0 CHECK (p4_customer_preference_score BETWEEN 0 AND 5),
  p4_hard_to_copy             TEXT DEFAULT '',
  p4_hard_to_copy_score       INT DEFAULT 0 CHECK (p4_hard_to_copy_score BETWEEN 0 AND 5),
  p4_ab_testing               TEXT DEFAULT '',
  p4_ab_testing_score         INT DEFAULT 0 CHECK (p4_ab_testing_score BETWEEN 0 AND 5),
  p4_observation              TEXT DEFAULT '',

  -- P5 — Market (12%)
  p5_icp                      TEXT DEFAULT '',
  p5_icp_score                INT DEFAULT 0 CHECK (p5_icp_score BETWEEN 0 AND 5),
  p5_market_size              TEXT DEFAULT '',
  p5_market_size_score        INT DEFAULT 0 CHECK (p5_market_size_score BETWEEN 0 AND 5),
  p5_urgency                  TEXT DEFAULT '',
  p5_urgency_score            INT DEFAULT 0 CHECK (p5_urgency_score BETWEEN 0 AND 5),
  p5_gtm                      TEXT DEFAULT '',
  p5_gtm_score                INT DEFAULT 0 CHECK (p5_gtm_score BETWEEN 0 AND 5),
  p5_unfair_access            TEXT DEFAULT '',
  p5_unfair_access_score      INT DEFAULT 0 CHECK (p5_unfair_access_score BETWEEN 0 AND 5),
  p5_observation              TEXT DEFAULT '',

  -- P6 — Business Model (11%)
  p6_revenue_model            TEXT DEFAULT '',
  p6_revenue_model_score      INT DEFAULT 0 CHECK (p6_revenue_model_score BETWEEN 0 AND 5),
  p6_revenue_stage            TEXT DEFAULT '',
  p6_bmc_status               TEXT DEFAULT '',
  p6_bmc_score                INT DEFAULT 0 CHECK (p6_bmc_score BETWEEN 0 AND 5),
  p6_model_type               TEXT DEFAULT '',
  p6_pricing_tested           TEXT DEFAULT '',
  p6_pricing_tested_score     INT DEFAULT 0 CHECK (p6_pricing_tested_score BETWEEN 0 AND 5),
  p6_unit_economics           TEXT DEFAULT '',
  p6_unit_economics_score     INT DEFAULT 0 CHECK (p6_unit_economics_score BETWEEN 0 AND 5),
  p6_observation              TEXT DEFAULT '',

  -- P7 — Traction & CRL (12%)
  p7_crl                      INT,
  p7_crl_score                INT DEFAULT 0 CHECK (p7_crl_score BETWEEN 0 AND 5),
  p7_active_users             INT DEFAULT 0,
  p7_active_users_score       INT DEFAULT 0 CHECK (p7_active_users_score BETWEEN 0 AND 5),
  p7_retention                TEXT DEFAULT '',
  p7_retention_score          INT DEFAULT 0 CHECK (p7_retention_score BETWEEN 0 AND 5),
  p7_growth                   TEXT DEFAULT '',
  p7_growth_score             INT DEFAULT 0 CHECK (p7_growth_score BETWEEN 0 AND 5),
  p7_referrals                TEXT DEFAULT '',
  p7_referrals_score          INT DEFAULT 0 CHECK (p7_referrals_score BETWEEN 0 AND 5),
  p7_churn                    TEXT DEFAULT '',
  p7_churn_score              INT DEFAULT 0 CHECK (p7_churn_score BETWEEN 0 AND 5),
  p7_observation              TEXT DEFAULT '',

  -- P8 — Team (12%)
  p8_team_members             JSONB DEFAULT '[]'::jsonb,
  p8_team_score               INT DEFAULT 0 CHECK (p8_team_score BETWEEN 0 AND 5),
  p8_missing_skills           TEXT DEFAULT '',
  p8_missing_skills_score     INT DEFAULT 0 CHECK (p8_missing_skills_score BETWEEN 0 AND 5),
  p8_commitment               TEXT DEFAULT '',
  p8_commitment_score         INT DEFAULT 0 CHECK (p8_commitment_score BETWEEN 0 AND 5),
  p8_advisors                 TEXT DEFAULT '',
  p8_advisors_score           INT DEFAULT 0 CHECK (p8_advisors_score BETWEEN 0 AND 5),
  p8_prior_work               TEXT DEFAULT '',
  p8_prior_work_score         INT DEFAULT 0 CHECK (p8_prior_work_score BETWEEN 0 AND 5),
  p8_internal_challenge       TEXT DEFAULT '',
  p8_internal_challenge_score INT DEFAULT 0 CHECK (p8_internal_challenge_score BETWEEN 0 AND 5),
  p8_observation              TEXT DEFAULT '',

  -- P9 — Advantage & Moats (6% + 3%)
  p9_competitor_awareness     TEXT DEFAULT '',
  p9_competitor_awareness_score INT DEFAULT 0 CHECK (p9_competitor_awareness_score BETWEEN 0 AND 5),
  p9_hard_to_copy             TEXT DEFAULT '',
  p9_hard_to_copy_score       INT DEFAULT 0 CHECK (p9_hard_to_copy_score BETWEEN 0 AND 5),
  p9_ip                       TEXT DEFAULT '',
  p9_ip_score                 INT DEFAULT 0 CHECK (p9_ip_score BETWEEN 0 AND 5),
  p9_network_effects          TEXT DEFAULT '',
  p9_network_effects_score    INT DEFAULT 0 CHECK (p9_network_effects_score BETWEEN 0 AND 5),
  p9_switching_costs          TEXT DEFAULT '',
  p9_switching_costs_score    INT DEFAULT 0 CHECK (p9_switching_costs_score BETWEEN 0 AND 5),
  p9_observation              TEXT DEFAULT '',

  -- Output Columns
  detected_stage              TEXT DEFAULT '',
  overall_weighted_score      FLOAT DEFAULT 0,

  -- 3-Role Extensions
  startup_user_id             UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submission_status           TEXT DEFAULT 'draft',
  submission_number           INT DEFAULT 1,
  diagnosis_released          BOOLEAN DEFAULT FALSE,
  admin_notes                 TEXT DEFAULT '',
  roadmap                     JSONB DEFAULT '[]'::jsonb
);

-- Step 3: Run migrations for new 9-Parameter Engine
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p1_problem_statement       TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p1_problem_score           INT DEFAULT 0 CHECK (p1_problem_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p1_why_us                  TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p1_why_us_score            INT DEFAULT 0 CHECK (p1_why_us_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p1_commitment              TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p1_commitment_score        INT DEFAULT 0 CHECK (p1_commitment_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p1_learning                TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p1_learning_score          INT DEFAULT 0 CHECK (p1_learning_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p1_deep_empathy            TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p1_deep_empathy_score      INT DEFAULT 0 CHECK (p1_deep_empathy_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p1_resilience              TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p1_resilience_score        INT DEFAULT 0 CHECK (p1_resilience_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p1_sacrifice               TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p1_sacrifice_score         INT DEFAULT 0 CHECK (p1_sacrifice_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p1_observation             TEXT DEFAULT '';

ALTER TABLE teams ADD COLUMN IF NOT EXISTS p2_interview_count         INT DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p2_interview_count_score   INT DEFAULT 0 CHECK (p2_interview_count_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p2_stakeholder_types       TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p2_stakeholder_types_score INT DEFAULT 0 CHECK (p2_stakeholder_types_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p2_key_insight             TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p2_key_insight_score       INT DEFAULT 0 CHECK (p2_key_insight_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p2_pivoted                 TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p2_pivoted_score            INT DEFAULT 0 CHECK (p2_pivoted_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p2_evidence                TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p2_evidence_score          INT DEFAULT 0 CHECK (p2_evidence_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p2_pilot_users              TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p2_pilot_users_score       INT DEFAULT 0 CHECK (p2_pilot_users_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p2_objections               TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p2_objections_score        INT DEFAULT 0 CHECK (p2_objections_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p2_observation             TEXT DEFAULT '';

ALTER TABLE teams ADD COLUMN IF NOT EXISTS p3_trl                     INT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p3_trl_score               INT DEFAULT 0 CHECK (p3_trl_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p3_built                    TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p3_built_score              INT DEFAULT 0 CHECK (p3_built_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p3_product_type            TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p3_external_testing        TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p3_external_testing_score   INT DEFAULT 0 CHECK (p3_external_testing_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p3_tech_risk                TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p3_tech_risk_score          INT DEFAULT 0 CHECK (p3_tech_risk_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p3_trl_gap                  TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p3_trl_gap_score            INT DEFAULT 0 CHECK (p3_trl_gap_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p3_ip                       TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p3_ip_score                 INT DEFAULT 0 CHECK (p3_ip_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p3_observation             TEXT DEFAULT '';

ALTER TABLE teams ADD COLUMN IF NOT EXISTS p4_differentiation         TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p4_differentiation_score   INT DEFAULT 0 CHECK (p4_differentiation_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p4_competitors              TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p4_competitors_score        INT DEFAULT 0 CHECK (p4_competitors_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p4_without_us               TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p4_without_us_score         INT DEFAULT 0 CHECK (p4_without_us_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p4_customer_preference      TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p4_customer_preference_score INT DEFAULT 0 CHECK (p4_customer_preference_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p4_hard_to_copy             TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p4_hard_to_copy_score       INT DEFAULT 0 CHECK (p4_hard_to_copy_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p4_ab_testing               TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p4_ab_testing_score         INT DEFAULT 0 CHECK (p4_ab_testing_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p4_observation             TEXT DEFAULT '';

ALTER TABLE teams ADD COLUMN IF NOT EXISTS p5_icp                     TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p5_icp_score               INT DEFAULT 0 CHECK (p5_icp_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p5_market_size              TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p5_market_size_score        INT DEFAULT 0 CHECK (p5_market_size_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p5_urgency                  TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p5_urgency_score            INT DEFAULT 0 CHECK (p5_urgency_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p5_gtm                      TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p5_gtm_score                INT DEFAULT 0 CHECK (p5_gtm_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p5_unfair_access            TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p5_unfair_access_score      INT DEFAULT 0 CHECK (p5_unfair_access_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p5_observation             TEXT DEFAULT '';

ALTER TABLE teams ADD COLUMN IF NOT EXISTS p6_revenue_model           TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p6_revenue_model_score      INT DEFAULT 0 CHECK (p6_revenue_model_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p6_revenue_stage            TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p6_bmc_status               TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p6_bmc_score                INT DEFAULT 0 CHECK (p6_bmc_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p6_model_type               TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p6_pricing_tested           TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p6_pricing_tested_score     INT DEFAULT 0 CHECK (p6_pricing_tested_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p6_unit_economics           TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p6_unit_economics_score     INT DEFAULT 0 CHECK (p6_unit_economics_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p6_observation             TEXT DEFAULT '';

ALTER TABLE teams ADD COLUMN IF NOT EXISTS p7_crl                      INT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p7_crl_score                INT DEFAULT 0 CHECK (p7_crl_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p7_active_users             INT DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p7_active_users_score       INT DEFAULT 0 CHECK (p7_active_users_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p7_retention                TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p7_retention_score          INT DEFAULT 0 CHECK (p7_retention_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p7_growth                   TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p7_growth_score             INT DEFAULT 0 CHECK (p7_growth_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p7_referrals                TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p7_referrals_score          INT DEFAULT 0 CHECK (p7_referrals_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p7_churn                    TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p7_churn_score              INT DEFAULT 0 CHECK (p7_churn_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p7_observation             TEXT DEFAULT '';

ALTER TABLE teams ADD COLUMN IF NOT EXISTS p8_team_members             JSONB DEFAULT '[]'::jsonb;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p8_team_score               INT DEFAULT 0 CHECK (p8_team_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p8_missing_skills           TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p8_missing_skills_score     INT DEFAULT 0 CHECK (p8_missing_skills_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p8_commitment               TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p8_commitment_score         INT DEFAULT 0 CHECK (p8_commitment_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p8_advisors                 TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p8_advisors_score           INT DEFAULT 0 CHECK (p8_advisors_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p8_prior_work               TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p8_prior_work_score         INT DEFAULT 0 CHECK (p8_prior_work_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p8_internal_challenge       TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p8_internal_challenge_score INT DEFAULT 0 CHECK (p8_internal_challenge_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p8_observation             TEXT DEFAULT '';

ALTER TABLE teams ADD COLUMN IF NOT EXISTS p9_competitor_awareness     TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p9_competitor_awareness_score INT DEFAULT 0 CHECK (p9_competitor_awareness_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p9_hard_to_copy             TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p9_hard_to_copy_score       INT DEFAULT 0 CHECK (p9_hard_to_copy_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p9_ip                       TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p9_ip_score                 INT DEFAULT 0 CHECK (p9_ip_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p9_network_effects          TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p9_network_effects_score    INT DEFAULT 0 CHECK (p9_network_effects_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p9_switching_costs          TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p9_switching_costs_score    INT DEFAULT 0 CHECK (p9_switching_costs_score BETWEEN 0 AND 5);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS p9_observation             TEXT DEFAULT '';

ALTER TABLE teams ADD COLUMN IF NOT EXISTS detected_stage             TEXT DEFAULT '';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS overall_weighted_score     FLOAT DEFAULT 0;

-- New 3-Role Columns
ALTER TABLE teams ADD COLUMN IF NOT EXISTS startup_user_id             UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS submission_status           TEXT DEFAULT 'draft';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS submission_number           INT DEFAULT 1;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS diagnosis_released          BOOLEAN DEFAULT FALSE;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS deleted_at                  TIMESTAMPTZ;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS admin_notes                 TEXT DEFAULT '';

-- Drop legacy/volatile columns (Decoupled to runtime logic for resilience)
ALTER TABLE teams DROP COLUMN IF EXISTS assigned_mentor_type;
ALTER TABLE teams DROP COLUMN IF EXISTS stage_override_flag;
ALTER TABLE teams DROP COLUMN IF EXISTS p9_bonus_active;

-- Drop legacy diagnosis schema field if it was created
ALTER TABLE teams DROP COLUMN IF EXISTS diagnosis_visible;

-- Cleanup legacy columns (optional, but requested for source-of-truth purity)
ALTER TABLE teams DROP COLUMN IF EXISTS problem_statement;
ALTER TABLE teams DROP COLUMN IF EXISTS problem_score;
ALTER TABLE teams DROP COLUMN IF EXISTS solution_description;
ALTER TABLE teams DROP COLUMN IF EXISTS solution_score;
ALTER TABLE teams DROP COLUMN IF EXISTS product_type;
ALTER TABLE teams DROP COLUMN IF EXISTS product_type_other;
ALTER TABLE teams DROP COLUMN IF EXISTS unique_value;
ALTER TABLE teams DROP COLUMN IF EXISTS unique_value_score;
ALTER TABLE teams DROP COLUMN IF EXISTS users_tested;
ALTER TABLE teams DROP COLUMN IF EXISTS testing_details;
ALTER TABLE teams DROP COLUMN IF EXISTS stakeholders_interacted;
ALTER TABLE teams DROP COLUMN IF EXISTS stakeholder_types;
ALTER TABLE teams DROP COLUMN IF EXISTS customer_interview_details;
ALTER TABLE teams DROP COLUMN IF EXISTS customer_interview_score;
ALTER TABLE teams DROP COLUMN IF EXISTS competitor_details;
ALTER TABLE teams DROP COLUMN IF EXISTS competitor_score;
ALTER TABLE teams DROP COLUMN IF EXISTS market_size_details;
ALTER TABLE teams DROP COLUMN IF EXISTS market_size_score;
ALTER TABLE teams DROP COLUMN IF EXISTS revenue_model_details;
ALTER TABLE teams DROP COLUMN IF EXISTS revenue_model_score;
ALTER TABLE teams DROP COLUMN IF EXISTS bmc_details;
ALTER TABLE teams DROP COLUMN IF EXISTS bmc_score;
ALTER TABLE teams DROP COLUMN IF EXISTS strengths;
ALTER TABLE teams DROP COLUMN IF EXISTS gaps;
ALTER TABLE teams DROP COLUMN IF EXISTS readiness_summary;
ALTER TABLE teams DROP COLUMN IF EXISTS recommendations;
ALTER TABLE teams DROP COLUMN IF EXISTS notes;
ALTER TABLE teams DROP COLUMN IF EXISTS roadmap;
ALTER TABLE teams DROP COLUMN IF EXISTS trl;
ALTER TABLE teams DROP COLUMN IF EXISTS brl;
ALTER TABLE teams DROP COLUMN IF EXISTS crl;

-- Step 4: Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop and recreate RLS policies cleanly
DROP POLICY IF EXISTS "Users see own teams" ON teams;
DROP POLICY IF EXISTS "Users can insert own teams" ON teams;
DROP POLICY IF EXISTS "Users can update own teams" ON teams;
DROP POLICY IF EXISTS "Users can delete own teams" ON teams;

-- Role-Aware Policies
CREATE POLICY "Programme Team and assigned Startups see teams" ON teams
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = startup_user_id);

CREATE POLICY "Users can insert own sessions" ON teams
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Programme Team and assigned Startups can update" ON teams
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = startup_user_id);

CREATE POLICY "Creators can delete sessions" ON teams
  FOR DELETE USING (auth.uid() = user_id);

-- Step 6: Create index for performance
CREATE INDEX IF NOT EXISTS teams_user_id_idx ON teams(user_id);
CREATE INDEX IF NOT EXISTS teams_startup_user_id_idx ON teams(startup_user_id);
CREATE INDEX IF NOT EXISTS teams_created_at_idx ON teams(created_at DESC);

-- Step 7: Verify everything worked
SELECT COUNT(*) as total_teams FROM teams;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'teams'
ORDER BY ordinal_position;
