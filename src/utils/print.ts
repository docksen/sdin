import { isNil } from 'lodash'
import { ellipsis } from './string'
import { filterNotNone } from './array'
import { SdinBusinessError, SdinError } from './error'

export function red(msg: any): string {
  return isNil(msg) ? '' : '\x1B[31m' + msg + '\x1B[0m'
}

export function green(msg: any): string {
  return isNil(msg) ? '' : '\x1B[32m' + msg + '\x1B[0m'
}

export function yellow(msg: any): string {
  return isNil(msg) ? '' : '\x1B[33m' + msg + '\x1B[0m'
}

export function blue(msg: any): string {
  return isNil(msg) ? '' : '\x1B[34m' + msg + '\x1B[0m'
}

export function magenta(msg: any): string {
  return isNil(msg) ? '' : '\x1B[35m' + msg + '\x1B[0m'
}

export function cyan(msg: any): string {
  return isNil(msg) ? '' : '\x1B[36m' + msg + '\x1B[0m'
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
  if (error instanceof SdinError) {
    print(error.message, red('x'), error.code)
  } else {
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
}

function clearCurrentLine() {
  process.stdout.write('\r\x1b[K')
}

function printCurrentLine(msg: string, icon?: string) {
  clearCurrentLine()
  process.stdout.write((icon ? icon + ' ' : '') + msg)
}

export interface PrintableTaskProps<P> {
  progress: (percent: number) => void
  loading: (payload: P) => void
}

const LOADING_ICONS = [magenta('⠙'), red('⠸'), yellow('⠴'), green('⠦'), blue('⠇'), cyan('⠋')]

export async function printTask<P, R>({
  exitCode,
  loading,
  resolve,
  reject,
  task
}: {
  exitCode?: number
  loading: (payload?: P) => string
  resolve: (result: R) => string
  reject: (reason: any) => string
  task: (props: PrintableTaskProps<P>) => Promise<R>
}): Promise<R> {
  let percent: number | undefined
  let messages: string[] = []
  let iconIndex: number = -1
  let iconRepeat: number = -1
  const timer = setInterval(() => {
    const msg = messages.length > 1 ? messages.shift() : messages[0]
    const text = filterNotNone([
      percent === undefined ? undefined : `${percent} / ${100}`,
      msg === undefined ? undefined : ellipsis(msg, 80)
    ]).join(' ')
    if (text) {
      iconRepeat = (iconRepeat + 1) % 3
      if (iconRepeat === 0) {
        iconIndex = (iconIndex + 1) % LOADING_ICONS.length
      }
      printCurrentLine(text, LOADING_ICONS[iconIndex])
    }
  }, 200)
  const clear = () => {
    clearInterval(timer)
    clearCurrentLine()
    percent = undefined
    messages = []
  }
  try {
    const handleProgress = (value: number) => {
      percent = value
    }
    const handleLoading = (value?: P) => {
      messages = loading(value).split('\n').filter(Boolean)
    }
    handleLoading()
    const result = await task({
      progress: handleProgress,
      loading: handleLoading
    })
    clear()
    printSuccess(resolve(result))
    return result
  } catch (error: any) {
    clear()
    if (exitCode !== undefined) {
      if (error instanceof Error) {
        printError(reject(error), error, exitCode)
      } else {
        printError(reject(error), exitCode)
      }
    } else {
      printError(reject(error))
      throw error
    }
  }
}
