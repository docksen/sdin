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
} from 'tools/errors'
export {
  RuntimeError,
  GitError,
  NpmError,
  PathError,
  ReadingError,
  SteamError,
  WritingError,
  EnquiringError
} from 'utils/errors'

export type { SdinProjectReadingParams } from 'main/config'
export type { SdinProjectCreatingOptions, SdinTemplateMeta } from 'main/create'
export type { SdinProjectStartingOptions } from 'main/start'
export type { SdinProjectBuildingOptions } from 'main/build'
export type { SdinProjectTestingOptions } from 'main/test'
export type { SdinProjectPlayingOptions } from 'main/play'
export type { SdinProject, SdinProjectParams } from 'configs/project'
export type { SdinModule, SdinModuleParams } from 'configs/module'
export type {
  SdinDeclarationModule,
  SdinDeclarationModuleParams,
  SdinDeclarationModuleDatas
} from 'configs/declaration-module'
export type {
  SdinFoundationModule,
  SdinFoundationModuleParams,
  SdinFoundationModuleDatas
} from 'configs/foundation-module'
export type {
  SdinIntegrationModule,
  SdinIntegrationModuleParams,
  SdinIntegrationModuleDatas
} from 'configs/integration-module'
export type {
  SdinApplicationModule,
  SdinApplicationModuleParams,
  SdinApplicationModuleDatas
} from 'configs/application-module'
export type {
  SdinApplicationPage,
  SdinApplicationPageParams,
  SdinApplicationPageDatas,
  SdinApplicationPageElement,
  SdinApplicationPageSkeleton
} from 'configs/application-page'
export type { SdinTesting, SdinTestingParams } from 'configs/testing'
export type { SdinPlaying, SdinPlayingParams, SdinPlayingDatas } from 'configs/playing'
