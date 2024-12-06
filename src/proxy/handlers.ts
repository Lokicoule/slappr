import type { BaseMethods, EventMap } from '../types/base.types'
import type { Emitter } from '../types/emitter.types'
import type { ExtractNamespace, NamespaceAPIGetter, NamespaceProps } from '../types/namespace.types'

function isBaseMethod(prop: string): prop is BaseMethods {
  return ['emit', 'on', 'once', 'off', 'ns'].includes(prop)
}

function isValidNamespace<T extends EventMap>(
  prop: string,
): prop is ExtractNamespace<NamespaceProps<T>> {
  return /^[a-zA-Z0-9-]+:[a-zA-Z0-9-]+$/.test(prop)
}

export function createProxyHandler<T extends EventMap>(
  getNamespaceAPI: NamespaceAPIGetter<T>,
): ProxyHandler<Emitter<T>> {
  return {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined
      if (prop in target && isBaseMethod(prop)) return target[prop]
      if (isValidNamespace<T>(prop)) return getNamespaceAPI(prop)
      return undefined
    },
  }
}
