import { useEffect, useState } from 'react'
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

interface AssuranceReportPageProps {
  reportId?: string
}

export function AssuranceReportPage({ reportId }: AssuranceReportPageProps) {
  const [report, setReport] = useState<AssuranceReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = reportId
          ? await getReportById(reportId)
          : await getReports().then((items) => items[0] ?? createReport())
        setReport(data)
      } catch {
        setReport(null)
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [reportId])

  if (loading) {
    return <div className="card" style={{ padding: '1rem' }}><p className="system-meta">Preparing assurance report…</p></div>
  }

  if (!report) {
    return <div className="card" style={{ padding: '1rem' }}><p className="system-meta">No assurance report is available yet.</p></div>
  }

  return (
    <div className="details-grid">
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
        <ReportActions reportId={report.id} />
      </div>
    </div>
  )
}
