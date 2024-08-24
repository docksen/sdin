export function red(msg: any): string {
  return msg ? '\x1B[31m' + msg + '\x1B[0m' : ''
}

export function green(msg: any): string {
  return msg ? '\x1B[32m' + msg + '\x1B[0m' : ''
}

export function yellow(msg: any): string {
  return msg ? '\x1B[33m' + msg + '\x1B[0m' : ''
}

export function blue(msg: any): string {
  return msg ? '\x1B[34m' + msg + '\x1B[0m' : ''
}

export function magenta(msg: any): string {
  return msg ? '\x1B[35m' + msg + '\x1B[0m' : ''
}

export function cyan(msg: any): string {
  return msg ? '\x1B[36m' + msg + '\x1B[0m' : ''
}

function indentMessage(msg: any, icon?: string): string | undefined {
  const msgs = Array.isArray(msg) ? msg : [msg]
  const suf1 = msgs.length > 2 ? '\n    ' : '\n  '
  const suf2 = msgs.length > 2 ? '\n  - ' : '\n  '
  const strs: string[] = []
  for (const item of msgs) {
    if (item) {
      const str1 =
        typeof item === 'string'
          ? item
          : item instanceof Error
          ? item.message
          : JSON.stringify(item)
      if (str1) {
        strs.push(str1.replaceAll('\n', suf1))
      }
    }
  }
  if (strs.length > 0) {
    return (icon ? icon + ' ' : '') + strs.join(suf2)
  }
  return undefined
}

export function print(msg: any, icon: string | undefined, exitCode: number): never
export function print(msg: any, icon?: string, exitCode?: undefined): void
export function print(msg: any, icon?: string, exitCode?: number): void {
  const indented = msg ? indentMessage(msg, icon) : undefined
  if (indented) {
    console.log(indented)
  }
  if (Number.isInteger(exitCode)) {
    console.log()
    process.exit(exitCode)
  }
}

export function printInfo(msg: any, exitCode?: undefined): void
export function printInfo(msg: any, exitCode: number): never
export function printInfo(msg: any, exitCode?: number) {
  if (exitCode !== undefined) {
    print(msg, blue('i'), exitCode)
  } else {
    print(msg, blue('i'))
  }
}

export function printWarn(msg: any, exitCode?: undefined): void
export function printWarn(msg: any, exitCode: number): never
export function printWarn(msg: any, exitCode?: number) {
  if (exitCode !== undefined) {
    print(msg, yellow('!'), exitCode)
  } else {
    print(msg, yellow('!'))
  }
}

export function printSuccess(msg: any, exitCode?: undefined): void
export function printSuccess(msg: any, exitCode: number): never
export function printSuccess(msg: any, exitCode?: number) {
  if (exitCode !== undefined) {
    print(msg, green('√'), exitCode)
  } else {
    print(msg, green('√'))
  }
}

export function printError(error: Error, exitCode?: undefined): void
export function printError(error: Error, exitCode: number): never
export function printError(msg: any, exitCode?: undefined): void
export function printError(msg: any, exitCode: number): never
export function printError(msg: any, error: Error, exitCode?: undefined): void
export function printError(msg: any, error: Error, exitCode: number): never
export function printError(arg1: any, arg2: any, arg3?: number) {
  let msg: any = undefined
  let error: Error | undefined = undefined
  let exitCode: number | undefined = undefined
  if (arg1 instanceof Error) {
    error = arg1
  } else if (arg2 instanceof Error) {
    msg = arg1
    error = arg2
    exitCode = arg3
  } else {
    msg = arg1
    exitCode = arg2
  }
  if (msg) {
    print(msg, red('x'))
  }
  if (error) {
    console.error(error)
  }
  if (exitCode !== undefined) {
    print(undefined, undefined, exitCode)
  }
}
