import React from 'react'
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet
} from '@react-pdf/renderer'
import type { TeamProfile } from '@/types/team.types'
import { calculateOverallScore, classifyStage, getRoadmap } from '@/utils/scores'

// Clean, Minimalist Custom Design
const s = StyleSheet.create({
  page: { 
    padding: 50, 
    fontFamily: 'Helvetica', 
    color: '#1e293b', 
    backgroundColor: '#ffffff' 
  },
  
  // Page 1 Header
  headerContainer: {
    marginBottom: 40
  },
  kicker: {
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#64748b',
    marginBottom: 8
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'normal',
    color: '#0f172a',
    marginBottom: 16
  },
  divider: {
    height: 4,
    backgroundColor: '#0f172a',
    width: '100%',
    marginBottom: 40
  },

  // Main Cards Row
  topCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  stageCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    padding: 30,
    marginRight: 20,
    border: 1,
    borderColor: '#e2e8f0',
  },
  stageCardLabel: {
    fontSize: 9,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10
  },
  stageCardTitle: {
    fontSize: 22,
    color: '#0f172a',
    marginBottom: 6
  },
  stageCardSub: {
    fontSize: 10,
    color: '#64748b'
  },
  
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scoreValueWrapper: {
    alignItems: 'center'
  },
  scoreNumber: {
    fontSize: 36,
    color: '#ffffff',
    marginBottom: 4
  },
  scoreLabel: {
    fontSize: 8,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1
  },

  // Info Cards Row
  infoCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    border: 1,
    borderColor: '#eee',
  },
  infoCardMargin: {
    marginRight: 10
  },
  infoLabel: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6
  },
  infoValue: {
    fontSize: 12,
    color: '#0f172a',
  },

  // Core Overview Row
  sectionTitle: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#475569',
    marginBottom: 20
  },
  coreOverviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coreCard: {
    flex: 1,
    border: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 20,
    marginRight: 10
  },
  coreCardLast: {
    marginRight: 0
  },
  coreParamId: {
    fontSize: 9,
    color: '#94a3b8',
    marginBottom: 10
  },
  coreScore: {
    fontSize: 18,
    color: '#0f172a',
    marginBottom: 8
  },
  coreName: {
    fontSize: 8,
    color: '#64748b',
  },

  // Page 2: Observations
  obsTitle: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#475569',
    marginBottom: 30,
    marginTop: 20
  },
  obsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  obsCard: {
    width: '48%',
    border: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15
  },
  obsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  obsCardTitle: {
    fontSize: 10,
    color: '#0f172a'
  },
  obsCardScore: {
    fontSize: 10,
    color: '#64748b'
  },
  obsCardText: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5
  },

  // Page 3: Roadmap
  roadmapPageTitle: {
    fontSize: 18,
    color: '#0f172a',
    marginBottom: 20,
    marginTop: 20
  },
  roadmapSubtitle: {
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#64748b',
    marginBottom: 30
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    border: 1,
    borderColor: '#e2e8f0',
    padding: 15
  },
  tableCol1: { width: '15%' },
  tableCol2: { width: '55%' },
  tableCol3: { width: '30%' },
  tableHeaderText: {
    fontSize: 8,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  tableRow: {
    flexDirection: 'row',
    borderLeft: 1,
    borderRight: 1,
    borderBottom: 1,
    borderColor: '#e2e8f0',
    padding: 15
  },
  tableRowText: {
    fontSize: 9,
    color: '#0f172a'
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 15
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8'
  },
  tableRowAnswers: {
    flexDirection: 'row',
    borderLeft: 1,
    borderRight: 1,
    borderBottom: 1,
    borderColor: '#e2e8f0',
    padding: 10,
    minHeight: 40,
    alignItems: 'center'
  },
  ansCol1: { width: '30%' },
  ansCol2: { width: '70%', paddingLeft: 10 },
  ansLabel: {
    fontSize: 7,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: 'bold'
  },
  ansText: {
    fontSize: 8,
    color: '#0f172a',
    lineHeight: 1.4
  },
  sectionHeaderRow: {
    backgroundColor: '#f1f5f9',
    padding: 8,
    border: 1,
    borderColor: '#e2e8f0',
    marginTop: 15
  },
  sectionHeaderText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 1
  }
})

import { PARAMETERS_CONFIG } from '@/config/parameters'

export default function DiagnosisPDF({ team }: { team: TeamProfile }) {
  const { overall, averages } = calculateOverallScore(team)
  const { stage, level } = classifyStage(team)
  const roadmap = getRoadmap(team)

  const parameters = [
    { id: 'P1', name: 'Founder & Problem', score: averages.p1 },
    { id: 'P2', name: 'Customer Discovery', score: averages.p2 },
    { id: 'P3', name: 'Product & TRL', score: averages.p3 },
    { id: 'P4', name: 'Differentiation', score: averages.p4 },
    { id: 'P5', name: 'Market & ICP', score: averages.p5 },
    { id: 'P6', name: 'Business Model', score: averages.p6 },
    { id: 'P7', name: 'Traction & CRL', score: averages.p7 },
    { id: 'P8', name: 'Team Readiness', score: averages.p8 },
    { id: 'P9', name: 'Advantage & Moats', score: averages.p9 }
  ]

  const observations = [
    team.p1_observation || 'No specific observations recorded.',
    team.p2_observation || 'No specific observations recorded.',
    team.p3_observation || 'No specific observations recorded.',
    team.p4_observation || 'No specific observations recorded.',
    team.p5_observation || 'No specific observations recorded.',
    team.p6_observation || 'No specific observations recorded.',
    team.p7_observation || 'No specific observations recorded.',
    team.p8_observation || 'No specific observations recorded.',
    team.p9_observation || 'No specific observations recorded.'
  ]

  const currentYear = new Date().getFullYear()

  return (
    <Document title={`${team.startupName || 'Startup'}-Diagnosis-Report`}>
      <Page size="A4" style={s.page}>
        {/* Page 1 */}
        <View style={s.headerContainer}>
          <Text style={s.kicker}>INUNITY STARTUP DIAGNOSIS</Text>
          <Text style={s.pageTitle}>Startup Profile</Text>
          <View style={s.divider} />
        </View>

        <View style={s.topCardsRow}>
          <View style={s.stageCard}>
            <Text style={s.stageCardLabel}>DIAGNOSIS STAGE</Text>
            <Text style={s.stageCardTitle}>{stage}</Text>
            <Text style={s.stageCardSub}>Classification: LEVEL {level} STRATEGY</Text>
          </View>
          <View style={s.scoreCircle}>
            <View style={s.scoreValueWrapper}>
              <Text style={s.scoreNumber}>{(overall || 0).toFixed(1)}</Text>
              <Text style={s.scoreLabel}>WEIGHTED AVG</Text>
            </View>
          </View>
        </View>

        <View style={s.infoCardsRow}>
          <View style={[s.infoCard, s.infoCardMargin]}>
            <Text style={s.infoLabel}>PRIMARY SECTOR</Text>
            <Text style={s.infoValue}>{team.sector || 'N/A'}</Text>
          </View>
          <View style={[s.infoCard, s.infoCardMargin]}>
            <Text style={s.infoLabel}>INSTITUTION</Text>
            <Text style={s.infoValue}>{team.institution || 'N/A'}</Text>
          </View>
          <View style={s.infoCard}>
            <Text style={s.infoLabel}>TEAM SIZE</Text>
            <Text style={s.infoValue}>{team.teamSize || 'N/A'}</Text>
          </View>
        </View>

        <Text style={s.sectionTitle}>CORE OVERVIEW (P1-P4)</Text>
        <View style={s.coreOverviewRow}>
          {parameters.slice(0, 4).map((p, i) => (
            <View key={p.id} style={[s.coreCard, i === 3 ? s.coreCardLast : {}]}>
              <Text style={s.coreParamId}>{p.id}</Text>
              <Text style={s.coreScore}>{(p.score || 0).toFixed(1)}</Text>
              <Text style={s.coreName}>{p.name}</Text>
            </View>
          ))}
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>{currentYear} InUnity Diagnosis Profiler</Text>
          <Text style={s.footerText}>Highly Confidential • Diagnostic Intelligence</Text>
        </View>
      </Page>

      {/* Page 2 */}
      <Page size="A4" style={s.page}>
        <Text style={s.obsTitle}>PARAMETER DEEP-DIVE & OBSERVATIONS</Text>
        <View style={s.obsGrid}>
          {parameters.map((p, i) => (
            <View key={p.id} style={s.obsCard}>
              <View style={s.obsCardHeader}>
                <Text style={s.obsCardTitle}>{p.id}: {p.name}</Text>
                <Text style={s.obsCardScore}>{(p.score || 0).toFixed(1)}</Text>
              </View>
              <Text style={s.obsCardText}>{observations[i]}</Text>
            </View>
          ))}
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>{currentYear} InUnity Diagnosis Profiler</Text>
          <Text style={s.footerText}>Highly Confidential • Diagnostic Intelligence</Text>
        </View>
      </Page>

      {/* Page 3 */}
      <Page size="A4" style={s.page}>
        <Text style={s.roadmapPageTitle}>4-Week Strategic Growth Sprint</Text>
        <Text style={s.roadmapSubtitle}>BASED ON STAGE {level} - {stage}</Text>

        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderText, s.tableCol1]}>PRIORITY</Text>
          <Text style={[s.tableHeaderText, s.tableCol2]}>STRATEGIC ACTION</Text>
          <Text style={[s.tableHeaderText, s.tableCol3]}>SUPPORT / BY</Text>
        </View>
        
        {roadmap.map((r, i) => {
          let support = 'Incubation Team'
          if (r.priority.includes('P0') || r.priority.includes('High') || r.priority.includes('Critical')) support = 'Lead Mentor'
          if (r.priority.includes('P1')) support = 'Discovery Coach'
          if (r.priority.includes('P2')) support = 'Peer Network'

          return (
            <View key={i} style={s.tableRow}>
              <Text style={[s.tableRowText, s.tableCol1]}>{r.priority.split(' ')[0]}</Text>
              <Text style={[s.tableRowText, s.tableCol2]}>{r.action}</Text>
              <Text style={[s.tableRowText, s.tableCol3]}>{support}</Text>
            </View>
          )
        })}

        {roadmap.length === 0 && (
          <View style={s.tableRow}>
            <Text style={[s.tableRowText, s.tableCol1]}>-</Text>
            <Text style={[s.tableRowText, s.tableCol2]}>No strategic actions required at this phase.</Text>
            <Text style={[s.tableRowText, s.tableCol3]}>-</Text>
          </View>
        )}

        <View style={s.footer} fixed>
          <Text style={s.footerText}>{currentYear} InUnity Diagnosis Profiler</Text>
          <Text style={s.footerText}>Highly Confidential • Diagnostic Intelligence</Text>
        </View>
      </Page>

      {/* Page 4: Raw Submission Log */}
      <Page size="A4" style={s.page}>
        <Text style={s.obsTitle}>DETAILED SUBMISSION LOG (FOUNDER RESPONSES)</Text>
        
        {PARAMETERS_CONFIG.map((p) => (
          <View key={p.id} wrap={false}>
            <View style={s.sectionHeaderRow}>
              <Text style={s.sectionHeaderText}>{p.id}: {p.title}</Text>
            </View>
            {[...p.coreQs, ...p.deepDiveQs].map((q) => {
              const answer = (team as any)[`${p.id}_${q.id}`] || '-'
              return (
                <View key={q.id} style={s.tableRowAnswers}>
                  <View style={s.ansCol1}>
                    <Text style={s.ansLabel}>{q.label}</Text>
                  </View>
                  <View style={s.ansCol2}>
                    <Text style={s.ansText}>{answer}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        ))}

        <View style={s.footer} fixed>
          <Text style={s.footerText}>{currentYear} InUnity Diagnosis Profiler</Text>
          <Text style={s.footerText}>Highly Confidential • Diagnostic Intelligence</Text>
        </View>
      </Page>
    </Document>
  )
}
