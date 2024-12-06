import { createBaseEmitter } from './core/emitter'
import { getNamespaceAPI } from './core/namespace'
import { createStore } from './core/store'
import { NamespaceCache } from './proxy/cache'
import { createProxy } from './proxy/create'
import type { EventMap } from './types/base.types'
import type { Prettify } from './types/common.types'
import type { Emitter } from './types/emitter.types'
import type { BaseEventMap } from './v1/types'

export type { Unsubscribe } from './types/base.types'
export type { RegularCallback, WildcardCallback } from './types/callbacks.types'
export type { Emitter } from './types/emitter.types'

export const createEmitter = <T extends EventMap>(): Prettify<Emitter<T & BaseEventMap>> => {
  const store = createStore<T>()
  const cache = new NamespaceCache<T>()
  const namespaceAPI = getNamespaceAPI(store, cache)

  const baseEmitter = createBaseEmitter<T>(store, namespaceAPI)

  return createProxy(baseEmitter, namespaceAPI)
}

type MyEvents = {
  // flat events
  'plain': string
  'plainNull': null
  'plainOptional'?: string
  'mixed': { id: string; name?: string }
  // namespaced events (ns:action)
  'user:login': { userId: string }
  'user:logout': { reason?: string }
  'cache:hit': { key: string }
  'cache:miss': never
  'products:added': { productId?: string }
}

const emitter = createEmitter<MyEvents>()

emitter.on('plain', (payload) => {
  console.log('plain', payload)
})

emitter.on('error', (error) => {
  console.error(error)
})
emitter.on('user:login', () => {})
emitter.on('user:logout', () => {})
emitter.emit('plainNull') // OK to omit payload
emitter.emit('cache:miss') // OK to omit payload
emitter.emit('plainOptional') // OK to omit payload

// @ts-expect-error Error: Expected 2 arguments, but got 1
emitter.emit('cache:hit') // Error: Expected 2 arguments, but got 1
// @ts-expect-error Error: Expected 2 arguments, but got 1
emitter.emit('user:login') // Error: Expected 2 arguments, but got 1

emitter.cache.emit('miss')
// @ts-expect-error Error: Expected 2 arguments, but got 1
emitter.cache.emit('hit') // Error: Expected 2 arguments, but got 1
emitter.cache.emit('hit', { key: 'data' })

// @ts-expect-error Error: Invalid event
emitter.products.emit('added')

// Expect flat events
emitter.on('*', (event, payload) => {
  console.log('Event', event, payload)
})

emitter.emit('plain', 'Hello world')

const user = emitter.ns('user')

emitter.ns('cache').on('hit', (payload) => {
  console.log('Cache hit', payload)
})

user.on('login', (payload) => {
  console.log('login', payload)
})

emitter.user.emit('logout', { reason: 'User logged out' })
emitter.cache.off('hit', () => {})
emitter.cache.emit('hit', { key: 'some-key' })

// @ts-expect-error Error: missing required payload
emitter.emit('mixed') // Error: missing required payload
// @ts-expect-error Error: missing required property
emitter.emit('mixed', {}) // Error: missing required property
// @ts-expect-error Error: missing required property
emitter.emit('mixed', { name: 'test' }) // Error: missing required property
emitter.emit('mixed', { id: '123' }) // OK
emitter.emit('mixed', { id: '123', name: 'test' }) // OK
