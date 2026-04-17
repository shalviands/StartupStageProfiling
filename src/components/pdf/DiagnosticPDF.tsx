import React from 'react'
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet
} from '@react-pdf/renderer'
import type { TeamProfile } from '@/types/team.types'
import { calculateOverallScore, classifyStage, getRoadmap, scoreColor } from '@/utils/scores'

// Helvetica standard weights mapping
const s = StyleSheet.create({
  page: { 
    padding: 50, 
    fontFamily: 'Helvetica', 
    color: '#0F172A', 
    backgroundColor: '#FFFFFF' 
  },
  
  header: { marginBottom: 40, borderBottom: 4, borderBottomColor: '#0F172A', paddingBottom: 20 },
  brand: { fontSize: 10, color: '#475569', letterSpacing: 2, marginBottom: 8 },
  title: { fontSize: 32, color: '#0F172A' },
  
  heroSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, alignItems: 'center' },
  stageBox: { backgroundColor: '#F8FAFC', padding: 25, borderRadius: 20, border: 1, borderColor: '#E2E8F0', width: '60%' },
  stageLabel: { fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  stageValue: { fontSize: 20, color: '#0F172A', marginBottom: 4 },
  stageTier: { fontSize: 10, color: '#64748B' },
  
  scoreCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  overallScore: { fontSize: 32, color: '#FFFFFF' },
  overallLabel: { fontSize: 8, color: '#94A3B8', marginTop: 2 },

  metaGrid: { flexDirection: 'row', gap: 20, marginBottom: 40 },
  metaItem: { flex: 1, backgroundColor: '#F8FAFC', padding: 15, borderRadius: 12 },
  metaLabel: { fontSize: 8, color: '#475569', textTransform: 'uppercase', marginBottom: 4 },
  metaValue: { fontSize: 11, color: '#1E293B' },

  paramGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  paramCard: { width: '48%', backgroundColor: '#FFFFFF', border: 1, borderColor: '#F1F5F9', padding: 15, borderRadius: 15, marginBottom: 10 },
  paramHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, borderBottom: 1, borderBottomColor: '#F8FAFC', paddingBottom: 5 },
  paramTitle: { fontSize: 10, color: '#0F172A' },
  paramScore: { fontSize: 10 },
  paramObs: { fontSize: 8, color: '#334155', lineHeight: 1.5 },

  roadmapTitle: { fontSize: 18, marginBottom: 20, color: '#0F172A' },
  roadmapTable: { border: 1, borderColor: '#E2E8F0', borderRadius: 12, overflow: 'hidden' },
  roadmapHead: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 12, borderBottom: 1, borderBottomColor: '#E2E8F0' },
  roadmapRow: { flexDirection: 'row', padding: 12, borderBottom: 0.5, borderBottomColor: '#F1F5F9' },
  roadmapCell: { fontSize: 9, color: '#1E293B' },
  
  warningBox: { backgroundColor: '#FFF7ED', border: 1, borderColor: '#FED7AA', padding: 15, borderRadius: 12, marginTop: 25 },
  warningText: { fontSize: 9, color: '#9A3412', lineHeight: 1.4 },

  footer: { position: 'absolute', bottom: 40, left: 50, right: 50, borderTop: 1, borderTopColor: '#F1F5F9', paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: '#64748B' }
})

export default function DiagnosticPDF({ team }: { team: TeamProfile }) {
  const { overall, p1, p2, p3, p4, p5, p6, p7, p8, p9 } = calculateOverallScore(team)
  const { stage, level, override } = classifyStage(team)
  const roadmap = getRoadmap(team)

  const params = [
    { id: 'P1', name: 'Founder & Problem', score: p1, obs: team.p1_observation },
    { id: 'P2', name: 'Customer Discovery', score: p2, obs: team.p2_observation },
    { id: 'P3', name: 'Product & TRL', score: p3, obs: team.p3_observation },
    { id: 'P4', name: 'Differentiation', score: p4, obs: team.p4_observation },
    { id: 'P5', name: 'Market & ICP', score: p5, obs: team.p5_observation },
    { id: 'P6', name: 'Business Model', score: p6, obs: team.p6_observation },
    { id: 'P7', name: 'Traction & CRL', score: p7, obs: team.p7_observation },
    { id: 'P8', name: 'Team Readiness', score: p8, obs: team.p8_observation },
    { id: 'P9', name: 'Advantage & Moats', score: p9, obs: team.p9_observation },
  ]

  return (
    <Document title={`${team.startupName || 'Startup'}-Profiler-Report`}>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.brand}>INUNITY STARTUP STAGE PROFILER • v0.04</Text>
          <Text style={s.title}>{team.startupName || 'Startup Strategic Profile'}</Text>
        </View>

        <View style={s.heroSection}>
          <View style={s.stageBox}>
            <Text style={s.stageLabel}>Profiler Stage</Text>
            <Text style={s.stageValue}>{stage}</Text>
            <Text style={s.stageTier}>Classification: LEVEL {level} STRATEGY</Text>
          </View>
          <View style={s.scoreCircle}>
            <Text style={s.overallScore}>{overall.toFixed(1)}</Text>
            <Text style={s.overallLabel}>WEIGHTED AVG</Text>
          </View>
        </View>

        <View style={s.metaGrid}>
          <View style={s.metaItem}><Text style={s.metaLabel}>Primary Sector</Text><Text style={s.metaValue}>{team.sector || 'N/A'}</Text></View>
          <View style={s.metaItem}><Text style={s.metaLabel}>Institution</Text><Text style={s.metaValue}>{team.institution || 'N/A'}</Text></View>
          <View style={s.metaItem}><Text style={s.metaLabel}>Team Size</Text><Text style={s.metaValue}>{team.teamSize || 'N/A'}</Text></View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={[s.stageLabel, { marginBottom: 15 }]}>Core Overview (P1-P4)</Text>
          <View style={s.paramGrid}>
            {params.slice(0, 4).map(p => (
              <View key={p.id} style={[s.paramCard, { width: '23%' }]}>
                <Text style={s.metaLabel}>{p.id}</Text>
                <Text style={{ fontSize: 18, color: '#0F172A' }}>{p.score.toFixed(1)}</Text>
                <Text style={{ fontSize: 7, color: '#64748B', marginTop: 4 }}>{p.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>© {new Date().getFullYear()} InUnity Strategic Systems • v0.04 Platinum</Text>
          <Text style={s.footerText}>Highly Confidential • Performance Analytics</Text>
        </View>
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={[s.stageLabel, { marginBottom: 25 }]}>Parameter Deep-Dive & Observations</Text>
        <View style={s.paramGrid}>
          {params.map(p => (
            <View key={p.id} style={s.paramCard}>
              <View style={s.paramHeader}>
                <Text style={s.paramTitle}>{p.id}: {p.name}</Text>
                <Text style={{ fontSize: 10, color: scoreColor(p.score) }}>{p.score.toFixed(1)}</Text>
              </View>
              <Text style={s.paramObs}>{p.obs || 'No specific observations recorded.'}</Text>
            </View>
          ))}
        </View>
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.roadmapTitle}>4-Week Strategic Growth Sprint</Text>
        <Text style={[s.stageLabel, { marginBottom: 20 }]}>Based on Stage {level} - {stage}</Text>

        <View style={s.roadmapTable}>
          <View style={s.roadmapHead}>
            <Text style={[s.roadmapCell, { width: '15%' }]}>PRIORITY</Text>
            <Text style={[s.roadmapCell, { width: '55%' }]}>STRATEGIC ACTION</Text>
            <Text style={[s.roadmapCell, { width: '30%' }]}>SUPPORT / BY</Text>
          </View>
          {roadmap.map((r, i) => (
            <View key={i} style={s.roadmapRow}>
              <Text style={[s.roadmapCell, { width: '15%' }]}>{r.priority}</Text>
              <Text style={[s.roadmapCell, { width: '55%' }]}>{r.action}</Text>
              <Text style={[s.roadmapCell, { width: '30%' }]}>{r.supportFrom}</Text>
            </View>
          ))}
        </View>

        {override && (
          <View style={s.warningBox}>
             <Text style={[s.stageLabel, { color: '#9A3412', marginBottom: 5 }]}>Growth Bottleneck Identified</Text>
             <Text style={s.warningText}>Capped at Stage {level} due to gaps in {override}. Address this parameter immediately to unlock further progress.</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
