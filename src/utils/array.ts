import { OrNil } from './types'

export function filterNotNil<T>(list?: OrNil<T>[]): T[] {
  const newList: T[] = []
  if (list) {
    for (const item of list) {
      if (item !== undefined && item !== null) {
        newList.push(item)
      }
    }
  }
  return newList
}

export function asyncMap<T, R>(
  list: T[],
  callback: (item: T, index: number) => Promise<R>
): Promise<Awaited<R>[]> {
  const promises: Promise<R>[] = []
  for (let i = 0; i < list.length; i++) {
    promises.push(callback(list[i], i))
  }
  return Promise.all(promises)
}

export async function asyncForEach<T>(
  list: T[],
  callback: (item: T, index: number) => Promise<any>
): Promise<void> {
  const promises: Promise<any>[] = []
  for (let i = 0; i < list.length; i++) {
    promises.push(callback(list[i], i))
  }
  await Promise.all(promises)
}
