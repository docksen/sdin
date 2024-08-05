import { Stats, Compiler } from 'webpack'
import { printWarn, printInfo } from './print'
import { SdinUtilsError } from './error'

export function compile(compiler: Compiler) {
  return new Promise<Stats | undefined>((resolve, reject) => {
    compiler.run((runErr, stats) => {
      compiler.close(closeErr => {
        if (runErr || closeErr) {
          reject(runErr ?? closeErr)
        } else {
          resolve(stats)
        }
      })
    })
  })
}

export function showStats({ stats, success }: { stats?: Stats; success?: () => void }) {
  if (!stats) {
    return
  }
  const info = stats.toJson({})
  const hasErrors = stats.hasErrors()
  const hasWarnings = stats.hasWarnings()
  if (hasErrors) {
    const errors = info.errors || []
    throw new SdinUtilsError(SdinUtilsError.WEBPACK_COMPILE_ERROR, [
      'Project built errors:',
      ...errors.map(i => i.message)
    ])
  }
  if (hasWarnings) {
    const warnings = info.warnings || []
    printWarn(['Project built warnings:', ...warnings.map(i => i.message)])
  }
  if (!hasWarnings && !hasErrors) {
    success && success()
    printInfo(['Webpack compiled information:', stats.toString({ preset: 'normal', colors: true })])
  }
}
