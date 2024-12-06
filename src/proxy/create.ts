import type { BaseEventMap, EventMap } from '../types/base.types'
import type { BaseEmitter, Emitter } from '../types/emitter.types'
import type { NamespaceAPIGetter } from '../types/namespace.types'
import { createProxyHandler } from './handlers'

export function createProxy<T extends EventMap>(
  baseEmitter: BaseEmitter<T>,
  getNamespaceAPI: NamespaceAPIGetter<T>,
): Emitter<T & BaseEventMap> {
  const handler = createProxyHandler(getNamespaceAPI)
  return new Proxy(baseEmitter, handler) as Emitter<T & BaseEventMap>
}
