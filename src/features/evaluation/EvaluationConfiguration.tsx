import type { ChangeEvent } from 'react'
import type { AssurancePillar, EvaluationCreateInput, EvaluationProfile, EvaluationRuntimeOptions } from '../../types'

interface EvaluationConfigurationProps {
  draft: EvaluationCreateInput
  onChange: (changes: Partial<EvaluationCreateInput>) => void
  onTogglePillar: (pillar: AssurancePillar) => void
  onToggleSuite?: (suite: string) => void
  onChangeRuntimeOption?: (field: keyof EvaluationRuntimeOptions, value: string | number | boolean) => void
  pillarOptions: AssurancePillar[]
}

const deploymentOptions = ['Cloud', 'Edge', 'On-prem', 'Hybrid']
const aiSystemOptions = [
  { id: 'sys-gpt41', name: 'GPT-4.1 Enterprise Assistant', model: 'GPT-4.1', modelVersion: 'gpt-4.1-2026-04', deploymentContext: 'Cloud' },
  { id: 'sys-claude', name: 'Claude Enterprise Agent', model: 'Claude 3.7', modelVersion: 'claude-3.7', deploymentContext: 'Hybrid' },
  { id: 'sys-support', name: 'Customer Support Agent', model: 'Support Copilot', modelVersion: 'v3.2', deploymentContext: 'Cloud' },
  { id: 'sys-finance', name: 'Financial Risk Assistant', model: 'Finance Risk Copilot', modelVersion: 'v1.4', deploymentContext: 'On-prem' },
  { id: 'sys-hr', name: 'Internal HR Assistant', model: 'HR Assistant', modelVersion: 'v2.1', deploymentContext: 'Hybrid' }
]
const modelOptions = ['GPT-4.1', 'Claude 3.7', 'Llama 3.1', 'Gemini 2.0', 'Custom']
const profileOptions: EvaluationProfile[] = ['Standard', 'Red Team', 'Compliance', 'Production']
const suiteOptions = [
  { name: 'OWASP Top 10 for LLM Applications', estimate: '12m' },
  { name: 'MITRE ATLAS', estimate: '14m' },
  { name: 'Prompt Injection', estimate: '8m' },
  { name: 'Hallucination', estimate: '7m' },
  { name: 'Jailbreak Resistance', estimate: '9m' },
  { name: 'Tool Abuse', estimate: '10m' },
  { name: 'Memory Poisoning', estimate: '6m' },
  { name: 'Prompt Leakage', estimate: '5m' },
  { name: 'RAG Security', estimate: '11m' },
  { name: 'Fairness', estimate: '6m' },
  { name: 'Reliability', estimate: '7m' },
  { name: 'Custom Evaluation', estimate: '9m' }
]

export function EvaluationConfiguration({
  draft,
  onChange,
  onTogglePillar,
  onToggleSuite,
  onChangeRuntimeOption,
  pillarOptions
}: EvaluationConfigurationProps) {
  const runtimeOptions = draft.runtimeOptions ?? {
    timeoutMinutes: 20,
    maxConcurrency: 3,
    includeReasoningTrace: true,
    captureEvidence: true,
    notifyOnCompletion: true
  }

  const handleFieldChange = (field: keyof EvaluationCreateInput) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange({ [field]: event.target.value })
  }

  const handleSystemSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    const selection = aiSystemOptions.find((option) => option.id === event.target.value)
    if (!selection) {
      return
    }

    onChange({
      aiSystemName: selection.name,
      aiSystemId: selection.id,
      modelVersion: selection.modelVersion,
      model: selection.model,
      deploymentContext: selection.deploymentContext
    })
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
          Select AI system
        </label>
        <select id="aiSystemName" className="input-field" value={draft.aiSystemId} onChange={handleSystemSelection}>
          {aiSystemOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="detail-label" htmlFor="modelVersion">
          Model
        </label>
        <select id="modelVersion" className="input-field" value={draft.model ?? draft.modelVersion} onChange={(event) => onChange({ model: event.target.value })}>
          {modelOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
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

      <div>
        <label className="detail-label" htmlFor="profile">
          Evaluation profile
        </label>
        <select id="profile" className="input-field" value={draft.profile ?? 'Standard'} onChange={(event) => onChange({ profile: event.target.value as EvaluationProfile })}>
          {profileOptions.map((option) => (
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

      <div className="full-width">
        <p className="detail-label">Test suites</p>
        <div className="pillar-list">
          {suiteOptions.map((suite) => {
            const isSelected = (draft.testSuites ?? []).includes(suite.name)
            return (
              <button key={suite.name} type="button" className={`pillar-chip${isSelected ? ' active' : ''}`} onClick={() => onToggleSuite?.(suite.name)}>
                {suite.name} · {suite.estimate}
              </button>
            )
          })}
        </div>
      </div>

      <div className="full-width">
        <p className="detail-label">Runtime options</p>
        <div className="details-grid">
          <div>
            <label className="detail-label" htmlFor="timeoutMinutes">
              Timeout (minutes)
            </label>
            <input
              id="timeoutMinutes"
              className="input-field"
              type="number"
              min="10"
              max="90"
              value={runtimeOptions.timeoutMinutes}
              onChange={(event) => onChangeRuntimeOption?.('timeoutMinutes', Number(event.target.value))}
            />
          </div>
          <div>
            <label className="detail-label" htmlFor="maxConcurrency">
              Max concurrency
            </label>
            <input
              id="maxConcurrency"
              className="input-field"
              type="number"
              min="1"
              max="8"
              value={runtimeOptions.maxConcurrency}
              onChange={(event) => onChangeRuntimeOption?.('maxConcurrency', Number(event.target.value))}
            />
          </div>
          <div>
            <label className="detail-label" htmlFor="includeReasoningTrace">
              Include reasoning trace
            </label>
            <input
              id="includeReasoningTrace"
              className="input-field"
              type="checkbox"
              checked={runtimeOptions.includeReasoningTrace}
              onChange={(event) => onChangeRuntimeOption?.('includeReasoningTrace', event.target.checked)}
            />
          </div>
          <div>
            <label className="detail-label" htmlFor="captureEvidence">
              Capture evidence
            </label>
            <input
              id="captureEvidence"
              className="input-field"
              type="checkbox"
              checked={runtimeOptions.captureEvidence}
              onChange={(event) => onChangeRuntimeOption?.('captureEvidence', event.target.checked)}
            />
          </div>
          <div>
            <label className="detail-label" htmlFor="notifyOnCompletion">
              Notify on completion
            </label>
            <input
              id="notifyOnCompletion"
              className="input-field"
              type="checkbox"
              checked={runtimeOptions.notifyOnCompletion}
              onChange={(event) => onChangeRuntimeOption?.('notifyOnCompletion', event.target.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
