export interface Cacher<K = any, V = any> {
  has: (key: K) => boolean
  get: (key: K) => V | undefined
  set: (key: K, value: V, expireTime?: number) => void
}

/**
 * 创建一个缓存器
 * @param defaultExpireTime 默认的过期时间，单位ms，默认 1000 ms
 * @param onDelete 监听删除动作
 */
export function createCacher<K = any, V = any>({
  defaultExpireTime = 1000,
  onDelete
}: {
  defaultExpireTime?: number
  onDelete?: (key: K, value: V | undefined) => void
} = {}): Cacher<K, V> {
  const dataMap = new Map<K, [V, any]>()
  const has = (key: K) => dataMap.has(key)
  const get = (key: K) => dataMap.get(key)?.[0]
  const set = (key: K, value: V, expireTime?: number): void => {
    const oldData = dataMap.get(key)
    if (oldData) {
      clearTimeout(oldData[1])
    }
    const timer = setTimeout(() => {
      if (onDelete) {
        onDelete(key, get(key))
      }
      dataMap.delete(key)
    }, expireTime || defaultExpireTime)
    dataMap.set(key, [value, timer])
  }
  return { has, get, set }
}

export interface Lazyer<V = any> {
  initialized: boolean
  get: () => V
}

/**
 * 创建一个惰性值存储器
 */
export function createLazyer<V = any>(init: () => V): Lazyer<V> {
  const lazyer: Lazyer<V> = {
    initialized: false,
    get: () => {
      if (!lazyer.initialized) {
        const value = init()
        lazyer.get = () => value
        lazyer.initialized = true
        return value
      } else {
        return 0 as any
      }
    }
  }
  return lazyer
}
