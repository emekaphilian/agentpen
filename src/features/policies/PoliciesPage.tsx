import { useMemo, useState } from 'react'
import { Button, Card, MetricCard, StatusBadge, Table, TableCell, TableHeader, TableHeaderCell, TableRow } from '../../components/ui'

const overviewMetrics = [
  { label: 'Total Policies', value: '18', helpText: 'Governance and assurance rules across the tenant', accent: 'Tenant' },
  { label: 'Active Policies', value: '11', helpText: 'Policies currently in effect for evaluations', accent: 'Live' },
  { label: 'Frameworks Enabled', value: '5', helpText: 'Framework mappings currently in the policy library', accent: 'Enabled' },
  { label: 'Custom Controls', value: '24', helpText: 'Organization-defined controls and guardrails', accent: 'Custom' },
  { label: 'Policies Requiring Review', value: '3', helpText: 'Policies due for version review and approval', accent: 'Review' },
  { label: 'Recent Changes', value: '6', helpText: 'Policy updates submitted in the current reporting window', accent: 'Updated' }
]

const assurancePolicies = [
  {
    name: 'Enterprise Assurance Baseline',
    description: 'Core policy baseline for all production AI systems and deployment decisioning.',
    owner: 'Priya Chen',
    businessUnit: 'Compliance',
    scope: 'Global',
    status: 'Approved',
    version: 'v4.3',
    created: '2026-05-12',
    updated: '2026-08-02'
  },
  {
    name: 'Finance Deployment Guardrails',
    description: 'High-trust threshold policy for treasury, fraud, and customer finance workflows.',
    owner: 'Jordan Bell',
    businessUnit: 'Finance',
    scope: 'Finance',
    status: 'In Review',
    version: 'v2.1',
    created: '2026-06-18',
    updated: '2026-08-01'
  },
  {
    name: 'Healthcare Safety Controls',
    description: 'Safety-first controls for medical triage and patient-facing evaluation workflows.',
    owner: 'Michele Ford',
    businessUnit: 'Operations',
    scope: 'Healthcare',
    status: 'Draft',
    version: 'v1.7',
    created: '2026-07-04',
    updated: '2026-08-03'
  },
  {
    name: 'Security Policy Standard',
    description: 'Security assurance rules that determine exposure, criticality, and escalation handling.',
    owner: 'Ariana Holt',
    businessUnit: 'Security',
    scope: 'Security',
    status: 'Approved',
    version: 'v5.0',
    created: '2026-04-09',
    updated: '2026-07-29'
  }
]

const thresholds = [
  { key: 'Security', value: '85', unit: '%' },
  { key: 'Safety', value: '90', unit: '%' },
  { key: 'Reliability', value: '85', unit: '%' },
  { key: 'Fairness', value: '80', unit: '%' },
  { key: 'Domain Readiness', value: '85', unit: '%' },
  { key: 'Overall Assurance Score', value: '90', unit: '%' },
  { key: 'Evidence Confidence', value: '90', unit: '%' },
  { key: 'Maximum Critical Findings', value: '0', unit: 'findings' },
  { key: 'Maximum High Findings', value: '2', unit: 'findings' },
  { key: 'Minimum Test Coverage', value: '85', unit: '%' }
]

const frameworks = [
  { name: 'NIST AI RMF', coverage: 'Strong', enabledControls: '17', mappedPolicies: '4', complianceStatus: 'Aligned' },
  { name: 'ISO/IEC 42001', coverage: 'Moderate', enabledControls: '11', mappedPolicies: '3', complianceStatus: 'In Review' },
  { name: 'MITRE ATLAS', coverage: 'Strong', enabledControls: '14', mappedPolicies: '5', complianceStatus: 'Aligned' },
  { name: 'OWASP Top 10 for LLM Applications', coverage: 'Strong', enabledControls: '21', mappedPolicies: '6', complianceStatus: 'Aligned' },
  { name: 'EU AI Act', coverage: 'Moderate', enabledControls: '9', mappedPolicies: '4', complianceStatus: 'Monitoring' },
  { name: 'Custom Organization Frameworks', coverage: 'Custom', enabledControls: '12', mappedPolicies: '3', complianceStatus: 'Draft' }
]

const controls = [
  { id: 'AIC-01', title: 'Model Risk Registration', framework: 'NIST AI RMF', category: 'Governance', severity: 'High', mappedPolicies: '3', pillars: 'Security, Reliability' },
  { id: 'AIC-02', title: 'Human Oversight for High-Risk Decisions', framework: 'EU AI Act', category: 'Governance', severity: 'Critical', mappedPolicies: '2', pillars: 'Fairness, Domain Assurance' },
  { id: 'AIC-03', title: 'Evidence Chain Traceability', framework: 'ISO/IEC 42001', category: 'Evidence', severity: 'Medium', mappedPolicies: '4', pillars: 'Evidence, Reliability' },
  { id: 'AIC-04', title: 'Prompt Injection Defense Review', framework: 'MITRE ATLAS', category: 'Security', severity: 'Critical', mappedPolicies: '5', pillars: 'Security, Safety' },
  { id: 'AIC-05', title: 'LLM Safety Benchmark Gate', framework: 'OWASP Top 10 for LLM Applications', category: 'Safety', severity: 'High', mappedPolicies: '3', pillars: 'Safety, Domain Assurance' },
  { id: 'AIC-06', title: 'Fairness Regression Check', framework: 'Custom Organization Frameworks', category: 'Fairness', severity: 'Medium', mappedPolicies: '4', pillars: 'Fairness, Evidence' }
]

const versions = [
  { version: 'v4.3', editor: 'Priya Chen', date: '2026-08-02', summary: 'Refined assurance thresholds for reliability and domain readiness gates.', approvalStatus: 'Approved' },
  { version: 'v4.2', editor: 'Simon Cruz', date: '2026-07-18', summary: 'Updated evidence confidence and critical finding limits for high-risk systems.', approvalStatus: 'Approved' },
  { version: 'v4.1', editor: 'Lina Morales', date: '2026-07-01', summary: 'Introduced custom organization controls for finance and compliance governance.', approvalStatus: 'Approved' },
  { version: 'v4.0', editor: 'Darius Reid', date: '2026-06-07', summary: 'Re-baselined policy thresholds for production deployment readiness.', approvalStatus: 'In Review' }
]

const policyImpact = [
  { label: 'AI Systems affected', value: '19' },
  { label: 'Evaluations impacted', value: '42' },
  { label: 'Reports requiring regeneration', value: '8' },
  { label: 'Policies currently blocking deployment', value: '3' }
]

const customRules = [
  'Overall Assurance >= 90',
  'Security >= 85',
  'Safety >= 90',
  'Reliability >= 85',
  'Fairness >= 80',
  'Domain Readiness >= 85',
  'Critical Findings = 0',
  'Evidence Confidence >= 90%',
  'Deployment Allowed = TRUE'
]

const policyMappings = [
  { policy: 'Enterprise Assurance Baseline', security: 'Yes', safety: 'Yes', reliability: 'Yes', fairness: 'Yes', domain: 'Yes', evidence: 'Yes', reports: 'Yes', recommendations: 'Yes' },
  { policy: 'Finance Deployment Guardrails', security: 'Yes', safety: 'Yes', reliability: 'Yes', fairness: 'Yes', domain: 'No', evidence: 'Yes', reports: 'Yes', recommendations: 'Yes' },
  { policy: 'Healthcare Safety Controls', security: 'Yes', safety: 'Yes', reliability: 'No', fairness: 'Yes', domain: 'Yes', evidence: 'Yes', reports: 'No', recommendations: 'Yes' }
]

const approvalHistory = [
  { state: 'Draft', owner: 'Michele Ford', date: '2026-07-04', result: 'Received' },
  { state: 'In Review', owner: 'Priya Chen', date: '2026-07-12', result: 'Review completed' },
  { state: 'Approved', owner: 'Ariana Holt', date: '2026-07-28', result: 'Signed off' },
  { state: 'Deprecated', owner: 'Simon Cruz', date: '2026-08-01', result: 'Superseded by v4.3' }
]

function statusTone(status: string) {
  if (status === 'Approved' || status === 'Aligned' || status === 'Strong' || status === 'Active') return 'healthy'
  if (status === 'In Review' || status === 'Moderate' || status === 'Monitoring' || status === 'Review') return 'warning'
  if (status === 'Draft' || status === 'Custom' || status === 'Deprecated' || status === 'Archived') return 'offline'
  return 'at-risk'
}

export default function PoliciesPage() {
  const [query, setQuery] = useState('')

  const filteredControls = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return controls

    return controls.filter((control) => [control.id, control.title, control.framework, control.category, control.severity, control.pillars]
      .join(' ')
      .toLowerCase()
      .includes(normalized))
  }, [query])

  return (
    <div className="details-grid">
      <div className="full-width">
        <Card className="space-y-3">
          <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Governance Center</div>
          <div className="text-2xl font-semibold text-white">Policy & Framework Management</div>
          <div className="text-sm text-slate-300">Enterprise policy source of truth for assurance thresholding, framework mapping, governance sign-off, and deployment control evaluation.</div>
        </Card>
      </div>

      <div className="full-width">
        <div className="metrics">
          {overviewMetrics.map((item) => (
            <MetricCard key={item.label} label={item.label} value={item.value} helpText={item.helpText} accent={<span className="rounded-full border border-[rgba(148,163,184,0.16)] bg-slate-900/80 px-3 py-1 text-xs text-slate-200">{item.accent}</span>} />
          ))}
        </div>
      </div>

      <div className="full-width">
        <Card>
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-slate-400">Assurance policies</div>
          <Table>
            <TableHeader>
              <TableHeaderCell>Policy Name</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Owner</TableHeaderCell>
              <TableHeaderCell>Business Unit</TableHeaderCell>
              <TableHeaderCell>Scope</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Version</TableHeaderCell>
              <TableHeaderCell>Created</TableHeaderCell>
              <TableHeaderCell>Last Updated</TableHeaderCell>
            </TableHeader>
            <tbody>
              {assurancePolicies.map((policy) => (
                <TableRow key={policy.name}>
                  <TableCell>{policy.name}</TableCell>
                  <TableCell>{policy.description}</TableCell>
                  <TableCell>{policy.owner}</TableCell>
                  <TableCell>{policy.businessUnit}</TableCell>
                  <TableCell>{policy.scope}</TableCell>
                  <TableCell><StatusBadge status={statusTone(policy.status)}>{policy.status}</StatusBadge></TableCell>
                  <TableCell>{policy.version}</TableCell>
                  <TableCell>{policy.created}</TableCell>
                  <TableCell>{policy.updated}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>

      <div className="full-width">
        <Card>
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-slate-400">Deployment thresholds</div>
          <div className="grid gap-4 lg:grid-cols-3">
            {thresholds.map((threshold) => (
              <div key={threshold.key} className="rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">{threshold.key}</div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="text-2xl font-semibold text-white">{threshold.value}</div>
                  <div className="rounded-full border border-[rgba(148,163,184,0.16)] bg-slate-900/80 px-3 py-1 text-xs text-slate-200">{threshold.unit}</div>
                </div>
                <div className="mt-3">
                  <input className="w-full rounded-xl border border-[rgba(148,163,184,0.16)] bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none" value={threshold.value} readOnly />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="full-width">
        <Card>
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-slate-400">Framework library</div>
          <Table>
            <TableHeader>
              <TableHeaderCell>Framework</TableHeaderCell>
              <TableHeaderCell>Coverage</TableHeaderCell>
              <TableHeaderCell>Enabled Controls</TableHeaderCell>
              <TableHeaderCell>Mapped Policies</TableHeaderCell>
              <TableHeaderCell>Compliance Status</TableHeaderCell>
            </TableHeader>
            <tbody>
              {frameworks.map((framework) => (
                <TableRow key={framework.name}>
                  <TableCell>{framework.name}</TableCell>
                  <TableCell><StatusBadge status={statusTone(framework.coverage)}>{framework.coverage}</StatusBadge></TableCell>
                  <TableCell>{framework.enabledControls}</TableCell>
                  <TableCell>{framework.mappedPolicies}</TableCell>
                  <TableCell><StatusBadge status={statusTone(framework.complianceStatus)}>{framework.complianceStatus}</StatusBadge></TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>

      <div className="full-width">
        <Card>
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Control library</div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-xl border border-[rgba(148,163,184,0.16)] bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none lg:max-w-xs"
              placeholder="Search control catalogue"
            />
          </div>

          <Table>
            <TableHeader>
              <TableHeaderCell>Control ID</TableHeaderCell>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>Framework</TableHeaderCell>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Severity</TableHeaderCell>
              <TableHeaderCell>Mapped Policies</TableHeaderCell>
              <TableHeaderCell>Mapped Assurance Pillars</TableHeaderCell>
            </TableHeader>
            <tbody>
              {filteredControls.map((control) => (
                <TableRow key={control.id}>
                  <TableCell>{control.id}</TableCell>
                  <TableCell>{control.title}</TableCell>
                  <TableCell>{control.framework}</TableCell>
                  <TableCell>{control.category}</TableCell>
                  <TableCell><StatusBadge status={statusTone(control.severity)}>{control.severity}</StatusBadge></TableCell>
                  <TableCell>{control.mappedPolicies}</TableCell>
                  <TableCell>{control.pillars}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>

      <div className="full-width">
        <Card>
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-slate-400">Policy version history</div>
          <Table>
            <TableHeader>
              <TableHeaderCell>Version</TableHeaderCell>
              <TableHeaderCell>Editor</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Summary of Changes</TableHeaderCell>
              <TableHeaderCell>Approval Status</TableHeaderCell>
            </TableHeader>
            <tbody>
              {versions.map((item) => (
                <TableRow key={item.version}>
                  <TableCell>{item.version}</TableCell>
                  <TableCell>{item.editor}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.summary}</TableCell>
                  <TableCell><StatusBadge status={statusTone(item.approvalStatus)}>{item.approvalStatus}</StatusBadge></TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>

      <div className="full-width">
        <Card>
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-slate-400">Approval workflow</div>
          <Table>
            <TableHeader>
              <TableHeaderCell>Lifecycle State</TableHeaderCell>
              <TableHeaderCell>Owner</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Result</TableHeaderCell>
            </TableHeader>
            <tbody>
              {approvalHistory.map((item) => (
                <TableRow key={`${item.state}-${item.date}`}>
                  <TableCell>{item.state}</TableCell>
                  <TableCell>{item.owner}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.result}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>

      <div className="full-width">
        <div className="metrics">
          {policyImpact.map((item) => (
            <MetricCard key={item.label} label={item.label} value={item.value} helpText="Derived from the current governance posture" accent={<span className="rounded-full border border-[rgba(148,163,184,0.16)] bg-slate-900/80 px-3 py-1 text-xs text-slate-200">Impact</span>} />
          ))}
        </div>
      </div>

      <div className="full-width">
        <Card>
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-slate-400">Custom rules</div>
          <div className="grid gap-3 lg:grid-cols-2">
            {customRules.map((rule) => (
              <div key={rule} className="rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-4 text-sm text-slate-200">
                {rule}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="full-width">
        <Card>
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-slate-400">Framework mapping</div>
          <Table>
            <TableHeader>
              <TableHeaderCell>Policy</TableHeaderCell>
              <TableHeaderCell>Security Assurance</TableHeaderCell>
              <TableHeaderCell>Safety Assurance</TableHeaderCell>
              <TableHeaderCell>Reliability Assurance</TableHeaderCell>
              <TableHeaderCell>Fairness Assurance</TableHeaderCell>
              <TableHeaderCell>Domain Assurance</TableHeaderCell>
              <TableHeaderCell>Evidence</TableHeaderCell>
              <TableHeaderCell>Reports</TableHeaderCell>
              <TableHeaderCell>Recommendations</TableHeaderCell>
            </TableHeader>
            <tbody>
              {policyMappings.map((mapping) => (
                <TableRow key={mapping.policy}>
                  <TableCell>{mapping.policy}</TableCell>
                  <TableCell>{mapping.security}</TableCell>
                  <TableCell>{mapping.safety}</TableCell>
                  <TableCell>{mapping.reliability}</TableCell>
                  <TableCell>{mapping.fairness}</TableCell>
                  <TableCell>{mapping.domain}</TableCell>
                  <TableCell>{mapping.evidence}</TableCell>
                  <TableCell>{mapping.reports}</TableCell>
                  <TableCell>{mapping.recommendations}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>

      <div className="full-width">
        <Card>
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-slate-400">Policy actions</div>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="sm">Create policy</Button>
            <Button variant="secondary" size="sm">Approve draft</Button>
            <Button variant="secondary" size="sm">Review thresholds</Button>
            <Button variant="secondary" size="sm">Compare versions</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
