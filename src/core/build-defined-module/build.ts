import gulp from 'gulp'
import gulpFilter from 'gulp-filter'
import gulpTypescript from 'gulp-typescript'
import { pipeline } from 'utils/stream'
import { gulpReplace, reverseGulpFilterPattern } from 'utils/gulp'
import type { SdinConfig, SdinDefinedModule } from 'core/config'

export interface BuildSdinDefinedModuleOptions {
  config: SdinConfig
  module: SdinDefinedModule
}

const TYPESCRIPT_EXP = /\.tsx?$/
const TYPESCRIPT_DEFINE_EXP = /\.d\.tsx?$/

export async function buildSdinDefinedModule(
  options: BuildSdinDefinedModuleOptions
): Promise<void> {
  await Promise.all([buildTypescriptDefineFiles(options), buildTypescriptContentFiles(options)])
}

function buildTypescriptDefineFiles(options: BuildSdinDefinedModuleOptions): Promise<void> {
  const { module } = options
  return pipeline(
    gulp.src('**/*', { cwd: module.src }),
    gulpFilter(file => TYPESCRIPT_DEFINE_EXP.test(file.path)),
    module.includes.length > 0 && gulpFilter(module.includes),
    module.excludes.length > 0 && gulpFilter(reverseGulpFilterPattern(module.excludes)),
    gulpReplace(module.definitions),
    gulp.dest(module.dist)
  )
}

function buildTypescriptContentFiles(options: BuildSdinDefinedModuleOptions): Promise<void> {
  const { config, module } = options
  const tsProject = gulpTypescript.createProject(config.getConfigPath('tsconfig.json'), {
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
    gulpFilter(file => TYPESCRIPT_EXP.test(file.path) && !TYPESCRIPT_DEFINE_EXP.test(file.path)),
    module.includes.length > 0 && gulpFilter(module.includes),
    module.excludes.length > 0 && gulpFilter(reverseGulpFilterPattern(module.excludes)),
    gulpReplace(module.definitions),
    tsStream,
    (ts: any) => ts.dts,
    gulp.dest(module.dist)
  )
}
