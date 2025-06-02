import { SdinProject, SdinProjectDatas } from './project'
import { SdinApplicationModule, SdinApplicationModuleParams } from './application-module'

export interface SdinPlayingDatas extends SdinProjectDatas {}

/**
 * Sdin 演示选项
 */
export interface SdinPlayingParams
  extends Omit<
    SdinApplicationModuleParams,
    'type' | 'name' | 'mode' | 'minify' | 'uglify' | 'sourceMap' | 'devEmoji'
  > {}

/**
 * Sdin 演示配置
 */
export class SdinPlaying extends SdinApplicationModule {
  public constructor(project: SdinProject, params: SdinPlayingParams) {
    super(project, {
      ...params,
      type: 'application',
      name: 'playing',
      mode: 'csr',
      src: params.src ? project.withRoot(params.src) : project.withPro('playing'),
      tar: params.tar ? project.withRoot(params.tar) : project.withTmp('playing'),
      path: params.path || '/',
      minify: false,
      uglify: false,
      sourceMap: false,
      devEmoji: '🎮'
    })
  }
}
