// src/lib/parameters.ts
/**
 * InUnity Startup Diagnosis Profiler — Parameter Registry v2.0
 * This is the SINGLE SOURCE OF TRUTH for all diagnostic questions, 
 * weights, and scoring fields.
 */

export interface Question {
  id: string
  label: string
  hint?: string
  type: 'text' | 'number' | 'select' | 'team' | 'textarea'
  options?: string[]
  scoreField: string
}

export interface ParameterSection {
  id: string
  name: string
  subtitle: string
  weight: number
  description: string
  questions: {
    core: Question[]
    deepDive: Question[]
  }
  observationField: string
}

export const PARAMETERS: Record<string, ParameterSection> = {
  P1: {
    id: 'P1',
    name: "Entrepreneur's Character & Problem Clarity",
    subtitle: "Founder integrity, resilience, and depth of problem understanding.",
    weight: 0.15, // Corrected v2.0 weight
    description: "Evaluates the founder's commitment and how deeply they understand the friction they are solving.",
    observationField: 'p1_observation',
    questions: {
      core: [
        {
          id: 'p1_problem_statement',
          label: 'What is the deep, underlying problem?',
          hint: 'Define the core friction or inefficiency.',
          type: 'textarea',
          scoreField: 'p1_problem_score'
        },
        {
          id: 'p1_why_us',
          label: 'Why is this team specifically qualified to win?',
          hint: 'Founder-market fit & unique insights.',
          type: 'textarea',
          scoreField: 'p1_why_us_score'
        },
        {
          id: 'p1_commitment',
          label: 'Current level of commitment?',
          hint: 'Time, money, and focus levels.',
          type: 'text',
          scoreField: 'p1_commitment_score'
        },
        {
          id: 'p1_learning',
          label: 'Evidence of rapid iteration?',
          hint: 'How fast did you pivot or learn from failure?',
          type: 'text',
          scoreField: 'p1_learning_score'
        }
      ],
      deepDive: [
        {
          id: 'p1_deep_empathy',
          label: 'Describe the worst version of this problem...',
          hint: 'Customer empathy and depth of pain understanding.',
          type: 'textarea',
          scoreField: 'p1_deep_empathy_score'
        },
        {
          id: 'p1_resilience',
          label: 'Past evidence of resilience?',
          hint: 'How did you handle a previous major setback?',
          type: 'textarea',
          scoreField: 'p1_resilience_score'
        },
        {
          id: 'p1_sacrifice',
          label: 'What have you given up to build this?',
          hint: 'Opportunity cost and skin in the game.',
          type: 'text',
          scoreField: 'p1_sacrifice_score'
        }
      ]
    }
  },
  P2: {
    id: 'P2',
    name: 'Customer Discovery',
    subtitle: 'Evidence of market interaction and validated insights.',
    weight: 0.13,
    description: 'Measures the quantity and quality of feedback from the real market.',
    observationField: 'p2_observation',
    questions: {
      core: [
        {
          id: 'p2_interview_count',
          label: 'Number of stakeholder interviews?',
          type: 'number',
          scoreField: 'p2_interview_count_score'
        },
        {
          id: 'p2_stakeholder_types',
          label: 'Who did you talk to?',
          hint: 'Users, buyers, partners, etc.',
          type: 'text',
          scoreField: 'p2_stakeholder_types_score'
        },
        {
          id: 'p2_key_insight',
          label: 'One non-obvious thing you learned?',
          type: 'textarea',
          scoreField: 'p2_key_insight_score'
        }
      ],
      deepDive: [
        {
          id: 'p2_pivoted',
          label: 'What did you change based on feedback?',
          type: 'textarea',
          scoreField: 'p2_pivoted_score'
        },
        {
          id: 'p2_evidence',
          label: 'Quality of the data captured?',
          type: 'text',
          scoreField: 'p2_evidence_score'
        },
        {
          id: 'p2_pilot_users',
          label: 'Number of pilot/LOI users?',
          type: 'text',
          scoreField: 'p2_pilot_users_score'
        },
        {
          id: 'p2_objections',
          label: 'Common objections you are investigating?',
          type: 'textarea',
          scoreField: 'p2_objections_score'
        }
      ]
    }
  },
  P3: {
    id: 'P3',
    name: 'Product & TRL',
    subtitle: 'Technical durability and readiness level of the solution.',
    weight: 0.13, // Corrected v2.0 weight
    description: 'Assesses the technical maturity and architecture of the solution.',
    observationField: 'p3_observation',
    questions: {
      core: [
        {
          id: 'p3_trl',
          label: 'Current Tech Readiness Level (TRL)?',
          type: 'select',
          options: ['1','2','3','4','5','6','7','8','9'],
          scoreField: 'p3_trl_score'
        },
        {
          id: 'p3_built',
          label: 'What is the current status of the build?',
          type: 'textarea',
          scoreField: 'p3_built_score'
        },
        {
          id: 'p3_product_type',
          label: 'Product Category?',
          type: 'select',
          options: ['SaaS', 'Hardware', 'Marketplace', 'DeepTech', 'Service-Tech', 'Other'],
          scoreField: 'p3_product_type_score'
        }
      ],
      deepDive: [
        {
          id: 'p3_external_testing',
          label: 'Results of external testing?',
          type: 'textarea',
          scoreField: 'p3_external_testing_score'
        },
        {
          id: 'p3_tech_risk',
          label: 'Critical technical risk identified?',
          type: 'text',
          scoreField: 'p3_tech_risk_score'
        },
        {
          id: 'p3_trl_gap',
          label: 'Next milestone to move up TRL?',
          type: 'text',
          scoreField: 'p3_trl_gap_score'
        },
        {
          id: 'p3_ip',
          label: 'Proprietary IP or algorithms?',
          type: 'text',
          scoreField: 'p3_ip_score'
        }
      ]
    }
  },
  P4: {
    id: 'P4',
    name: 'Differentiation',
    subtitle: 'How you win against incumbents and alternatives.',
    weight: 0.07,
    description: 'Evaluates the uniqueness of the value proposition.',
    observationField: 'p4_observation',
    questions: {
      core: [
        {
           id: 'p4_differentiation',
           label: 'Why will customers pick you over others?',
           type: 'textarea',
           scoreField: 'p4_differentiation_score'
        },
        {
           id: 'p4_competitors',
           label: 'What is the "Alternative Logic" used today?',
           hint: 'Includes Excel, manual work, or rival startups.',
           type: 'textarea',
           scoreField: 'p4_competitors_score'
        },
        {
           id: 'p4_without_us',
           label: 'Cost of sticking with the status quo?',
           type: 'text',
           scoreField: 'p4_without_us_score'
        }
      ],
      deepDive: [
        {
           id: 'p4_customer_preference',
           label: 'Evidence of customer preference?',
           type: 'textarea',
           scoreField: 'p4_customer_preference_score'
        },
        {
           id: 'p4_hard_to_copy',
           label: 'Non-replicable barrier to entry?',
           type: 'text',
           scoreField: 'p4_hard_to_copy_score'
        },
        {
           id: 'p4_ab_testing',
           label: 'A/B testing or comparison results?',
           type: 'text',
           scoreField: 'p4_ab_testing_score'
        }
      ]
    }
  },
  P5: {
    id: 'P5',
    name: 'Market & ICP',
    subtitle: 'Targeting, urgency, and scale potential.',
    weight: 0.12,
    description: 'Measures the scale of the opportunity and clarity of targets.',
    observationField: 'p5_observation',
    questions: {
      core: [
        {
          id: 'p5_icp',
          label: 'Describe the "Desperate Customer" (ICP)?',
          type: 'textarea',
          scoreField: 'p5_icp_score'
        },
        {
          id: 'p5_market_size',
          label: 'TAM / SAM / SOM calculation?',
          type: 'text',
          scoreField: 'p5_market_size_score'
        },
        {
          id: 'p5_urgency',
          label: 'What is the "Hair on Fire" urgency?',
          hint: 'Fine, Fee, or Fear triggers?',
          type: 'text',
          scoreField: 'p5_urgency_score'
        }
      ],
      deepDive: [
        {
          id: 'p5_gtm',
          label: 'Go-to-Market (GTM) strategy details?',
          type: 'textarea',
          scoreField: 'p5_gtm_score'
        },
        {
          id: 'p5_unfair_access',
          label: 'Distribution Moat?',
          hint: 'Partnerships or unfair network access.',
          type: 'text',
          scoreField: 'p5_unfair_access_score'
        }
      ]
    }
  },
  P6: {
    id: 'P6',
    name: 'Business Model',
    subtitle: 'Revenue engine and unit economic potential.',
    weight: 0.11,
    description: 'Evaluates capitalization potential and revenue logic.',
    observationField: 'p6_observation',
    questions: {
      core: [
        {
          id: 'p6_revenue_model',
          label: 'How exactly do you make money?',
          type: 'textarea',
          scoreField: 'p6_revenue_model_score'
        },
        {
          id: 'p6_revenue_stage',
          label: 'Current Revenue Stage?',
          type: 'select',
          options: ['Pre-Revenue', 'Initial Pilots (Free)', 'Paid Pilots', 'Early Revenue', 'Recurring Revenue', 'Scaling'],
          scoreField: 'p6_revenue_model_score' // Using this as proxy or score mapping
        },
        {
          id: 'p6_bmc_status',
          label: 'Business Model Canvas (BMC) maturity?',
          type: 'text',
          scoreField: 'p6_bmc_score'
        }
      ],
      deepDive: [
        {
          id: 'p6_pricing_tested',
          label: 'How was pricing validated?',
          type: 'textarea',
          scoreField: 'p6_pricing_tested_score'
        },
        {
          id: 'p6_model_type',
          label: 'Fixed vs Variable cost logic?',
          type: 'text',
          scoreField: 'p6_bmc_score'
        },
        {
          id: 'p6_unit_economics',
          label: 'Early LTV/CAC math?',
          type: 'text',
          scoreField: 'p6_unit_economics_score'
        }
      ]
    }
  },
  P7: {
    id: 'P7',
    name: 'Traction & CRL',
    subtitle: 'Active user proof and feedback loops.',
    weight: 0.11, // Corrected v2.0 weight
    description: 'Measures active market pull and user retention.',
    observationField: 'p7_observation',
    questions: {
      core: [
        {
          id: 'p7_crl',
          label: 'Commercial Readiness Level (CRL)?',
          type: 'select',
          options: ['1','2','3','4','5','6','7','8','9'],
          scoreField: 'p7_crl_score'
        },
        {
          id: 'p7_active_users',
          label: 'Number of Active Users (DAU/WAU/MAU)?',
          type: 'number',
          scoreField: 'p7_active_users_score'
        },
        {
          id: 'p7_retention',
          label: 'Evidence of retention (Stickiness)?',
          type: 'textarea',
          scoreField: 'p7_retention_score'
        }
      ],
      deepDive: [
        {
          id: 'p7_growth',
          label: 'Growth Velocity (% WoW/MoM)?',
          type: 'text',
          scoreField: 'p7_growth_score'
        },
        {
          id: 'p7_referrals',
          label: 'Referral/Viral coefficient?',
          type: 'text',
          scoreField: 'p7_referrals_score'
        },
        {
          id: 'p7_churn',
          label: 'Why do users leave? (Churn audit)',
          type: 'textarea',
          scoreField: 'p7_churn_score'
        }
      ]
    }
  },
  P8: {
    id: 'P8',
    name: 'Team Readiness',
    subtitle: 'Founder mix, skills, and execution track record.',
    weight: 0.12,
    description: 'Evaluates the human capital behind the venture.',
    observationField: 'p8_observation',
    questions: {
      core: [
        {
          id: 'p8_team_members',
          label: 'Core Team Members',
          type: 'team',
          scoreField: 'p8_team_score'
        },
        {
          id: 'p8_missing_skills',
          label: 'What hire is needed next?',
          type: 'text',
          scoreField: 'p8_missing_skills_score'
        },
        {
          id: 'p8_commitment',
          label: 'Founder Equity & Focus status?',
          type: 'text',
          scoreField: 'p8_commitment_score'
        }
      ],
      deepDive: [
        {
          id: 'p8_advisors',
          label: 'Who are your key advisors?',
          type: 'textarea',
          scoreField: 'p8_advisors_score'
        },
        {
          id: 'p8_prior_work',
          label: 'Team track record (Evidence of Done)?',
          type: 'textarea',
          scoreField: 'p8_prior_work_score'
        },
        {
          id: 'p8_internal_challenge',
          label: 'How long has the team worked together?',
          type: 'text',
          scoreField: 'p8_internal_challenge_score'
        }
      ]
    }
  },
  P9: {
    id: 'P9',
    name: 'Advantage & Moats',
    subtitle: 'High-level defensibility and winner logic.',
    weight: 0.06, // Corrected v2.0 weight
    description: 'Assesses the strategic depth and barriers to entry.',
    observationField: 'p9_observation',
    questions: {
      core: [
        {
          id: 'p9_competitor_awareness',
          label: 'Deep analysis of incumbents?',
          type: 'textarea',
          scoreField: 'p9_competitor_awareness_score'
        },
        {
          id: 'p9_hard_to_copy_core',
          label: 'Technological or data moat?',
          type: 'textarea',
          scoreField: 'p9_hard_to_copy_score'
        }
      ],
      deepDive: [
        {
          id: 'p9_ip',
          label: 'Formal IP (Patents, Trade Secrets)?',
          type: 'text',
          scoreField: 'p9_ip_score'
        },
        {
          id: 'p9_network_effects',
          label: 'Potential for Network Effects?',
          type: 'text',
          scoreField: 'p9_network_effects_score'
        },
        {
          id: 'p9_switching_costs',
          label: 'Switching costs for customers?',
          type: 'text',
          scoreField: 'p9_switching_costs_score'
        }
      ]
    }
  }
} as const
