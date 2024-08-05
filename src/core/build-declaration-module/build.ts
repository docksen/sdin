import { join } from 'path'
import { emptyDir } from 'fs-extra'
import gulp from 'gulp'
import gulpTypeScript from 'gulp-typescript'
import { pipeline } from 'utils/stream'
import { gulpExtraFilter, gulpReplaceVariables } from 'utils/gulp'
import { getTypeScriptSettings } from './typescript'
import type { SdinConfig, SdinDeclarationModule } from 'core/config'
import { cyan, green, magenta, printSuccess, yellow } from 'utils/print'
import { ms2s } from 'utils/unit'

export interface SdinDeclarationModuleBuildingOptions {
  config: SdinConfig
  module: SdinDeclarationModule
}

const DTSX_EXP = /\.d\.tsx?$/

export async function buildSdinDeclarationModule(
  options: SdinDeclarationModuleBuildingOptions
): Promise<void> {
  const { module } = options
  const startTime = Date.now()
  await emptyDir(module.tar)
  await Promise.all([buildTypeScriptDefineFiles(options), buildTypeScriptContentFiles(options)])
  printSuccess(
    `Successfully built ${green(module.type)} ${magenta(module.mode)} module ${yellow(
      module.name
    )}, it took ${cyan(ms2s(Date.now() - startTime))} s.`
  )
}

function buildTypeScriptDefineFiles(options: SdinDeclarationModuleBuildingOptions): Promise<void> {
  const { module } = options
  return pipeline(
    gulp.src('**/*', { cwd: module.src }),
    gulpExtraFilter(file => DTSX_EXP.test(file.basename)),
    gulpExtraFilter(module.includes),
    gulpExtraFilter(module.excludes, { reverse: true }),
    gulp.dest(module.tar)
  )
}

function buildTypeScriptContentFiles(options: SdinDeclarationModuleBuildingOptions): Promise<void> {
  const { config, module } = options
  const tsProject = gulpTypeScript.createProject(getTypeScriptSettings(config, module))
  const tsStream: NodeJS.ReadWriteStream = tsProject({
    error: err => {
      tsStream.emit('error', err.stack || err.message)
    }
  })
  const srcFilter = gulpExtraFilter(file => file.path.startsWith(module.src), {
    restore: true
  })
  return pipeline(
    gulp.src([config.withProPath('declarations/**/*.d.ts'), join(module.src, '**/*.{ts,tsx}')]),
    srcFilter,
    gulpExtraFilter(module.includes),
    gulpExtraFilter(module.excludes, { reverse: true }),
    gulpReplaceVariables(module.definitions),
    srcFilter.restore,
    tsStream,
    (ts: any) => ts.dts,
    gulp.dest(module.tar)
  )
}
