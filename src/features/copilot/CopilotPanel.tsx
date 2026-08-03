import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Badge, Button, Card, StatusBadge } from '../../components/ui'

type ContextKey = 'discovery' | 'evaluation' | 'evidence' | 'assurance' | 'reports' | 'executive'

type ConversationTurn = {
  id: string
  prompt: string
  answer: string
  timestamp: string
}

type InsightCard = {
  title: string
  value: string
  tone: 'healthy' | 'warning' | 'at-risk' | 'offline'
}

const contextMap: Record<ContextKey, { title: string; prompts: string[]; insights: InsightCard[]; actions: string[] }> = {
  discovery: {
    title: 'Discovery Analyst',
    prompts: [
      'Explain the discovered assets.',
      'Which systems should be evaluated next?',
      'Identify the highest-risk assets.'
    ],
    insights: [
      { title: 'Key Findings', value: '4 APIs, 2 MCP servers, and 1 RAG pipeline show elevated trust drift.', tone: 'warning' },
      { title: 'Risk Drivers', value: 'Missing access controls and unbounded tool invocation paths.', tone: 'at-risk' },
      { title: 'Confidence Summary', value: 'Discovery confidence is 87% with strong asset coverage.', tone: 'healthy' },
      { title: 'Recommended Actions', value: 'Prioritize evaluation for finance and procurement assets.', tone: 'healthy' },
      { title: 'Framework Impact', value: 'NIST AI RMF, OWASP LLM Top 10, and EU AI Act controls are impacted.', tone: 'warning' },
      { title: 'Business Impact', value: 'Finance and procurement operations are carrying the highest deployment exposure.', tone: 'at-risk' }
    ],
    actions: ['Run another evaluation', 'Investigate findings', 'Review recommendations']
  },
  evaluation: {
    title: 'Evaluation Analyst',
    prompts: [
      'Summarize the current evaluation.',
      'Explain what caused the failure.',
      'Recommend more assurance suites.'
    ],
    insights: [
      { title: 'Key Findings', value: 'One evaluation is in evidence-validation with 2 failed probes.', tone: 'warning' },
      { title: 'Risk Drivers', value: 'Prompt injection and tool misuse remain the strongest contributors.', tone: 'at-risk' },
      { title: 'Confidence Summary', value: 'Evaluation evidence confidence remains solid at 84%.', tone: 'healthy' },
      { title: 'Recommended Actions', value: 'Re-run the fairness and safety suites for the next release candidate.', tone: 'healthy' },
      { title: 'Framework Impact', value: 'MITRE ATLAS coverage is improving while OWASP evidence trails remain incomplete.', tone: 'warning' },
      { title: 'Business Impact', value: 'Customer-support operations remain deployable only with targeted risk controls.', tone: 'warning' }
    ],
    actions: ['Compare evaluations', 'Generate report', 'Open evidence package']
  },
  evidence: {
    title: 'Evidence Analyst',
    prompts: [
      'Summarize the evidence package.',
      'What evidence supports the recommendation?',
      'Highlight the weakest findings.'
    ],
    insights: [
      { title: 'Key Findings', value: 'Strong evidence is present for security and reliability. Fairness evidence is thin.', tone: 'warning' },
      { title: 'Risk Drivers', value: 'Sampling gaps in fairness and domain-specific validation.', tone: 'at-risk' },
      { title: 'Confidence Summary', value: 'Evidence confidence is 82% with one missing artifact.', tone: 'warning' },
      { title: 'Recommended Actions', value: 'Collect additional fairness witnesses and a domain validator trace.', tone: 'healthy' },
      { title: 'Framework Impact', value: 'EU AI Act and ISO 42001 require stronger evidence mapping on fairness controls.', tone: 'warning' },
      { title: 'Business Impact', value: 'Evidence completion is delaying sign-off for healthcare and compliance workloads.', tone: 'warning' }
    ],
    actions: ['Open evidence package', 'Review recommendations', 'Generate report']
  },
  assurance: {
    title: 'Assurance Analyst',
    prompts: [
      'Explain this assurance score.',
      'Compare the pillars.',
      'Justify the deployment decision.'
    ],
    insights: [
      { title: 'Key Findings', value: 'Security and reliability exceed the deployment threshold. Fairness needs remediation.', tone: 'warning' },
      { title: 'Risk Drivers', value: 'Fairness drift and insufficient policy coverage are the main contributors.', tone: 'at-risk' },
      { title: 'Confidence Summary', value: 'Assurance confidence is high; residual risk remains manageable.', tone: 'healthy' },
      { title: 'Recommended Actions', value: 'Approve with conditions and require a targeted mitigation package.', tone: 'healthy' },
      { title: 'Framework Impact', value: 'NIST AI RMF and ISO 42001 controls are within policy tolerance, but fairness evidence requires remediation.', tone: 'warning' },
      { title: 'Business Impact', value: 'Deployment approval can proceed for low-data-latency workloads with governance exceptions.', tone: 'healthy' }
    ],
    actions: ['Approve deployment', 'Reject deployment', 'Review recommendations']
  },
  reports: {
    title: 'Governance Reporter',
    prompts: [
      'Summarize the executive report.',
      'Explain the framework mappings.',
      'What should governance review next?'
    ],
    insights: [
      { title: 'Key Findings', value: 'The current report highlights clear control gaps in fairness oversight.', tone: 'warning' },
      { title: 'Risk Drivers', value: 'Two framework controls remain unclosed and require sign-off.', tone: 'at-risk' },
      { title: 'Confidence Summary', value: 'Executive report confidence is 90% with strong evidence traceability.', tone: 'healthy' },
      { title: 'Recommended Actions', value: 'Publish the report with an executive mitigation note.', tone: 'healthy' },
      { title: 'Framework Impact', value: 'OWASP and MITRE ATLAS mappings are now resolved at the evidence level.', tone: 'healthy' },
      { title: 'Business Impact', value: 'Governance boards can use this report to support deployment and risk decisions today.', tone: 'healthy' }
    ],
    actions: ['Generate report', 'Open evidence package', 'Approve deployment']
  },
  executive: {
    title: 'Executive Assurance Advisor',
    prompts: [
      'Explain the enterprise risk posture.',
      'Summarize the current trend line.',
      'Identify the highest-priority governance issues.'
    ],
    insights: [
      { title: 'Key Findings', value: 'Portfolio assurance remains stable, but three high-risk systems need governance action.', tone: 'warning' },
      { title: 'Risk Drivers', value: 'Fairness, policy drift, and evidence completeness are the leading contributors.', tone: 'at-risk' },
      { title: 'Confidence Summary', value: 'Portfolio confidence remains 88% across the current review cadence.', tone: 'healthy' },
      { title: 'Recommended Actions', value: 'Escalate governance review for the procurement and finance workloads.', tone: 'healthy' },
      { title: 'Framework Impact', value: 'Multiple frameworks remain at elevated coverage and action-tracking risk across the portfolio.', tone: 'warning' },
      { title: 'Business Impact', value: 'Enterprise governance should prioritize finance, procurement, and healthcare workloads next.', tone: 'at-risk' }
    ],
    actions: ['Review recommendations', 'Approve deployment', 'Open evidence package']
  }
}

function inferContext(pathname: string): ContextKey {
  if (pathname.startsWith('/discovery')) return 'discovery'
  if (pathname.startsWith('/evaluations')) return 'evaluation'
  if (pathname.startsWith('/evidence')) return 'evidence'
  if (pathname.startsWith('/assurance')) return 'assurance'
  if (pathname.startsWith('/reports')) return 'reports'
  if (pathname.startsWith('/executive')) return 'executive'
  return 'evaluation'
}

function buildMockAnswer(context: ContextKey, userPrompt: string): ConversationTurn {
  const base = contextMap[context]
  const normalizedPrompt = userPrompt.toLowerCase()

  let answer = `I’m reviewing the ${base.title.toLowerCase()} context now. The highest-confidence observation is that the current workspace remains aligned to the assurance workflow and the main risk is concentrated in ${base.insights[1].value.toLowerCase()}.`

  if (normalizedPrompt.includes('why') || normalizedPrompt.includes('fail')) {
    answer = 'The current evidence suggests the failure is primarily a combination of weak control coverage, incomplete evidence traceability, and a rising risk signal in the fairness and domain-specific areas.'
  }

  if (normalizedPrompt.includes('security score') || normalizedPrompt.includes('security')) {
    answer = 'The Security score is supported by strong control evidence and broad coverage across the reviewed pipelines. The residual risk is moderate, but the score remains above the deployment approval threshold.'
  }

  if (normalizedPrompt.includes('compare') || normalizedPrompt.includes('previous')) {
    answer = 'Compared with the previous evaluation, the current review has improved in reliability and security while fairness remains slightly below the prior baseline. The overall assurance posture is still positive but not fully stable.'
  }

  if (normalizedPrompt.includes('deploy') || normalizedPrompt.includes('ready')) {
    answer = 'This system is ready for deployment only when the high-priority fairness and evidence-completeness gaps are remediated or explicitly documented with governance exceptions.'
  }

  if (normalizedPrompt.includes('framework') || normalizedPrompt.includes('frameworks')) {
    answer = 'The framework impact is primarily concentrated in NIST AI RMF, ISO/IEC 42001, and EU AI Act mappings. The current gaps are concentrated in control evidence, policy traceability, and the remaining action items for sign-off.'
  }

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    prompt: userPrompt,
    answer,
    timestamp: new Date().toISOString()
  }
}

interface CopilotPanelProps {
  open: boolean
  onClose: () => void
}

export default function CopilotPanel({ open, onClose }: CopilotPanelProps) {
  const location = useLocation()
  const context = inferContext(location.pathname)
  const contextConfig = contextMap[context]
  const [history, setHistory] = useState<ConversationTurn[]>([])
  const [draft, setDraft] = useState('')
  const [panelWidth, setPanelWidth] = useState(420)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    setDraft('')
  }, [context])

  const sessionSummary = useMemo(() => {
    const active = history.length > 0 ? history[history.length - 1] : null
    return active ? active.answer : contextConfig.insights[0].value
  }, [contextConfig, history])

  const promptSuggestions = useMemo(() => contextConfig.prompts, [contextConfig])

  const handleSend = () => {
    const prompt = draft.trim()
    if (!prompt) {
      return
    }

    const message = buildMockAnswer(context, prompt)
    setHistory((current) => [...current, message])
    setDraft('')
  }

  const handlePromptClick = (value: string) => {
    setDraft(value)
    const message = buildMockAnswer(context, value)
    setHistory((current) => [...current, message])
  }

  const handleAction = (action: string) => {
    const message = buildMockAnswer(context, action)
    setHistory((current) => [...current, message])
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => onClose()}
        className="fixed bottom-5 right-5 z-[110] rounded-full border border-[rgba(129,140,248,0.35)] bg-slate-950/95 px-4 py-2 text-sm font-medium text-white shadow-lg"
      >
        AI Copilot
      </button>
    )
  }

  return (
    <div className="fixed bottom-5 right-5 z-[110] rounded-[1.5rem] border border-[rgba(148,163,184,0.18)] bg-slate-950/95 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur" style={{ width: panelWidth, minWidth: 320, maxWidth: 560 }}>
      <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.14)] px-4 py-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400">AgentPen</div>
          <div className="text-sm font-semibold text-white">{contextConfig.title}</div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="rounded-full border border-[rgba(148,163,184,0.16)] px-2 py-1 text-xs text-slate-300" onClick={() => setCollapsed((value) => !value)}>{collapsed ? 'Expand' : 'Collapse'}</button>
          <button type="button" className="rounded-full border border-[rgba(148,163,184,0.16)] px-2 py-1 text-xs text-slate-300" onClick={onClose}>Close</button>
        </div>
      </div>

      {!collapsed ? (
        <>
          <div className="border-b border-[rgba(148,163,184,0.12)] px-4 py-3">
            <div className="text-xs uppercase tracking-[0.26em] text-slate-400">Context snapshot</div>
            <div className="mt-2 text-sm text-slate-200">{sessionSummary}</div>
          </div>

          <div className="max-h-[360px] overflow-auto px-4 py-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {contextConfig.insights.map((item) => (
                <Card key={item.title} className="p-4">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">{item.title}</div>
                  <div className="mt-2 text-sm font-semibold text-white">{item.value}</div>
                  <div className="mt-2">
                    <StatusBadge status={item.tone}>{item.tone}</StatusBadge>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-4">
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Suggested prompts</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {promptSuggestions.map((prompt) => (
                  <button key={prompt} type="button" className="rounded-full border border-[rgba(129,140,248,0.28)] bg-slate-900/80 px-3 py-1 text-xs text-slate-100" onClick={() => handlePromptClick(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Recommended actions</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {contextConfig.actions.map((action) => (
                  <button key={action} type="button" className="rounded-full border border-[rgba(148,163,184,0.16)] bg-slate-900/80 px-3 py-1 text-xs text-slate-100" onClick={() => handleAction(action)}>
                    {action}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-900/80 p-3">
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Conversation history</div>
              <div className="mt-3 space-y-2">
                {history.length === 0 ? (
                  <div className="text-sm text-slate-300">No active conversation yet. Ask the Analyst a question from this workspace.</div>
                ) : (
                  history.slice(-3).map((item) => (
                    <div key={item.id} className="rounded-xl border border-[rgba(148,163,184,0.12)] bg-slate-950/80 p-2">
                      <div className="text-xs font-semibold text-white">{item.prompt}</div>
                      <div className="mt-1 text-xs text-slate-300">{item.answer}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-[rgba(148,163,184,0.14)] p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">AI Assurance Analyst</div>
              <Badge variant="info">Session aware</Badge>
            </div>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Ask about assurance scores, evaluation findings, or governance actions..."
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <div className="mt-3 flex gap-2">
              <Button variant="primary" size="sm" onClick={handleSend}>Ask Copilot</Button>
              <Link to="/reports" className="btn-secondary btn-sm">Generate report</Link>
            </div>
          </div>

          <div className="cursor-ew-resize border-t border-[rgba(148,163,184,0.12)] px-2 py-1 text-center text-[10px] uppercase tracking-[0.24em] text-slate-500" onMouseDown={(event) => {
            const startX = event.clientX
            const startWidth = panelWidth
            const handleMove = (moveEvent: MouseEvent) => {
              const nextWidth = startWidth - (moveEvent.clientX - startX)
              setPanelWidth(Math.max(320, Math.min(560, nextWidth)))
            }
            const handleUp = () => {
              window.removeEventListener('mousemove', handleMove)
              window.removeEventListener('mouseup', handleUp)
            }
            window.addEventListener('mousemove', handleMove)
            window.addEventListener('mouseup', handleUp)
          }}>
            Resize panel
          </div>
        </>
      ) : (
        <div className="p-4 text-center text-sm text-slate-300">Assistant collapsed. Expand to resume the current assurance review.</div>
      )}
    </div>
  )
}
