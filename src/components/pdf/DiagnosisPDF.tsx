import React from 'react'
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet,
  Font
} from '@react-pdf/renderer'
import type { TeamProfile } from '@/types/team.types'
import { calculateOverallScore, classifyStage, getRoadmap, scoreColor } from '@/utils/scores'

// Using standard fonts for reliability, but with a highly structured grid design
const s = StyleSheet.create({
  page: { 
    padding: 40, 
    fontFamily: 'Helvetica', 
    color: '#0F172A', 
    backgroundColor: '#FFFFFF' 
  },
  
  // Premium Header
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'baseline',
    marginBottom: 30, 
    borderBottom: 2, 
    borderBottomColor: '#0F172A', 
    paddingBottom: 15 
  },
  brand: { fontSize: 8, color: '#64748B', letterSpacing: 3, fontWeight: 'bold' },
  reportId: { fontSize: 8, color: '#94A3B8', letterSpacing: 1 },
  
  // Hero Hero Section
  hero: { 
    backgroundColor: '#0F172A', 
    borderRadius: 24, 
    padding: 30, 
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#FFFFFF'
  },
  startupName: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  sector: { fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 },
  
  scoreBadge: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 15, 
    alignItems: 'center', 
    justifyContent: 'center',
    width: 80,
    height: 80
  },
  scoreValue: { fontSize: 28, color: '#0F172A', fontWeight: 'bold' },
  scoreLabel: { fontSize: 7, color: '#64748B', marginTop: 2, fontWeight: 'bold' },

  // Stage Matrix
  stageMatrix: { 
    flexDirection: 'row', 
    gap: 15, 
    marginBottom: 30 
  },
  stageCard: { 
    flex: 1, 
    backgroundColor: '#F8FAFC', 
    borderRadius: 16, 
    padding: 15, 
    border: 1, 
    borderColor: '#E2E8F0' 
  },
  cardLabel: { fontSize: 7, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  cardValue: { fontSize: 13, color: '#0F172A', fontWeight: 'bold' },
  
  // Analysis Grid
  sectionTitle: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, color: '#0F172A', marginBottom: 15, borderLeft: 3, borderLeftColor: '#F59E0B', paddingLeft: 8 },
  
  paramGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  paramBox: { 
    width: '31.5%', 
    backgroundColor: '#FFFFFF', 
    border: 1, 
    borderColor: '#F1F5F9', 
    borderRadius: 12, 
    padding: 12 
  },
  paramTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  paramId: { fontSize: 7, color: '#64748B', fontWeight: 'bold' },
  paramScore: { fontSize: 9, fontWeight: 'bold' },
  paramName: { fontSize: 9, color: '#1E293B', marginBottom: 4 },
  
  // Observations
  obsBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, borderLeft: 2, borderLeftColor: '#38BDF8', marginBottom: 15 },
  obsText: { fontSize: 8, color: '#475569', lineHeight: 1.5 },

  // Roadmap
  roadmapRow: { flexDirection: 'row', padding: 12, borderBottom: 1, borderBottomColor: '#F1F5F9', alignItems: 'center' },
  priority: { fontSize: 8, fontWeight: 'bold', color: '#F59E0B', width: '15%' },
  action: { fontSize: 9, color: '#1E293B', width: '60%', paddingRight: 10 },
  byWhen: { fontSize: 8, color: '#64748B', width: '25%', textAlign: 'right' },

  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, borderTop: 1, borderTopColor: '#F1F5F9', paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 7, color: '#94A3B8' }
})

export default function DiagnosisPDF({ team }: { team: TeamProfile }) {
  const { overall, averages } = calculateOverallScore(team)
  const { stage, level } = classifyStage(team)
  const roadmap = getRoadmap(team)

  const parameters = [
    { id: 'P1', name: 'Founder & Problem', score: averages.p1, obs: team.p1_observation },
    { id: 'P2', name: 'Customer Discovery', score: averages.p2, obs: team.p2_observation },
    { id: 'P3', name: 'Product & TRL', score: averages.p3, obs: team.p3_observation },
    { id: 'P4', name: 'Differentiation', score: averages.p4, obs: team.p4_observation },
    { id: 'P5', name: 'Market & ICP', score: averages.p5, obs: team.p5_observation },
    { id: 'P6', name: 'Business Model', score: averages.p6, obs: team.p6_observation },
    { id: 'P7', name: 'Traction & CRL', score: averages.p7, obs: team.p7_observation },
    { id: 'P8', name: 'Team Readiness', score: averages.p8, obs: team.p8_observation },
    { id: 'P9', name: 'Advantage & Moats', score: averages.p9, obs: team.p9_observation },
  ]

  return (
    <Document title={`${team.startupName || 'Startup'}-Diagnosis-Report`}>
      <Page size="A4" style={s.page} wrap>
        {/* Header */}
        <View style={s.header} fixed>
          <Text style={s.brand}>INUNITY STRATEGIC SYSTEMS</Text>
          <Text style={s.reportId}>REF: {team.id.slice(0, 8).toUpperCase()}</Text>
        </View>

        {/* PAGE 1: Overview */}
        <View style={s.hero}>
          <View>
            <Text style={s.startupName}>{team.startupName || 'Unnamed Venture'}</Text>
            <Text style={s.sector}>{team.sector || 'Uncategorized Sector'}</Text>
          </View>
          <View style={s.scoreBadge}>
            <Text style={s.scoreValue}>{(overall || 0).toFixed(1)}</Text>
            <Text style={s.scoreLabel}>SCORE</Text>
          </View>
        </View>

        <View style={s.stageMatrix}>
          <View style={s.stageCard}>
            <Text style={s.cardLabel}>Classification</Text>
            <Text style={s.cardValue}>{stage}</Text>
          </View>
          <View style={s.stageCard}>
            <Text style={s.cardLabel}>Strategic Level</Text>
            <Text style={s.cardValue}>LEVEL {level}</Text>
          </View>
          <View style={s.stageCard}>
            <Text style={s.cardLabel}>Submission</Text>
            <Text style={s.cardValue}>#0{team.submission_number || 1}</Text>
          </View>
        </View>

        {/* PAGE 2: Performance Breakdown */}
        <View break>
          <Text style={s.sectionTitle}>Performance Parameters</Text>
          <View style={s.paramGrid}>
            {parameters.map(p => (
              <View key={p.id} style={s.paramBox}>
                <View style={s.paramTop}>
                  <Text style={s.paramId}>{p.id}</Text>
                  <Text style={[s.paramScore, { color: scoreColor(p.score) }]}>{(p.score || 0).toFixed(1)}</Text>
                </View>
                <Text style={s.paramName}>{p.name}</Text>
              </View>
            ))}
          </View>

          <Text style={s.sectionTitle}>Evaluator Observations</Text>
          {parameters.filter(p => p.obs).slice(0, 5).map((p, idx) => (
            <View key={p.id} style={[s.obsBox, { marginBottom: idx === 4 ? 0 : 15 }]}>
              <Text style={[s.cardLabel, { marginBottom: 4 }]}>{p.name} (P{p.id.slice(1)})</Text>
              <Text style={s.obsText}>{p.obs}</Text>
            </View>
          ))}
        </View>

        {/* PAGE 3: Strategic Roadmap */}
        {roadmap.length > 0 && (
          <View break>
            <Text style={s.sectionTitle}>Strategic Roadmap (Next 30 Days)</Text>
            <View style={{ marginTop: 5 }}>
              {roadmap.map((r, i) => (
                <View key={i} style={s.roadmapRow}>
                  <Text style={s.priority}>{r.priority}</Text>
                  <Text style={s.action}>{r.action}</Text>
                  <Text style={s.byWhen}>{r.byWhen}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>© {new Date().getFullYear()} InUnity Strategic Systems • Platinum Tier Evaluation</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages} • Highly Confidential`} />
        </View>
      </Page>
    </Document>
  )
}
