import type { EventMap } from '../types/base.types'
import type { EmitterStore } from '../types/store.types'

export const createStore = <T extends EventMap>(): EmitterStore<T> => ({
  listeners: new Map(),
  wildcardListeners: new Set(),
  queue: new Map(),
})
