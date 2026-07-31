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
