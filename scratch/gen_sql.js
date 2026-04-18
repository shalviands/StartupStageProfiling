const fs = require('fs');
const readline = require('readline');

async function run() {
  const mappers = fs.readFileSync('src/utils/mappers.ts', 'utf8');
  const needed = [];
  const lines = mappers.split('\n');
  for (const line of lines) {
    const match = line.match(/^\s+(p[1-9]_[a-z0-9_]+):/);
    if (match) needed.push(match[1]);
  }
  
  // existing columns from my previous DB inspection
  const existing = [
    'id', 'created_at', 'updated_at', 'user_id', 'team_name', 'startup_name', 
    'sector', 'institution', 'team_size', 'roles', 'interview_date', 'interviewer', 
    'revenue_stage', 'business_model_type', 'bmc_done', 'trl', 'brl', 'crl', 
    'p0_need', 'p1_need', 'p2_need', 'barriers', 'mentor', 'next_checkin', 
    'entry_level', 'strengths', 'gaps', 'biz_model_notes', 'pitch_notes', 
    'modules', 'notes', 'problem_statement', 'problem_score', 'solution_description', 
    'solution_score', 'product_type', 'product_type_other', 'unique_value', 
    'unique_value_score', 'users_tested', 'testing_details', 'stakeholders_interacted', 
    'stakeholder_types', 'customer_interview_score', 'customer_interview_details', 
    'competitor_score', 'competitor_details', 'market_size_score', 'market_size_details', 
    'revenue_model_score', 'revenue_model_details', 'bmc_score', 'bmc_details', 
    'pitch_deck_score', 'pitch_deck_details', 'elevator_score', 'elevator_details', 
    'investor_ask_score', 'investor_ask_details', 'sector_other', 'roadmap', 
    'startup_user_id', 'submission_status', 'diagnosis_visible', 'admin_notes', 
    'p8_team_members', 'submission_number', 'deleted_at', 'diagnosis_released', 
    'detected_stage', 'overall_weighted_score', 'p9_bonus_active'
  ];

  const toAdd = needed.filter(c => !existing.includes(c));
  let sql = '-- migration_v3_schema.sql\n\nALTER TABLE public.teams\n';
  const stmts = toAdd.map(c => {
    let type = 'TEXT';
    if (c.endsWith('_score') || c === 'p2_interview_count' || c === 'p3_trl' || c === 'p7_crl' || c === 'p7_active_users') type = 'NUMERIC DEFAULT 0';
    if (c === 'p8_team_members') type = "JSONB DEFAULT '[]'::jsonb";
    if (c === 'p9_bonus_active') type = 'BOOLEAN DEFAULT false';
    return `  ADD COLUMN IF NOT EXISTS ${c} ${type}`;
  });
  sql += stmts.join(',\n') + ';\n';
  fs.writeFileSync('migration_v3_schema.sql', sql);
  console.log('Wrote to migration_v3_schema.sql', toAdd.length, 'columns');
}
run();
