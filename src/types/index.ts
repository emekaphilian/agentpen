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

export type AssurancePillar = 'Security' | 'Safety' | 'Reliability' | 'Fairness' | 'Domain'
export type EvaluationStatus = 'draft' | 'in_progress' | 'completed' | 'failed'

export interface EvaluationEvidence {
  id: string
  title: string
  description: string
  source: string
  recordedAt: string
}

export interface Recommendation {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
}

export interface AssuranceScore {
  overall: number
  security: number
  safety: number
  reliability: number
  fairness: number
  domain: number
}

export interface Evaluation {
  id: string
  name: string
  description: string
  aiSystemName: string
  aiSystemId: string
  modelVersion: string
  deploymentContext: string
  pillars: AssurancePillar[]
  status: EvaluationStatus
  summary: string
  assuranceScore: AssuranceScore
  evidence: EvaluationEvidence[]
  recommendations: Recommendation[]
  createdAt: string
  updatedAt: string
}

export interface EvaluationCreateInput {
  name: string
  description: string
  aiSystemName: string
  aiSystemId: string
  modelVersion: string
  deploymentContext: string
  pillars: AssurancePillar[]
}

export interface EvaluationSuite {
  id: string
  name: string
  description: string
  evaluations: Evaluation[]
  createdAt: string
  updatedAt: string
}
