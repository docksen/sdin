import gulp from 'gulp'
import gulpFilter from 'gulp-filter'
import gulpBabel from 'gulp-babel'
import gulpUglify from 'gulp-uglify'
import { getBabelOptions } from './babel'
import { pipeline } from 'utils/stream'
import { gulpReplace, reverseGulpFilterPattern } from 'utils/gulp'
import type { SdinConfig, SdinCompiledModule } from 'core/config'

export interface BuildSdinCompiledModuleOptions {
  config: SdinConfig
  module: SdinCompiledModule
}

const SCRIPT_EXP = /\.[tj]sx?$/
const TYPESCRIPT_DEFINE_EXP = /\.d\.tsx?$/

export async function buildSdinCompiledModule(
  options: BuildSdinCompiledModuleOptions
): Promise<void> {
  await Promise.all([buildAssetsFiles(options), buildScriptContentFiles(options)])
}

function buildAssetsFiles(options: BuildSdinCompiledModuleOptions): Promise<void> {
  const { module } = options
  return pipeline(
    gulp.src('**/*', { cwd: module.src }),
    gulpFilter(file => !SCRIPT_EXP.test(file.path)),
    module.includes.length > 0 && gulpFilter(module.includes),
    module.excludes.length > 0 && gulpFilter(reverseGulpFilterPattern(module.excludes)),
    gulpReplace(module.definitions),
    gulp.dest(module.dist)
  )
}

function buildScriptContentFiles(options: BuildSdinCompiledModuleOptions): Promise<void> {
  const { module } = options
  return pipeline(
    gulp.src('**/*', { cwd: module.src }),
    gulpFilter(file => SCRIPT_EXP.test(file.path) && !TYPESCRIPT_DEFINE_EXP.test(file.path)),
    module.includes.length > 0 && gulpFilter(module.includes),
    module.excludes.length > 0 && gulpFilter(reverseGulpFilterPattern(module.excludes)),
    gulpBabel(getBabelOptions(options.config, options.module)),
    module.uglify &&
      gulpUglify({
        mangle: { toplevel: true },
        compress: options.module.minify
      }),
    gulp.dest(module.dist)
  )
}
