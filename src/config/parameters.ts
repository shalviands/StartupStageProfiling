export const PARAMETERS_CONFIG = [
  {
    id: 'p1',
    title: 'Character & Problem',
    subtitle: 'Founder integrity, resilience, and depth of problem understanding.',
    weight: '16%',
    coreQs: [
      { id: 'problem_statement', label: 'Problem Statement', type: 'text', placeholder: 'What is the deep, underlying problem?', description: 'Define the core friction or inefficiency you are solving.', example: "Local manufacturers lose 30% of margin because they buy raw materials from 4 different middlemen who don't consolidate orders." },
      { id: 'why_us', label: 'Why Us?', type: 'text', placeholder: 'Founder-market fit & unique insight.', description: 'Why is this team specifically qualified to win?', example: "Our CTO spent 10 years in logistics for BlueChip Corp and saw this specific inefficiency firsthand across 200 vendors." },
      { id: 'commitment', label: 'Founder Commitment', type: 'text', placeholder: 'Time, money, and focus levels.', description: 'Level of dedication to this specific venture.', example: "3/4 founders are full-time; we have invested $15k of our own savings to build the initial MVP." },
      { id: 'learning', label: 'Learning Velocity', type: 'text', placeholder: 'How fast does the team iterate?', description: 'Evidence of rapid experimentation and adaptation.', example: "We ran 5 landing page tests in 2 weeks, resulting in a 40% pivot from B2C to B2B based on sign-up data." },
    ],
    deepDiveQs: [
      { id: 'deep_empathy', label: 'Customer Empathy', type: 'text', placeholder: 'Depth of emotional understanding of user pain.', description: 'Do you feel the "pain" your customer feels?', example: "Spent 40 hours shadowing warehouse managers; observed they carry physical clipboards because the current digital tools have too small buttons for gloves." },
      { id: 'resilience', label: 'Resilience Evidence', type: 'text', placeholder: 'Past failures handled or pivots survived.', description: 'How does the team handle extreme pressure?', example: "Previous startup failed due to co-founder departure; I successfully wound it down, paid back debts, and started this with 2 core engineers from that team." },
      { id: 'sacrifice', label: 'Founder Sacrifice', type: 'text', placeholder: 'What has been given up to build this?', description: 'Opportunity cost and skin in the game.', example: "Left a $120k/year senior role to build this venture with zero salary for the first 12 months." },
    ]
  },
  {
    id: 'p2',
    title: 'Customer Discovery',
    subtitle: 'Evidence of market interaction and validated insights.',
    weight: '13%',
    coreQs: [
      { id: 'interview_count', label: 'Discovery Interviews', type: 'number', placeholder: 'Total # of stakeholders interviewed.', description: 'Quantitative evidence of market feedback.', example: "Conducted 62 deep-dive interviews with purchasing officers across the textile industry." },
      { id: 'stakeholder_types', label: 'Stakeholder Variety', type: 'text', placeholder: 'Who did you talk to? (Users, buyers, partners).', description: 'Breadth of perspectives captured.', example: "End-users (operators), purchasers (CFOs), and channel partners (distributors)." },
      { id: 'key_insight', label: 'The Big "Aha!"', type: 'text', placeholder: 'One non-obvious thing you learned.', description: 'Validated non-obvious truth about the market.', example: "Customers don't care about the price being 10% lower; they care about the delivery window being guaranteed under 24 hours." },
    ],
    deepDiveQs: [
      { id: 'pivoted', label: 'Pivot History', type: 'text', placeholder: 'What did you change based on feedback?', description: 'Evidence that you are listening to the market.', example: "Moved from an 'Uber for Logistics' model to a 'B2B SaaS Inventory' model after 15 interviews suggested high fragmentation." },
      { id: 'evidence', label: 'Data Quality', type: 'text', placeholder: 'Synthesized evidence vs. anecdotal bias.', description: 'How do you verify the feedback?', example: "Used a structured scoring rubric for all interviews to eliminate confirmation bias; 80% of interviewed CFOs confirmed the pain point." },
      { id: 'pilot_users', label: 'Pilot/LOI Users', type: 'text', placeholder: 'Commitment from early users.', description: 'First signs of true market pull.', example: "6 companies have signed non-binding LOIs to pilot the software for $500/month starting in Q3." },
      { id: 'objections', label: 'Known Objections', type: 'text', placeholder: 'Counter-evidence you are investigating.', description: 'Healthy self-awareness of risks.', example: "CFOs are worried about the IT integration heavy-lift; we are currently building a 'Zero-IT' CSV upload feature to address this." },
    ]
  },
  {
    id: 'p3',
    title: 'Product & TRL',
    subtitle: 'Technical durability and readiness level of the solution.',
    weight: '14%',
    coreQs: [
      { id: 'trl', label: 'TRL Level', type: 'select', options: ['1 - Basic Research', '2 - Concept Formulated', '3 - Experimental Proof', '4 - Lab Validation', '5 - Relevant Environment', '6 - Subsystem Demo', '7 - System Prototype', '8 - Production Ready', '9 - Mission Proven'], description: 'NASA Technology Readiness Level scale.', example: "TRL 4 - Lab Validation." },
      { id: 'built', label: 'Solution Architecture', type: 'text', placeholder: 'Current status of the build.', description: 'Detailed technical status.', example: "Fully functional web application on React/Node with integrated Supabase DB; handling concurrent users in staging." },
      { id: 'product_type', label: 'Product Type', type: 'select', options: ['SaaS', 'Hardware', 'Marketplace', 'DeepTech/R&D', 'Service-Tech', 'Other'], description: 'Category of the solution.', example: "SaaS." },
    ],
    deepDiveQs: [
      { id: 'external_testing', label: 'Third-Party Validation', type: 'text', placeholder: 'Testing by someone outside the team.', description: 'Objective proof of performance.', example: "Beta tests with 5 external companies led to 3 bug fixes and 1 UI redesign." },
      { id: 'tech_risk', label: 'Critical Tech Risk', type: 'text', placeholder: 'What could break the product?', description: 'Biggest technical bottleneck.', example: "Scaling the matching algorithm from 100 to 10,000 requests per minute without latency." },
      { id: 'trl_gap', label: 'Next Mile Gap', type: 'text', placeholder: 'What is needed to reach next TRL?', description: 'Requirement for progression.', example: "Need to deploy into a factory environment for 30 continuous days to move to TRL 6." },
      { id: 'ip', label: 'IP / Proprietary Tech', type: 'text', placeholder: 'Algorithms, patents, or trade secrets.', description: 'Core technical moats.', example: "Proprietary image recognition algorithm optimized for low-bandwidth mobile devices." },
    ]
  },
  {
    id: 'p4',
    title: 'Differentiation',
    subtitle: 'How you win against incumbents and alternatives.',
    weight: '7%',
    coreQs: [
      { id: 'differentiation', label: 'Unique Edge', type: 'text', placeholder: 'Why will customers pick you?', description: 'Your core Value Proposition.', example: "Only solution that provides data in 5 minutes vs. the industry standard of 24 hours." },
      { id: 'competitors', label: 'Alternative Logic', type: 'text', placeholder: 'What do they use today (including Excel)?', description: 'What is the current non-consumption or incumbent solution?', example: "Manual Excel sheets managed by 3 full-time data entry clerks." },
      { id: 'without_us', label: 'Status Quo Cost', type: 'text', placeholder: 'Cost of doing nothing.', description: 'The pain of sticking with current methods.', example: "$2,000/month in labor costs plus 5% error rate in data entry." },
    ],
    deepDiveQs: [
      { id: 'customer_preference', label: 'Preference Evidence', type: 'text', placeholder: 'Why do users say they like you better?', description: 'Concrete feedback on superiority.', example: "User testing score of 4.8/5 compared to the rival's 3.2/5 based on 'clean UI' and 'speed'." },
      { id: 'hard_to_copy', label: 'Barriers to Entry', type: 'text', placeholder: 'Why can’t a giant copy you tomorrow?', description: 'Strategic moats.', example: "Exclusive data access agreement with 3 leading logistics hubs in the region." },
      { id: 'ab_testing', label: 'Testing Results', type: 'text', placeholder: 'Comparison data against alternatives.', description: 'Quantitative performance proof.', example: "A/B test showed 15% higher conversation rate using our checkout flow versus the standard Shopify plugin." },
    ]
  },
  {
    id: 'p5',
    title: 'Market & ICP',
    subtitle: 'Targeting, urgency, and scale potential.',
    weight: '12%',
    coreQs: [
      { id: 'icp', label: 'Ideal Customer Profile', type: 'text', placeholder: 'Who is the "Desperate Customer"?', description: 'Define your narrow, early-adopter segment.', example: "Operations Managers at mid-sized 3PL firms (20-100 trucks) in Tier 1 cities." },
      { id: 'market_size', label: 'TAM/SAM/SOM', type: 'text', placeholder: 'Addressable revenue potential.', description: 'Scale of the opportunity.', example: "TAM: $5B Global, SAM: $500M SE Asia, SOM: $15M Year 1." },
      { id: 'urgency', label: 'Buying Urgency', type: 'text', placeholder: 'Why buy now? (Fine, Fee, or Fear).', description: 'The trigger for immediate adoption.', example: "New environmental regulations (Fee) coming into effect next year require precise carbon tracking." },
    ],
    deepDiveQs: [
      { id: 'gtm', label: 'Go-To-Market Strategy', type: 'text', placeholder: 'Channel strategy for first 100 users.', description: 'How do you acquire users profitably?', example: "Direct LinkedIn outreach to Ops Managers + partnerships with 2 industry associations." },
      { id: 'unfair_access', label: 'Distribution Moat', type: 'text', placeholder: 'Partnerships or hidden network access.', description: 'Non-replicable growth hacks.', example: "Lead founder sits on the national board of the Manufacturing Council, giving us direct access to 400 CEOs." },
    ]
  },
  {
    id: 'p6',
    title: 'Business Model',
    subtitle: 'Revenue engine and unit economic potential.',
    weight: '11%',
    coreQs: [
      { id: 'revenue_model', label: 'Revenue Stream', type: 'text', placeholder: 'How exactly do you make money?', description: 'Your monetization strategy.', example: "Monthly SaaS subscription ($250/seat) + 2% transaction fee on marketplace sales." },
      { id: 'revenue_stage', label: 'Revenue Status', type: 'select', options: ['Pre-Revenue', 'Initial Pilots (Free)', 'Paid Pilots', 'Early Revenue', 'Recurring Revenue', 'Scaling Revenue'], description: 'Current financial traction.', example: "Early Revenue." },
      { id: 'bmc_status', label: 'BMC Maturity', type: 'text', placeholder: 'Status of the 9 blocks.', description: 'Business Model Canvas coverage.', example: "7/9 blocks validated; still testing the best 'Customer Relationship' automation strategy." },
    ],
    deepDiveQs: [
      { id: 'pricing_tested', label: 'Pricing Validation', type: 'text', placeholder: 'Willingness to pay evidence.', description: 'Proof that the price point is viable.', example: "Pricing survey of 50 users showed 70% would pay $50-100/month; 10% already paid $200 for early access." },
      { id: 'model_type', label: 'Scalability Logic', type: 'text', placeholder: 'Fixed vs Variable cost structure.', description: 'Capital efficiency of growth.', example: "Cloud-native infrastructure means our cost to serve an extra 1000 users is less than $100." },
      { id: 'unit_economics', label: 'LTV/CAC Logic', type: 'text', placeholder: 'Early math on profitability per user.', description: 'Sustainability of growth.', example: "Target LTV of $4k with a CAC of $800; currently CAC is high ($2k) but falling as we shift to content-led growth." },
    ]
  },
  {
    id: 'p7',
    title: 'Traction & CRL',
    subtitle: 'Active user proof and feedback loops.',
    weight: '12%',
    coreQs: [
      { id: 'crl', label: 'CRL Level', type: 'select', options: ['1 - Ignorant', '2 - Identified', '3 - Validated', '4 - Qualified', '5 - Committed', '6 - Commercialized', '7 - Scalable', '8 - Proven', '9 - High Growth'], description: 'Commercial Readiness Level (1-9).', example: "CRL 3 - Validated." },
      { id: 'active_users', label: 'Active User Count', type: 'number', placeholder: 'DAU/MAU or active accounts.', description: 'Current user engagement.', example: "12 Weekly Active Users (WAU) from 5 separate paying accounts." },
      { id: 'retention', label: 'Retention Evidence', type: 'text', placeholder: 'Do they come back?', description: 'Sticky factor of the product.', example: "Zero churn in the first 90 days; 4/5 pilots converted to paid annual contracts." },
    ],
    deepDiveQs: [
      { id: 'growth', label: 'Growth Velocity', type: 'text', placeholder: 'Week-over-week or Month-over-month %.', description: 'Rate of expansion.', example: "20% WoW growth in registered users over the last 8 weeks." },
      { id: 'referrals', label: 'K-Factor', type: 'text', placeholder: 'Evidence of viral or referral growth.', description: 'Organic growth mechanisms.', example: "25% of new signups come from the 'Invite a Colleague' button inside the dashboard." },
      { id: 'churn', label: 'Churn Rate', type: 'text', placeholder: 'Why do users leave?', description: 'Analysis of loss.', example: "Exited 2 users who were 'Too Small' for the feature set; focusing more on Enterprise now." },
    ]
  },
  {
    id: 'p8',
    title: 'Team Readiness',
    subtitle: 'Founder mix, skills, and execution track record.',
    weight: '12%',
    coreQs: [
      { id: 'team_members', label: 'Core Team', type: 'team', description: 'List of core members and their primary roles.', example: "CEO (Strategy), CTO (Ex-IBM), Head of Sales (15 yrs exp)." },
      { id: 'missing_skills', label: 'Gaps in Table', type: 'text', placeholder: 'What hire is needed next?', description: 'Vulnerabilities in the human capital stack.', example: "Need a dedicated UI/UX designer and a full-time Customer Success manager." },
      { id: 'commitment', label: 'Founder Equity/Time', type: 'text', placeholder: 'Full-time vs Side-project status.', description: 'Financial and time alignment.', example: "Equal equity split (33% each); all 3 on vesting schedules; full focus." },
    ],
    deepDiveQs: [
      { id: 'advisors', label: 'Advisory Board', type: 'text', placeholder: 'External veterans supporting the team.', description: 'Knowledge leverage.', example: "Advised by Prof. X from Oxford (Chemistry) and Jane Doe (Former VP Sales at Salesforce)." },
      { id: 'prior_work', label: 'Execution Evidence', type: 'text', placeholder: 'Past startups or domain expertise.', description: 'Proven track record of the team.', example: "Product head previously built and sold a travel-tech app for $1.2M in 2018." },
      { id: 'internal_challenge', label: 'Team Cohesion', type: 'text', placeholder: 'How long have you worked together?', description: 'Durability under pressure.', example: "Cofounders were roommates at Uni and worked together at previous employer for 4 years." },
    ]
  },
  {
    id: 'p9',
    title: 'Advantage & Moats',
    subtitle: 'High-level defensibility and long-term winner logic.',
    weight: '3% + Bonus',
    coreQs: [
      { id: 'competitor_awareness', label: 'Incumbent Audit', type: 'text', placeholder: 'What will Google/Meta do if they see you?', description: 'Threat landscape analysis.', example: "Google would see us as sub-scale but might acquire for the specific Southeast Asian logistics data." },
      { id: 'hard_to_copy_core', label: 'Technological Moat', type: 'text', placeholder: 'What is non-trivial to replicate?', description: 'Defensible IP/Assets.', example: "Proprietary database of 10k+ local warehouse maps that are not on Google Maps." },
    ],
    deepDiveQs: [
      { id: 'ip', label: 'Patents/Trade Secrets', type: 'text', placeholder: 'Legal or structural defensibility.', description: 'Formal protection.', example: "Design patent filed for the unique modular sensor casing." },
      { id: 'network_effects', label: 'Defensive Loops', type: 'text', placeholder: 'Data or user network effects.', description: 'Growth that creates scale moats.', example: "The more users upload data, the more accurate the benchmark becomes for everyone (Data Network Effect)." },
      { id: 'switching_costs', label: 'Lock-in Logic', type: 'text', placeholder: 'Why is it painful to leave?', description: 'Retention moats.', example: "Exporting data to another platform takes 2 weeks of manual cleaning due to our proprietary format." },
    ]
  }
] as const
