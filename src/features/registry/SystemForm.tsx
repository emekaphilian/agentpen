import { FormEvent } from 'react'
import type { AISystem, DeploymentType, RiskLevel, SystemStatus } from '../../types'

interface SystemFormProps {
  system?: AISystem | null
  onSubmit: (payload: Omit<AISystem, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

const deploymentTypes: DeploymentType[] = ['cloud', 'edge', 'on-prem', 'hybrid']
const riskLevels: RiskLevel[] = ['low', 'medium', 'high', 'critical']
const systemStatuses: SystemStatus[] = ['active', 'maintenance', 'draft', 'archived']

const emptyDraft = {
  name: '',
  description: '',
  owner: '',
  targetUrl: '',
  deploymentType: 'cloud' as DeploymentType,
  riskLevel: 'medium' as RiskLevel,
  status: 'active' as SystemStatus,
  tags: [] as string[]
}

export default function SystemForm({ system, onSubmit, onCancel }: SystemFormProps) {
  const initialState = system
    ? {
        name: system.name,
        description: system.description,
        owner: system.owner,
        targetUrl: system.targetUrl,
        deploymentType: system.deploymentType,
        riskLevel: system.riskLevel,
        status: system.status,
        tags: system.tags
      }
    : emptyDraft

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload: Omit<AISystem, 'id' | 'createdAt' | 'updatedAt'> = {
      name: String(formData.get('name') || ''),
      description: String(formData.get('description') || ''),
      owner: String(formData.get('owner') || ''),
      targetUrl: String(formData.get('targetUrl') || ''),
      deploymentType: String(formData.get('deploymentType') || 'cloud') as DeploymentType,
      riskLevel: String(formData.get('riskLevel') || 'medium') as RiskLevel,
      status: String(formData.get('status') || 'active') as SystemStatus,
      tags: String(formData.get('tags') || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    }

    onSubmit(payload)
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="card-title" style={{ marginBottom: '1rem' }}>
        {system ? 'Edit system' : 'Register a system'}
      </div>
      <div className="form-grid fg-2" style={{ marginBottom: '12px' }}>
        <div className="form-group">
          <label>Name</label>
          <input name="name" defaultValue={initialState.name} required />
        </div>
        <div className="form-group">
          <label>Owner</label>
          <input name="owner" defaultValue={initialState.owner} required />
        </div>
      </div>
      <div className="form-group" style={{ marginBottom: '12px' }}>
        <label>Description</label>
        <textarea name="description" rows={3} defaultValue={initialState.description} />
      </div>
      <div className="form-grid fg-2" style={{ marginBottom: '12px' }}>
        <div className="form-group">
          <label>Target URL</label>
          <input name="targetUrl" defaultValue={initialState.targetUrl} required />
        </div>
        <div className="form-group">
          <label>Tags</label>
          <input name="tags" defaultValue={initialState.tags.join(', ')} placeholder="ops, chat, legal" />
        </div>
      </div>
      <div className="form-grid fg-3" style={{ marginBottom: '12px' }}>
        <div className="form-group">
          <label>Deployment</label>
          <select name="deploymentType" defaultValue={initialState.deploymentType}>
            {deploymentTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Risk level</label>
          <select name="riskLevel" defaultValue={initialState.riskLevel}>
            {riskLevels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" defaultValue={initialState.status}>
            {systemStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button className="btn-primary" type="submit">
          {system ? 'Save changes' : 'Register system'}
        </button>
        <button className="btn-ghost" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
