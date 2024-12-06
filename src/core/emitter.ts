import type { EventMap } from '../types/base.types'
import type { BaseEmitter } from '../types/emitter.types'
import type { NamespaceAPIGetter } from '../types/namespace.types'
import type { EmitterStore } from '../types/store.types'
import { emit } from './emit'
import { off, on, once } from './handlers'

export function createBaseEmitter<T extends EventMap>(
  store: EmitterStore<T>,
  getNamespaceAPI: NamespaceAPIGetter<T>,
): BaseEmitter<T> {
  return {
    on: (event, callback) => on(store, event, callback),
    once: (event, callback) => once(store, event, callback),
    off: (event, callback) => off(store, event, callback),
    emit: (event, ...payload) => emit(store, event, payload as any),
    ns: (namespace) => getNamespaceAPI(namespace),
  }
}
