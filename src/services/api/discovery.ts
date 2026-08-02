import { get, post } from './client'
import type { DiscoveryAsset, DiscoverySummary } from '../../types'

interface DiscoveryPayload {
  assets: DiscoveryAsset[]
  summary: DiscoverySummary
}

export async function listDiscoveredAssets(): Promise<DiscoveryAsset[]> {
  return get<DiscoveryAsset[]>('/discovery/assets')
}

export async function discoverAssets(): Promise<DiscoveryPayload> {
  return get<DiscoveryPayload>('/discovery')
}

export async function getAssetDetails(assetId: string): Promise<DiscoveryAsset> {
  return get<DiscoveryAsset>(`/discovery/assets/${encodeURIComponent(assetId)}`)
}

export async function registerAsset(assetId: string): Promise<DiscoveryAsset> {
  return post<DiscoveryAsset>(`/discovery/assets/${encodeURIComponent(assetId)}/register`)
}
