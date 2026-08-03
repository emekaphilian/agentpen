import { useMemo, useState } from 'react'
import { Button, Card, Drawer, MetricCard, StatusBadge, Table, TableCell, TableHeader, TableHeaderCell, TableRow } from '../../components/ui'

const inventoryMetrics = [
  { label: 'Total AI Systems', value: '24', helpText: 'AI assets tracked across the tenant', accent: 'Inventory' },
  { label: 'Production Systems', value: '11', helpText: 'Systems currently serving production workloads', accent: 'Live' },
  { label: 'High Risk Systems', value: '4', helpText: 'Systems with elevated assurance risk exposure', accent: 'Escalated' },
  { label: 'Pending Evaluations', value: '7', helpText: 'Systems awaiting analysis or re-evaluation', accent: 'Queued' },
  { label: 'Expired Assurance Reports', value: '2', helpText: 'Expired governance reports requiring refresh', accent: 'Review' }
]

const inventorySystems = [
  {
    id: 'sys-001',
    name: 'Risk Copilot',
    organization: 'Apex Intelligence',
    owner: 'Priya Chen',
    modelProvider: 'OpenAI',
    modelVersion: 'GPT-4.1',
    deploymentEnvironment: 'Production',
    riskLevel: 'high',
    assuranceStatus: 'Needs Remediation',
    lastEvaluation: '2026-08-01',
    nextReviewDate: '2026-08-21',
    description: 'Enterprise risk guidance model for policy, deployment, and control triage.',
    businessPurpose: 'Supports governance and triage decisions across enterprise AI deployment readiness.',
    criticality: 'Critical',
    dataClassification: 'Restricted',
    aiCategory: 'Agentic Copilot',
    deploymentType: 'Cloud',
    model: 'GPT-4.1',
    apiEndpoint: 'https://api.apexintel.example/risk-copilot',
    framework: 'Azure OpenAI',
    hosting: 'Azure West Europe',
    tools: ['Policy Retrieval', 'Evidence Graph'],
    ragUsage: 'Enabled',
    memory: 'Session memory + vector memory',
    mcpServers: ['Governance MCP', 'Evidence MCP'],
    connectedPlugins: ['Compliance Plugin', 'Decision Trace'],
    registration: '2026-04-10',
    discoveryHistory: ['Discovered on 2026-04-09', 'Asset fingerprint recorded on 2026-04-10'],
    evaluationHistory: ['Security Evaluation', 'Safety Evaluation', 'Reliability Evaluation'],
    evidencePackages: ['Finance Evidence Pack', 'Policy Control Pack'],
    assuranceReports: ['Quarterly Assurance Report'],
    governanceDecisions: ['Approved with monitoring'],
    linkedEvaluations: ['EV-102', 'EV-114'],
    evidencePackagesLinked: ['PKG-11', 'PKG-12'],
    assuranceReportsLinked: ['RPT-22'],
    policies: ['Enterprise Assurance Baseline', 'Security Policy Standard'],
    frameworkMappings: ['NIST AI RMF', 'MITRE ATLAS'],
    organizations: ['Apex Intelligence'],
    projects: ['Enterprise Risk Copilot'],
    compliance: { nist: 'Aligned', iso: 'Aligned', owasp: 'Monitoring', mitre: 'Aligned', eu: 'Monitoring' },
    riskProfile: { overallRisk: 'High', security: '85', safety: '88', reliability: '82', fairness: '79', domainReadiness: '84' }
  },
  {
    id: 'sys-002',
    name: 'Treasury Copilot',
    organization: 'Apex Intelligence',
    owner: 'Jordan Bell',
    modelProvider: 'Anthropic',
    modelVersion: 'Claude 3.5 Sonnet',
    deploymentEnvironment: 'Production',
    riskLevel: 'critical',
    assuranceStatus: 'High Risk',
    lastEvaluation: '2026-07-27',
    nextReviewDate: '2026-08-18',
    description: 'Finance-oriented decision support model for treasury and risk review workflows.',
    businessPurpose: 'Accelerates treasury forecasting, oversight, and decision rationales across capital operations.',
    criticality: 'Critical',
    dataClassification: 'Confidential',
    aiCategory: 'LLM Assistant',
    deploymentType: 'Hybrid',
    model: 'Claude 3.5 Sonnet',
    apiEndpoint: 'https://api.apexintel.example/treasury-copilot',
    framework: 'Anthropic API',
    hosting: 'AWS us-east-1',
    tools: ['Treasury Calculator', 'Risk Signals'],
    ragUsage: 'Enabled',
    memory: 'Vector memory for transactional summaries',
    mcpServers: ['Finance MCP', 'Control MCP'],
    connectedPlugins: ['Treasury Plugin'],
    registration: '2026-03-16',
    discoveryHistory: ['Discovered on 2026-03-12', 'Registry enriched on 2026-03-16'],
    evaluationHistory: ['Finance Evaluation', 'Fairness Evaluation'],
    evidencePackages: ['Treasury Risk Pack'],
    assuranceReports: ['Treasury Governance Report'],
    governanceDecisions: ['Needs remediation'],
    linkedEvaluations: ['EV-078', 'EV-091'],
    evidencePackagesLinked: ['PKG-09'],
    assuranceReportsLinked: ['RPT-11'],
    policies: ['Finance Deployment Guardrails'],
    frameworkMappings: ['NIST AI RMF', 'EU AI Act'],
    organizations: ['Apex Intelligence'],
    projects: ['Treasury Assurance'],
    compliance: { nist: 'Aligned', iso: 'In Review', owasp: 'Aligned', mitre: 'Monitoring', eu: 'In Review' },
    riskProfile: { overallRisk: 'Critical', security: '90', safety: '88', reliability: '84', fairness: '81', domainReadiness: '86' }
  },
  {
    id: 'sys-003',
    name: 'Contract Review Agent',
    organization: 'Apex Intelligence',
    owner: 'Michele Ford',
    modelProvider: 'Azure OpenAI',
    modelVersion: 'GPT-4o',
    deploymentEnvironment: 'Sandbox',
    riskLevel: 'medium',
    assuranceStatus: 'In Assessment',
    lastEvaluation: '2026-08-02',
    nextReviewDate: '2026-08-30',
    description: 'Legal document triage and contract review workflow for enterprise compliance.',
    businessPurpose: 'Automates contract clause extraction, policy checks, and legal workflow handoff.',
    criticality: 'High',
    dataClassification: 'Confidential',
    aiCategory: 'LLM Assistant',
    deploymentType: 'Cloud',
    model: 'GPT-4o',
    apiEndpoint: 'https://api.apexintel.example/contract-review',
    framework: 'Azure OpenAI',
    hosting: 'Azure Central US',
    tools: ['Clause Extractor', 'Policy Match'],
    ragUsage: 'Disabled',
    memory: 'Manual context injection',
    mcpServers: ['Legal MCP'],
    connectedPlugins: ['Legal Review Plugin'],
    registration: '2026-05-20',
    discoveryHistory: ['Discovered on 2026-05-19'],
    evaluationHistory: ['Compliance Evaluation'],
    evidencePackages: ['Contract Evidence Pack'],
    assuranceReports: ['Compliance Assurance Summary'],
    governanceDecisions: ['Ready for review'],
    linkedEvaluations: ['EV-134'],
    evidencePackagesLinked: ['PKG-18'],
    assuranceReportsLinked: ['RPT-18'],
    policies: ['Healthcare Safety Controls'],
    frameworkMappings: ['ISO/IEC 42001', 'EU AI Act'],
    organizations: ['Apex Intelligence'],
    projects: ['Data Privacy Review'],
    compliance: { nist: 'In Review', iso: 'Aligned', owasp: 'Monitoring', mitre: 'In Review', eu: 'Aligned' },
    riskProfile: { overallRisk: 'Medium', security: '76', safety: '79', reliability: '83', fairness: '76', domainReadiness: '81' }
  }
]

const riskToneMap: Record<string, 'healthy' | 'warning' | 'at-risk' | 'offline'> = {
  informational: 'healthy',
  low: 'healthy',
  medium: 'warning',
  high: 'at-risk',
  critical: 'at-risk'
}

const assuranceToneMap: Record<string, 'healthy' | 'warning' | 'at-risk' | 'offline'> = {
  'Needs Remediation': 'at-risk',
  'High Risk': 'at-risk',
  'In Assessment': 'warning',
  'Ready for Review': 'healthy',
  'Approved': 'healthy'
}

function statusWeight(value: string) {
  return value.toLowerCase().includes('critical') || value.toLowerCase().includes('high') ? 'at-risk' : value.toLowerCase().includes('medium') ? 'warning' : 'healthy'
}

export default function SystemsPage() {
  const [search, setSearch] = useState('')
  const [selectedSystem, setSelectedSystem] = useState<(typeof inventorySystems)[number] | null>(null)

  const filteredSystems = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) return inventorySystems

    return inventorySystems.filter((system) =>
      [
        system.name,
        system.organization,
        system.owner,
        system.modelProvider,
        system.modelVersion,
        system.deploymentEnvironment,
        system.riskLevel,
        system.assuranceStatus,
        system.lastEvaluation,
        system.nextReviewDate
      ].join(' ').toLowerCase().includes(normalized)
    )
  }, [search])

  return (
    <div className="details-grid">
      <div className="full-width">
        <Card className="space-y-3">
          <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">AI Systems Inventory</div>
          <div className="text-2xl font-semibold text-white">AgentPen AI Systems Registry</div>
          <div className="text-sm text-slate-300">A complete inventory of AI systems known to AgentPen, including governance readiness, risk posture, linked evaluations, and evidence-backed assurance state.</div>
        </Card>
      </div>

      <div className="full-width">
        <div className="metrics">
          {inventoryMetrics.map((item) => (
            <MetricCard key={item.label} label={item.label} value={item.value} helpText={item.helpText} accent={<span className="rounded-full border border-[rgba(148,163,184,0.16)] bg-slate-900/80 px-3 py-1 text-xs text-slate-200">{item.accent}</span>} />
          ))}
        </div>
      </div>

      <div className="full-width">
        <Card>
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Searchable systems inventory</div>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm">Register System</Button>
              <Button variant="secondary" size="sm">Discover Metadata</Button>
              <Button variant="secondary" size="sm">Start Evaluation</Button>
              <Button variant="secondary" size="sm">View Evidence</Button>
              <Button variant="secondary" size="sm">Generate Report</Button>
              <Button variant="secondary" size="sm">Export Inventory</Button>
            </div>
          </div>

          <div className="mb-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-[rgba(148,163,184,0.16)] bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none lg:max-w-xs"
              placeholder="Search inventory"
            />
          </div>

          <Table>
            <TableHeader>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Organization</TableHeaderCell>
              <TableHeaderCell>Owner</TableHeaderCell>
              <TableHeaderCell>Model Provider</TableHeaderCell>
              <TableHeaderCell>Model Version</TableHeaderCell>
              <TableHeaderCell>Deployment Environment</TableHeaderCell>
              <TableHeaderCell>Risk Level</TableHeaderCell>
              <TableHeaderCell>Assurance Status</TableHeaderCell>
              <TableHeaderCell>Last Evaluation</TableHeaderCell>
              <TableHeaderCell>Next Review Date</TableHeaderCell>
            </TableHeader>
            <tbody>
              {filteredSystems.map((system) => (
                <TableRow key={system.id}>
                  <TableCell><button type="button" className="text-left text-slate-100 hover:text-primary" onClick={() => setSelectedSystem(system)}>{system.name}</button></TableCell>
                  <TableCell>{system.organization}</TableCell>
                  <TableCell>{system.owner}</TableCell>
                  <TableCell>{system.modelProvider}</TableCell>
                  <TableCell>{system.modelVersion}</TableCell>
                  <TableCell>{system.deploymentEnvironment}</TableCell>
                  <TableCell><StatusBadge status={riskToneMap[system.riskLevel] ?? 'healthy'}>{system.riskLevel}</StatusBadge></TableCell>
                  <TableCell><StatusBadge status={assuranceToneMap[system.assuranceStatus] ?? 'healthy'}>{system.assuranceStatus}</StatusBadge></TableCell>
                  <TableCell>{system.lastEvaluation}</TableCell>
                  <TableCell>{system.nextReviewDate}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>

      <Drawer open={Boolean(selectedSystem)} onClose={() => setSelectedSystem(null)} title={selectedSystem?.name ?? 'System details'}>
        {selectedSystem ? (
          <div className="space-y-5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">System Profile</div>
              <div className="mt-3 grid gap-3">
                <div><div className="text-xs text-slate-400">Description</div><div className="text-sm text-slate-100">{selectedSystem.description}</div></div>
                <div><div className="text-xs text-slate-400">Business purpose</div><div className="text-sm text-slate-100">{selectedSystem.businessPurpose}</div></div>
                <div><div className="text-xs text-slate-400">Criticality</div><div className="text-sm text-slate-100">{selectedSystem.criticality}</div></div>
                <div><div className="text-xs text-slate-400">Data classification</div><div className="text-sm text-slate-100">{selectedSystem.dataClassification}</div></div>
                <div><div className="text-xs text-slate-400">AI category</div><div className="text-sm text-slate-100">{selectedSystem.aiCategory}</div></div>
                <div><div className="text-xs text-slate-400">Deployment type</div><div className="text-sm text-slate-100">{selectedSystem.deploymentType}</div></div>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Technical Information</div>
              <div className="mt-3 grid gap-3">
                <div><div className="text-xs text-slate-400">Model</div><div className="text-sm text-slate-100">{selectedSystem.model}</div></div>
                <div><div className="text-xs text-slate-400">API endpoint</div><div className="text-sm text-slate-100">{selectedSystem.apiEndpoint}</div></div>
                <div><div className="text-xs text-slate-400">Framework</div><div className="text-sm text-slate-100">{selectedSystem.framework}</div></div>
                <div><div className="text-xs text-slate-400">Hosting</div><div className="text-sm text-slate-100">{selectedSystem.hosting}</div></div>
                <div><div className="text-xs text-slate-400">Tools</div><div className="text-sm text-slate-100">{selectedSystem.tools.join(', ')}</div></div>
                <div><div className="text-xs text-slate-400">RAG usage</div><div className="text-sm text-slate-100">{selectedSystem.ragUsage}</div></div>
                <div><div className="text-xs text-slate-400">Memory</div><div className="text-sm text-slate-100">{selectedSystem.memory}</div></div>
                <div><div className="text-xs text-slate-400">MCP servers</div><div className="text-sm text-slate-100">{selectedSystem.mcpServers.join(', ')}</div></div>
                <div><div className="text-xs text-slate-400">Connected plugins</div><div className="text-sm text-slate-100">{selectedSystem.connectedPlugins.join(', ')}</div></div>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Lifecycle</div>
              <div className="mt-3 grid gap-3">
                <div><div className="text-xs text-slate-400">Registration</div><div className="text-sm text-slate-100">{selectedSystem.registration}</div></div>
                <div><div className="text-xs text-slate-400">Discovery history</div><div className="text-sm text-slate-100">{selectedSystem.discoveryHistory.join(' · ')}</div></div>
                <div><div className="text-xs text-slate-400">Evaluation history</div><div className="text-sm text-slate-100">{selectedSystem.evaluationHistory.join(' · ')}</div></div>
                <div><div className="text-xs text-slate-400">Evidence packages</div><div className="text-sm text-slate-100">{selectedSystem.evidencePackages.join(' · ')}</div></div>
                <div><div className="text-xs text-slate-400">Assurance reports</div><div className="text-sm text-slate-100">{selectedSystem.assuranceReports.join(' · ')}</div></div>
                <div><div className="text-xs text-slate-400">Governance decisions</div><div className="text-sm text-slate-100">{selectedSystem.governanceDecisions.join(' · ')}</div></div>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Relationships</div>
              <div className="mt-3 grid gap-3">
                <div><div className="text-xs text-slate-400">Linked evaluations</div><div className="text-sm text-slate-100">{selectedSystem.linkedEvaluations.join(', ')}</div></div>
                <div><div className="text-xs text-slate-400">Evidence packages</div><div className="text-sm text-slate-100">{selectedSystem.evidencePackagesLinked.join(', ')}</div></div>
                <div><div className="text-xs text-slate-400">Assurance reports</div><div className="text-sm text-slate-100">{selectedSystem.assuranceReportsLinked.join(', ')}</div></div>
                <div><div className="text-xs text-slate-400">Policies</div><div className="text-sm text-slate-100">{selectedSystem.policies.join(', ')}</div></div>
                <div><div className="text-xs text-slate-400">Framework mappings</div><div className="text-sm text-slate-100">{selectedSystem.frameworkMappings.join(', ')}</div></div>
                <div><div className="text-xs text-slate-400">Organizations</div><div className="text-sm text-slate-100">{selectedSystem.organizations.join(', ')}</div></div>
                <div><div className="text-xs text-slate-400">Projects</div><div className="text-sm text-slate-100">{selectedSystem.projects.join(', ')}</div></div>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Compliance</div>
              <div className="mt-3 grid gap-3">
                <div><div className="text-xs text-slate-400">NIST AI RMF</div><div className="text-sm text-slate-100">{selectedSystem.compliance.nist}</div></div>
                <div><div className="text-xs text-slate-400">ISO 42001</div><div className="text-sm text-slate-100">{selectedSystem.compliance.iso}</div></div>
                <div><div className="text-xs text-slate-400">OWASP LLM</div><div className="text-sm text-slate-100">{selectedSystem.compliance.owasp}</div></div>
                <div><div className="text-xs text-slate-400">MITRE ATLAS</div><div className="text-sm text-slate-100">{selectedSystem.compliance.mitre}</div></div>
                <div><div className="text-xs text-slate-400">EU AI Act readiness</div><div className="text-sm text-slate-100">{selectedSystem.compliance.eu}</div></div>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Risk Profile</div>
              <div className="mt-3 grid gap-3">
                <div><div className="text-xs text-slate-400">Overall Risk</div><div className="text-sm text-slate-100">{selectedSystem.riskProfile.overallRisk}</div></div>
                <div><div className="text-xs text-slate-400">Security</div><div className="text-sm text-slate-100">{selectedSystem.riskProfile.security}</div></div>
                <div><div className="text-xs text-slate-400">Safety</div><div className="text-sm text-slate-100">{selectedSystem.riskProfile.safety}</div></div>
                <div><div className="text-xs text-slate-400">Reliability</div><div className="text-sm text-slate-100">{selectedSystem.riskProfile.reliability}</div></div>
                <div><div className="text-xs text-slate-400">Fairness</div><div className="text-sm text-slate-100">{selectedSystem.riskProfile.fairness}</div></div>
                <div><div className="text-xs text-slate-400">Domain Readiness</div><div className="text-sm text-slate-100">{selectedSystem.riskProfile.domainReadiness}</div></div>
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  )
}
