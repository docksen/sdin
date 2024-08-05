import gulp from 'gulp'
import sass from 'sass'
import gulpBabel from 'gulp-babel'
import gulpUglify from 'gulp-uglify'
import gulpSassFactory from 'gulp-sass'
import { getBabelOptions } from './babel'
import { pipeline } from 'utils/stream'
import { gulpExtraFilter } from 'utils/gulp'
import type { SdinConfig, SdinFoundationModule } from 'core/config'
import { emptyDir } from 'fs-extra'
import { cyan, green, magenta, printSuccess, yellow } from 'utils/print'
import { ms2s } from 'utils/unit'

export interface SdinFoundationModuleBuildingOptions {
  config: SdinConfig
  module: SdinFoundationModule
}

const gulpSass = gulpSassFactory(sass)

const SACSS_EXP = /\.s[ac]ss$/
const TJSX_EXP = /\.[tj]sx?$/
const DTSX_EXP = /\.d\.tsx?$/

export async function buildSdinFoundationModule(
  options: SdinFoundationModuleBuildingOptions
): Promise<void> {
  const { module } = options
  const startTime = Date.now()
  await emptyDir(module.tar)
  await Promise.all([
    buildScriptContentFiles(options),
    buildSassFiles(options),
    buildOtherFiles(options)
  ])
  printSuccess(
    `Successfully built ${green(module.type)} ${magenta(module.mode)} module ${yellow(
      module.name
    )}, it took ${cyan(ms2s(Date.now() - startTime))} s.`
  )
}

function buildSassFiles(options: SdinFoundationModuleBuildingOptions): Promise<void> {
  const { module } = options
  return pipeline(
    gulp.src('**/*', { cwd: module.src, sourcemaps: module.sourceMap }),
    gulpExtraFilter(file => SACSS_EXP.test(file.basename)),
    gulpExtraFilter(module.includes),
    gulpExtraFilter(module.excludes, { reverse: true }),
    gulpSass({ outputStyle: module.minify ? 'compressed' : 'expanded' }),
    gulp.dest(module.tar, { sourcemaps: module.sourceMap ? '.' : false })
  )
}

function buildScriptContentFiles(options: SdinFoundationModuleBuildingOptions): Promise<void> {
  const { module } = options
  return pipeline(
    gulp.src('**/*', { cwd: module.src, sourcemaps: module.sourceMap }),
    gulpExtraFilter(file => TJSX_EXP.test(file.basename) && !DTSX_EXP.test(file.basename)),
    gulpExtraFilter(module.includes),
    gulpExtraFilter(module.excludes, { reverse: true }),
    gulpBabel(getBabelOptions(options.config, options.module)),
    module.minify &&
      gulpUglify({
        compress: true,
        mangle: module.uglify && { toplevel: true }
      }),
    gulp.dest(module.tar, { sourcemaps: module.sourceMap ? '.' : false })
  )
}

function buildOtherFiles(options: SdinFoundationModuleBuildingOptions): Promise<void> {
  const { module } = options
  return pipeline(
    gulp.src('**/*', { cwd: module.src }),
    gulpExtraFilter(file => !TJSX_EXP.test(file.basename) && !SACSS_EXP.test(file.basename)),
    gulpExtraFilter(module.includes),
    gulpExtraFilter(module.excludes, { reverse: true }),
    gulp.dest(module.tar)
  )
}
