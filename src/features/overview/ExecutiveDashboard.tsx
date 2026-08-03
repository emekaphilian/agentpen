import { Link } from 'react-router-dom'
import {
  Badge,
  Card,
  MetricCard,
  StatusBadge,
  Table,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow
} from '../../components/ui'

const kpis = [
  { label: 'AI Systems Evaluated', value: '28', helpText: 'Across four enterprise business units', accent: '↗ 12%' },
  { label: 'Overall Assurance Score', value: '89', helpText: 'Down 2 points vs. prior review', accent: 'Stable' },
  { label: 'High-Risk Systems', value: '03', helpText: '2 systems moved to monitored mode', accent: 'Needs action' },
  { label: 'Deployable Systems', value: '19', helpText: '65% of the evaluated portfolio', accent: 'Ready' },
  { label: 'Active Evaluations', value: '07', helpText: 'Three queue items are in progress', accent: 'Live' },
  { label: 'Open Recommendations', value: '14', helpText: '6 critical and 3 high-priority items', accent: 'Escalate' }
]

const pillarScores = [
  { name: 'Security', score: 91, trend: '+6%', risk: 'Low', previous: '85', owner: 'CISO' },
  { name: 'Safety', score: 87, trend: '+2%', risk: 'Medium', previous: '84', owner: 'AI Safety' },
  { name: 'Reliability', score: 94, trend: '+4%', risk: 'Low', previous: '89', owner: 'Platform' },
  { name: 'Fairness', score: 82, trend: '-1%', risk: 'Medium', previous: '83', owner: 'Governance' },
  { name: 'Domain Readiness', score: 88, trend: '+3%', risk: 'Medium', previous: '86', owner: 'Compliance' }
]

const decisions = [
  { system: 'Financial Risk Assistant', unit: 'Finance', score: '91', decision: 'Approved', date: '2026-08-02', owner: 'CISO Office' },
  { system: 'Clinical Triage Copilot', unit: 'Healthcare', score: '88', decision: 'Approved with Conditions', date: '2026-08-01', owner: 'Medical Risk Council' },
  { system: 'Customer Support Agent', unit: 'Customer Success', score: '74', decision: 'Requires Review', date: '2026-07-29', owner: 'AI Governance Board' },
  { system: 'Procurement Intelligence Bot', unit: 'Operations', score: '63', decision: 'Rejected', date: '2026-07-25', owner: 'CIO Office' }
]

const complianceRows = [
  { name: 'NIST AI RMF', coverage: 91, passing: 49, failing: 5, actions: 3 },
  { name: 'ISO/IEC 42001', coverage: 86, passing: 37, failing: 6, actions: 4 },
  { name: 'MITRE ATLAS', coverage: 78, passing: 22, failing: 7, actions: 5 },
  { name: 'OWASP Top 10 for LLM Applications', coverage: 89, passing: 31, failing: 4, actions: 2 },
  { name: 'EU AI Act', coverage: 83, passing: 26, failing: 5, actions: 3 }
]

const recommendationGroups = [
  {
    label: 'Critical',
    items: [
      { title: 'Remediate prompt guardrail drift', system: 'Customer Support Agent', link: '/evidence' },
      { title: 'Revalidate high-context retrieval isolation', system: 'Procurement Intelligence Bot', link: '/evidence' }
    ]
  },
  {
    label: 'High',
    items: [
      { title: 'Increase logging depth for policy actions', system: 'Clinical Triage Copilot', link: '/evidence' },
      { title: 'Add red-team evidence for fairness thresholds', system: 'Financial Risk Assistant', link: '/evidence' }
    ]
  },
  {
    label: 'Medium',
    items: [
      { title: 'Refresh deployment runbooks', system: 'Customer Success Agent', link: '/evidence' },
      { title: 'Standardize release sign-off metadata', system: 'Healthcare Suite', link: '/evidence' }
    ]
  },
  {
    label: 'Low',
    items: [
      { title: 'Align evidence retention policy with legal review', system: 'Ops Automation Bot', link: '/evidence' }
    ]
  }
]

const reports = [
  { title: 'Q3 Assurance Readiness Report', system: 'Financial Risk Assistant', version: 'v5.3', status: 'Published', date: '2026-08-02', signed: 'Yes' },
  { title: 'Safety Governance Memo', system: 'Clinical Triage Copilot', version: 'v2.9', status: 'Published', date: '2026-08-01', signed: 'Yes' },
  { title: 'Controls Review Summary', system: 'Customer Support Agent', version: 'v1.8', status: 'Pending Sign-off', date: '2026-07-30', signed: 'No' }
]

const activity = [
  'Evaluation Completed · Financial Risk Assistant',
  'Evidence Approved · Clinical Triage Copilot',
  'Report Published · Customer Support Agent',
  'Deployment Approved · Policy Copilot',
  'Policy Updated · AI Governance Board'
]

const scoreTrend = [72, 76, 78, 81, 84, 86, 88, 87, 90]
const evaluationVolume = [5, 6, 7, 9, 10, 8, 11, 13]
const highRisk = [4, 5, 4, 3, 2, 3, 4, 2]
const complianceTrend = [84, 85, 86, 87, 88, 89, 91, 90]
const decisionTrend = [2, 3, 2, 4, 3, 5, 3, 4]

function renderTrendChart(values: number[], color: string, yLabel: string) {
  const width = 360
  const height = 180
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = Math.max(max - min, 1)

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * (width - 24) + 12
      const y = height - ((value - min) / range) * (height - 28) - 14
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-44 w-full" aria-label={yLabel}>
      <defs>
        <linearGradient id={yLabel.replace(/\s+/g, '-') + '-fill'} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M 12 14 L 12 ${height - 14} L ${width - 12} ${height - 14}`} stroke="rgba(148,163,184,0.25)" strokeWidth="1" />
      <polyline fill="none" stroke={color} strokeWidth="3" points={points} />
      <polygon fill={`url(#${yLabel.replace(/\s+/g, '-') + '-fill'})`} points={`12,${height - 14} ${points} ${width - 12},${height - 14}`} />
    </svg>
  )
}

function renderBarChart(values: number[], color: string, label: string) {
  const width = 360
  const height = 180
  const max = Math.max(...values)
  return (
    <div className="mt-4 flex h-44 items-end gap-3">
      {values.map((value, index) => (
        <div key={`${label}-${index}`} className="flex flex-1 flex-col items-center gap-2">
          <div className="w-full rounded-t-[12px] bg-slate-900/75 border border-[rgba(148,163,184,0.12)] p-1">
            <div className="rounded-t-[10px]" style={{ height: `${(value / max) * 100}%`, minHeight: 10, background: color }} />
          </div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{index + 1}</div>
        </div>
      ))}
    </div>
  )
}

function getRiskTone(score: number) {
  if (score >= 90) return 'healthy'
  if (score >= 80) return 'warning'
  if (score >= 70) return 'at-risk'
  return 'offline'
}

export default function ExecutiveDashboard() {
  return (
    <div className="space-y-6 p-6">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Executive Portfolio Summary</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Deployment trust posture</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/operations" className="btn-secondary">Open Operations Console</Link>
            <Link to="/reports" className="btn-primary">Review Reports</Link>
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {kpis.map((item) => (
            <MetricCard key={item.label} label={item.label} value={item.value} helpText={item.helpText} accent={<span className="rounded-full border border-[rgba(148,163,184,0.16)] bg-slate-900/80 px-3 py-1 text-xs text-slate-200">{item.accent}</span>} />
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-4 text-lg font-semibold text-white">Assurance Overview</div>
          <div className="grid gap-4 md:grid-cols-2">
            {pillarScores.map((pillar) => (
              <div key={pillar.name} className="rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">{pillar.name}</div>
                  <StatusBadge status={getRiskTone(pillar.score)}>{pillar.risk}</StatusBadge>
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-3xl font-semibold text-white">{pillar.score}</div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Score</div>
                  </div>
                  <div className="text-sm text-emerald-300">Trend {pillar.trend}</div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>Previous: {pillar.previous}</span>
                  <span>Owner: {pillar.owner}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 text-lg font-semibold text-white">Deployment Decisions</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>AI System</TableHeaderCell>
                <TableHeaderCell>Business Unit</TableHeaderCell>
                <TableHeaderCell>Overall Score</TableHeaderCell>
                <TableHeaderCell>Decision</TableHeaderCell>
                <TableHeaderCell>Decision Date</TableHeaderCell>
                <TableHeaderCell>Decision Owner</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {decisions.map((item) => (
                <TableRow key={item.system}>
                  <TableCell>{item.system}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.score}</TableCell>
                  <TableCell>
                    <Badge variant={item.decision === 'Approved' ? 'success' : item.decision === 'Approved with Conditions' ? 'info' : item.decision === 'Requires Review' ? 'warning' : 'danger'}>{item.decision}</Badge>
                  </TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.owner}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="mb-4 text-lg font-semibold text-white">Compliance Dashboard</div>
          <div className="space-y-3">
            {complianceRows.map((row) => (
              <div key={row.name} className="rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">{row.name}</div>
                  <div className="text-xs text-slate-400">Coverage {row.coverage}%</div>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-4">
                  <div className="rounded-xl bg-slate-900/70 p-3 text-sm text-slate-200">Controls Passing <span className="block text-lg font-semibold text-white">{row.passing}</span></div>
                  <div className="rounded-xl bg-slate-900/70 p-3 text-sm text-slate-200">Controls Failing <span className="block text-lg font-semibold text-white">{row.failing}</span></div>
                  <div className="rounded-xl bg-slate-900/70 p-3 text-sm text-slate-200">Outstanding Actions <span className="block text-lg font-semibold text-white">{row.actions}</span></div>
                  <div className="rounded-xl bg-slate-900/70 p-3 text-sm text-slate-200">Coverage % <span className="block text-lg font-semibold text-white">{row.coverage}%</span></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 text-lg font-semibold text-white">Assurance Trends</div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-4">
              <div className="text-sm font-semibold text-white">Overall Assurance Score over time</div>
              {renderTrendChart(scoreTrend, '#818cf8', 'Assurance score over time')}
            </div>
            <div className="rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-4">
              <div className="text-sm font-semibold text-white">Evaluation volume</div>
              {renderBarChart(evaluationVolume, '#2dd4bf', 'Evaluation volume')}
            </div>
            <div className="rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-4">
              <div className="text-sm font-semibold text-white">High-risk findings</div>
              {renderBarChart(highRisk, '#f97316', 'High-risk findings')}
            </div>
            <div className="rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-4">
              <div className="text-sm font-semibold text-white">Framework compliance</div>
              {renderTrendChart(complianceTrend, '#22c55e', 'Framework compliance')}
            </div>
            <div className="rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-4 md:col-span-2">
              <div className="text-sm font-semibold text-white">Deployment decisions</div>
              {renderBarChart(decisionTrend, '#60a5fa', 'Deployment decisions')}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <div className="mb-4 text-lg font-semibold text-white">Risk Heatmap</div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs uppercase tracking-[0.28em] text-slate-400">
            <div />
            <div>Low</div>
            <div>Medium</div>
            <div>High</div>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            <div className="text-xs uppercase tracking-[0.28em] text-slate-400">Low</div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/12 p-3 text-sm text-white">Low risk</div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/12 p-3 text-sm text-white">Observe</div>
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/12 p-3 text-sm text-white">Escalate</div>
            <div className="text-xs uppercase tracking-[0.28em] text-slate-400">Medium</div>
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 text-sm text-white">Monitor</div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-sm text-white">Watchlist</div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/12 p-3 text-sm text-white">Remediate</div>
            <div className="text-xs uppercase tracking-[0.28em] text-slate-400">High</div>
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/12 p-3 text-sm text-white">Critical</div>
            <div className="rounded-xl border border-red-500/20 bg-red-500/12 p-3 text-sm text-white">Quarantine</div>
            <div className="rounded-xl border border-red-500/30 bg-red-500/18 p-3 text-sm text-white">Banned</div>
          </div>
        </Card>

        <Card>
          <div className="mb-4 text-lg font-semibold text-white">Recommendations</div>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendationGroups.map((group) => (
              <div key={group.label} className="rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-4">
                <div className="mb-3 text-xs uppercase tracking-[0.3em] text-slate-400">{group.label}</div>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <Link key={item.title} to={item.link} className="block rounded-xl border border-[rgba(148,163,184,0.14)] bg-slate-900/80 p-3 text-sm text-slate-100 transition hover:border-indigo-400/25 hover:bg-slate-900">
                      <div className="font-medium text-white">{item.title}</div>
                      <div className="mt-1 text-xs text-slate-400">{item.system}</div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <div className="mb-4 text-lg font-semibold text-white">Recent Reports</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Title</TableHeaderCell>
                <TableHeaderCell>AI System</TableHeaderCell>
                <TableHeaderCell>Version</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Published Date</TableHeaderCell>
                <TableHeaderCell>Signed</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {reports.map((report) => (
                <TableRow key={`${report.title}-${report.system}`}>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.system}</TableCell>
                  <TableCell>{report.version}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'Published' ? 'success' : 'warning'}>{report.status}</Badge>
                  </TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.signed}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <div className="mb-4 text-lg font-semibold text-white">Live Activity</div>
          <div className="space-y-3">
            {activity.map((item) => (
              <div key={item} className="rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-4 text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  {item}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
