import type { EventMap } from '../types/base.types'
import type { ExtractNamespace, NamespacedEmitter, NamespaceProps } from '../types/namespace.types'

export class NamespaceCache<T extends EventMap> {
  private cache = new Map<string, NamespacedEmitter<T, string>>()

  get<NS extends ExtractNamespace<NamespaceProps<T>>>(
    namespace: NS,
  ): NamespacedEmitter<T, NS> | undefined {
    return this.cache.get(namespace) as NamespacedEmitter<T, NS> | undefined
  }

  set<NS extends ExtractNamespace<NamespaceProps<T>>>(
    namespace: NS,
    api: NamespacedEmitter<T, NS>,
  ): void {
    this.cache.set(namespace, api as unknown as NamespacedEmitter<T, string>)
  }
}
