export interface Cacher {
  has: (key: string) => boolean
  get: (key: string) => any
  set: (key: string, value: any, expireTime?: number | undefined) => void
}

/**
 * 创建一个缓存器
 * @param defaultExpireTime 默认的过期时间，单位ms，默认值 200
 */
export function createCacher(defaultExpireTime: number = 200): Cacher {
  const cache: Record<string, any> = {}
  return {
    has: (key: string) => key in cache,
    get: (key: string) => cache[key],
    set: (key: string, value: any, expireTime?: number) => {
      cache[key] = value
      setTimeout(() => {
        delete cache[key]
      }, expireTime || defaultExpireTime)
    }
  }
}
