export { readSdinConfig } from 'core/config'
export { createSdinProject } from 'main/create'
export { buildSdinProject } from 'main/build'

export type {
  SdinConfigParams,
  SdinConfig,
  SdinModuleParams,
  SdinModule,
  SdinFoundationModuleParams,
  SdinFoundationModule,
  SdinIntegrationModuleParams,
  SdinIntegrationModule,
  SdinDeclarationModuleParams,
  SdinDeclarationModule,
  SdinConfigReadingParams
} from 'core/config'
export type { SdinTemplateMeta } from 'core/enquire'
export type { SdinProjectCreatingOptions } from 'main/create'
export type { SdinProjectBuildingOptions } from 'main/build'
