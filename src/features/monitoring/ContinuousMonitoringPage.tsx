import { useMemo, useState } from 'react'
import { Button, Card, Drawer, MetricCard, StatusBadge, Table, TableCell, TableHeader, TableHeaderCell, TableRow } from '../../components/ui'

const overviewMetrics = [
  { label: 'Systems Under Monitoring', value: '16', helpText: 'Production and pilot systems actively observed', accent: 'Live' },
  { label: 'Active Alerts', value: '5', helpText: 'Critical and high-priority monitoring signals', accent: 'Escalated' },
  { label: 'Assurance Drift Events', value: '3', helpText: 'Systems showing confidence or policy drift', accent: 'Drift' },
  { label: 'Failed Evaluations', value: '2', helpText: 'Recently failed evaluation runs requiring intervention', accent: 'Review' },
  { label: 'Monitoring Coverage', value: '92%', helpText: 'Portfolio coverage across active deployed systems', accent: 'Coverage' }
]

const monitoredSystems = [
  {
    id: 'mon-01',
    systemName: 'Risk Copilot',
    currentAssuranceScore: '86',
    previousAssuranceScore: '89',
    driftStatus: 'Drift detected',
    lastHealthCheck: '2 mins ago',
    nextScheduledEvaluation: '2026-08-04 18:00 UTC',
    activeAlerts: '2',
    currentAssuranceState: 'Stable with drift signals',
    historicalTrend: 'Down 3 points over the last 7 days',
    driftTimeline: ['Policy threshold tightened', 'Fairness signal dipped', 'Evidence confidence slipped'],
    healthStatus: 'Healthy but trending downward',
    monitoringEvents: [
      'Score change from 89 to 86',
      'Policy violation: fairness threshold below target',
      'Failed evaluation: transcript replay mismatch',
      'New evidence added: policy control trace',
      'Configuration change: retrieval source updated'
    ],
    alertCenter: {
      critical: ['Security prompt guardrail drift'],
      high: ['Fairness deviation detected'],
      medium: ['Evidence freshness window near expiry'],
      informational: ['Weekly evidence package completed']
    },
    schedule: {
      dailyChecks: 'Enabled',
      weeklyEvaluations: 'Scheduled',
      monthlyAssuranceReviews: 'Due 2026-08-28',
      manualEvaluations: 'Available'
    },
    trendAnalysis: {
      assurance: 'Down 3%',
      risk: 'Up 2%',
      compliance: 'Stable',
      reliability: 'Stable'
    },
    recommendedActions: ['Re-run evaluation', 'Generate new report', 'Escalate to governance', 'Update policy', 'Create investigation']
  },
  {
    id: 'mon-02',
    systemName: 'Treasury Copilot',
    currentAssuranceScore: '78',
    previousAssuranceScore: '82',
    driftStatus: 'Severe drift',
    lastHealthCheck: '5 mins ago',
    nextScheduledEvaluation: '2026-08-04 21:00 UTC',
    activeAlerts: '4',
    currentAssuranceState: 'Elevated governance concern',
    historicalTrend: 'Down 4 points over the last 4 days',
    driftTimeline: ['Evidence completeness dropped', 'Model behavior changed', 'New high-risk signal observed'],
    healthStatus: 'Needs attention',
    monitoringEvents: [
      'Score change from 82 to 78',
      'Policy violation: evidence confidence under threshold',
      'Failed evaluation: fairness replay dataset mismatch',
      'New evidence: policy attestation missing',
      'Configuration change: plugin policy updated'
    ],
    alertCenter: {
      critical: ['Immediate governance escalation required'],
      high: ['Evidence confidence below required threshold'],
      medium: ['Recurrent retrieval drift'],
      informational: ['Weekly evaluation queued']
    },
    schedule: {
      dailyChecks: 'Enabled',
      weeklyEvaluations: 'Scheduled',
      monthlyAssuranceReviews: 'Due 2026-08-20',
      manualEvaluations: 'Available'
    },
    trendAnalysis: {
      assurance: 'Down 4%',
      risk: 'Up 4%',
      compliance: 'Down 1%',
      reliability: 'Stable'
    },
    recommendedActions: ['Re-run evaluation', 'Generate new report', 'Escalate to governance', 'Update policy', 'Create investigation']
  },
  {
    id: 'mon-03',
    systemName: 'Contract Review Agent',
    currentAssuranceScore: '91',
    previousAssuranceScore: '89',
    driftStatus: 'No drift',
    lastHealthCheck: '1 min ago',
    nextScheduledEvaluation: '2026-08-05 09:00 UTC',
    activeAlerts: '0',
    currentAssuranceState: 'Healthy',
    historicalTrend: 'Up 2 points over the last 10 days',
    driftTimeline: ['Evidence quality normalized', 'Control coverage expanded', 'No policy exception required'],
    healthStatus: 'Healthy',
    monitoringEvents: [
      'Score change from 89 to 91',
      'Evidence package verified',
      'New evidence: clause extraction accuracy improved',
      'Configuration change: human review lane updated',
      'No policy violations detected'
    ],
    alertCenter: {
      critical: [],
      high: [],
      medium: [],
      informational: ['Daily check passed']
    },
    schedule: {
      dailyChecks: 'Enabled',
      weeklyEvaluations: 'Scheduled',
      monthlyAssuranceReviews: 'Due 2026-08-29',
      manualEvaluations: 'Available'
    },
    trendAnalysis: {
      assurance: 'Up 2%',
      risk: 'Down 1%',
      compliance: 'Stable',
      reliability: 'Up 2%'
    },
    recommendedActions: ['Generate new report', 'Review evidence', 'Update policy', 'Create investigation']
  }
]

const statusTone: Record<string, 'healthy' | 'warning' | 'at-risk' | 'offline'> = {
  'No drift': 'healthy',
  'Drift detected': 'warning',
  'Severe drift': 'at-risk'
}

const alertTone: Record<string, 'healthy' | 'warning' | 'at-risk' | 'offline'> = {
  '0': 'healthy',
  '2': 'warning',
  '4': 'at-risk'
}

export default function ContinuousMonitoringPage() {
  const [search, setSearch] = useState('')
  const [selectedSystem, setSelectedSystem] = useState<(typeof monitoredSystems)[number] | null>(null)

  const filteredSystems = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) return monitoredSystems

    return monitoredSystems.filter((system) =>
      [system.systemName, system.driftStatus, system.lastHealthCheck, system.nextScheduledEvaluation, system.activeAlerts]
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    )
  }, [search])

  return (
    <div className="details-grid">
      <div className="full-width">
        <Card className="space-y-3">
          <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Live Operations Workspace</div>
          <div className="text-2xl font-semibold text-white">Continuous Monitoring</div>
          <div className="text-sm text-slate-300">Operational monitoring surface for deployed AI systems, showing assurance drift, evaluation health, alert posture, and recommended actions.</div>
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
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Live monitoring table</div>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm">Start Monitoring</Button>
              <Button variant="secondary" size="sm">Pause Monitoring</Button>
              <Button variant="secondary" size="sm">Run Immediate Evaluation</Button>
              <Button variant="secondary" size="sm">View Evidence</Button>
              <Button variant="secondary" size="sm">Generate Updated Report</Button>
            </div>
          </div>

          <div className="mb-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-[rgba(148,163,184,0.16)] bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none lg:max-w-xs"
              placeholder="Search monitored systems"
            />
          </div>

          <Table>
            <TableHeader>
              <TableHeaderCell>System Name</TableHeaderCell>
              <TableHeaderCell>Current Assurance Score</TableHeaderCell>
              <TableHeaderCell>Previous Assurance Score</TableHeaderCell>
              <TableHeaderCell>Drift Status</TableHeaderCell>
              <TableHeaderCell>Last Health Check</TableHeaderCell>
              <TableHeaderCell>Next Scheduled Evaluation</TableHeaderCell>
              <TableHeaderCell>Active Alerts</TableHeaderCell>
            </TableHeader>
            <tbody>
              {filteredSystems.map((system) => (
                <TableRow key={system.id}>
                  <TableCell><button type="button" className="text-left text-slate-100 hover:text-primary" onClick={() => setSelectedSystem(system)}>{system.systemName}</button></TableCell>
                  <TableCell>{system.currentAssuranceScore}</TableCell>
                  <TableCell>{system.previousAssuranceScore}</TableCell>
                  <TableCell><StatusBadge status={statusTone[system.driftStatus] ?? 'healthy'}>{system.driftStatus}</StatusBadge></TableCell>
                  <TableCell>{system.lastHealthCheck}</TableCell>
                  <TableCell>{system.nextScheduledEvaluation}</TableCell>
                  <TableCell><StatusBadge status={alertTone[system.activeAlerts] ?? 'healthy'}>{system.activeAlerts}</StatusBadge></TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>

      <Drawer open={Boolean(selectedSystem)} onClose={() => setSelectedSystem(null)} title={selectedSystem?.systemName ?? 'Monitoring details'}>
        {selectedSystem ? (
          <div className="space-y-5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Monitoring Summary</div>
              <div className="mt-3 grid gap-3">
                <div><div className="text-xs text-slate-400">Current assurance state</div><div className="text-sm text-slate-100">{selectedSystem.currentAssuranceState}</div></div>
                <div><div className="text-xs text-slate-400">Historical assurance trend</div><div className="text-sm text-slate-100">{selectedSystem.historicalTrend}</div></div>
                <div><div className="text-xs text-slate-400">Drift timeline</div><div className="text-sm text-slate-100">{selectedSystem.driftTimeline.join(' · ')}</div></div>
                <div><div className="text-xs text-slate-400">Health status</div><div className="text-sm text-slate-100">{selectedSystem.healthStatus}</div></div>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Monitoring Events</div>
              <div className="mt-3 space-y-2">
                {selectedSystem.monitoringEvents.map((entry) => (
                  <div key={entry} className="rounded-[1rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-3 text-sm text-slate-200">{entry}</div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Alert Center</div>
              <div className="mt-3 grid gap-3">
                <div><div className="text-xs text-slate-400">Critical alerts</div><div className="text-sm text-slate-100">{selectedSystem.alertCenter.critical.join(', ') || 'None'}</div></div>
                <div><div className="text-xs text-slate-400">High alerts</div><div className="text-sm text-slate-100">{selectedSystem.alertCenter.high.join(', ') || 'None'}</div></div>
                <div><div className="text-xs text-slate-400">Medium alerts</div><div className="text-sm text-slate-100">{selectedSystem.alertCenter.medium.join(', ') || 'None'}</div></div>
                <div><div className="text-xs text-slate-400">Informational events</div><div className="text-sm text-slate-100">{selectedSystem.alertCenter.informational.join(', ') || 'None'}</div></div>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Monitoring Schedule</div>
              <div className="mt-3 grid gap-3">
                <div><div className="text-xs text-slate-400">Daily checks</div><div className="text-sm text-slate-100">{selectedSystem.schedule.dailyChecks}</div></div>
                <div><div className="text-xs text-slate-400">Weekly evaluations</div><div className="text-sm text-slate-100">{selectedSystem.schedule.weeklyEvaluations}</div></div>
                <div><div className="text-xs text-slate-400">Monthly assurance reviews</div><div className="text-sm text-slate-100">{selectedSystem.schedule.monthlyAssuranceReviews}</div></div>
                <div><div className="text-xs text-slate-400">Manual evaluations</div><div className="text-sm text-slate-100">{selectedSystem.schedule.manualEvaluations}</div></div>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Trend Analysis</div>
              <div className="mt-3 grid gap-3">
                <div><div className="text-xs text-slate-400">Assurance trend</div><div className="text-sm text-slate-100">{selectedSystem.trendAnalysis.assurance}</div></div>
                <div><div className="text-xs text-slate-400">Risk trend</div><div className="text-sm text-slate-100">{selectedSystem.trendAnalysis.risk}</div></div>
                <div><div className="text-xs text-slate-400">Compliance trend</div><div className="text-sm text-slate-100">{selectedSystem.trendAnalysis.compliance}</div></div>
                <div><div className="text-xs text-slate-400">Reliability trend</div><div className="text-sm text-slate-100">{selectedSystem.trendAnalysis.reliability}</div></div>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Recommended Actions</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedSystem.recommendedActions.map((action) => (
                  <span key={action} className="rounded-full border border-[rgba(129,140,248,0.28)] bg-slate-900/80 px-3 py-1 text-xs text-slate-100">{action}</span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  )
}
