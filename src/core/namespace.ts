import type { NamespaceCache } from '../proxy/cache'
import type { EventMap } from '../types/base.types'
import type {
  MapNamespacedToFullKey,
  NamespaceAPIGetter,
  NamespacedEmitter,
} from '../types/namespace.types'
import type { EmitterStore } from '../types/store.types'
import { emit } from './emit'
import { off, on, once } from './handlers'

function createNamespacedHandlers<T extends EventMap, NS extends string>(
  store: EmitterStore<T>,
  namespace: NS,
): NamespacedEmitter<T, NS> {
  return {
    emit: (event, ...payload) => emit(store, `${namespace}:${String(event)}`, payload as any),
    on: (event, callback) =>
      on(
        store,
        `${namespace}:${String(event)}` as MapNamespacedToFullKey<T, NS, typeof event>,
        callback as any,
      ),
    once: (event, callback) =>
      once(
        store,
        `${namespace}:${String(event)}` as MapNamespacedToFullKey<T, NS, typeof event>,
        callback as any,
      ),
    off: (event, callback) =>
      off(
        store,
        `${namespace}:${String(event)}` as MapNamespacedToFullKey<T, NS, typeof event>,
        callback as any,
      ),
  }
}

export function getNamespaceAPI<T extends EventMap>(
  store: EmitterStore<T>,
  cache: NamespaceCache<T>,
): NamespaceAPIGetter<T> {
  return (namespace) => {
    let api = cache.get(namespace)
    if (!api) {
      api = createNamespacedHandlers(store, namespace)
      cache.set(namespace, api)
    }
    return api
  }
}
