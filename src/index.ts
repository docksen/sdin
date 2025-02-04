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
  SdinSuiteParams,
  SdinSuite,
  SdinUnitSuiteParams,
  SdinUnitSuite,
  SdinWebsiteSuiteParams,
  SdinWebsiteSuite,
  SdinConfigReadingParams,
  SdinJestConfig
} from 'core/config'
export type { SdinTemplateMeta } from 'core/enquire'
export type { SdinProjectCreatingOptions } from 'main/create'
export type { SdinProjectBuildingOptions } from 'main/build'
export type { SdinProjectTestingOptions } from 'main/test'
