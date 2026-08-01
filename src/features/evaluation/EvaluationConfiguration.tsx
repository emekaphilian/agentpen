import type { ChangeEvent } from 'react'
import type { AssurancePillar, EvaluationCreateInput } from '../../types'

interface EvaluationConfigurationProps {
  draft: EvaluationCreateInput
  onChange: (changes: Partial<EvaluationCreateInput>) => void
  onTogglePillar: (pillar: AssurancePillar) => void
  pillarOptions: AssurancePillar[]
}

const deploymentOptions = ['Cloud', 'Edge', 'On-prem', 'Hybrid']

export function EvaluationConfiguration({
  draft,
  onChange,
  onTogglePillar,
  pillarOptions
}: EvaluationConfigurationProps) {
  const handleFieldChange = (field: keyof EvaluationCreateInput) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange({ [field]: event.target.value })
  }

  return (
    <div className="details-grid">
      <div className="full-width">
        <label className="detail-label" htmlFor="name">
          Evaluation name
        </label>
        <input id="name" className="input-field" value={draft.name} onChange={handleFieldChange('name')} placeholder="Quarterly assurance review" />
      </div>

      <div className="full-width">
        <label className="detail-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className="input-field"
          rows={4}
          value={draft.description}
          onChange={handleFieldChange('description')}
          placeholder="Capture the goal, target deployment, and scope of the evaluation."
        />
      </div>

      <div>
        <label className="detail-label" htmlFor="aiSystemName">
          AI system
        </label>
        <input id="aiSystemName" className="input-field" value={draft.aiSystemName} onChange={handleFieldChange('aiSystemName')} placeholder="Compliance Copilot" />
      </div>

      <div>
        <label className="detail-label" htmlFor="aiSystemId">
          AI system ID
        </label>
        <input id="aiSystemId" className="input-field" value={draft.aiSystemId} onChange={handleFieldChange('aiSystemId')} placeholder="sys-001" />
      </div>

      <div>
        <label className="detail-label" htmlFor="modelVersion">
          Model version
        </label>
        <input id="modelVersion" className="input-field" value={draft.modelVersion} onChange={handleFieldChange('modelVersion')} placeholder="gpt-4.1-2026-04" />
      </div>

      <div>
        <label className="detail-label" htmlFor="deploymentContext">
          Deployment context
        </label>
        <select id="deploymentContext" className="input-field" value={draft.deploymentContext} onChange={handleFieldChange('deploymentContext')}>
          {deploymentOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="full-width">
        <p className="detail-label">Assurance pillars</p>
        <div className="pillar-list">
          {pillarOptions.map((pillar) => {
            const isSelected = draft.pillars.includes(pillar)
            return (
              <button key={pillar} type="button" className={`pillar-chip${isSelected ? ' active' : ''}`} onClick={() => onTogglePillar(pillar)}>
                {pillar}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
