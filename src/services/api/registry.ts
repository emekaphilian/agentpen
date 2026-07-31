import type { AISystem, DeploymentType, RiskLevel, SystemStatus } from '../../types'

const mockSystems: AISystem[] = [
  {
    id: 'sys-001',
    name: 'Compliance Copilot',
    description: 'Internal policy triage assistant for legal and compliance review.',
    owner: 'Legal Ops',
    targetUrl: 'https://agent.internal/compliance',
    deploymentType: 'cloud',
    riskLevel: 'high',
    status: 'active',
    tags: ['compliance', 'legal'],
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'sys-002',
    name: 'Support CoPilot',
    description: 'Customer support assistant for internal troubleshooting escalation.',
    owner: 'Support Engineering',
    targetUrl: 'https://agent.internal/support',
    deploymentType: 'edge',
    riskLevel: 'medium',
    status: 'maintenance',
    tags: ['support', 'ops'],
    createdAt: '2026-02-01T09:30:00.000Z',
    updatedAt: '2026-02-01T09:30:00.000Z'
  }
]

let systems = [...mockSystems]

export async function getSystems(): Promise<AISystem[]> {
  return systems
}

export async function createSystem(input: Omit<AISystem, 'id' | 'createdAt' | 'updatedAt'>): Promise<AISystem> {
  const system: AISystem = {
    id: `sys-${Date.now()}`,
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  systems = [system, ...systems]
  return system
}

export async function updateSystem(id: string, updates: Partial<AISystem>): Promise<AISystem> {
  systems = systems.map((system) => (system.id === id ? { ...system, ...updates, updatedAt: new Date().toISOString() } : system))
  const system = systems.find((item) => item.id === id)
  if (!system) {
    throw new Error('System not found')
  }
  return system
}

export async function deleteSystem(id: string): Promise<void> {
  systems = systems.filter((system) => system.id !== id)
}

export async function getSystemById(id: string): Promise<AISystem | undefined> {
  return systems.find((system) => system.id === id)
}
