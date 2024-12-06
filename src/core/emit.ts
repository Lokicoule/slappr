import type { EventMap } from '../types/base.types'
import type { EmitterStore } from '../types/store.types'

export const emit = <T extends EventMap, K extends keyof T>(
  store: EmitterStore<T>,
  event: K,
  payload: T[K],
): void => {
  const listeners = store.listeners.get(event)
  const hasListeners = listeners && listeners.size > 0
  const hasWildcard = store.wildcardListeners.size > 0

  if (!hasListeners && !hasWildcard) return

  store.queue.set(event, structuredClone(payload))

  queueMicrotask(() => {
    const queuedPayload = store.queue.get(event)
    if (!queuedPayload) return

    try {
      if (hasListeners) {
        listeners.forEach((callback) => callback(queuedPayload))
      }

      if (hasWildcard) {
        store.wildcardListeners.forEach((callback) => callback(event, queuedPayload))
      }
    } catch (error) {
      console.error(`Error in event listener for ${String(event)}:`, error)
      emit(
        store,
        'error' as keyof T,
        {
          error: error instanceof Error ? error : new Error(String(error)),
          event: String(event),
          data: queuedPayload,
        } as T[keyof T],
      )
    }

    store.queue.delete(event)
  })
}
