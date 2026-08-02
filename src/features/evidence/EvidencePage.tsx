import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Drawer } from '../../components/ui/Drawer'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Table, TableCell, TableHeader, TableHeaderCell, TableRow } from '../../components/ui/Table'
import { downloadEvidence, exportEvidence, getEvidencePackages, getEvidence, verifyEvidence } from '../../services/api/evidence'
import type { EvidenceArtifact, EvidencePackage, EvidenceRecommendation, EvidenceTimelineEvent } from '../../types'

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

function getStatusTone(status: string) {
  if (status === 'Completed' || status === 'Signed') {
    return 'healthy' as const
  }
  if (status === 'Pending Review' || status === 'Needs Attention') {
    return 'warning' as const
  }
  return 'at-risk' as const
}

function getConfidenceTone(score: number) {
  if (score >= 82) {
    return 'high'
  }
  if (score >= 68) {
    return 'medium'
  }
  return 'low'
}

export default function EvidencePage() {
  const [packages, setPackages] = useState<EvidencePackage[]>([])
  const [selectedPackage, setSelectedPackage] = useState<EvidencePackage | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      const data = await getEvidencePackages()
      setPackages(data)
    }

    void load()
  }, [])

  const overviewCards = useMemo(() => {
    const totalEvidencePackages = packages.length
    const evidenceArtifacts = packages.reduce((sum, pkg) => sum + pkg.artifacts.length, 0)
    const activeEvaluations = packages.filter((pkg) => pkg.assuranceStatus !== 'Completed').length
    const averageConfidence = packages.length
      ? Math.round(packages.reduce((sum, pkg) => sum + pkg.confidence, 0) / packages.length)
      : 0
    const signedReports = packages.filter((pkg) => pkg.signed).length
    const pendingReviews = packages.filter((pkg) => pkg.pendingReview).length

    return [
      { label: 'Total Evidence Packages', value: totalEvidencePackages.toString(), detail: 'Completed evaluations with evidence bundles' },
      { label: 'Evidence Artifacts', value: evidenceArtifacts.toString(), detail: 'Artifacts and traces captured' },
      { label: 'Active Evaluations', value: activeEvaluations.toString(), detail: 'Evaluations still being reviewed' },
      { label: 'Average Confidence', value: `${averageConfidence}%`, detail: 'Evidence quality and completeness' },
      { label: 'Signed Reports', value: signedReports.toString(), detail: 'Governance-ready evidence reports' },
      { label: 'Pending Reviews', value: pendingReviews.toString(), detail: 'Evidence awaiting governance sign-off' }
    ]
  }, [packages])

  const openPackage = async (packageId: string) => {
    const data = await getEvidence(packageId)
    setSelectedPackage(data)
    setDrawerOpen(true)
  }

  const handleDownload = async (packageId: string) => {
    await downloadEvidence(packageId)
  }

  const handleExport = async (packageId: string, format: 'json' | 'pdf') => {
    await exportEvidence(packageId, format)
  }

  const handleVerify = async (packageId: string) => {
    const verified = await verifyEvidence(packageId)
    if (verified) {
      setPackages((current) => current.map((item) => item.id === packageId ? { ...item, assuranceStatus: 'Verified' } : item))
    }
  }

  return (
    <div className="details-grid">
      <div className="full-width">
        <div className="card">
          <div className="card-title" style={{ marginBottom: '0.75rem' }}>
            Evidence workspace
          </div>
          <div className="system-meta">
            Governance-ready evidence bundles collected from completed evaluations and linked to assurance reports.
          </div>
        </div>
      </div>

      <div className="full-width">
        <div className="metrics">
          {overviewCards.map((card) => (
            <div key={card.label} className="metric">
              <div className="metric-label">{card.label}</div>
              <div className="metric-val">{card.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>{card.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="full-width">
        <div className="card">
          <div className="card-title" style={{ marginBottom: '0.75rem' }}>
            Evidence package table
          </div>
          <Table>
            <TableHeader>
              <TableHeaderCell>Evaluation ID</TableHeaderCell>
              <TableHeaderCell>Target AI</TableHeaderCell>
              <TableHeaderCell>Model</TableHeaderCell>
              <TableHeaderCell>Version</TableHeaderCell>
              <TableHeaderCell>Test Suite</TableHeaderCell>
              <TableHeaderCell>Evaluation Date</TableHeaderCell>
              <TableHeaderCell>Confidence</TableHeaderCell>
              <TableHeaderCell>Assurance Status</TableHeaderCell>
              <TableHeaderCell>Overall Score</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableHeader>
            <tbody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>{pkg.evaluationId}</TableCell>
                  <TableCell>{pkg.targetSystem}</TableCell>
                  <TableCell>{pkg.model}</TableCell>
                  <TableCell>{pkg.version}</TableCell>
                  <TableCell>{pkg.testSuite}</TableCell>
                  <TableCell>{formatDate(pkg.evaluationDate)}</TableCell>
                  <TableCell>
                    <span className={`badge ${getConfidenceTone(pkg.confidence) === 'high' ? 'badge-high' : getConfidenceTone(pkg.confidence) === 'medium' ? 'badge-medium' : 'badge-low'}`}>
                      {pkg.confidence}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={getStatusTone(pkg.assuranceStatus)}>{pkg.assuranceStatus}</StatusBadge>
                  </TableCell>
                  <TableCell>{pkg.overallScore}/100</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button type="button" className="btn-secondary" onClick={() => { void openPackage(pkg.id) }}>
                        View Evidence
                      </button>
                      <button type="button" className="btn-secondary" onClick={() => { void handleDownload(pkg.id) }}>
                        Download
                      </button>
                      <button type="button" className="btn-secondary" onClick={() => { void handleExport(pkg.id, 'json') }}>
                        JSON
                      </button>
                      <button type="button" className="btn-secondary" onClick={() => { void handleExport(pkg.id, 'pdf') }}>
                        PDF
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <div className="full-width">
        <div className="card">
          <div className="card-title" style={{ marginBottom: '0.75rem' }}>
            Evidence flow
          </div>
          <div className="system-meta" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span>Evaluation</span>
            <span>↓</span>
            <span>Evidence Package</span>
            <span>↓</span>
            <span>Evidence Viewer</span>
            <span>↓</span>
            <span>Assurance Engine</span>
            <span>↓</span>
            <span>Report</span>
          </div>
        </div>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={selectedPackage?.evaluationId ?? 'Evidence viewer'}>
        {selectedPackage ? (
          <div className="details-grid">
            <div className="full-width">
              <div className="card" style={{ marginBottom: '0.75rem' }}>
                <div className="card-title" style={{ marginBottom: '0.75rem' }}>Evaluation metadata</div>
                <div className="details-grid">
                  <div>
                    <p className="detail-label">Evaluation ID</p>
                    <p className="system-meta">{selectedPackage.evaluationId}</p>
                  </div>
                  <div>
                    <p className="detail-label">Evaluator</p>
                    <p className="system-meta">{selectedPackage.metadata.evaluator}</p>
                  </div>
                  <div>
                    <p className="detail-label">Timestamp</p>
                    <p className="system-meta">{formatDate(selectedPackage.metadata.timestamp)}</p>
                  </div>
                  <div>
                    <p className="detail-label">Model</p>
                    <p className="system-meta">{selectedPackage.metadata.model}</p>
                  </div>
                  <div>
                    <p className="detail-label">Version</p>
                    <p className="system-meta">{selectedPackage.metadata.version}</p>
                  </div>
                  <div>
                    <p className="detail-label">Deployment Context</p>
                    <p className="system-meta">{selectedPackage.metadata.deploymentContext}</p>
                  </div>
                  <div>
                    <p className="detail-label">Runtime</p>
                    <p className="system-meta">{selectedPackage.metadata.runtime}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="full-width">
              <div className="card" style={{ marginBottom: '0.75rem' }}>
                <div className="card-title" style={{ marginBottom: '0.75rem' }}>Test results</div>
                <Table>
                  <TableHeader>
                    <TableHeaderCell>Test Name</TableHeaderCell>
                    <TableHeaderCell>Category</TableHeaderCell>
                    <TableHeaderCell>Result</TableHeaderCell>
                    <TableHeaderCell>Severity</TableHeaderCell>
                    <TableHeaderCell>Confidence</TableHeaderCell>
                  </TableHeader>
                  <tbody>
                    {selectedPackage.artifacts.map((artifact) => (
                      <TableRow key={artifact.id}>
                        <TableCell>{artifact.title}</TableCell>
                        <TableCell>{artifact.assurancePillar}</TableCell>
                        <TableCell>{artifact.description}</TableCell>
                        <TableCell>{artifact.severity}</TableCell>
                        <TableCell>{artifact.confidence}</TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>

            <div className="full-width">
              <div className="card" style={{ marginBottom: '0.75rem' }}>
                <div className="card-title" style={{ marginBottom: '0.75rem' }}>Prompt / response log</div>
                <div className="finding-list">
                  {selectedPackage.timeline.map((event) => (
                    <div key={event.id} className="card" style={{ marginBottom: '0.5rem' }}>
                      <div className="system-name">{event.title}</div>
                      <div className="system-meta">{event.description}</div>
                      <div className="system-meta">{formatDate(event.timestamp)} · Test ID: {event.testId}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="full-width">
              <div className="card" style={{ marginBottom: '0.75rem' }}>
                <div className="card-title" style={{ marginBottom: '0.75rem' }}>Supporting artifacts</div>
                <div className="metrics">
                  {selectedPackage.artifacts.map((artifact) => (
                    <div key={artifact.id} className="metric">
                      <div className="metric-label">{artifact.title}</div>
                      <div className="metric-val">{artifact.metadata.type as string}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>{artifact.metadata.size as string}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{formatDate(artifact.timestamp)}</div>
                      <button type="button" className="btn-secondary" style={{ marginTop: '0.75rem' }} onClick={() => { void handleDownload(selectedPackage.id) }}>
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="full-width">
              <div className="card" style={{ marginBottom: '0.75rem' }}>
                <div className="card-title" style={{ marginBottom: '0.75rem' }}>Confidence analysis</div>
                <div className="metrics">
                  <div className="metric">
                    <div className="metric-label">Confidence %</div>
                    <div className="metric-val">{selectedPackage.confidence}%</div>
                  </div>
                  <div className="metric">
                    <div className="metric-label">Data Completeness</div>
                    <div className="metric-val">{selectedPackage.confidenceSummary.dataCompleteness}%</div>
                  </div>
                  <div className="metric">
                    <div className="metric-label">Test Coverage</div>
                    <div className="metric-val">{selectedPackage.confidenceSummary.testCoverage}%</div>
                  </div>
                  <div className="metric">
                    <div className="metric-label">Evidence Quality</div>
                    <div className="metric-val">{selectedPackage.confidenceSummary.evidenceQuality}%</div>
                  </div>
                  <div className="metric">
                    <div className="metric-label">Reproducibility</div>
                    <div className="metric-val">{selectedPackage.confidenceSummary.reproducibility}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="full-width">
              <div className="card" style={{ marginBottom: '0.75rem' }}>
                <div className="card-title" style={{ marginBottom: '0.75rem' }}>Evidence timeline</div>
                <div className="finding-list">
                  {selectedPackage.timeline.map((event, index) => (
                    <div key={event.id} className="card" style={{ marginBottom: '0.5rem' }}>
                      <div className="system-meta">{index + 1}. {event.title}</div>
                      <div className="system-meta">{event.description}</div>
                      <div className="system-meta">{formatDate(event.timestamp)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="full-width">
              <div className="card" style={{ marginBottom: '0.75rem' }}>
                <div className="card-title" style={{ marginBottom: '0.75rem' }}>Recommendations</div>
                <div className="finding-list">
                  {selectedPackage.recommendations.map((recommendation) => (
                    <div key={recommendation.id} className="card" style={{ marginBottom: '0.5rem' }}>
                      <div className="system-name">{recommendation.recommendation}</div>
                      <div className="system-meta">Category: {recommendation.category}</div>
                      <div className="system-meta">Priority: {recommendation.priority}</div>
                      <div className="system-meta">Expected improvement: {recommendation.expectedImprovement}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="full-width">
              <div className="card" style={{ marginBottom: '0.75rem' }}>
                <div className="card-title" style={{ marginBottom: '0.75rem' }}>Evidence actions</div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button type="button" className="btn-secondary" onClick={() => { void handleDownload(selectedPackage.id) }}>
                    Download evidence bundle
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => { void handleExport(selectedPackage.id, 'json') }}>
                    Export JSON
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => { void handleExport(selectedPackage.id, 'pdf') }}>
                    Export PDF
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => { void handleVerify(selectedPackage.id) }}>
                    Verify evidence
                  </button>
                  <Link to="/reports" className="btn-secondary">Open assurance report</Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  )
}
