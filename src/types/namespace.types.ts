import type { EventMap, Unsubscribe } from './base.types'
import type { EmitterPayload } from './emitter.types'

export type ExtractNamespace<T extends string> = T extends `${infer NS}:${string}` ? NS : never
export type NamespaceKeys<T> = T extends string ? ExtractNamespace<T> : never
export type NamespacedEvents<T extends EventMap, NS extends string> = {
  [K in keyof T & string as K extends `${NS}:${infer E}` ? E : never]: T[K]
}
export type NamespaceProps<T extends EventMap> = Extract<keyof T, `${string}:${string}`>
export type NamespaceAPIGetter<T extends EventMap> = <
  NS extends ExtractNamespace<NamespaceProps<T>>,
>(
  namespace: NS,
) => NamespacedEmitter<T, NS>

export type MapNamespacedToFullKey<
  T extends EventMap,
  NS extends string,
  E extends keyof NamespacedEvents<T, NS>,
> = `${NS}:${string & E}`

export type NamespacedCallback<
  T extends EventMap,
  NS extends string,
  E extends keyof NamespacedEvents<T, NS>,
> = (payload: MapNamespacedToFullKey<T, NS, E>) => void

export type NamespacedEmitSignature<T extends EventMap, NS extends string> = {
  <E extends keyof NamespacedEvents<T, NS>>(
    event: E,
    ...args: EmitterPayload<NamespacedEvents<T, NS>, E>
  ): void
}

export type NamespacedOnSignature<T extends EventMap, NS extends string> = {
  <E extends keyof NamespacedEvents<T, NS>>(
    event: E,
    callback: NamespacedCallback<T, NS, E>,
  ): Unsubscribe
}

export type NamespacedOffSignature<T extends EventMap, NS extends string> = {
  <E extends keyof NamespacedEvents<T, NS>>(event: E, callback: NamespacedCallback<T, NS, E>): void
}

export interface NamespacedEmitter<T extends EventMap, NS extends string> {
  emit: NamespacedEmitSignature<T, NS>
  on: NamespacedOnSignature<T, NS>
  once: NamespacedOnSignature<T, NS>
  off: NamespacedOffSignature<T, NS>
}
