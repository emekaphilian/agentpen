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

export type AssetType = 'AI Models' | 'AI Agents' | 'REST APIs' | 'MCP Servers' | 'Tools' | 'Plugins' | 'Memory' | 'Vector Databases' | 'RAG Sources'
export type DiscoveryStatus = 'Discovered' | 'Registered' | 'Ready for Evaluation' | 'Evaluation Running' | 'Evaluation Complete'

export interface DiscoveryAsset {
  id: string
  name: string
  description: string
  assetType: AssetType
  provider: string
  version: string
  status: DiscoveryStatus
  lastSeen: string
  evaluationReady: boolean
  endpoint: string
  authenticationType: string
  connectedTools: string[]
  memoryEnabled: boolean
  ragEnabled: boolean
  evaluationStatus: DiscoveryStatus
}

export interface DiscoverySummary {
  aiSystems: number
  models: number
  agents: number
  apis: number
  mcpServers: number
  tools: number
  memoryStores: number
  ragSources: number
}

export type AssurancePillar = 'Security' | 'Safety' | 'Reliability' | 'Fairness' | 'Domain'

export type EvaluationProfile = 'Standard' | 'Red Team' | 'Compliance' | 'Production'
export type EvaluationStage = 'Initializing' | 'Preparing Environment' | 'Executing Tests' | 'Collecting Evidence' | 'Calculating Scores' | 'Building Report' | 'Completed' | 'Paused' | 'Failed' | 'Cancelled'

export interface EvaluationRuntimeOptions {
  timeoutMinutes: number
  maxConcurrency: number
  includeReasoningTrace: boolean
  captureEvidence: boolean
  notifyOnCompletion: boolean
}

export interface EvaluationProgress {
  percentage: number
  currentStage: EvaluationStage
  completedStages: EvaluationStage[]
  activeTests: string[]
  logs: string[]
}

export interface EvaluationConfiguration {
  aiSystemId: string
  aiSystemName: string
  model: string
  modelVersion: string
  profile: EvaluationProfile
  pillars: AssurancePillar[]
  testSuites: string[]
  runtimeOptions: EvaluationRuntimeOptions
}

export interface EvaluationSummary {
  totalEvaluations: number
  runningEvaluations: number
  completedEvaluations: number
  failedEvaluations: number
  averageAssuranceScore: number
  averageDurationMinutes: number
}

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
  Cancelled = 'Cancelled',
  Paused = 'Paused'
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
export type EvidenceConfidenceLevel = 'low' | 'medium' | 'high'

export interface EvidenceArtifact {
  id: string
  evaluationId: string
  title: string
  description: string
  assurancePillar: AssurancePillar
  severity: EvidenceSeverity
  confidence: EvidenceConfidenceLevel
  timestamp: string
  metadata: Record<string, string | number | boolean | null>
}

export interface EvidenceMetadata {
  evaluator: string
  timestamp: string
  model: string
  version: string
  deploymentContext: string
  runtime: string
}

export interface EvidenceTimelineEvent {
  id: string
  title: string
  description: string
  timestamp: string
  testId: string
}

export interface EvidenceRecommendation {
  id: string
  priority: 'low' | 'medium' | 'high'
  category: string
  recommendation: string
  expectedImprovement: string
}

export interface EvidenceConfidenceSummary {
  confidence: number
  dataCompleteness: number
  testCoverage: number
  evidenceQuality: number
  reproducibility: number
}

export interface EvidenceExport {
  id: string
  format: 'json' | 'pdf'
  status: 'exported' | 'downloaded'
}

export interface EvidencePackage {
  id: string
  evaluationId: string
  targetSystem: string
  model: string
  version: string
  testSuite: string
  evaluationDate: string
  confidence: number
  assuranceStatus: string
  overallScore: number
  signed: boolean
  pendingReview: boolean
  artifacts: EvidenceArtifact[]
  timeline: EvidenceTimelineEvent[]
  metadata: EvidenceMetadata
  confidenceSummary: EvidenceConfidenceSummary
  recommendations: EvidenceRecommendation[]
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
  relatedPillar?: AssurancePillar
  suggestedAction?: string
}

export interface DeploymentDecision {
  label: 'Approved' | 'Approved with Monitoring' | 'Needs Remediation' | 'High Risk' | 'Do Not Deploy'
  reason: string
}

export interface StandardsMapping {
  framework: string
  mapping: string
}

export interface RiskMatrix {
  likelihood: string
  impact: string
  overallPosition: string
}

export interface TrendAnalysis {
  pillar: AssurancePillar
  previousScore: number
  currentScore: number
  change: number
  direction: 'up' | 'down' | 'stable'
  summary: string
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
  confidence: number
  deploymentDecision: DeploymentDecision
  categories: AssuranceCategory[]
  recommendations: Recommendation[]
  standardsMappings: StandardsMapping[]
  riskMatrix: RiskMatrix
  trendAnalysis: TrendAnalysis[]
}

export interface EvaluationMetadata {
  evaluationId: string
  aiSystem: string
  modelVersion: string
  deploymentContext: string
  generatedAt: string
}

export interface ExecutiveSummary {
  headline: string
  overview: string
  highlights: string[]
}

export interface EvidenceSummary {
  totalArtifacts: number
  highSeverityCount: number
  averageConfidence: number
  coverage: number
}

export interface Finding {
  id: string
  title: string
  summary: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  pillar: AssurancePillar
}

export interface FrameworkMapping {
  framework: string
  mapping: string
}

export interface AssuranceReport {
  id: string
  evaluationId: string
  metadata: EvaluationMetadata
  executiveSummary: ExecutiveSummary
  pillars: Record<AssurancePillar, AssuranceCategory>
  overallScore: number
  riskLevel: RiskLevel
  evidenceSummary: EvidenceSummary
  findings: Finding[]
  recommendations: Recommendation[]
  frameworkMappings: FrameworkMapping[]
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
  model: string
  deploymentContext: string
  pillars: AssurancePillar[]
  status: EvaluationStatus
  stage: EvaluationStage
  summary: string
  assuranceScore: AssuranceScore
  evidence: EvaluationEvidence[]
  recommendations: Recommendation[]
  lifecycle?: EvaluationLifecycleState
  progress: EvaluationProgress
  configuration: EvaluationConfiguration
  testSuites: string[]
  durationMinutes: number
  startedAt: string
  completedAt: string | null
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
  model?: string
  profile?: EvaluationProfile
  testSuites?: string[]
  runtimeOptions?: EvaluationRuntimeOptions
}

export interface EvaluationSuite {
  id: string
  name: string
  description: string
  evaluations: Evaluation[]
  createdAt: string
  updatedAt: string
}
