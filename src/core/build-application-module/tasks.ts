import gulp from 'gulp'
import gulpFilter from 'gulp-filter'
import gulpUglify from 'gulp-uglify'
import gulpCleanCss from 'gulp-clean-css'
import { pipeline } from 'utils/stream'
import { SdinApplicationModule } from 'configs/application-module'
import { outputJson } from 'fs-extra'
import { isNonEmptyDir } from 'utils/path'

export async function copyAssetsFiles(module: SdinApplicationModule): Promise<any> {
  if (!isNonEmptyDir(module.astSrc)) {
    return
  }
  const scrFilter = gulpFilter('**/*.js', { restore: true })
  const styFilter = gulpFilter('**/*.css', { restore: true })
  return pipeline(
    gulp.src('**/*', { cwd: module.astSrc }),
    scrFilter,
    gulpUglify(),
    scrFilter.restore,
    styFilter,
    gulpCleanCss(),
    styFilter.restore,
    gulp.dest(module.withTar(module.astPath))
  )
}

export function createManifest(module: SdinApplicationModule): Promise<void> {
  return outputJson(module.withTar('manifest.json'), {
    name: module.name,
    path: module.path,
    astPath: module.astPath,
    index: module.index?.name,
    error: module.error?.name,
    pages: module.pages.map(i => ({
      name: i.name,
      path: i.path
    }))
  })
}
