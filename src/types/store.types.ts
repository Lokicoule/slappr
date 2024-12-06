import type { EventMap } from './base.types'
import type { RegularCallback, WildcardCallback } from './callbacks.types'

export interface EmitterStore<T extends EventMap> {
  readonly listeners: Map<keyof T, Set<RegularCallback<T, keyof T>>>
  readonly wildcardListeners: Set<WildcardCallback<T>>
  readonly queue: Map<keyof T, T[keyof T]>
}
