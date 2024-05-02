import ora from 'ora'
import { isFunction } from 'lodash'
import { FunctionResult, PromiseData } from './types'

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

export function getErrorMsg(err: any): string {
  if (err instanceof Error) {
    return err.message
  } else {
    return err.toString()
  }
}

export function print(msg: any, icon?: string, exitCode?: undefined, noBlank?: boolean): void
export function print(
  msg: any,
  icon: string | undefined,
  exitCode: number,
  noBlank?: boolean
): never
export function print(msg: any, icon?: string, exitCode?: number, noBlank?: boolean): void {
  if (msg) {
    if (msg instanceof Error) {
      console.error(msg)
    } else {
      const text = (icon ? icon + ' ' : '') + msg
      if (noBlank) {
        process.stdout.write(text)
      } else {
        console.log(text)
      }
    }
    if (Number.isInteger(exitCode)) {
      console.log()
      process.exit(exitCode)
    }
  }
}

export function printInfo(msg: any, exitCode?: undefined): void
export function printInfo(msg: any, exitCode: number): never
export function printInfo(msg: any, exitCode?: number) {
  if (exitCode) {
    print(msg, blue('i'), exitCode)
  } else {
    print(msg, blue('i'))
  }
}

export function printWarn(msg: any, exitCode?: undefined): void
export function printWarn(msg: any, exitCode: number): never
export function printWarn(msg: any, exitCode?: number) {
  if (exitCode) {
    print(msg, yellow('!'), exitCode)
  } else {
    print(msg, yellow('!'))
  }
}

export function printSuccess(msg: any, exitCode?: undefined): void
export function printSuccess(msg: any, exitCode: number): never
export function printSuccess(msg: any, exitCode?: number) {
  if (exitCode) {
    print(msg, green('√'), exitCode)
  } else {
    print(msg, green('√'))
  }
}

export function printError(msg: any, exitCode?: undefined): void
export function printError(msg: any, exitCode: number): never
export function printError(msg: any, exitCode?: number) {
  if (exitCode) {
    print(msg, red('x'), exitCode)
  } else {
    print(msg, red('x'))
  }
}

export function printLoading<T extends () => any>({
  exitCode,
  start,
  pendding,
  success,
  failed,
  task
}: {
  exitCode?: number
  start?: string
  pendding?: string | (() => string)
  success?: string | ((res: PromiseData<FunctionResult<T>>) => string)
  failed?: string | ((err: any) => string)
  task: T
}): FunctionResult<T | undefined> {
  const spinner = ora({})
  spinner.start(start)
  const onPendding = () => {
    const msg = isFunction(pendding) ? pendding() : pendding
    if (msg) {
      spinner.text = msg
    }
  }
  const timer = setInterval(onPendding, 100)
  const onSuccess = (res: any) => {
    if (timer) {
      clearInterval(timer)
    }
    spinner.succeed(isFunction(success) ? success(res) : success)
    return res
  }
  const onFailed = (err: any) => {
    if (timer) {
      clearInterval(timer)
    }
    spinner.fail(isFunction(failed) ? failed(err) : `${failed}\n${err}`)
    if (exitCode) {
      process.exit(exitCode)
    }
  }
  try {
    const res = task()
    if (isFunction(res?.then)) {
      return res.then(onSuccess).catch(onFailed)
    } else {
      return onSuccess(res)
    }
  } catch (err) {
    onFailed(err)
  }
}
