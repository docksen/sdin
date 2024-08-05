import TypeScript from 'typescript'
import { Settings } from 'gulp-typescript'
import getTypeScriptPathsTransformer from 'typescript-transform-paths'
import { SdinConfig, SdinDeclarationModule } from 'core/config'

/**
 * 适用于
 */
export function getTypeScriptSettings(config: SdinConfig, module: SdinDeclarationModule): Settings {
  return {
    typescript: TypeScript,
    outDir: module.tar,
    allowJs: true,
    checkJs: false,
    declaration: true,
    removeComments: false,
    noImplicitAny: true,
    noImplicitThis: true,
    noImplicitReturns: false,
    noUnusedLocals: false,
    noUnusedParameters: false,
    noFallthroughCasesInSwitch: false,
    strictNullChecks: true,
    preserveConstEnums: true,
    experimentalDecorators: true,
    allowSyntheticDefaultImports: true,
    jsx: 'react',
    lib: ['ESNext', 'DOM'],
    target: 'ES2015',
    module: 'ESNext',
    moduleResolution: 'node',
    baseUrl: config.root,
    paths: config.getTsConfigPaths(),
    getCustomTransformers: program => ({
      afterDeclarations: [getTypeScriptPathsTransformer(program, { useRootDirs: true })]
    })
  }
}
