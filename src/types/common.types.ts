export type IsNullable<T> = T extends null | undefined | void | never ? true : false
export type HasUndefined<T> = undefined extends T ? true : false

/**
 * @see https://www.totaltypescript.com/concepts/the-prettify-helper
 */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
