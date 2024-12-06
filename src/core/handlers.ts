import type { EventKey, EventMap, Unsubscribe } from '../types/base.types'
import type { EventCallback, RegularCallback, WildcardCallback } from '../types/callbacks.types'
import type { EmitterStore } from '../types/store.types'

export const on = <T extends EventMap, K extends EventKey<T>>(
  store: EmitterStore<T>,
  event: K | '*',
  callback: EventCallback<T, K>,
): Unsubscribe => {
  if (event === '*') {
    store.wildcardListeners.add(callback as WildcardCallback<T>)
  } else {
    let listeners = store.listeners.get(event)

    if (!listeners) {
      listeners = new Set()
      store.listeners.set(event, listeners)
    }

    listeners.add(callback as RegularCallback<T, keyof T>)
  }

  return () => off(store, event, callback)
}

export const once = <T extends EventMap, K extends keyof T>(
  store: EmitterStore<T>,
  event: K,
  callback: RegularCallback<T, K>,
): Unsubscribe => {
  const onceCallback = ((payload: T[K]) => {
    callback(payload)
    off(store, event, onceCallback)
  }) as EventCallback<T, K>

  return on(store, event, onceCallback)
}

export const off = <T extends EventMap, K extends EventKey<T>>(
  store: EmitterStore<T>,
  event: K | '*',
  callback: EventCallback<T, K>,
): void => {
  if (event === '*') {
    store.wildcardListeners.delete(callback as WildcardCallback<T>)
    return
  }

  const listeners = store.listeners.get(event)
  if (listeners) {
    listeners.delete(callback as RegularCallback<T, keyof T>)
    if (listeners.size === 0) {
      store.listeners.delete(event)
    }
  }
}
