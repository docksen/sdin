import gulp from 'gulp'
import sass from 'sass'
import gulpBabel from 'gulp-babel'
import gulpUglify from 'gulp-uglify'
import gulpSassFactory from 'gulp-sass'
import gulpPostCss from 'gulp-postcss'
import postCssImport from 'postcss-import'
import postCssModules from 'postcss-modules'
import { writeJSONSync } from 'fs-extra'
import { getBabelOptions } from './babel'
import { pipeline } from 'utils/stream'
import { gulpExtraFilter } from 'utils/gulp'
import { relativePosix } from 'utils/path'
import type { SdinConfig, SdinFoundationModule } from 'core/config'
import { filterNotNone } from 'utils/array'

const gulpSass = gulpSassFactory(sass)

const SACSS_EXP = /\.s[ac]ss$/
const TJSX_EXP = /\.[tj]sx?$/
const DTS_EXP = /\.d\.ts$/

export function buildScriptContentFiles(
  config: SdinConfig,
  module: SdinFoundationModule
): Promise<void> {
  return pipeline(
    gulp.src('**/*', { cwd: module.src, sourcemaps: module.sourceMap }),
    gulpExtraFilter(file => TJSX_EXP.test(file.basename) && !DTS_EXP.test(file.basename)),
    gulpExtraFilter(module.includes),
    gulpExtraFilter(module.excludes, { reverse: true }),
    gulpBabel(getBabelOptions(config, module)),
    module.minify &&
      gulpUglify({
        compress: true,
        mangle: module.uglify && { toplevel: true }
      }),
    gulp.dest(module.tar, { sourcemaps: module.sourceMap ? '.' : false })
  )
}

export function buildSassFiles(config: SdinConfig, module: SdinFoundationModule): Promise<void> {
  return pipeline(
    gulp.src('**/*', { cwd: module.src, sourcemaps: module.sourceMap }),
    gulpExtraFilter(file => SACSS_EXP.test(file.basename)),
    gulpExtraFilter(module.includes),
    gulpExtraFilter(module.excludes, { reverse: true }),
    gulpSass({ outputStyle: module.minify ? 'compressed' : 'expanded' }),
    gulpPostCss(
      filterNotNone([
        postCssImport({
          root: config.root
        }),
        module.sassModule &&
          postCssModules({
            root: config.root,
            localsConvention: 'camelCaseOnly',
            generateScopedName: config.isProduction()
              ? '[hash:base64:10]'
              : '[local]_[hash:base64:6]',
            getJSON: (cssFileName, json) => {
              const cssJsonRelPath = relativePosix(module.src, cssFileName)
              const cssJsonTarPath = module.withTarPath(cssJsonRelPath) + '.json'
              writeJSONSync(cssJsonTarPath, json, {
                spaces: module.minify ? 0 : 2,
                EOL: module.minify ? '' : '\n'
              })
            }
          })
      ])
    ),
    gulp.dest(module.tar, { sourcemaps: module.sourceMap ? '.' : false })
  )
}

export function copyOtherFiles(module: SdinFoundationModule): Promise<void> {
  return pipeline(
    gulp.src('**/*', { cwd: module.src }),
    gulpExtraFilter(file => !TJSX_EXP.test(file.basename) && !SACSS_EXP.test(file.basename)),
    gulpExtraFilter(module.includes),
    gulpExtraFilter(module.excludes, { reverse: true }),
    gulp.dest(module.tar)
  )
}
