import { Stats, Compiler } from 'webpack'
import { printWarn, printInfo } from 'utils/print'
import { RuntimeError } from 'utils/errors'

export class WebpackError extends RuntimeError {
  /** Webpack 编译出错 */
  static readonly WEBPACK_COMPILE_ERROR = 110201
}

export function compile(compiler: Compiler) {
  return new Promise<Stats | undefined>((resolve, reject) => {
    compiler.run((runErr, stats) => {
      compiler.close(closeErr => {
        const error = runErr ?? closeErr
        if (error) {
          reject(error)
        } else {
          resolve(stats)
        }
      })
    })
  })
}

export function showStats(stats?: Stats, success?: (showDetails: () => void) => void) {
  if (!stats) {
    return
  }
  const info = stats.toJson({})
  const hasErrors = stats.hasErrors()
  const hasWarnings = stats.hasWarnings()
  if (hasErrors) {
    const errors = info.errors || []
    const errMsgs = errors.map(i => i.message)
    errMsgs.unshift('Project built errors:')
    throw new WebpackError(WebpackError.WEBPACK_COMPILE_ERROR, errMsgs)
  } else if (hasWarnings) {
    const warnings = info.warnings || []
    const warnMsgs = warnings.map(i => i.message)
    warnMsgs.unshift('Project built warnings:')
    printWarn(warnMsgs)
  } else {
    const showDetails = () => {
      const infoMsgs = stats.toString({ preset: 'normal', colors: true }).split('\n')
      infoMsgs.unshift('Project built details:')
      printInfo(infoMsgs)
    }
    if (success) {
      success(showDetails)
    } else {
      showDetails()
    }
  }
}
