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

export enum EvaluationStatus {
  Draft = 'Draft',
  Queued = 'Queued',
  Initializing = 'Initializing',
  Running = 'Running',
  CollectingEvidence = 'CollectingEvidence',
  CalculatingScores = 'CalculatingScores',
  GeneratingReport = 'GeneratingReport',
  Completed = 'Completed',
  Failed = 'Failed',
  Cancelled = 'Cancelled'
}

export interface EvaluationLifecycleStep {
  key: EvaluationStatus
  title: string
  description: string
  completed: boolean
}

export interface EvaluationLifecycleState {
  currentStatus: EvaluationStatus
  progress: number
  steps: EvaluationLifecycleStep[]
  startedAt: string | null
  updatedAt: string
  completedAt: string | null
}

export type EvidenceCategory = 'Finding' | 'Control' | 'Observation' | 'TestResult'
export type EvidenceSeverity = 'low' | 'medium' | 'high' | 'critical'
export type EvidenceConfidence = 'low' | 'medium' | 'high'

export interface EvidenceArtifact {
  id: string
  evaluationId: string
  title: string
  description: string
  assurancePillar: AssurancePillar
  severity: EvidenceSeverity
  confidence: EvidenceConfidence
  timestamp: string
  metadata: Record<string, string | number | boolean | null>
}

export interface Evidence extends EvidenceArtifact {
  category: EvidenceCategory
  recommendations: Recommendation[]
}

export interface Recommendation {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
}

export type RiskLevel = 'informational' | 'low' | 'medium' | 'high' | 'critical'

export interface ScoreBreakdown {
  rawScore: number
  weightedScore: number
  confidence: number
  riskLevel: RiskLevel
  trend: 'up' | 'down' | 'stable'
}

export interface AssuranceCategory extends ScoreBreakdown {
  name: AssurancePillar
}

export interface AssuranceResult {
  id: string
  evaluationId: string
  overallScore: number
  riskLevel: RiskLevel
  summary: string
  categories: AssuranceCategory[]
  recommendations: Recommendation[]
}

export interface EvaluationEvidence {
  id: string
  title: string
  description: string
  source: string
  recordedAt: string
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
  lifecycle?: EvaluationLifecycleState
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
