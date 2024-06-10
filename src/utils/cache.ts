export interface Cacher<K = any, V = any> {
  has: (key: K) => boolean
  get: (key: K) => V | undefined
  set: (key: K, value: V, expireTime?: number) => void
}

/**
 * 创建一个缓存器
 * @param defaultExpireTime 默认的过期时间，单位ms，默认值 200
 */
export function createCacher<K = any, V = any>(defaultExpireTime: number = 200): Cacher<K, V> {
  const dataMap = new Map<K, [V, any]>()
  return {
    has: (key: K) => dataMap.has(key),
    get: (key: K) => dataMap.get(key)?.[0],
    set: (key: K, value: V, expireTime?: number): void => {
      const oldData = dataMap.get(key)
      if (oldData) {
        clearTimeout(oldData[1])
      }
      const timer = setTimeout(() => {
        dataMap.delete(key)
      }, expireTime || defaultExpireTime)
      dataMap.set(key, [value, timer])
    }
  }
}
