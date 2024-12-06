import type { EventKey } from '../v1/types'
import type { EventMap } from './base.types'

export type RegularCallback<T extends EventMap, K extends keyof T> = (payload: T[K]) => void
export type WildcardCallback<T extends EventMap> = (event: EventKey<T>, payload: T[keyof T]) => void
export type EventCallback<T extends EventMap, K extends EventKey<T>> = K extends '*'
  ? WildcardCallback<T>
  : RegularCallback<T, K>
