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
    
    problemStatement:           row.problem_statement                ?? '',
    problemScore:               Number(row.problem_score)            || 0,
    solutionDescription:        row.solution_description             ?? '',
    solutionScore:              Number(row.solution_score)           || 0,
    productType:                row.product_type                     ?? '',
    productTypeOther:           row.product_type_other               ?? '',
    uniqueValue:                row.unique_value                     ?? '',
    uniqueValueScore:           Number(row.unique_value_score)       || 0,
    
    usersTested:                Number(row.users_tested)             || 0,
    testingDetails:             row.testing_details                  ?? '',
    stakeholdersInteracted:     Number(row.stakeholders_interacted)  || 0,
    stakeholderTypes:           row.stakeholder_types                ?? '',
    customerInterviewScore:     Number(row.customer_interview_score) || 0,
    customerInterviewDetails:   row.customer_interview_details       ?? '',
    competitorScore:            Number(row.competitor_score)         || 0,
    competitorDetails:          row.competitor_details               ?? '',
    marketSizeScore:            Number(row.market_size_score)        || 0,
    marketSizeDetails:          row.market_size_details              ?? '',
    
    revenueModelScore:          Number(row.revenue_model_score)      || 0,
    revenueModelDetails:        row.revenue_model_details            ?? '',
    bmcScore:                   Number(row.bmc_score)                || 0,
    bmcDetails:                 row.bmc_details                      ?? '',
    revenueStage:               row.revenue_stage                    ?? '',
    businessModelType:          row.business_model_type              ?? '',
    bmcDone:                    row.bmc_done                         ?? '',
    
    trl:                        row.trl?.toString()                  ?? '',
    brl:                        row.brl?.toString()                  ?? '',
    crl:                        row.crl?.toString()                  ?? '',
    
    pitchDeckScore:             Number(row.pitch_deck_score)         || 0,
    pitchDeckDetails:           row.pitch_deck_details               ?? '',
    elevatorScore:              Number(row.elevator_score)           || 0,
    elevatorDetails:            row.elevator_details                 ?? '',
    investorAskScore:           Number(row.investor_ask_score)       || 0,
    investorAskDetails:         row.investor_ask_details             ?? '',

    strengths:                  row.strengths                        ?? '',
    gaps:                       row.gaps                             ?? '',
    readinessSummary:           row.readiness_summary                ?? '',
    recommendations:            row.recommendations                  ?? '',
    modules:                    row.modules                          ?? '',
    p0:                         row.p0_need                          ?? '',
    p1:                         row.p1_need                          ?? '',
    p2:                         row.p2_need                          ?? '',
    barriers:                   row.barriers                         ?? '',
    mentor:                     row.mentor                           ?? '',
    nextCheckin:                row.next_checkin                     ?? '',
    notes:                      row.notes                            ?? '',
    roadmap:                    row.roadmap                          ?? [],
  }
}

export function mapFrontendToDb(team: Partial<TeamProfile>): any {
  const db: any = {}

  if (team.teamName                !== undefined) db.team_name                  = team.teamName
  if (team.startupName             !== undefined) db.startup_name               = team.startupName
  if (team.sector                  !== undefined) db.sector                     = team.sector
  if (team.institution             !== undefined) db.institution                = team.institution
  if (team.teamSize                !== undefined) db.team_size                  = team.teamSize
  if (team.roles                   !== undefined) db.roles                      = team.roles
  if (team.interviewDate           !== undefined) db.interview_date             = team.interviewDate || null
  if (team.interviewer             !== undefined) db.interviewer                = team.interviewer

  if (team.problemStatement        !== undefined) db.problem_statement          = team.problemStatement
  if (team.problemScore            !== undefined) db.problem_score              = team.problemScore
  if (team.solutionDescription     !== undefined) db.solution_description       = team.solutionDescription
  if (team.solutionScore           !== undefined) db.solution_score             = team.solutionScore
  if (team.productType             !== undefined) db.product_type               = team.productType
  if (team.productTypeOther        !== undefined) db.product_type_other         = team.productTypeOther
  if (team.uniqueValue             !== undefined) db.unique_value               = team.uniqueValue
  if (team.uniqueValueScore        !== undefined) db.unique_value_score         = team.uniqueValueScore

  if (team.usersTested             !== undefined) db.users_tested               = team.usersTested
  if (team.testingDetails          !== undefined) db.testing_details            = team.testingDetails
  if (team.stakeholdersInteracted  !== undefined) db.stakeholders_interacted    = team.stakeholdersInteracted
  if (team.stakeholderTypes        !== undefined) db.stakeholder_types          = team.stakeholderTypes
  if (team.customerInterviewScore  !== undefined) db.customer_interview_score    = team.customerInterviewScore
  if (team.customerInterviewDetails !== undefined) db.customer_interview_details = team.customerInterviewDetails
  if (team.competitorScore         !== undefined) db.competitor_score           = team.competitorScore
  if (team.marketSizeScore         !== undefined) db.market_size_score          = team.marketSizeScore
  if (team.marketSizeDetails       !== undefined) db.market_size_details        = team.marketSizeDetails

  if (team.revenueModelScore       !== undefined) db.revenue_model_score        = team.revenueModelScore
  if (team.revenueModelDetails     !== undefined) db.revenue_model_details      = team.revenueModelDetails
  if (team.bmcScore               !== undefined) db.bmc_score                  = team.bmcScore
  if (team.bmcDetails             !== undefined) db.bmc_details                = team.bmcDetails
  if (team.revenueStage           !== undefined) db.revenue_stage              = team.revenueStage
  if (team.businessModelType       !== undefined) db.business_model_type        = team.businessModelType
  if (team.bmcDone                 !== undefined) db.bmc_done                   = team.bmcDone

  if (team.trl                    !== undefined) db.trl                        = team.trl ? Number(team.trl) : null
  if (team.brl                    !== undefined) db.brl                        = team.brl ? Number(team.brl) : null
  if (team.crl                    !== undefined) db.crl                        = team.crl ? Number(team.crl) : null

  if (team.pitchDeckScore          !== undefined) db.pitch_deck_score           = team.pitchDeckScore
  if (team.pitchDeckDetails        !== undefined) db.pitch_deck_details         = team.pitchDeckDetails
  if (team.elevatorScore           !== undefined) db.elevator_score             = team.elevatorScore
  if (team.elevatorDetails         !== undefined) db.elevator_details           = team.elevatorDetails
  if (team.investorAskScore       !== undefined) db.investor_ask_score         = team.investorAskScore
  if (team.investorAskDetails     !== undefined) db.investor_ask_details       = team.investorAskDetails

  if (team.strengths              !== undefined) db.strengths                  = team.strengths
  if (team.gaps                   !== undefined) db.gaps                       = team.gaps
  if (team.readinessSummary       !== undefined) db.readiness_summary          = team.readinessSummary
  if (team.recommendations        !== undefined) db.recommendations            = team.recommendations
  if (team.modules                !== undefined) db.modules                    = team.modules
  if (team.p0                     !== undefined) db.p0_need                    = team.p0
  if (team.p1                     !== undefined) db.p1_need                    = team.p1
  if (team.p2                     !== undefined) db.p2_need                    = team.p2
  if (team.barriers               !== undefined) db.barriers                   = team.barriers
  if (team.mentor                 !== undefined) db.mentor                     = team.mentor
  if (team.nextCheckin           !== undefined) db.next_checkin               = team.nextCheckin || null
  if (team.notes                  !== undefined) db.notes                      = team.notes
  if (team.roadmap                !== undefined) db.roadmap                    = team.roadmap

  return db
}
