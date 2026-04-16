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
import { calculateScores } from '@/utils/scores'

// Register fonts if needed, but standard ones are safer for initial migration
const s = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', color: '#0F2647' },
  header: { marginBottom: 30, borderBottom: 2, borderBottomColor: '#E8A020', paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 10, color: '#8A9BB0', marginTop: 4, textTransform: 'uppercase' },
  
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#1A3A6B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  scoreCard: { width: '23%', backgroundColor: '#F4F6F9', padding: 10, borderRadius: 5 },
  scoreLabel: { fontSize: 8, color: '#8A9BB0', marginBottom: 2 },
  scoreValue: { fontSize: 16, fontWeight: 'bold' },

  row: { flexDirection: 'row', marginBottom: 10 },
  col: { flex: 1 },
  label: { fontSize: 8, color: '#8A9BB0', marginBottom: 2, textTransform: 'uppercase' },
  value: { fontSize: 10, lineHeight: 1.4 },
  
  box: { backgroundColor: '#F4F6F9', padding: 15, borderRadius: 8, marginBottom: 15 },
  roadmapTable: { marginTop: 10 },
  roadmapHeader: { flexDirection: 'row', borderBottom: 1, borderBottomColor: '#DDE3EC', paddingBottom: 5, marginBottom: 5 },
  roadmapRow: { flexDirection: 'row', paddingVertical: 4, borderBottom: 0.5, borderBottomColor: '#F4F6F9' },
  roadmapCell: { fontSize: 9 },
  
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, borderTop: 1, borderTopColor: '#DDE3EC', paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: '#8A9BB0' }
})

export default function DiagnosticPDF({ team }: { team: TeamProfile }) {
  const scores = calculateScores(team)

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>{team.startupName || 'Startup Profile'}</Text>
          <Text style={s.subtitle}>Startup Stage Profile • InUnity</Text>
        </View>

        {/* Readiness Score */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Readiness score</Text>
          <View style={s.grid}>
            <View style={s.scoreCard}>
              <Text style={s.scoreLabel}>Value Prop</Text>
              <Text style={s.scoreValue}>{scores.problem || '-'}</Text>
            </View>
            <View style={s.scoreCard}>
              <Text style={s.scoreLabel}>Market</Text>
              <Text style={s.scoreValue}>{scores.market || '-'}</Text>
            </View>
            <View style={s.scoreCard}>
              <Text style={s.scoreLabel}>Business</Text>
              <Text style={s.scoreValue}>{scores.biz || '-'}</Text>
            </View>
            <View style={s.scoreCard}>
              <Text style={s.scoreLabel}>Pitch</Text>
              <Text style={s.scoreValue}>{scores.pitch || '-'}</Text>
            </View>
          </View>
        </View>

        {/* Basic Info */}
        <View style={s.section}>
          <View style={s.row}>
            <View style={s.col}>
              <Text style={s.label}>Sector</Text>
              <Text style={s.value}>{team.sector || 'N/A'}</Text>
            </View>
            <View style={s.col}>
              <Text style={s.label}>Institution</Text>
              <Text style={s.value}>{team.institution || 'N/A'}</Text>
            </View>
            <View style={s.col}>
              <Text style={s.label}>Team Size</Text>
              <Text style={s.value}>{team.teamSize || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Assessment Summary */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Assessment Summary</Text>
          <View style={s.row}>
            <View style={[s.col, { marginRight: 10 }]}>
              <Text style={s.label}>Key Strengths</Text>
              <Text style={s.value}>{team.strengths || 'N/A'}</Text>
            </View>
            <View style={s.col}>
              <Text style={s.label}>Critical Gaps</Text>
              <Text style={s.value}>{team.gaps || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Roadmap */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Team Roadmap</Text>
          <View style={s.roadmapTable}>
            <View style={s.roadmapHeader}>
              <Text style={[s.roadmapCell, { width: '15%', fontWeight: 'bold' }]}>Priority</Text>
              <Text style={[s.roadmapCell, { width: '55%', fontWeight: 'bold' }]}>Action Item</Text>
              <Text style={[s.roadmapCell, { width: '30%', fontWeight: 'bold' }]}>Deadline</Text>
            </View>
            {(team.roadmap || []).map((item, i) => (
              <View key={i} style={s.roadmapRow}>
                <Text style={[s.roadmapCell, { width: '15%', color: item.priority === 'P0' ? '#E84B3A' : '#0F2647' }]}>
                  {item.priority}
                </Text>
                <Text style={[s.roadmapCell, { width: '55%' }]}>{item.action}</Text>
                <Text style={[s.roadmapCell, { width: '30%' }]}>{item.byWhen}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Internal Notes */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Internal Feedback / Programme Notes</Text>
          <View style={s.box}>
            <Text style={s.value}>{team.notes || 'No internal notes provided.'}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>Generated for InUnity Startup Programme</Text>
          <Text style={s.footerText}>InUnity Private Limited • Confidential</Text>
        </View>
      </Page>
    </Document>
  )
}
