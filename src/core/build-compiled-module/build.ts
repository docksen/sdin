import gulp from 'gulp'
import sass from 'sass'
import gulpFilter from 'gulp-filter'
import gulpBabel from 'gulp-babel'
import gulpUglify from 'gulp-uglify'
import gulpSassFactory from 'gulp-sass'
import { getBabelOptions } from './babel'
import { pipeline } from 'utils/stream'
import { reverseGulpFilterPattern } from 'utils/gulp'
import type { SdinConfig, SdinCompiledModule } from 'core/config'

export interface BuildSdinCompiledModuleOptions {
  config: SdinConfig
  module: SdinCompiledModule
}

const gulpSass = gulpSassFactory(sass)

const SACSS_EXP = /\.s[ac]ss$/
const TJSX_EXP = /\.[tj]sx?$/
const DTSX_EXP = /\.d\.tsx?$/

export async function buildSdinCompiledModule(
  options: BuildSdinCompiledModuleOptions
): Promise<void> {
  await Promise.all([
    buildScriptContentFiles(options),
    buildSassFiles(options),
    buildOtherFiles(options)
  ])
}

function buildSassFiles(options: BuildSdinCompiledModuleOptions): Promise<void> {
  const { module } = options
  return pipeline(
    gulp.src('**/*', { cwd: module.src, sourcemaps: module.sourceMap }),
    module.includes.length > 0 && gulpFilter(module.includes),
    module.excludes.length > 0 && gulpFilter(reverseGulpFilterPattern(module.excludes)),
    gulpFilter(file => SACSS_EXP.test(file.basename)),
    gulpSass({
      outputStyle: module.minify ? 'compressed' : 'nested'
    }),
    gulp.dest(module.dist, { sourcemaps: module.sourceMap })
  )
}

function buildScriptContentFiles(options: BuildSdinCompiledModuleOptions): Promise<void> {
  const { module } = options
  return pipeline(
    gulp.src('**/*', { cwd: module.src, sourcemaps: module.sourceMap }),
    module.includes.length > 0 && gulpFilter(module.includes),
    module.excludes.length > 0 && gulpFilter(reverseGulpFilterPattern(module.excludes)),
    gulpFilter(file => TJSX_EXP.test(file.basename) && !DTSX_EXP.test(file.basename)),
    gulpBabel(getBabelOptions(options.config, options.module)),
    module.uglify &&
      gulpUglify({
        mangle: { toplevel: true },
        compress: options.module.minify
      }),
    gulp.dest(module.dist, { sourcemaps: module.sourceMap })
  )
}

function buildOtherFiles(options: BuildSdinCompiledModuleOptions): Promise<void> {
  const { module } = options
  return pipeline(
    gulp.src('**/*', { cwd: module.src }),
    module.includes.length > 0 && gulpFilter(module.includes),
    module.excludes.length > 0 && gulpFilter(reverseGulpFilterPattern(module.excludes)),
    gulpFilter(file => !TJSX_EXP.test(file.basename) && !SACSS_EXP.test(file.basename)),
    gulp.dest(module.dist)
  )
}
