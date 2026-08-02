import type { AssurancePillar, EvaluationCreateInput } from '../../types'
import type { AISystem } from '../../types'
import { EvaluationConfiguration } from '../../features/evaluation/EvaluationConfiguration'

interface NewScanPanelProps {
  systems: AISystem[]
  selectedSystemId: string
  draft: EvaluationCreateInput
  onSelectSystem: (systemId: string) => void
  onDraftChange: (changes: Partial<EvaluationCreateInput>) => void
  onTogglePillar: (pillar: AssurancePillar) => void
  onRunEvaluation: () => void
  isRunning: boolean
  progressLabel: string
  progressPercent: number
  selectedSystem: AISystem | null
}

export default function NewScanPanel({
  systems,
  selectedSystemId,
  draft,
  onSelectSystem,
  onDraftChange,
  onTogglePillar,
  progressLabel,
  progressPercent,
  onRunEvaluation,
  isRunning,
  selectedSystem
}: NewScanPanelProps) {
  return (
    <div className="view active" id="view-scan">
      <div className="card">
        <div className="card-title">Evaluation configuration</div>
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label>Registered AI systems</label>
          <select value={selectedSystemId} onChange={(event) => onSelectSystem(event.target.value)}>
            {systems.map((system) => (
              <option key={system.id} value={system.id}>
                {system.name}
              </option>
            ))}
          </select>
        </div>
        {selectedSystem && (
          <div className="system-meta" style={{ marginBottom: '12px' }}>
            {selectedSystem.description} · {selectedSystem.owner}
          </div>
        )}
        <EvaluationConfiguration draft={draft} onChange={onDraftChange} onTogglePillar={onTogglePillar} pillarOptions={['Security', 'Safety', 'Reliability', 'Fairness', 'Domain']} />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn-primary" type="button" onClick={onRunEvaluation} disabled={isRunning}>
            {isRunning ? 'Running evaluation…' : '▶ Run evaluation'}
          </button>
          <span style={{ fontSize: '12px' }}>{isRunning ? 'Evaluation is in progress.' : 'Select a registry system to begin.'}</span>
        </div>
      </div>

      <div id="scan-progress">
        <div className="progress-wrap">
          <div className="progress-meta">
            <span id="prog-label">{progressLabel}</span>
            <span id="prog-pct">{progressPercent}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" id="prog-bar" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <div className="terminal" id="scan-log">
          <div className="log-line">{selectedSystem ? `Registry → ${selectedSystem.name}` : 'Registry → No system selected'}</div>
          <div className="log-line">{draft.aiSystemName ? `Evaluation → ${draft.aiSystemName}` : 'Evaluation → Pending'}</div>
          <div className="log-line log-ok">{isRunning ? 'Workflow running' : 'Ready to launch'}</div>
        </div>
      </div>
    </div>
  )
}
