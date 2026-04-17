import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'

export async function GET() {
  try {
    const user = await getUserFromRequest()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createServerSupabaseClient()
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()

    const role = profile?.role ?? 'startup'
    let selectFields = '*'
    
    // Exclude admin_notes for anyone not admin
    if (role !== 'admin') {
      // List all fields EXCEPT admin_notes
      // In Supabase/PostgREST, we can't easily "exclude", so we list them or just select * if we trust RLS.
      // But the prompt specifically says EXCLUDE admin_notes from SELECT.
      // To be safe, I'll list the common fields or use a restricted select.
      // However, usually RLS handles visibility. If I must exclude from SELECT:
      selectFields = 'id, user_id, startup_user_id, team_name, startup_name, sector, institution, team_size, roles, interviewer, interview_date, p1_problem_statement, p1_problem_score, p1_why_us, p1_why_us_score, p1_commitment, p1_commitment_score, p1_learning, p1_learning_score, p1_deep_empathy, p1_deep_empathy_score, p1_resilience, p1_resilience_score, p1_sacrifice, p1_sacrifice_score, p1_observation, p2_interview_count, p2_interview_count_score, p2_stakeholder_types, p2_stakeholder_types_score, p2_key_insight, p2_key_insight_score, p2_pivoted, p2_pivoted_score, p2_evidence, p2_evidence_score, p2_pilot_users, p2_pilot_users_score, p2_objections, p2_objections_score, p2_observation, p3_trl, p3_trl_score, p3_built, p3_built_score, p3_product_type, p3_external_testing, p3_external_testing_score, p3_tech_risk, p3_tech_risk_score, p3_trl_gap, p3_trl_gap_score, p3_ip, p3_ip_score, p3_observation, p4_differentiation, p4_differentiation_score, p4_competitors, p4_competitors_score, p4_without_us, p4_without_us_score, p4_customer_preference, p4_customer_preference_score, p4_hard_to_copy, p4_hard_to_copy_score, p4_ab_testing, p4_ab_testing_score, p4_observation, p5_icp, p5_market_size, p5_market_size_score, p5_urgency, p5_urgency_score, p5_gtm, p5_gtm_score, p5_unfair_access, p5_unfair_access_score, p5_observation, p6_revenue_model, p6_revenue_model_score, p6_revenue_stage, p6_bmc_status, p6_bmc_score, p6_model_type, p6_pricing_tested, p6_pricing_tested_score, p6_unit_economics, p6_unit_economics_score, p6_observation, p7_crl, p7_crl_score, p7_active_users, p7_active_users_score, p7_retention, p7_retention_score, p7_growth, p7_growth_score, p7_referrals, p7_referrals_score, p7_churn, p7_churn_score, p7_observation, p8_team_members, p8_team_score, p8_missing_skills, p8_missing_skills_score, p8_commitment, p8_commitment_score, p8_advisors, p8_advisors_score, p8_prior_work, p8_prior_work_score, p8_internal_challenge, p8_internal_challenge_score, p8_observation, p9_competitor_awareness, p9_competitor_awareness_score, p9_hard_to_copy, p9_hard_to_copy_score, p9_ip, p9_ip_score, p9_network_effects, p9_network_effects_score, p9_switching_costs, p9_switching_costs_score, p9_observation, detected_stage, stage_override_flag, assigned_mentor_type, overall_weighted_score, p9_bonus_active, submission_status, submission_number, created_at, updated_at'
    }

    let query = supabase.from('teams').select(selectFields).order('created_at', { ascending: false })

    if (role === 'startup') {
      query = query.eq('startup_user_id', user.id)
    }

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data ?? [])
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const supabase = await createServerSupabaseClient()

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()

    const role = profile?.role ?? 'startup'

    // Calculate submission number for startups
    let submission_number = 1
    if (role === 'startup') {
      const { count } = await supabase
        .from('teams')
        .select('id', { count: 'exact', head: true })
        .eq('startup_user_id', user.id)
      
      submission_number = (count ?? 0) + 1
    }

    const insertData: any = {
      user_id: user.id,
      team_name: body.teamName ?? body.team_name ?? 'New Submission',
      startup_name: body.startupName ?? body.startup_name ?? '',
      sector: body.sector ?? '',
      institution: body.institution ?? '',
      submission_status: 'draft',
      submission_number,
      p8_team_members: body.p8_team_members ?? [],
      // defaults for other fields
    }

    if (role === 'startup') {
      insertData.startup_user_id = user.id
    }

    const { data, error } = await supabase
      .from('teams')
      .insert(insertData)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
