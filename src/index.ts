export { readSdinProject } from 'main/config'
export { createSdinProject } from 'main/create'
export { startSdinProject } from 'main/start'
export { buildSdinProject } from 'main/build'
export { testSdinProject } from 'main/test'
export { playSdinProject } from 'main/play'
export {
  SdinBusinessError,
  SdinCheckingError,
  SdinConfigError,
  SdinCreatingError,
  SdinStartingError,
  SdinBuildingError,
  SdinTestingError,
  SdinPlayingError
} from 'src/tool/errors'
export {
  RuntimeError,
  GitError,
  NpmError,
  PathError,
  ReadingError,
  SteamError,
  WritingError,
  EnquiringError
} from 'util/errors'

export type { SdinProjectReadingParams } from 'main/config'
export type { SdinProjectCreatingOptions, SdinTemplateMeta } from 'main/create'
export type { SdinProjectStartingOptions } from 'main/start'
export type { SdinProjectBuildingOptions } from 'main/build'
export type { SdinProjectTestingOptions } from 'main/test'
export type { SdinProjectPlayingOptions } from 'main/play'
export type { SdinProject, SdinProjectParams } from 'config/project'
export type { SdinModule, SdinModuleParams } from 'config/module'
export type {
  SdinDeclarationModule,
  SdinDeclarationModuleParams,
  SdinDeclarationModuleDatas
} from 'config/declaration-module'
export type {
  SdinFoundationModule,
  SdinFoundationModuleParams,
  SdinFoundationModuleDatas
} from 'config/foundation-module'
export type {
  SdinIntegrationModule,
  SdinIntegrationModuleParams,
  SdinIntegrationModuleDatas
} from 'config/integration-module'
export type {
  SdinApplicationModule,
  SdinApplicationModuleParams,
  SdinApplicationModuleDatas
} from 'config/application-module'
export type {
  SdinApplicationPage,
  SdinApplicationPageParams,
  SdinApplicationPageDatas,
  SdinApplicationPageElement,
  SdinApplicationPageSkeleton
} from 'config/application-page'
export type { SdinTesting, SdinTestingParams } from 'config/testing'
export type { SdinPlaying, SdinPlayingParams, SdinPlayingDatas } from 'config/playing'
