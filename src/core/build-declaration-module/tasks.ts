import { join } from 'path'
import gulp from 'gulp'
import gulpTypeScript from 'gulp-typescript'
import { pipeline } from 'utils/stream'
import { gulpExtraFilter, gulpReplaceVariables } from 'utils/gulp'
import { getTypeScriptSettings } from './typescript'
import { SdinDeclarationModule } from 'configs/declaration-module'

const DTS_EXP = /\.d\.ts$/

export function buildTypeScriptSrcDeclarationFiles(module: SdinDeclarationModule): Promise<void> {
  return pipeline(
    gulp.src('**/*', { cwd: module.src }),
    gulpExtraFilter(file => DTS_EXP.test(file.basename)),
    gulpExtraFilter(module.includes),
    gulpExtraFilter(module.excludes, { reverse: true }),
    gulp.dest(module.tar)
  )
}

export function buildTypeScriptContentFiles(module: SdinDeclarationModule): Promise<void> {
  const tsProject = gulpTypeScript.createProject(getTypeScriptSettings(module))
  const tsStream: NodeJS.ReadWriteStream = tsProject({
    error: err => {
      tsStream.emit('error', err.stack || err.message)
    }
  })
  const srcFilter = gulpExtraFilter(file => file.path.startsWith(module.src), {
    restore: true
  })
  return pipeline(
    gulp.src([module.withPro('declarations/**/*.d.ts'), join(module.src, '**/*.{ts,tsx}')]),
    srcFilter,
    gulpExtraFilter(module.includes),
    gulpExtraFilter(module.excludes, { reverse: true }),
    gulpReplaceVariables(module.getMacros()),
    srcFilter.restore,
    tsStream,
    (ts: any) => ts.dts,
    gulp.dest(module.tar)
  )
}
