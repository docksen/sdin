import gulp from 'gulp'
import gulpBabel from 'gulp-babel'
import { getBabelOptions } from './babel'
import { pipeline } from 'utils/stream'
import { gulpExtraFilter } from 'utils/gulp'
import type { SdinConfig } from 'core/config'

const TJSX_EXP = /\.[tj]sx?$/
const DTS_EXP = /\.d\.ts$/

export function buildScriptContentFiles(config: SdinConfig): Promise<void> {
  const testing = config.testing
  return pipeline(
    gulp.src('**/*', { cwd: testing.src }),
    gulpExtraFilter(file => TJSX_EXP.test(file.basename) && !DTS_EXP.test(file.basename)),
    gulpBabel(getBabelOptions(config)),
    gulp.dest(testing.tar)
  )
}

export function copyOtherFiles(config: SdinConfig): Promise<void> {
  const testing = config.testing
  return pipeline(
    gulp.src('**/*', { cwd: testing.src }),
    gulpExtraFilter(file => !TJSX_EXP.test(file.basename)),
    gulp.dest(testing.tar)
  )
}
