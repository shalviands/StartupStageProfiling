import React from 'react'
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Font,
  Image
} from '@react-pdf/renderer'
import type { TeamProfile } from '@/types/team.types'
import { calculateOverallScore, classifyStage, getRoadmap, scoreColor } from '@/utils/scores'

const s = StyleSheet.create({
  page: { padding: 50, fontFamily: 'Helvetica', color: '#0F172A', backgroundColor: '#FFFFFF' },
  
  // PAGE 1: EXECUTIVE SUMMARY
  header: { marginBottom: 40, borderBottom: 4, borderBottomColor: '#0F172A', paddingBottom: 20 },
  brand: { fontSize: 10, fontWeight: 'black', color: '#64748B', letterSpacing: 2, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#0F172A' },
  
  heroSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, alignItems: 'center' },
  stageBox: { backgroundColor: '#F8FAFC', padding: 25, borderRadius: 20, border: 1, borderColor: '#E2E8F0', width: '60%' },
  stageLabel: { fontSize: 9, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  stageValue: { fontSize: 20, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  stageTier: { fontSize: 10, color: '#94A3B8', fontWeight: 'bold' },
  
  scoreCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  overallScore: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' },
  overallLabel: { fontSize: 8, color: '#94A3B8', marginTop: 2 },

  metaGrid: { flexDirection: 'row', gap: 20, marginBottom: 40 },
  metaItem: { flex: 1, backgroundColor: '#F8FAFC', padding: 15, borderRadius: 12 },
  metaLabel: { fontSize: 8, color: '#64748B', textTransform: 'uppercase', marginBottom: 4, fontWeight: 'bold' },
  metaValue: { fontSize: 11, fontWeight: 'bold', color: '#334155' },

  // PAGE 2: PARAMETER INSIGHTS
  paramGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  paramCard: { width: '48%', backgroundColor: '#FFFFFF', border: 1, borderColor: '#F1F5F9', padding: 15, borderRadius: 15, marginBottom: 10 },
  paramHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, borderBottom: 1, borderBottomColor: '#F8FAFC', paddingBottom: 5 },
  paramTitle: { fontSize: 10, fontWeight: 'bold', color: '#0F172A' },
  paramScore: { fontSize: 10, fontWeight: 'bold' },
  paramObs: { fontSize: 8, color: '#475569', lineHeight: 1.5 },

  // PAGE 3: STRATEGIC ROADMAP
  roadmapTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#0F172A' },
  roadmapTable: { border: 1, borderColor: '#E2E8F0', borderRadius: 12, overflow: 'hidden' },
  roadmapHead: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 12, borderBottom: 1, borderBottomColor: '#E2E8F0' },
  roadmapRow: { flexDirection: 'row', padding: 12, borderBottom: 0.5, borderBottomColor: '#F1F5F9' },
  roadmapCell: { fontSize: 9, color: '#334155' },
  
  warningBox: { backgroundColor: '#FFF7ED', border: 1, borderColor: '#FED7AA', padding: 15, borderRadius: 12, marginTop: 25 },
  warningText: { fontSize: 9, color: '#9A3412', lineHeight: 1.4 },

  footer: { position: 'absolute', bottom: 40, left: 50, right: 50, borderTop: 1, borderTopColor: '#F1F5F9', paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: '#94A3B8' }
})

export default function DiagnosticPDF({ team }: { team: TeamProfile }) {
  const { overall, p1, p2, p3, p4, p5, p6, p7, p8, p9, isBonusActive } = calculateOverallScore(team)
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
    <Document title={`${team.startupName || 'Startup'}-Diagnosis-Report`}>
      {/* PAGE 1: EXECUTIVE SUMMARY */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.brand}>INUNITY STARTUP DIAGNOSIS</Text>
          <Text style={s.title}>{team.startupName || 'Startup Profile'}</Text>
        </View>

        <View style={s.heroSection}>
          <View style={s.stageBox}>
            <Text style={s.stageLabel}>Diagnosis Stage</Text>
            <Text style={s.stageValue}>{stage}</Text>
            <Text style={s.stageTier}>Classification: LEVEL {level} STRATEGY</Text>
          </View>
          <View style={s.scoreCircle}>
            <Text style={s.overallScore}>{overall.toFixed(1)}</Text>
            <Text style={s.overallLabel}>WEIGHTED AVG</Text>
          </View>
        </View>

        <View style={s.metaGrid}>
          <View style={s.metaItem}>
            <Text style={s.metaLabel}>Primary Sector</Text>
            <Text style={s.metaValue}>{team.sector || 'N/A'}</Text>
          </View>
          <View style={s.metaItem}>
            <Text style={s.metaLabel}>Institution</Text>
            <Text style={s.metaValue}>{team.institution || 'N/A'}</Text>
          </View>
          <View style={s.metaItem}>
            <Text style={s.metaLabel}>Team Size</Text>
            <Text style={s.metaValue}>{team.teamSize || 'N/A'}</Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={[s.stageLabel, { marginBottom: 15 }]}>Core Diagnostics Overview</Text>
          <View style={s.paramGrid}>
            {params.slice(0, 4).map(p => (
              <View key={p.id} style={[s.paramCard, { width: '23%' }]}>
                <Text style={s.metaLabel}>{p.id}</Text>
                <Text style={[s.overallScore, { color: '#0F172A', fontSize: 18 }]}>{p.score.toFixed(1)}</Text>
                <Text style={{ fontSize: 7, color: '#94A3B8', marginTop: 4 }}>{p.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>© {new Date().getFullYear()} InUnity Private Limited</Text>
          <Text style={s.footerText}>Highly Confidential • Diagnostic Intelligence</Text>
        </View>
      </Page>

      {/* PAGE 2: PARAMETER INSIGHTS */}
      <Page size="A4" style={s.page}>
        <Text style={[s.stageLabel, { marginBottom: 25 }]}>Parameter Deep-Dive & Observations</Text>
        
        <View style={s.paramGrid}>
          {params.map(p => (
            <View key={p.id} style={s.paramCard}>
              <View style={s.paramHeader}>
                <Text style={s.paramTitle}>{p.id}: {p.name}</Text>
                <Text style={[s.paramScore, { color: scoreColor(p.score) }]}>{p.score.toFixed(1)}</Text>
              </View>
              <Text style={s.paramObs}>{p.obs || 'No specific observations recorded for this parameter.'}</Text>
            </View>
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>Parameter Breakdown (Page 2 of 3)</Text>
          <Text style={s.footerText}>{team.teamName || 'Startup'}</Text>
        </View>
      </Page>

      {/* PAGE 3: STRATEGIC ROADMAP */}
      <Page size="A4" style={s.page}>
        <Text style={s.roadmapTitle}>4-Week Strategic Growth Sprint</Text>
        <Text style={[s.stageLabel, { marginBottom: 20 }]}>Based on Stage {level} - {stage}</Text>

        <View style={s.roadmapTable}>
          <View style={s.roadmapHead}>
            <Text style={[s.roadmapCell, { width: '15%', fontWeight: 'bold' }]}>PRIORITY</Text>
            <Text style={[s.roadmapCell, { width: '55%', fontWeight: 'bold' }]}>STRATEGIC ACTION</Text>
            <Text style={[s.roadmapCell, { width: '30%', fontWeight: 'bold' }]}>SUPPORT / BY</Text>
          </View>
          {roadmap.map((r, i) => (
            <View key={i} style={s.roadmapRow}>
              <Text style={[s.roadmapCell, { width: '15%', fontWeight: 'bold' }]}>{r.priority}</Text>
              <Text style={[s.roadmapCell, { width: '55%' }]}>{r.action}</Text>
              <Text style={[s.roadmapCell, { width: '30%' }]}>{r.supportFrom}</Text>
            </View>
          ))}
        </View>

        {override && (
          <View style={s.warningBox}>
             <Text style={[s.stageLabel, { color: '#9A3412', marginBottom: 5 }]}>Weakest Link Alert</Text>
             <Text style={s.warningText}>
               Growth tier classification is currently capped at Stage {level} due to gaps in {override}. 
               Addressing this parameter is the highest priority for moving to the next investment-ready tier.
             </Text>
          </View>
        )}

        <View style={{ marginTop: 40, backgroundColor: '#0F172A', padding: 25, borderRadius: 20 }}>
           <Text style={[s.stageLabel, { color: '#94A3B8' }]}>Assigned Primary Mentor Type</Text>
           <Text style={[s.stageValue, { color: '#FFFFFF', marginTop: 10 }]}>{team.assigned_mentor_type || 'Discovery Coach'}</Text>
           <Text style={{ fontSize: 9, color: '#64748B', marginTop: 15, lineHeight: 1.5 }}>
             The assigned mentor type is selected based on your current stage triggers and weakest-link analysis. 
             This specialist will guide you through the 4-week sprint items listed above.
           </Text>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>Strategic Roadmap (Page 3 of 3)</Text>
          <Text style={s.footerText}>InUnity Diagnosis Engine v2.0</Text>
        </View>
      </Page>
    </Document>
  )
}
