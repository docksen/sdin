import { OrNone } from './declaration'

export function filterNotNone<T>(list?: OrNone<T>[]): T[] {
  const newList: T[] = []
  if (list) {
    for (const item of list) {
      if (item !== undefined && item !== null && item !== false && item !== '') {
        newList.push(item)
      }
    }
  }
  return newList
}

export function asyncMap<T, R>(
  list: T[],
  callback: (item: T, index: number) => OrNone<Promise<R>>
): Promise<Awaited<R>[]> {
  const promises: Promise<R>[] = []
  for (let i = 0; i < list.length; i++) {
    const result = callback(list[i], i)
    if (result && result instanceof Promise) {
      promises.push(result)
    }
  }
  return Promise.all(promises)
}

export async function asyncForEach<T>(
  list: T[],
  callback: (item: T, index: number) => OrNone<Promise<any>>
): Promise<void> {
  const promises: Promise<any>[] = []
  for (let i = 0; i < list.length; i++) {
    const result = callback(list[i], i)
    if (result && result instanceof Promise) {
      promises.push(result)
    }
  }
  await Promise.all(promises)
}
