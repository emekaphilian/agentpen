export interface SystemFinding {
  id: string
  title: string
  description: string
  severity: string
}

export interface SystemSummary {
  id: string
  name: string
  target_url: string
  status: string
  risk_score: number
  finding_count: number
}

export interface SystemDetails extends SystemSummary {
  findings: SystemFinding[]
}

export type DeploymentType = 'cloud' | 'edge' | 'on-prem' | 'hybrid'
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type SystemStatus = 'active' | 'maintenance' | 'draft' | 'archived'

export interface AISystem {
  id: string
  name: string
  description: string
  owner: string
  targetUrl: string
  deploymentType: DeploymentType
  riskLevel: RiskLevel
  status: SystemStatus
  tags: string[]
  createdAt: string
  updatedAt: string
}
