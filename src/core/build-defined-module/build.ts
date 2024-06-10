import gulp from 'gulp'
import gulpFilter from 'gulp-filter'
import gulpTypescript from 'gulp-typescript'
import { pipeline } from 'utils/stream'
import { gulpReplaceVariables, reverseGulpFilterPattern } from 'utils/gulp'
import type { SdinConfig, SdinDefinedModule } from 'core/config'

export interface BuildSdinDefinedModuleOptions {
  config: SdinConfig
  module: SdinDefinedModule
}

const TSX_EXP = /\.tsx?$/
const DTSX_EXP = /\.d\.tsx?$/

export async function buildSdinDefinedModule(
  options: BuildSdinDefinedModuleOptions
): Promise<void> {
  await Promise.all([buildTypescriptDefineFiles(options), buildTypescriptContentFiles(options)])
}

function buildTypescriptDefineFiles(options: BuildSdinDefinedModuleOptions): Promise<void> {
  const { module } = options
  return pipeline(
    gulp.src('**/*', { cwd: module.src }),
    module.includes.length > 0 && gulpFilter(module.includes),
    module.excludes.length > 0 && gulpFilter(reverseGulpFilterPattern(module.excludes)),
    gulpFilter(file => DTSX_EXP.test(file.basename)),
    gulp.dest(module.dist)
  )
}

function buildTypescriptContentFiles(options: BuildSdinDefinedModuleOptions): Promise<void> {
  const { config, module } = options
  const tsConfigPath = config.getConfigPath('tsconfig.json')
  const tsProject = gulpTypescript.createProject(tsConfigPath, {
    declaration: true,
    removeComments: false
  })
  const tsStream: NodeJS.ReadWriteStream = tsProject({
    error: err => {
      tsStream.emit('error', err.stack || err.message)
    }
  })
  return pipeline(
    gulp.src('**/*', { cwd: module.src }),
    module.includes.length > 0 && gulpFilter(module.includes),
    module.excludes.length > 0 && gulpFilter(reverseGulpFilterPattern(module.excludes)),
    gulpFilter(file => TSX_EXP.test(file.basename) && !DTSX_EXP.test(file.basename)),
    gulpReplaceVariables(module.definitions),

    tsStream,
    (ts: any) => ts.dts,
    gulp.dest(module.dist)
  )
}
