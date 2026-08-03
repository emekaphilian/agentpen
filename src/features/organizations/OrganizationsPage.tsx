import { Card, MetricCard, StatusBadge, Table, TableCell, TableHeader, TableHeaderCell, TableRow } from '../../components/ui'

const overviewMetrics = [
  { label: 'Organization Name', value: 'Apex Intelligence', helpText: 'Enterprise AI Assurance tenant', accent: 'Enterprise' },
  { label: 'Industry', value: 'Financial Services', helpText: 'Regulated operating context', accent: 'FSI' },
  { label: 'Organization ID', value: 'ORG-28471', helpText: 'Primary multi-tenant tenant identifier', accent: 'ID' },
  { label: 'Subscription Plan', value: 'Enterprise Plus', helpText: 'Advanced assurance, governance, and reporting', accent: 'Active' },
  { label: 'Users', value: '128', helpText: 'Active enterprise seats across global teams', accent: '8 teams' },
  { label: 'Business Units', value: '6', helpText: 'Aligned operating departments', accent: 'Global' },
  { label: 'Projects', value: '12', helpText: 'Portfolio projects with active evidence chains', accent: 'Live' },
  { label: 'AI Systems', value: '19', helpText: 'Production, sandbox, and review systems', accent: 'Assured' },
  { label: 'Evaluations', value: '42', helpText: 'Ongoing and completed assurance workflows', accent: 'Run' },
  { label: 'Reports', value: '28', helpText: 'Published and review-ready governance reports', accent: 'Board' },
  { label: 'Overall Assurance', value: '87%', helpText: 'Portfolio confidence across policy, safety, and evidence', accent: 'Strong' }
]

const businessUnits = [
  { department: 'Engineering', systems: 'Risk Copilot, Ops Model, Code Reviewer', owner: 'S. Ortiz', status: 'healthy' },
  { department: 'Security', systems: 'Threat Monitor, Policy Evaluator', owner: 'A. Hsu', status: 'healthy' },
  { department: 'Compliance', systems: 'Fairness Gate, Regulatory AI Watch', owner: 'M. Nwosu', status: 'warning' },
  { department: 'Legal', systems: 'Contract Review Agent', owner: 'R. Patel', status: 'healthy' },
  { department: 'Finance', systems: 'Treasury Copilot, Fraud Analyzer', owner: 'J. Brown', status: 'at-risk' },
  { department: 'Operations', systems: 'Workflow Orchestrator', owner: 'T. Dhar', status: 'healthy' }
]

const users = [
  { name: 'Ariana Holt', email: 'ariana.holt@apexintel.com', role: 'Platform Owner', department: 'Executive', status: 'Active', lastActive: '2 min ago' },
  { name: 'Simon Cruz', email: 'simon.cruz@apexintel.com', role: 'Organization Admin', department: 'Security', status: 'Active', lastActive: '11 min ago' },
  { name: 'Priya Chen', email: 'priya.chen@apexintel.com', role: 'AI Governance Lead', department: 'Compliance', status: 'Active', lastActive: '16 min ago' },
  { name: 'Darius Reid', email: 'darius.reid@apexintel.com', role: 'Security Analyst', department: 'Security', status: 'Active', lastActive: '28 min ago' },
  { name: 'Lina Morales', email: 'lina.morales@apexintel.com', role: 'Assurance Analyst', department: 'Engineering', status: 'Active', lastActive: '36 min ago' },
  { name: 'Henri Poynter', email: 'henri.poynter@apexintel.com', role: 'Auditor', department: 'Internal Audit', status: 'Pending', lastActive: '1 day ago' },
  { name: 'Nora Gates', email: 'nora.gates@apexintel.com', role: 'Executive Viewer', department: 'Executive', status: 'Active', lastActive: '5 min ago' },
  { name: 'Marcus Rowe', email: 'marcus.rowe@apexintel.com', role: 'Viewer', department: 'Operations', status: 'Inactive', lastActive: '7 days ago' }
]

const rbacRoles = [
  { role: 'Platform Owner', permissions: 'Create organizations, assign admins, manage billing, full governance access' },
  { role: 'Organization Admin', permissions: 'Manage users, teams, projects, policies, and settings' },
  { role: 'AI Governance Lead', permissions: 'Approve policies, set control baselines, review evidence and reports' },
  { role: 'Security Analyst', permissions: 'Review evaluations, investigate system risk, manage escalations' },
  { role: 'Assurance Analyst', permissions: 'Run evaluations, triage evidence, publish assurance recommendations' },
  { role: 'Auditor', permissions: 'Read audit log, verify evidence chains, review compliance posture' },
  { role: 'Executive Viewer', permissions: 'Read reports, dashboards, high-level assurance status and actions' },
  { role: 'Viewer', permissions: 'Read project visibility and shared governance artifacts' }
]

const projects = [
  {
    name: 'Enterprise Risk Copilot',
    description: 'Global AI risk analysis workflow with policy, evidence, and deployment controls.',
    systems: ['Risk Copilot', 'Policy Evaluator'],
    evaluations: '12 active',
    reports: '5 published',
    recommendations: '3 urgent' 
  },
  {
    name: 'Treasury Assurance',
    description: 'Cross-border finance operations support with fairness and control validation.',
    systems: ['Treasury Copilot', 'Fraud Analyzer'],
    evaluations: '8 active',
    reports: '4 published',
    recommendations: '2 urgent'
  },
  {
    name: 'Data Privacy Review',
    description: 'Legal and compliance review flows for AI-powered contract and document triage.',
    systems: ['Contract Review Agent', 'Regulatory AI Watch'],
    evaluations: '6 active',
    reports: '3 published',
    recommendations: '1 urgent'
  }
]

const teamActivity = [
  { label: 'Recent Evaluations', value: '18', detail: 'Assurance workflows launched this week' },
  { label: 'Reports Published', value: '9', detail: 'Board and governance artifacts released' },
  { label: 'Evidence Reviewed', value: '37', detail: 'Evidence artifacts examined by analysts' },
  { label: 'Deployment Decisions', value: '6', detail: 'Approved with governance controls' },
  { label: 'Policy Updates', value: '4', detail: 'Controls and standards revised in the tenant' }
]

const auditLog = [
  { timestamp: '2026-08-03 08:15 UTC', user: 'Ariana Holt', action: 'Created project', target: 'Enterprise Risk Copilot', result: 'Succeeded' },
  { timestamp: '2026-08-03 07:48 UTC', user: 'Simon Cruz', action: 'Updated policy', target: 'Data Handling Policy', result: 'Succeeded' },
  { timestamp: '2026-08-03 06:33 UTC', user: 'Priya Chen', action: 'Reviewed evidence', target: 'Fairness Gate Pack', result: 'Approved' },
  { timestamp: '2026-08-03 05:12 UTC', user: 'Lina Morales', action: 'Published report', target: 'Finance Governance Report', result: 'Published' },
  { timestamp: '2026-08-02 22:03 UTC', user: 'Darius Reid', action: 'Escalated finding', target: 'Treasury Copilot', result: 'Queued for review' }
]

const settings = [
  { label: 'Branding', value: 'Apex Intelligence corporate theme with secure dark tenant shell' },
  { label: 'Regions', value: 'US-East, EU-West, APAC-Singapore' },
  { label: 'Retention', value: '180-day evidence retention with board-ready archive window' },
  { label: 'Evidence Policies', value: 'Qualification, lineage, and attestation rules enforced per project' },
  { label: 'Notification Settings', value: 'Governance tickets, policy updates, and deployment exceptions' },
  { label: 'SSO', value: 'Entra ID and Okta SAML federation enabled' },
  { label: 'API Keys', value: '3 active service principals and 2 restricted partner keys' }
]

function getStatusTone(status: string) {
  if (status === 'Active' || status === 'healthy') return 'healthy'
  if (status === 'Pending' || status === 'warning') return 'warning'
  if (status === 'Inactive' || status === 'at-risk') return 'at-risk'
  return 'offline'
}

export default function OrganizationsPage() {
  return (
    <div className="details-grid">
      <div className="full-width">
        <Card className="space-y-3">
          <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Enterprise Organization Workspace</div>
          <div className="text-2xl font-semibold text-white">Apex Intelligence</div>
          <div className="text-sm text-slate-300">A multi-tenant AI Assurance administration surface for enterprise governance, evidence lifecycle, and AI system stewardship.</div>
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
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-slate-400">Business units</div>
          <Table>
            <TableHeader>
              <TableHeaderCell>Department</TableHeaderCell>
              <TableHeaderCell>Assigned AI systems</TableHeaderCell>
              <TableHeaderCell>Owner</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableHeader>
            <tbody>
              {businessUnits.map((unit) => (
                <TableRow key={unit.department}>
                  <TableCell>{unit.department}</TableCell>
                  <TableCell>{unit.systems}</TableCell>
                  <TableCell>{unit.owner}</TableCell>
                  <TableCell><StatusBadge status={getStatusTone(unit.status)}>{unit.status}</StatusBadge></TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>

      <div className="full-width">
        <Card>
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-slate-400">User management</div>
          <Table>
            <TableHeader>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Department</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Last active</TableHeaderCell>
            </TableHeader>
            <tbody>
              {users.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell><StatusBadge status={getStatusTone(user.status)}>{user.status}</StatusBadge></TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>

      <div className="full-width">
        <Card>
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-slate-400">RBAC</div>
          <Table>
            <TableHeader>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Permissions</TableHeaderCell>
            </TableHeader>
            <tbody>
              {rbacRoles.map((item) => (
                <TableRow key={item.role}>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{item.permissions}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>

      <div className="full-width">
        <Card>
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-slate-400">Projects</div>
          <div className="grid gap-4 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.name} className="rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-4">
                <div className="text-lg font-semibold text-white">{project.name}</div>
                <div className="mt-2 text-sm text-slate-300">{project.description}</div>
                <div className="mt-3 space-y-2 text-sm text-slate-200">
                  <div><span className="text-slate-400">AI Systems:</span> {project.systems.join(', ')}</div>
                  <div><span className="text-slate-400">Evaluations:</span> {project.evaluations}</div>
                  <div><span className="text-slate-400">Evidence:</span> {project.reports}</div>
                  <div><span className="text-slate-400">Recommendations:</span> {project.recommendations}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="full-width">
        <div className="metrics">
          {teamActivity.map((item) => (
            <MetricCard key={item.label} label={item.label} value={item.value} helpText={item.detail} accent={<span className="rounded-full border border-[rgba(148,163,184,0.16)] bg-slate-900/80 px-3 py-1 text-xs text-slate-200">Live</span>} />
          ))}
        </div>
      </div>

      <div className="full-width">
        <Card>
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-slate-400">Enterprise audit log</div>
          <Table>
            <TableHeader>
              <TableHeaderCell>Timestamp</TableHeaderCell>
              <TableHeaderCell>User</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
              <TableHeaderCell>Target</TableHeaderCell>
              <TableHeaderCell>Result</TableHeaderCell>
            </TableHeader>
            <tbody>
              {auditLog.map((item) => (
                <TableRow key={`${item.timestamp}-${item.user}-${item.target}`}>
                  <TableCell>{item.timestamp}</TableCell>
                  <TableCell>{item.user}</TableCell>
                  <TableCell>{item.action}</TableCell>
                  <TableCell>{item.target}</TableCell>
                  <TableCell><StatusBadge status={getStatusTone(item.result === 'Succeeded' || item.result === 'Approved' || item.result === 'Published' ? 'healthy' : 'warning')}>{item.result}</StatusBadge></TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>

      <div className="full-width">
        <Card>
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-slate-400">Organization settings</div>
          <div className="grid gap-4 lg:grid-cols-2">
            {settings.map((item) => (
              <div key={item.label} className="rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">{item.label}</div>
                <div className="mt-2 text-sm text-slate-200">{item.value}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
