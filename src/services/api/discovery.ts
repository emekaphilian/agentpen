import { apiClient, type ApiError, normalizeApiError } from './client'
import type { DiscoveryAsset, DiscoverySummary } from '../../types'

interface DiscoveryPayload {
  assets: DiscoveryAsset[]
  summary: DiscoverySummary
}

const mockAssets: DiscoveryAsset[] = [
  {
    id: 'asset-openai-gpt41-agent',
    name: 'OpenAI GPT-4.1 Agent',
    description: 'Primary orchestration agent for customer support and workflow execution.',
    assetType: 'AI Agents',
    provider: 'OpenAI',
    version: 'gpt-4.1',
    status: 'Discovered',
    lastSeen: '2m ago',
    evaluationReady: true,
    endpoint: 'https://api.openai.com/v1/agents',
    authenticationType: 'API Key',
    connectedTools: ['Web Search', 'Knowledge Retrieval'],
    memoryEnabled: true,
    ragEnabled: true,
    evaluationStatus: 'Ready for Evaluation'
  },
  {
    id: 'asset-anthropic-claude-agent',
    name: 'Anthropic Claude Agent',
    description: 'Research assistant used for complex reasoning and policy summarization.',
    assetType: 'AI Agents',
    provider: 'Anthropic',
    version: 'claude-3.7',
    status: 'Registered',
    lastSeen: '12m ago',
    evaluationReady: true,
    endpoint: 'https://api.anthropic.com/v1/messages',
    authenticationType: 'OAuth 2.0',
    connectedTools: ['Code Interpreter'],
    memoryEnabled: false,
    ragEnabled: true,
    evaluationStatus: 'Registered'
  },
  {
    id: 'asset-customer-support-bot',
    name: 'Internal Customer Support Bot',
    description: 'Support copilot that answers product questions and routes tickets.',
    assetType: 'AI Agents',
    provider: 'Internal',
    version: 'v3.2',
    status: 'Ready for Evaluation',
    lastSeen: '35m ago',
    evaluationReady: true,
    endpoint: 'https://support.internal.example/agent',
    authenticationType: 'mTLS',
    connectedTools: ['CRM Lookup', 'Knowledge Base'],
    memoryEnabled: true,
    ragEnabled: true,
    evaluationStatus: 'Ready for Evaluation'
  },
  {
    id: 'asset-finance-risk-assistant',
    name: 'Finance Risk Assistant',
    description: 'Risk review agent for contracts and compliance language.',
    assetType: 'AI Agents',
    provider: 'Internal',
    version: 'v1.4',
    status: 'Evaluation Running',
    lastSeen: '1h ago',
    evaluationReady: true,
    endpoint: 'https://finance.internal.example/assistant',
    authenticationType: 'JWT',
    connectedTools: ['Policy Engine'],
    memoryEnabled: true,
    ragEnabled: false,
    evaluationStatus: 'Evaluation Running'
  },
  {
    id: 'asset-hr-knowledge-assistant',
    name: 'HR Knowledge Assistant',
    description: 'Policy retrieval assistant for employee support and handbook search.',
    assetType: 'AI Agents',
    provider: 'Internal',
    version: 'v2.1',
    status: 'Evaluation Complete',
    lastSeen: '3h ago',
    evaluationReady: true,
    endpoint: 'https://hr.internal.example/knowledge',
    authenticationType: 'API Key',
    connectedTools: ['HR Toolkit'],
    memoryEnabled: false,
    ragEnabled: true,
    evaluationStatus: 'Evaluation Complete'
  },
  {
    id: 'asset-local-rag-system',
    name: 'Local RAG System',
    description: 'Internal retrieval pipeline serving policy and handbook context.',
    assetType: 'RAG Sources',
    provider: 'Local',
    version: 'v0.9',
    status: 'Discovered',
    lastSeen: '18m ago',
    evaluationReady: false,
    endpoint: 'https://rag.internal.example/search',
    authenticationType: 'OAuth 2.0',
    connectedTools: ['Embedding Search'],
    memoryEnabled: false,
    ragEnabled: true,
    evaluationStatus: 'Discovered'
  },
  {
    id: 'asset-mcp-file-server',
    name: 'MCP File Server',
    description: 'Tool server exposing file capabilities to connected agents.',
    assetType: 'MCP Servers',
    provider: 'Local',
    version: 'v1.0',
    status: 'Discovered',
    lastSeen: '44m ago',
    evaluationReady: true,
    endpoint: 'http://localhost:8081',
    authenticationType: 'No Auth',
    connectedTools: ['File Read', 'File Write'],
    memoryEnabled: false,
    ragEnabled: false,
    evaluationStatus: 'Discovered'
  },
  {
    id: 'asset-vector-database',
    name: 'Vector Database',
    description: 'Embedding index used for retrieval-augmented knowledge workflows.',
    assetType: 'Vector Databases',
    provider: 'Pinecone',
    version: 'v2.4',
    status: 'Registered',
    lastSeen: '2h ago',
    evaluationReady: true,
    endpoint: 'https://vector.internal.example',
    authenticationType: 'API Key',
    connectedTools: ['Embedding Pipeline'],
    memoryEnabled: false,
    ragEnabled: true,
    evaluationStatus: 'Registered'
  }
]

const mockSummary: DiscoverySummary = {
  aiSystems: 5,
  models: 3,
  agents: 5,
  apis: 2,
  mcpServers: 1,
  tools: 7,
  memoryStores: 2,
  ragSources: 4
}

export async function listDiscoveredAssets(): Promise<DiscoveryAsset[]> {
  try {
    const response = await apiClient.get<DiscoveryAsset[]>('/discovery/assets')
    return response.data
  } catch (error) {
    return mockAssets
  }
}

export async function discoverAssets(): Promise<DiscoveryPayload> {
  try {
    const response = await apiClient.get<DiscoveryPayload>('/discovery')
    return response.data
  } catch (error) {
    return { assets: mockAssets, summary: mockSummary }
  }
}

export async function getAssetDetails(assetId: string): Promise<DiscoveryAsset> {
  try {
    const response = await apiClient.get<DiscoveryAsset>(`/discovery/assets/${encodeURIComponent(assetId)}`)
    return response.data
  } catch (error) {
    return mockAssets.find((asset) => asset.id === assetId) ?? mockAssets[0]
  }
}

export async function registerAsset(assetId: string): Promise<DiscoveryAsset> {
  try {
    const response = await apiClient.post<DiscoveryAsset>(`/discovery/assets/${encodeURIComponent(assetId)}/register`)
    return response.data
  } catch (error) {
    const matchingAsset = mockAssets.find((asset) => asset.id === assetId)
    if (matchingAsset) {
      return { ...matchingAsset, status: 'Registered', evaluationStatus: 'Registered' }
    }
    throw normalizeApiError(error as ApiError)
  }
}
