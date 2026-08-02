import { del, get, post, put } from './client'
import type { AISystem } from '../../types'

export async function getSystems(): Promise<AISystem[]> {
  return get<AISystem[]>('/systems')
}

export async function createSystem(input: Omit<AISystem, 'id' | 'createdAt' | 'updatedAt'>): Promise<AISystem> {
  return post<AISystem, Omit<AISystem, 'id' | 'createdAt' | 'updatedAt'>>('/systems', input)
}

export async function updateSystem(id: string, updates: Partial<AISystem>): Promise<AISystem> {
  return put<AISystem, Partial<AISystem>>(`/systems/${encodeURIComponent(id)}`, updates)
}

export async function deleteSystem(id: string): Promise<void> {
  await del(`/systems/${encodeURIComponent(id)}`)
}

export async function getSystemById(id: string): Promise<AISystem | undefined> {
  const systems = await getSystems()
  return systems.find((system) => system.id === id)
}
