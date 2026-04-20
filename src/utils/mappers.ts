import type { TeamProfile } from '@/types/team.types'

export function mapDbToFrontend(row: any): TeamProfile | null {
  if (!row) return null

  return {
    id:                         row.id,
    teamName:                   row.team_name                        ?? '',
    startupName:                row.startup_name                     ?? '',
    sector:                     row.sector                           ?? '',
    institution:                row.institution                      ?? '',
    teamSize:                   row.team_size                        ?? '',
    roles:                      row.roles                            ?? '',
    interviewDate:              row.interview_date                   ?? '',
    interviewer:                row.interviewer                      ?? '',

    // P1
    p1_problem_statement:       row.p1_problem_statement             ?? '',
    p1_problem_score:           Number(row.p1_problem_score)         || 0,
    p1_why_us:                  row.p1_why_us                        ?? '',
    p1_why_us_score:            Number(row.p1_why_us_score)          || 0,
    p1_commitment:              row.p1_commitment                     ?? '',
    p1_commitment_score:        Number(row.p1_commitment_score)       || 0,
    p1_learning:                row.p1_learning                      ?? '',
    p1_learning_score:          Number(row.p1_learning_score)         || 0,
    p1_deep_empathy:            row.p1_deep_empathy                  ?? '',
    p1_deep_empathy_score:      Number(row.p1_deep_empathy_score)      || 0,
    p1_resilience:              row.p1_resilience                   ?? '',
    p1_resilience_score:        Number(row.p1_resilience_score)       || 0,
    p1_sacrifice:               row.p1_sacrifice                     ?? '',
    p1_sacrifice_score:         Number(row.p1_sacrifice_score)        || 0,
    p1_observation:             row.p1_observation                   ?? '',

    // P2
    p2_interview_count:         Number(row.p2_interview_count)       || 0,
    p2_interview_count_score:   Number(row.p2_interview_count_score) || 0,
    p2_stakeholder_types:       row.p2_stakeholder_types             ?? '',
    p2_stakeholder_types_score: Number(row.p2_stakeholder_types_score) || 0,
    p2_key_insight:             row.p2_key_insight                   ?? '',
    p2_key_insight_score:       Number(row.p2_key_insight_score)     || 0,
    p2_pivoted:                 row.p2_pivoted                       ?? '',
    p2_pivoted_score:           Number(row.p2_pivoted_score)         || 0,
    p2_evidence:                row.p2_evidence                      ?? '',
    p2_evidence_score:          Number(row.p2_evidence_score)        || 0,
    p2_pilot_users:             row.p2_pilot_users                   ?? '',
    p2_pilot_users_score:       Number(row.p2_pilot_users_score)     || 0,
    p2_objections:              row.p2_objections                    ?? '',
    p2_objections_score:        Number(row.p2_objections_score)      || 0,
    p2_observation:             row.p2_observation                    ?? '',

    // P3
    p3_trl:                     row.p3_trl ? parseInt(String(row.p3_trl), 10) : null,
    p3_trl_score:               Number(row.p3_trl_score)               || 0,
    p3_built:                   row.p3_built                         ?? '',
    p3_built_score:             Number(row.p3_built_score)           || 0,
    p3_product_type:            row.p3_product_type                  ?? '',
    p3_external_testing:        row.p3_external_testing              ?? '',
    p3_external_testing_score:  Number(row.p3_external_testing_score) || 0,
    p3_tech_risk:               row.p3_tech_risk                     ?? '',
    p3_tech_risk_score:         Number(row.p3_tech_risk_score)       || 0,
    p3_trl_gap:                 row.p3_trl_gap                       ?? '',
    p3_trl_gap_score:           Number(row.p3_trl_gap_score)         || 0,
    p3_ip:                      row.p3_ip                            ?? '',
    p3_ip_score:                Number(row.p3_ip_score)              || 0,
    p3_observation:             row.p3_observation                   ?? '',

    // P4
    p4_differentiation:         row.p4_differentiation               ?? '',
    p4_differentiation_score:   Number(row.p4_differentiation_score) || 0,
    p4_competitors:             row.p4_competitors                   ?? '',
    p4_competitors_score:       Number(row.p4_competitors_score)     || 0,
    p4_without_us:              row.p4_without_us                    ?? '',
    p4_without_us_score:        Number(row.p4_without_us_score)      || 0,
    p4_customer_preference:     row.p4_customer_preference           ?? '',
    p4_customer_preference_score: Number(row.p4_customer_preference_score) || 0,
    p4_hard_to_copy:            row.p4_hard_to_copy                  ?? '',
    p4_hard_to_copy_score:      Number(row.p4_hard_to_copy_score)    || 0,
    p4_ab_testing:              row.p4_ab_testing                    ?? '',
    p4_ab_testing_score:        Number(row.p4_ab_testing_score)      || 0,
    p4_observation:             row.p4_observation                   ?? '',

    // P5
    p5_icp:                     row.p5_icp                           ?? '',
    p5_icp_score:               Number(row.p5_icp_score)             || 0,
    p5_market_size:             row.p5_market_size                   ?? '',
    p5_market_size_score:       Number(row.p5_market_size_score)     || 0,
    p5_urgency:                 row.p5_urgency                       ?? '',
    p5_urgency_score:           Number(row.p5_urgency_score)         || 0,
    p5_gtm:                     row.p5_gtm                           ?? '',
    p5_gtm_score:               Number(row.p5_gtm_score)             || 0,
    p5_unfair_access:           row.p5_unfair_access                 ?? '',
    p5_unfair_access_score:     Number(row.p5_unfair_access_score)   || 0,
    p5_observation:             row.p5_observation                   ?? '',

    // P6
    p6_revenue_model:           row.p6_revenue_model                 ?? '',
    p6_revenue_model_score:     Number(row.p6_revenue_model_score)   || 0,
    p6_revenue_stage:           row.p6_revenue_stage                 ?? '',
    p6_bmc_status:              row.p6_bmc_status                    ?? '',
    p6_bmc_score:               Number(row.p6_bmc_score)             || 0,
    p6_model_type:              row.p6_model_type                    ?? '',
    p6_pricing_tested:          row.p6_pricing_tested                ?? '',
    p6_pricing_tested_score:    Number(row.p6_pricing_tested_score)  || 0,
    p6_unit_economics:          row.p6_unit_economics                ?? '',
    p6_unit_economics_score:    Number(row.p6_unit_economics_score)  || 0,
    p6_observation:             row.p6_observation                   ?? '',

    // P7
    p7_crl:                     row.p7_crl ? Number(row.p7_crl) : null,
    p7_crl_score:               Number(row.p7_crl_score)               || 0,
    p7_active_users:            Number(row.p7_active_users)          || 0,
    p7_active_users_score:      Number(row.p7_active_users_score)    || 0,
    p7_retention:               row.p7_retention                     ?? '',
    p7_retention_score:         Number(row.p7_retention_score)       || 0,
    p7_growth:                  row.p7_growth                        ?? '',
    p7_growth_score:            Number(row.p7_growth_score)          || 0,
    p7_referrals:               row.p7_referrals                     ?? '',
    p7_referrals_score:         Number(row.p7_referrals_score)       || 0,
    p7_churn:                   row.p7_churn                         ?? '',
    p7_churn_score:             Number(row.p7_churn_score)           || 0,
    p7_observation:             row.p7_observation                   ?? '',

    // P8
    p8_team_members:            row.p8_team_members                  ?? [],
    p8_team_score:              Number(row.p8_team_score)            || 0,
    p8_missing_skills:          row.p8_missing_skills                ?? '',
    p8_missing_skills_score:    Number(row.p8_missing_skills_score)  || 0,
    p8_commitment:              row.p8_commitment                    ?? '',
    p8_commitment_score:        Number(row.p8_commitment_score)      || 0,
    p8_advisors:                row.p8_advisors                      ?? '',
    p8_advisors_score:          Number(row.p8_advisors_score)        || 0,
    p8_prior_work:              row.p8_prior_work                    ?? '',
    p8_prior_work_score:        Number(row.p8_prior_work_score)      || 0,
    p8_internal_challenge:      row.p8_internal_challenge            ?? '',
    p8_internal_challenge_score: Number(row.p8_internal_challenge_score) || 0,
    p8_observation:             row.p8_observation                   ?? '',

    // P9
    p9_competitor_awareness:    row.p9_competitor_awareness          ?? '',
    p9_competitor_awareness_score: Number(row.p9_competitor_awareness_score) || 0,
    p9_hard_to_copy:            row.p9_hard_to_copy                  ?? '',
    p9_hard_to_copy_score:      Number(row.p9_hard_to_copy_score)    || 0,
    p9_ip:                      row.p9_ip                            ?? '',
    p9_ip_score:                Number(row.p9_ip_score)              || 0,
    p9_network_effects:         row.p9_network_effects               ?? '',
    p9_network_effects_score:   Number(row.p9_network_effects_score) || 0,
    p9_switching_costs:         row.p9_switching_costs               ?? '',
    p9_switching_costs_score:   Number(row.p9_switching_costs_score) || 0,
    p9_observation:             row.p9_observation                   ?? '',

    // Diagnosis Outputs
    detected_stage:             row.detected_stage                   ?? '',
    overall_weighted_score:     row.overall_weighted_score ? Number(row.overall_weighted_score) : null,
    
    // 3-Role Extensions
    startup_user_id:           row.startup_user_id                  ?? null,
    submission_status:         row.submission_status                ?? 'draft',
    submission_number:         Number(row.submission_number)        || 1,
    admin_notes:               row.admin_notes                      ?? '',
    
    diagnosis_released:        !!row.diagnosis_released,
    deleted_at:                row.deleted_at                       ?? null,
    
    // Metadata
    created_at:                row.created_at                       ?? '',
    updated_at:                row.updated_at                       ?? '',
  }
}

export function mapFrontendToDb(team: Partial<TeamProfile>): any {
  const db: any = {}

  // Basic Info
  if (team.teamName                !== undefined) db.team_name                  = team.teamName
  if (team.startupName             !== undefined) db.startup_name               = team.startupName
  if (team.sector                  !== undefined) db.sector                     = team.sector
  if (team.institution             !== undefined) db.institution                = team.institution
  if (team.teamSize                !== undefined) db.team_size                  = team.teamSize
  if (team.roles                   !== undefined) db.roles                      = team.roles
  if (team.interviewDate           !== undefined) db.interview_date             = team.interviewDate || null
  if (team.interviewer             !== undefined) db.interviewer                = team.interviewer

  // Map all p1-p9 and outputs exactly as they are (snake_case in frontend state for these fields)
  Object.keys(team).forEach(key => {
    if (key.startsWith('p1_') || key.startsWith('p2_') || key.startsWith('p3_') || 
        key.startsWith('p4_') || key.startsWith('p5_') || key.startsWith('p6_') || 
        key.startsWith('p7_') || key.startsWith('p8_') || key.startsWith('p9_') ||
        ['detected_stage', 'overall_weighted_score', 'startup_user_id', 'submission_status', 'submission_number', 'admin_notes', 'diagnosis_released', 'deleted_at'].includes(key)) {
      db[key] = (team as any)[key]
    }
  })

  return db
}
