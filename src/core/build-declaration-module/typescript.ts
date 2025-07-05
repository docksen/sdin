import TypeScript from 'typescript'
import { Settings } from 'gulp-typescript'
import { createStyleModuleTypescriptTransformer } from 'plugins/typescript-transformer-style-module'
import { createModuleAliasTypescriptTransformer } from 'plugins/typescript-transformer-module-alias'
import { SdinDeclarationModule } from 'configs/declaration-module'

export function getTypeScriptSettings(module: SdinDeclarationModule): Settings {
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
    baseUrl: module.root,
    paths: module.toTsCfgPaths(),
    getCustomTransformers: () => ({
      afterDeclarations: [
        createStyleModuleTypescriptTransformer(),
        createModuleAliasTypescriptTransformer({ root: module.root, alias: module.alias })
      ]
    })
  }
}
