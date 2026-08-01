import type { AssuranceReport } from '../../types'

interface FrameworkMappingsProps {
  report: AssuranceReport
}

export function FrameworkMappings({ report }: FrameworkMappingsProps) {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="detail-label">Framework mappings</div>
      <div className="finding-list">
        {report.frameworkMappings.map((mapping) => (
          <div key={mapping.framework} className="card" style={{ marginBottom: '0.75rem' }}>
            <div className="system-name">{mapping.framework}</div>
            <div className="system-meta">{mapping.mapping}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
