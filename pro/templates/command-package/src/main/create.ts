export function create(name: string) {
  return new Promise<string>(resolve => {
    setTimeout(() => {
      resolve(name)
    }, 1000)
  })
}
