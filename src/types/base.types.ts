export type BaseEventMap = {
  error: { error: Error; event: string; data: unknown }
}
export type EventMap = Record<string, unknown> & Partial<BaseEventMap>
export type EventKey<T extends EventMap> = keyof T | '*'
export type Unsubscribe = () => void

export type BaseMethods = 'emit' | 'on' | 'once' | 'off' | 'ns'
