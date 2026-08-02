import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Table, TableCell, TableHeader, TableHeaderCell, TableRow } from '../../components/ui/Table'
import { getAssuranceByEvaluationId, getMockAssuranceResult } from '../../services/api/assurance'
import type { AssuranceCategory, AssuranceResult, Recommendation, RiskLevel, StandardsMapping, TrendAnalysis } from '../../types'
import { AssuranceBreakdown } from './AssuranceBreakdown'
import { AssuranceRadar } from './AssuranceRadar'
import { AssuranceScoreCard } from './AssuranceScoreCard'
import { AssuranceSummary } from './AssuranceSummary'
import { RecommendationSummary } from './RecommendationSummary'

function getDecisionTone(level: RiskLevel | string) {
  if (level === 'informational' || level === 'low') {
    return 'healthy'
  }
  if (level === 'medium') {
    return 'warning'
  }
  return 'at-risk'
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`
}

function getDecisionLabel(score: number): string {
  if (score >= 90) return 'Approved'
  if (score >= 80) return 'Approved with Monitoring'
  if (score >= 65) return 'Needs Remediation'
  if (score >= 50) return 'High Risk'
  return 'Do Not Deploy'
}

function getDecisionReason(score: number): string {
  if (score >= 90) return 'The evaluation evidence is strong, the control coverage is broad, and the residual risk remains low.'
  if (score >= 80) return 'The system meets the expected threshold for deployment with continued monitoring and evidence review.'
  if (score >= 65) return 'The system demonstrates partial readiness, but targeted remediation is still recommended before broad rollout.'
  if (score >= 50) return 'The current evidence indicates material weaknesses that should be addressed before deployment.'
  return 'The assurance posture is insufficient for deployment and requires substantial remediation.'
}

export default function AssurancePage() {
  const [result, setResult] = useState<AssuranceResult | null>(null)

  useEffect(() => {
    const load = async () => {
      const data = await getMockAssuranceResult()
      setResult(data)
    }

    void load()
  }, [])

  useEffect(() => {
    const load = async () => {
      if (!result?.evaluationId) {
        return
      }
      const data = await getAssuranceByEvaluationId(result.evaluationId)
      setResult(data)
    }

    void load()
  }, [result?.evaluationId])

  if (!result) {
    return <div className="card" style={{ padding: '1rem' }}><p className="system-meta">Preparing assurance workspace…</p></div>
  }

  const decision = getDecisionLabel(result.overallScore)
  const decisionReason = getDecisionReason(result.overallScore)
  const standardsMappings: StandardsMapping[] = [
    { framework: 'MITRE ATLAS', mapping: 'Prompt injection and unsafe tool execution' },
    { framework: 'OWASP Top 10 for LLM Applications', mapping: 'Prompt injection, model hijacking, data leakage' },
    { framework: 'NIST AI RMF', mapping: 'Governance, measurement, and risk management' },
    { framework: 'ISO/IEC 42001', mapping: 'AI management system controls and evidence traceability' },
    { framework: 'EU AI Act', mapping: 'High-risk governance and transparency controls' }
  ]

  const trends: TrendAnalysis[] = [
    {
      pillar: 'Security',
      previousScore: 76,
      currentScore: 84,
      change: 8,
      direction: 'up',
      summary: 'Control coverage improved following policy hardening.'
    },
    {
      pillar: 'Safety',
      previousScore: 81,
      currentScore: 79,
      change: -2,
      direction: 'down',
      summary: 'Residual harmful-output handling regressed slightly.'
    },
    {
      pillar: 'Reliability',
      previousScore: 74,
      currentScore: 88,
      change: 14,
      direction: 'up',
      summary: 'Evaluation consistency improved across test cases.'
    }
  ]

  const riskMatrix = {
    likelihood: 'Medium',
    impact: 'High',
    overallPosition: 'Monitor'
  }

  return (
    <div className="details-grid">
      <div className="full-width">
        <div className="card">
          <div className="card-title" style={{ marginBottom: '0.75rem' }}>Assurance workspace</div>
          <div className="system-meta">Evidence-backed assurance conclusions across the five pillars, mapped to governance frameworks and deployment decisions.</div>
        </div>
      </div>

      <div className="full-width">
        <AssuranceSummary result={result} />
      </div>

      <div className="full-width">
        <AssuranceScoreCard result={result} />
      </div>

      <div className="full-width">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="detail-label">Deployment decision</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span className={`badge ${getDecisionTone(result.riskLevel) === 'healthy' ? 'badge-high' : getDecisionTone(result.riskLevel) === 'warning' ? 'badge-medium' : 'badge-low'}`}>{decision}</span>
            <span className="system-meta">Confidence {Math.round(result.categories.reduce((sum, item) => sum + item.confidence, 0) / result.categories.length * 100)}%</span>
          </div>
          <p className="system-meta">{decisionReason}</p>
        </div>
      </div>

      <div className="full-width">
        <AssuranceBreakdown result={result} />
      </div>

      <div className="full-width">
        <AssuranceRadar result={result} />
      </div>

      <div className="full-width">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="detail-label">Risk matrix</div>
          <div className="metrics">
            <div className="metric">
              <div className="metric-label">Likelihood</div>
              <div className="metric-val">{riskMatrix.likelihood}</div>
            </div>
            <div className="metric">
              <div className="metric-label">Impact</div>
              <div className="metric-val">{riskMatrix.impact}</div>
            </div>
            <div className="metric">
              <div className="metric-label">Overall Position</div>
              <div className="metric-val">{riskMatrix.overallPosition}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="full-width">
        <RecommendationSummary result={result} />
      </div>

      <div className="full-width">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="detail-label">Standards mapping</div>
          <Table>
            <TableHeader>
              <TableHeaderCell>Framework</TableHeaderCell>
              <TableHeaderCell>Mapping</TableHeaderCell>
            </TableHeader>
            <tbody>
              {standardsMappings.map((item) => (
                <TableRow key={item.framework}>
                  <TableCell>{item.framework}</TableCell>
                  <TableCell>{item.mapping}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <div className="full-width">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="detail-label">Trend analysis</div>
          <Table>
            <TableHeader>
              <TableHeaderCell>Pillar</TableHeaderCell>
              <TableHeaderCell>Previous</TableHeaderCell>
              <TableHeaderCell>Current</TableHeaderCell>
              <TableHeaderCell>Change</TableHeaderCell>
              <TableHeaderCell>Summary</TableHeaderCell>
            </TableHeader>
            <tbody>
              {trends.map((item) => (
                <TableRow key={item.pillar}>
                  <TableCell>{item.pillar}</TableCell>
                  <TableCell>{item.previousScore}%</TableCell>
                  <TableCell>{item.currentScore}%</TableCell>
                  <TableCell>{item.change > 0 ? `+${item.change}` : item.change}%</TableCell>
                  <TableCell>{item.summary}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <div className="full-width">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="detail-label">Assurance summary</div>
          <div className="metrics">
            <div className="metric">
              <div className="metric-label">Evaluation ID</div>
              <div className="metric-val">{result.evaluationId}</div>
            </div>
            <div className="metric">
              <div className="metric-label">Target AI</div>
              <div className="metric-val">Compliance Copilot</div>
            </div>
            <div className="metric">
              <div className="metric-label">Model Version</div>
              <div className="metric-val">GPT-4.1 / 2026-04</div>
            </div>
            <div className="metric">
              <div className="metric-label">Evaluation Date</div>
              <div className="metric-val">2026-08-01</div>
            </div>
            <div className="metric">
              <div className="metric-label">Confidence</div>
              <div className="metric-val">{Math.round(result.categories.reduce((sum, item) => sum + item.confidence, 0) / result.categories.length * 100)}%</div>
            </div>
            <div className="metric">
              <div className="metric-label">Overall Assurance Score</div>
              <div className="metric-val">{result.overallScore}%</div>
            </div>
            <div className="metric">
              <div className="metric-label">Deployment Decision</div>
              <div className="metric-val">{decision}</div>
            </div>
            <div className="metric">
              <div className="metric-label">Evidence Package</div>
              <div className="metric-val">
                <Link to="/evidence" className="btn-secondary">Open Evidence</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
