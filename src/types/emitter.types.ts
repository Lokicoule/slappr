import type { EventKey, EventMap, Unsubscribe } from './base.types'
import type { EventCallback, RegularCallback } from './callbacks.types'
import type { Prettify } from './common.types'
import type { NamespacedEmitter, NamespaceKeys } from './namespace.types'

/* export type EmitterPayload<T, K extends keyof T> = T[K] extends never | void | null | undefined
  ? []
  : undefined extends T[K]
    ? [payload?: T[K]]
    : [payload: T[K]]
 */

type HasOnlyOptionalProps<T> = T extends object ? (Required<T> extends T ? false : true) : false

export type EmitterPayload<T, K extends keyof T> = T[K] extends never | void | null | undefined
  ? []
  : HasOnlyOptionalProps<T[K]> extends true
    ? [payload?: T[K]]
    : undefined extends T[K]
      ? [payload?: T[K]]
      : [payload: T[K]]

export type EmitSignature<T> = {
  <K extends keyof T>(event: K, ...args: EmitterPayload<T, K>): void
}

export type OnSignature<T extends EventMap> = {
  <K extends EventKey<T>>(event: K, callback: EventCallback<T, K>): Unsubscribe
}

export type OnceSignature<T extends EventMap> = {
  <K extends keyof T>(event: K, callback: RegularCallback<T, K>): Unsubscribe
}

export type OffSignature<T extends EventMap> = {
  <K extends EventKey<T>>(event: K, callback: EventCallback<T, K>): void
}

export type NamespaceSignature<T extends EventMap> = {
  <NS extends NamespaceKeys<keyof T>>(namespace: NS): Prettify<NamespacedEmitter<T, NS>>
}

export interface BaseEmitter<T extends EventMap> {
  emit: EmitSignature<T>
  on: OnSignature<T>
  once: OnceSignature<T>
  off: OffSignature<T>
  ns: NamespaceSignature<T>
}
export type Emitter<T extends EventMap> = BaseEmitter<T> & {
  [K in NamespaceKeys<keyof T>]: NamespacedEmitter<T, K>
}
