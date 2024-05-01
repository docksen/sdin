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
