-- Migration: Add new columns for Startup Diagnosis Profiler Feature Update
-- Run this in your Supabase SQL Editor

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  problem_statement        TEXT;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  problem_score            INT DEFAULT 0;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  solution_description     TEXT;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  solution_score           INT DEFAULT 0;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  product_type             TEXT;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  product_type_other       TEXT;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  unique_value             TEXT;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  unique_value_score       INT DEFAULT 0;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  users_tested             INT DEFAULT 0;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  testing_details          TEXT;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  stakeholders_interacted  INT DEFAULT 0;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  stakeholder_types        TEXT;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  customer_interview_score INT DEFAULT 0;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  customer_interview_details TEXT;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  competitor_score         INT DEFAULT 0;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  competitor_details       TEXT;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  market_size_score        INT DEFAULT 0;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  market_size_details      TEXT;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  revenue_model_score      INT DEFAULT 0;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  revenue_model_details    TEXT;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  bmc_score                INT DEFAULT 0;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  bmc_details              TEXT;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  pitch_deck_score         INT DEFAULT 0;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  pitch_deck_details       TEXT;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  elevator_score           INT DEFAULT 0;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  elevator_details         TEXT;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  investor_ask_score       INT DEFAULT 0;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  investor_ask_details     TEXT;

ALTER TABLE teams ADD COLUMN IF NOT EXISTS
  sector_other             TEXT;
