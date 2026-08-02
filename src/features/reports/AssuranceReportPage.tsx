import { useEffect, useMemo, useState } from 'react'
import { getReports, getReportById, createReport } from '../../services/api/reports'
import type { AssuranceReport } from '../../types'
import { AssuranceScoreSection } from './AssuranceScoreSection'
import { EvaluationMetadata } from './EvaluationMetadata'
import { EvidenceSummarySection } from './EvidenceSummarySection'
import { ExecutiveSummary } from './ExecutiveSummary'
import { FindingsSection } from './FindingsSection'
import { FrameworkMappings } from './FrameworkMappings'
import { RecommendationsSection } from './RecommendationsSection'
import { ReportActions } from './ReportActions'
import { Table, TableCell, TableHeader, TableHeaderCell, TableRow } from '../../components/ui/Table'

interface AssuranceReportPageProps {
  reportId?: string
}

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

function getStatusTone(status: string) {
  if (status === 'Published') {
    return 'healthy'
  }
  if (status === 'Ready for Review' || status === 'Scheduled') {
    return 'warning'
  }
  return 'at-risk'
}

export function AssuranceReportPage({ reportId }: AssuranceReportPageProps) {
  const [reports, setReports] = useState<AssuranceReport[]>([])
  const [report, setReport] = useState<AssuranceReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const items = reportId
          ? [await getReportById(reportId)]
          : await getReports()

        const selected = items.find((item) => item.id === reportId) ?? items[0] ?? await createReport()
        setReports(items)
        setReport(selected)
      } catch {
        setReport(null)
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [reportId])

  const overviewCards = useMemo(() => {
    const published = reports.filter((item) => item.status === 'Published').length
    const draft = reports.filter((item) => item.status === 'Draft').length
    const review = reports.filter((item) => item.status === 'Ready for Review').length
    const scheduled = reports.filter((item) => item.status === 'Scheduled').length

    return [
      { label: 'Total reports', value: reports.length.toString(), detail: 'Reports generated across assurance workflows' },
      { label: 'Published', value: published.toString(), detail: 'Governance-ready reports released to stakeholders' },
      { label: 'Drafts', value: draft.toString(), detail: 'In-progress report templates and drafts' },
      { label: 'Review', value: review.toString(), detail: 'Reports awaiting reviewer sign-off' },
      { label: 'Scheduled', value: scheduled.toString(), detail: 'Upcoming or planned release reports' }
    ]
  }, [reports])

  if (loading) {
    return <div className="card" style={{ padding: '1rem' }}><p className="system-meta">Preparing assurance reports…</p></div>
  }

  if (!report) {
    return <div className="card" style={{ padding: '1rem' }}><p className="system-meta">No assurance report is available yet.</p></div>
  }

  return (
    <div className="details-grid">
      <div className="full-width">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="card-title" style={{ marginBottom: '0.75rem' }}>Reports workspace</div>
          <div className="system-meta">Coverage across executive, compliance, and operational report needs, with evidence packages, framework mappings, sign-off metadata, and reusable templates.</div>
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
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="detail-label" style={{ marginBottom: '0.75rem' }}>Report catalogue</div>
          <Table>
            <TableHeader>
              <TableHeaderCell>Report</TableHeaderCell>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Owner</TableHeaderCell>
              <TableHeaderCell>Generated</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableHeader>
            <tbody>
              {reports.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.reportType}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell><span className={`badge ${getStatusTone(item.status) === 'healthy' ? 'badge-high' : getStatusTone(item.status) === 'warning' ? 'badge-medium' : 'badge-low'}`}>{item.status}</span></TableCell>
                  <TableCell>{item.owner}</TableCell>
                  <TableCell>{formatDate(item.metadata.generatedAt)}</TableCell>
                  <TableCell>
                    <button type="button" className="btn-secondary" onClick={() => setReport(item)}>
                      Open
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <div className="full-width">
        <ExecutiveSummary report={report} />
      </div>

      <div className="full-width">
        <EvaluationMetadata report={report} />
      </div>

      <div className="full-width">
        <AssuranceScoreSection report={report} />
      </div>

      <div className="full-width">
        <EvidenceSummarySection report={report} />
      </div>

      <div className="full-width">
        <FindingsSection report={report} />
      </div>

      <div className="full-width">
        <RecommendationsSection report={report} />
      </div>

      <div className="full-width">
        <FrameworkMappings report={report} />
      </div>

      <div className="full-width">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="detail-label" style={{ marginBottom: '0.75rem' }}>Evidence package content</div>
          <Table>
            <TableHeader>
              <TableHeaderCell>Package</TableHeaderCell>
              <TableHeaderCell>Confidence</TableHeaderCell>
              <TableHeaderCell>Artifacts</TableHeaderCell>
              <TableHeaderCell>Reviewed by</TableHeaderCell>
            </TableHeader>
            <tbody>
              {report.evidencePackages.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.confidence}%</TableCell>
                  <TableCell>{item.artifactCount}</TableCell>
                  <TableCell>{item.reviewedBy}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <div className="full-width">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="detail-label" style={{ marginBottom: '0.75rem' }}>Digital signature</div>
          <div className="details-grid">
            <div>
              <div className="system-meta">Signer</div>
              <div className="system-name">{report.signature.signer}</div>
            </div>
            <div>
              <div className="system-meta">Role</div>
              <div className="system-name">{report.signature.role}</div>
            </div>
            <div>
              <div className="system-meta">Status</div>
              <div className="system-name">{report.signature.status}</div>
            </div>
            <div>
              <div className="system-meta">Certificate</div>
              <div className="system-name">{report.signature.certificateId}</div>
            </div>
            <div>
              <div className="system-meta">Signed at</div>
              <div className="system-name">{formatDate(report.signature.signedAt)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="full-width">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="detail-label" style={{ marginBottom: '0.75rem' }}>Version history</div>
          <Table>
            <TableHeader>
              <TableHeaderCell>Version</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Published</TableHeaderCell>
              <TableHeaderCell>Summary</TableHeaderCell>
            </TableHeader>
            <tbody>
              {report.versionHistory.map((item) => (
                <TableRow key={item.version}>
                  <TableCell>{item.version}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{formatDate(item.publishedAt)}</TableCell>
                  <TableCell>{item.summary}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <div className="full-width">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="detail-label" style={{ marginBottom: '0.75rem' }}>Report templates</div>
          <div className="finding-list">
            {report.templates.map((item) => (
              <div key={item.id} className="card" style={{ marginBottom: '0.5rem' }}>
                <div className="system-name">{item.name}</div>
                <div className="system-meta">{item.description}</div>
                <div className="system-meta">Category: {item.category} · {item.default ? 'Default template' : 'Optional template'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="full-width">
        <ReportActions reportId={report.id} />
      </div>
    </div>
  )
}
