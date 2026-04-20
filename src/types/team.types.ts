import { z } from 'zod'

export interface SubmissionComment {
  id: string
  team_id: string
  commenter_id: string
  commenter_name: string
  comment_text: string
  parameter_ref: string   // 'overall' | 'P1' | 'P2' | ... | 'P9'
  created_at: string
  updated_at: string
}

export const RoadmapItemSchema = z.object({
  priority:    z.enum(['P0', 'P1', 'P2']),
  action:      z.string().max(500).default(''),
  supportFrom: z.string().max(200).default(''),
  byWhen:      z.string().max(100).default(''),
})

export const TeamMemberSchema = z.object({
  name: z.string().default(''),
  role: z.string().default(''),
  skill: z.string().default(''),
})

export const TeamBaseSchema = z.object({
  // Basic Info
  teamName:                  z.string().max(200).default(''),
  startupName:               z.string().max(200).default(''),
  sector:                    z.string().max(200).default(''),
  institution:               z.string().max(200).default(''),
  teamSize:                  z.string().max(100).default(''),
  roles:                     z.string().max(500).default(''),
  interviewDate:             z.string().default(''),
  interviewer:               z.string().max(200).default(''),

  // P1 — Character & Problem
  p1_problem_statement:      z.string().default(''),
  p1_problem_score:          z.number().int().min(0).max(5).default(0),
  p1_why_us:                 z.string().default(''),
  p1_why_us_score:           z.number().int().min(0).max(5).default(0),
  p1_commitment:             z.string().default(''),
  p1_commitment_score:       z.number().int().min(0).max(5).default(0),
  p1_learning:               z.string().default(''),
  p1_learning_score:         z.number().int().min(0).max(5).default(0),
  p1_deep_empathy:           z.string().default(''),
  p1_deep_empathy_score:     z.number().int().min(0).max(5).default(0),
  p1_resilience:             z.string().default(''),
  p1_resilience_score:       z.number().int().min(0).max(5).default(0),
  p1_sacrifice:              z.string().default(''),
  p1_sacrifice_score:        z.number().int().min(0).max(5).default(0),
  p1_observation:            z.string().default(''),

  // P2 — Discovery
  p2_interview_count:        z.number().default(0),
  p2_interview_count_score:  z.number().int().min(0).max(5).default(0),
  p2_stakeholder_types:      z.string().default(''),
  p2_stakeholder_types_score: z.number().int().min(0).max(5).default(0),
  p2_key_insight:            z.string().default(''),
  p2_key_insight_score:      z.number().int().min(0).max(5).default(0),
  p2_pivoted:                z.string().default(''),
  p2_pivoted_score:          z.number().int().min(0).max(5).default(0),
  p2_evidence:               z.string().default(''),
  p2_evidence_score:         z.number().int().min(0).max(5).default(0),
  p2_pilot_users:            z.string().default(''),
  p2_pilot_users_score:      z.number().int().min(0).max(5).default(0),
  p2_objections:             z.string().default(''),
  p2_objections_score:       z.number().int().min(0).max(5).default(0),
  p2_observation:            z.string().default(''),

  // P3 — Product / TRL
  p3_trl:                    z.number().nullable().default(null),
  p3_trl_score:              z.number().int().min(0).max(5).default(0),
  p3_built:                  z.string().default(''),
  p3_built_score:            z.number().int().min(0).max(5).default(0),
  p3_product_type:           z.string().default(''),
  p3_external_testing:       z.string().default(''),
  p3_external_testing_score: z.number().int().min(0).max(5).default(0),
  p3_tech_risk:              z.string().default(''),
  p3_tech_risk_score:        z.number().int().min(0).max(5).default(0),
  p3_trl_gap:                z.string().default(''),
  p3_trl_gap_score:          z.number().int().min(0).max(5).default(0),
  p3_ip:                     z.string().default(''),
  p3_ip_score:               z.number().int().min(0).max(5).default(0),
  p3_observation:            z.string().default(''),

  // P4 — Differentiation
  p4_differentiation:        z.string().default(''),
  p4_differentiation_score:  z.number().int().min(0).max(5).default(0),
  p4_competitors:            z.string().default(''),
  p4_competitors_score:      z.number().int().min(0).max(5).default(0),
  p4_without_us:             z.string().default(''),
  p4_without_us_score:       z.number().int().min(0).max(5).default(0),
  p4_customer_preference:    z.string().default(''),
  p4_customer_preference_score: z.number().int().min(0).max(5).default(0),
  p4_hard_to_copy:           z.string().default(''),
  p4_hard_to_copy_score:     z.number().int().min(0).max(5).default(0),
  p4_ab_testing:             z.string().default(''),
  p4_ab_testing_score:       z.number().int().min(0).max(5).default(0),
  p4_observation:            z.string().default(''),

  // P5 — Market
  p5_icp:                    z.string().default(''),
  p5_icp_score:              z.number().int().min(0).max(5).default(0),
  p5_market_size:            z.string().default(''),
  p5_market_size_score:      z.number().int().min(0).max(5).default(0),
  p5_urgency:                z.string().default(''),
  p5_urgency_score:          z.number().int().min(0).max(5).default(0),
  p5_gtm:                    z.string().default(''),
  p5_gtm_score:              z.number().int().min(0).max(5).default(0),
  p5_unfair_access:          z.string().default(''),
  p5_unfair_access_score:    z.number().int().min(0).max(5).default(0),
  p5_observation:            z.string().default(''),

  // P6 — Business Model
  p6_revenue_model:          z.string().default(''),
  p6_revenue_model_score:    z.number().int().min(0).max(5).default(0),
  p6_revenue_stage:          z.string().default(''),
  p6_bmc_status:             z.string().default(''),
  p6_bmc_score:              z.number().int().min(0).max(5).default(0),
  p6_model_type:             z.string().default(''),
  p6_pricing_tested:         z.string().default(''),
  p6_pricing_tested_score:   z.number().int().min(0).max(5).default(0),
  p6_unit_economics:         z.string().default(''),
  p6_unit_economics_score:   z.number().int().min(0).max(5).default(0),
  p6_observation:            z.string().default(''),

  // P7 — Traction / CRL
  p7_crl:                    z.number().nullable().default(null),
  p7_crl_score:              z.number().int().min(0).max(5).default(0),
  p7_active_users:           z.number().default(0),
  p7_active_users_score:     z.number().int().min(0).max(5).default(0),
  p7_retention:              z.string().default(''),
  p7_retention_score:        z.number().int().min(0).max(5).default(0),
  p7_growth:                 z.string().default(''),
  p7_growth_score:           z.number().int().min(0).max(5).default(0),
  p7_referrals:              z.string().default(''),
  p7_referrals_score:        z.number().int().min(0).max(5).default(0),
  p7_churn:                  z.string().default(''),
  p7_churn_score:            z.number().int().min(0).max(5).default(0),
  p7_observation:            z.string().default(''),

  // P8 — Team
  p8_team_members:           z.array(TeamMemberSchema).default([]),
  p8_team_score:             z.number().int().min(0).max(5).default(0),
  p8_missing_skills:         z.string().default(''),
  p8_missing_skills_score:   z.number().int().min(0).max(5).default(0),
  p8_commitment:             z.string().default(''),
  p8_commitment_score:       z.number().int().min(0).max(5).default(0),
  p8_advisors:               z.string().default(''),
  p8_advisors_score:         z.number().int().min(0).max(5).default(0),
  p8_prior_work:             z.string().default(''),
  p8_prior_work_score:       z.number().int().min(0).max(5).default(0),
  p8_internal_challenge:     z.string().default(''),
  p8_internal_challenge_score: z.number().int().min(0).max(5).default(0),
  p8_observation:            z.string().default(''),

  // P9 — Advantage
  p9_competitor_awareness:   z.string().default(''),
  p9_competitor_awareness_score: z.number().int().min(0).max(5).default(0),
  p9_hard_to_copy:           z.string().default(''),
  p9_hard_to_copy_score:     z.number().int().min(0).max(5).default(0),
  p9_ip:                     z.string().default(''),
  p9_ip_score:               z.number().int().min(0).max(5).default(0),
  p9_network_effects:        z.string().default(''),
  p9_network_effects_score:  z.number().int().min(0).max(5).default(0),
  p9_switching_costs:        z.string().default(''),
  p9_switching_costs_score:  z.number().int().min(0).max(5).default(0),
  p9_observation:            z.string().default(''),

  // Diagnosis Outputs
  detected_stage:            z.string().default(''),
  overall_weighted_score:    z.number().nullable().default(null),

  // Strategic Metadata
  startup_user_id:           z.string().nullable().default(null),
  submission_status:         z.enum(['draft', 'submitted']).default('draft'),
  submission_number:         z.number().int().default(1),
  diagnosis_released:        z.boolean().default(false),
  deleted_at:                z.string().nullable().default(null),
  admin_notes:               z.string().default(''),
})

export const TeamCreateSchema = TeamBaseSchema
export const TeamUpdateSchema = TeamBaseSchema.partial()

export type TeamProfile = z.infer<typeof TeamBaseSchema> & { 
  id: string
  created_at: string
  updated_at: string
}
export type RoadmapItem = z.infer<typeof RoadmapItemSchema>
