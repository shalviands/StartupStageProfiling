export const PARAMETERS_CONFIG = [
  {
    id: 'p1',
    title: 'Character & Problem',
    subtitle: 'Founder integrity, resilience, and depth of problem understanding.',
    weight: '16%',
    coreQs: [
      { id: 'problem_statement', label: 'Problem Statement', type: 'text', placeholder: 'What is the deep, underlying problem?' },
      { id: 'why_us', label: 'Why Us?', type: 'text', placeholder: 'Founder-market fit & unique insight.' },
      { id: 'commitment', label: 'Founder Commitment', type: 'text', placeholder: 'Time, money, and focus levels.' },
      { id: 'learning', label: 'Learning Velocity', type: 'text', placeholder: 'How fast does the team iterate?' },
    ],
    deepDiveQs: [
      { id: 'deep_empathy', label: 'Customer Empathy', type: 'text', placeholder: 'Depth of emotional understanding of user pain.' },
      { id: 'resilience', label: 'Resilience Evidence', type: 'text', placeholder: 'Past failures handled or pivots survived.' },
      { id: 'sacrifice', label: 'Founder Sacrifice', type: 'text', placeholder: 'What has been given up to build this?' },
    ]
  },
  {
    id: 'p2',
    title: 'Customer Discovery',
    subtitle: 'Evidence of market interaction and validated insights.',
    weight: '13%',
    coreQs: [
      { id: 'interview_count', label: 'Discovery Interviews', type: 'number', placeholder: 'Total # of stakeholders interviewed.' },
      { id: 'stakeholder_types', label: 'Stakeholder Variety', type: 'text', placeholder: 'Who did you talk to? (Users, buyers, partners).' },
      { id: 'key_insight', label: 'The Big "Aha!"', type: 'text', placeholder: 'One non-obvious thing you learned.' },
    ],
    deepDiveQs: [
      { id: 'pivoted', label: 'Pivot History', type: 'text', placeholder: 'What did you change based on feedback?' },
      { id: 'evidence', label: 'Data Quality', type: 'text', placeholder: 'Synthesized evidence vs. anecdotal bias.' },
      { id: 'pilot_users', label: 'Pilot/LOI Users', type: 'text', placeholder: 'Commitment from early users.' },
      { id: 'objections', label: 'Known Objections', type: 'text', placeholder: 'Counter-evidence you are investigating.' },
    ]
  },
  {
    id: 'p3',
    title: 'Product & TRL',
    subtitle: 'Technical durability and readiness level of the solution.',
    weight: '14%',
    coreQs: [
      { id: 'trl', label: 'TRL Level', type: 'select', options: ['1 - Basic Research', '2 - Concept Formulated', '3 - Experimental Proof', '4 - Lab Validation', '5 - Relevant Environment', '6 - Subsystem Demo', '7 - System Prototype', '8 - Production Ready', '9 - Mission Proven'] },
      { id: 'built', label: 'Solution Architecture', type: 'text', placeholder: 'Current status of the build.' },
      { id: 'product_type', label: 'Product Type', type: 'select', options: ['SaaS', 'Hardware', 'Marketplace', 'DeepTech/R&D', 'Service-Tech', 'Other'] },
    ],
    deepDiveQs: [
      { id: 'external_testing', label: 'Third-Party Validation', type: 'text', placeholder: 'Testing by someone outside the team.' },
      { id: 'tech_risk', label: 'Critical Tech Risk', type: 'text', placeholder: 'What could break the product?' },
      { id: 'trl_gap', label: 'Next Mile Gap', type: 'text', placeholder: 'What is needed to reach next TRL?' },
      { id: 'ip', label: 'IP / Proprietary Tech', type: 'text', placeholder: 'Algorithms, patents, or trade secrets.' },
    ]
  },
  {
    id: 'p4',
    title: 'Differentiation',
    subtitle: 'How you win against incumbents and alternatives.',
    weight: '7%',
    coreQs: [
      { id: 'differentiation', label: 'Unique Edge', type: 'text', placeholder: 'Why will customers pick you?' },
      { id: 'competitors', label: 'Alternative Logic', type: 'text', placeholder: 'What do they use today (including Excel)?' },
      { id: 'without_us', label: 'Status Quo Cost', type: 'text', placeholder: 'Cost of doing nothing.' },
    ],
    deepDiveQs: [
      { id: 'customer_preference', label: 'Preference Evidence', type: 'text', placeholder: 'Why do users say they like you better?' },
      { id: 'hard_to_copy', label: 'Barriers to Entry', type: 'text', placeholder: 'Why can’t a giant copy you tomorrow?' },
      { id: 'ab_testing', label: 'Testing Results', type: 'text', placeholder: 'Comparison data against alternatives.' },
    ]
  },
  {
    id: 'p5',
    title: 'Market & ICP',
    subtitle: 'Targeting, urgency, and scale potential.',
    weight: '12%',
    coreQs: [
      { id: 'icp', label: 'Ideal Customer Profile', type: 'text', placeholder: 'Who is the "Desperate Customer"?' },
      { id: 'market_size', label: 'TAM/SAM/SOM', type: 'text', placeholder: 'Addressable revenue potential.' },
      { id: 'urgency', label: 'Buying Urgency', type: 'text', placeholder: 'Why buy now? (Fine, Fee, or Fear).' },
    ],
    deepDiveQs: [
      { id: 'gtm', label: 'Go-To-Market Strategy', type: 'text', placeholder: 'Channel strategy for first 100 users.' },
      { id: 'unfair_access', label: 'Distribution Moat', type: 'text', placeholder: 'Partnerships or hidden network access.' },
    ]
  },
  {
    id: 'p6',
    title: 'Business Model',
    subtitle: 'Revenue engine and unit economic potential.',
    weight: '11%',
    coreQs: [
      { id: 'revenue_model', label: 'Revenue Stream', type: 'text', placeholder: 'How exactly do you make money?' },
      { id: 'revenue_stage', label: 'Revenue Status', type: 'select', options: ['Pre-Revenue', 'Initial Pilots (Free)', 'Paid Pilots', 'Early Revenue', 'Recurring Revenue', 'Scaling Revenue'] },
      { id: 'bmc_status', label: 'BMC Maturity', type: 'text', placeholder: 'Status of the 9 blocks.' },
    ],
    deepDiveQs: [
      { id: 'pricing_tested', label: 'Pricing Validation', type: 'text', placeholder: 'Willingness to pay evidence.' },
      { id: 'model_type', label: 'Scalability Logic', type: 'text', placeholder: 'Fixed vs Variable cost structure.' },
      { id: 'unit_economics', label: 'LTV/CAC Logic', type: 'text', placeholder: 'Early math on profitability per user.' },
    ]
  },
  {
    id: 'p7',
    title: 'Traction & CRL',
    subtitle: 'Active user proof and feedback loops.',
    weight: '12%',
    coreQs: [
      { id: 'crl', label: 'CRL Level', type: 'select', options: ['1 - Ignorant', '2 - Identified', '3 - Validated', '4 - Qualified', '5 - Committed', '6 - Commercialized', '7 - Scalable', '8 - Proven', '9 - High Growth'] },
      { id: 'active_users', label: 'Active User Count', type: 'number', placeholder: 'DAU/MAU or active accounts.' },
      { id: 'retention', label: 'Retention Evidence', type: 'text', placeholder: 'Do they come back?' },
    ],
    deepDiveQs: [
      { id: 'growth', label: 'Growth Velocity', type: 'text', placeholder: 'Week-over-week or Month-over-month %.' },
      { id: 'referrals', label: 'K-Factor', type: 'text', placeholder: 'Evidence of viral or referral growth.' },
      { id: 'churn', label: 'Churn Rate', type: 'text', placeholder: 'Why do users leave?' },
    ]
  },
  {
    id: 'p8',
    title: 'Team Readiness',
    subtitle: 'Founder mix, skills, and execution track record.',
    weight: '12%',
    coreQs: [
      { id: 'team_members', label: 'Core Team', type: 'team' },
      { id: 'missing_skills', label: 'Gaps in Table', type: 'text', placeholder: 'What hire is needed next?' },
      { id: 'commitment', label: 'Founder Equity/Time', type: 'text', placeholder: 'Full-time vs Side-project status.' },
    ],
    deepDiveQs: [
      { id: 'advisors', label: 'Advisory Board', type: 'text', placeholder: 'External veterans supporting the team.' },
      { id: 'prior_work', label: 'Execution Evidence', type: 'text', placeholder: 'Past startups or domain expertise.' },
      { id: 'internal_challenge', label: 'Team Cohesion', type: 'text', placeholder: 'How long have you worked together?' },
    ]
  },
  {
    id: 'p9',
    title: 'Advantage & Moats',
    subtitle: 'High-level defensibility and long-term winner logic.',
    weight: '3% + Bonus',
    coreQs: [
      { id: 'competitor_awareness', label: 'Incumbent Audit', type: 'text', placeholder: 'What will Google/Meta do if they see you?' },
      { id: 'hard_to_copy', label: 'Technological Moat', type: 'text', placeholder: 'What is non-trivial to replicate?' },
    ],
    deepDiveQs: [
      { id: 'ip', label: 'Patents/Trade Secrets', type: 'text', placeholder: 'Legal or structural defensibility.' },
      { id: 'network_effects', label: 'Defensive Loops', type: 'text', placeholder: 'Data or user network effects.' },
      { id: 'switching_costs', label: 'Lock-in Logic', type: 'text', placeholder: 'Why is it painful to leave?' },
    ]
  }
] as const
