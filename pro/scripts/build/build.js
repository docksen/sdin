const gulp = require('gulp')
const gulpFilter = require('gulp-filter')
const gulpBabel = require('gulp-babel')
const gulpUglify = require('gulp-uglify')
const gulpTypescript = require('gulp-typescript')
const { ms2s } = require('../utils/unit')
const { resolve } = require('path')
const { emptyDir } = require('fs-extra')
const { getBabelOptions } = require('./babel')
const { createModuleAliasTypescriptTransformer } = require('./plugin')
const { pipeline, reverseGulpFilterPattern } = require('../utils/gulp')
const { blue, magenta, green, cyan, yellow, printSuccess, printInfo } = require('../utils/print')

const TJSX_EXP = /\.[tj]sx?$/
const DTSX_EXP = /\.d\.tsx?$/

function build(config) {
  const pkg = require(resolve(config.root, 'package.json'))
  printInfo(`Project ${blue(pkg.name)}, version ${magenta(pkg.version)}.`)
  Promise.all(config.modules.map(module => buildModule({ config, module })))
}

async function buildModule(options) {
  const { config, module } = options
  const startTime = Date.now()
  if (module.type === 'foundation') {
    await emptyDir(resolve(config.root, module.tar))
    await Promise.all([buildScriptContentFiles(options), buildOtherFiles(options)])
    printSuccess(
      `Successfully built ${green(module.type)} ${magenta(module.mode)} module ${yellow(
        module.name
      )}, it took ${cyan(ms2s(Date.now() - startTime))} s.`
    )
  } else if (module.type === 'declaration') {
    await emptyDir(resolve(config.root, module.tar))
    await Promise.all([buildTypescriptDefineFiles(options), buildTypescriptContentFiles(options)])
    printSuccess(
      `Successfully built ${green(module.type)} ${magenta(module.mode)} module ${yellow(
        module.name
      )}, it took ${cyan(ms2s(Date.now() - startTime))} s.`
    )
  } else {
    throw new Error(`Cannot support unknown module type (${module.type}).`)
  }
}

function buildScriptContentFiles(options) {
  const { config, module } = options
  return pipeline(
    gulp.src('**/*', { cwd: resolve(config.root, module.src), sourcemaps: module.sourceMap }),
    gulpFilter(file => TJSX_EXP.test(file.basename) && !DTSX_EXP.test(file.basename)),
    module.includes.length > 0 && gulpFilter(module.includes),
    module.excludes.length > 0 && gulpFilter(reverseGulpFilterPattern(module.excludes)),
    gulpBabel(getBabelOptions(options)),
    module.uglify &&
      gulpUglify({
        mangle: { toplevel: true },
        compress: module.minify
      }),
    gulp.dest(resolve(config.root, module.tar), {
      sourcemaps: module.sourceMap ? '.' : false
    })
  )
}

function buildTypescriptDefineFiles(options) {
  const { config, module } = options
  return pipeline(
    gulp.src('**/*', { cwd: resolve(config.root, module.src) }),
    gulpFilter(file => DTSX_EXP.test(file.basename)),
    module.includes.length > 0 && gulpFilter(module.includes),
    module.excludes.length > 0 && gulpFilter(reverseGulpFilterPattern(module.excludes)),
    gulp.dest(resolve(config.root, module.tar))
  )
}

function buildTypescriptContentFiles(options) {
  const { config, module } = options
  const tsConfigPath = resolve(config.root, 'tsconfig.json')
  const tsProject = gulpTypescript.createProject(tsConfigPath, {
    outDir: module.tar,
    declaration: true,
    removeComments: false,
    getCustomTransformers: program => {
      return {
        afterDeclarations: [
          createModuleAliasTypescriptTransformer({ root: config.root, alias: config.alias })
        ]
      }
    }
  })
  const tsStream = tsProject({
    error: err => {
      tsStream.emit('error', err.stack || err.message)
    }
  })
  return pipeline(
    tsProject.src(),
    tsStream,
    ts => ts.dts,
    module.includes.length > 0 && gulpFilter(module.includes),
    module.excludes.length > 0 && gulpFilter(reverseGulpFilterPattern(module.excludes)),
    gulp.dest(resolve(config.root, module.tar))
  )
}

function buildOtherFiles(options) {
  const { config, module } = options
  return pipeline(
    gulp.src('**/*', { cwd: resolve(config.root, module.src) }),
    gulpFilter(file => !TJSX_EXP.test(file.basename)),
    module.includes.length > 0 && gulpFilter(module.includes),
    module.excludes.length > 0 && gulpFilter(reverseGulpFilterPattern(module.excludes)),
    gulp.dest(resolve(config.root, module.tar))
  )
}

module.exports = {
  build
}
