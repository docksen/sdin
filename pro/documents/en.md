# sdin

- [sdin](#sdin)
  - [Configuration](#configuration)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Commands](#commands)
    - [Main Commands](#main-commands)
    - [build Commands](#build-commands)
    - [create command](#create-command)
  - [Interface](#interface)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Configuration

Project configuration file path: `pro/configs/project.ts`.

Contents of the project configuration file:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Project configuration

| Property    | Type                        | Required | Default                   | Description                                                            | Example               |
| ----------- | --------------------------- | -------- | ------------------------- | ---------------------------------------------------------------------- | --------------------- |
| root        | string                      | No       | Current working directory | Project root directory                                                 | -                     |
| mode        | SdinBuildMode               | No       | production                | Build mode                                                             | -                     |
| alias       | Record\<string, string\>    | No       | -                         | Module alias, \<alias, path (relative to the project root directory)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | No       | -                         | Global definition, \<original code, replaced code\>                    | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | yes      | -                         | module configuration item list                                         | -                     |

```typescript
// production: production mode; development: development environment;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

### SdinDeclarationModuleParams

Define module configuration

| Attribute | Type                      | Required | Default                 | Description                                                     | Example |
| --------- | ------------------------- | -------- | ----------------------- | --------------------------------------------------------------- | ------- |
| type      | 'declaration'             | yes      | -                       | module type                                                     | -       |
| mode      | SdinDeclarationModuleMode | No       | 'dts'                   | Module build mode                                               | -       |
| name      | string                    | Yes      | -                       | Module name                                                     | -       |
| src       | string                    | No       | 'src'                   | Input source location (relative to the project root directory)  | -       |
| tar       | string                    | No       | 'tar/module build mode' | Output target location (relative to the project root directory) | -       |
| includes  | OrNil\<string\>[]         | No       | -                       | Included files (relative to the project root directory)         | -       |
| excludes  | OrNil\<string\>[]         | No       | -                       | Excluded files (relative to the project root directory)         | -       |

```typescript
// dts: TypeScript definition module;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Basic module configuration

| Property     | Type                     | Required | Default                                        | Description                                           | Example |
| ------------ | ------------------------ | -------- | ---------------------------------------------- | ----------------------------------------------------- | ------- |
| type         | 'foundation'             | Yes      | -                                              | Module type                                           | -       |
| mode         | SdinFoundationModuleMode | No       | 'cjs'                                          | Module build mode                                     | -       |
| name         | string                   | Yes      | -                                              | Module name                                           | -       |
| src          | string                   | No       | 'src'                                          | Input source location (relative to the project root)  | -       |
| tar          | string                   | No       | 'tar/module build mode'                        | Output target location (relative to the project root) | -       |
| includes     | OrNil\<string\>[]        | No       | -                                              | Included files (relative to the project root)         | -       |
| excludes     | OrNil\<string\>[]        | No       | -                                              | Excluded files (relative to the project root)         | -       |
| minify       | boolean                  | No       | Enabled by default in production mode          | Compress code                                         | -       |
| uglify       | boolean                  | No       | Enabled by default in production mode          | Ugly code (valid when minify is enabled)              | -       |
| sassModule   | boolean                  | No       | true                                           | SASS module switch                                    | -       |
| styleImports | boolean                  | No       | Enabled by default when SASS module is enabled | Import the transformed CSS file in the JS file        | -       |

```typescript
// cjs: CommonJS module; esm: ESModule module;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Integration module configuration

| Property      | Type                        | Required          | Default                   | Description                                                                       | Example |
| ------------- | --------------------------- | ----------------- | ------------------------- | --------------------------------------------------------------------------------- | ------- |
| type          | 'integration'               | Yes               | -                         | Module type                                                                       | -       |
| mode          | SdinIntegrationModuleMode   | No                | 'umd'                     | Module build mode                                                                 | -       |
| name          | string                      | Yes               | -                         | Module name                                                                       | -       |
| src           | string                      | No                | 'src/index.{jsx?\|tsx?}'  | Input source code location (relative to the project root directory)               | -       |
| tar           | string                      | No                | 'tar/module build mode'   | Output target location (relative to the project root directory)                   | -       |
| entryName     | string                      | No                | 'index'                   | Module entry name                                                                 | -       |
| globalName    | string                      | Required if valid | -                         | Specify the global name of the package export object (valid in cjs and umd modes) | "React" |
| minify        | boolean                     | No                | Enable in production mode | Compress code                                                                     | -       |
| uglify        | boolean                     | No                | Enable in production mode | Ugly code (valid when minify is enabled)                                          | -       |
| externals     | Record\<string, string\>    | No                | -                         | Remove external modules used in the code                                          | -       |
| sassModule    | Record\<string, string\>    | No                | true                      | SASS module                                                                       | -       |
| babelIncludes | OrNil\<RuleSetCondition\>[] | No                | -                         | babel compilation inclusions                                                      | -       |
| babelExcludes | OrNil\<RuleSetCondition\>[] | No                | -                         | babel compilation exclusions                                                      | -       |
| rawRule       | Partial\<RuleSetRule\>      | No                | -                         | Modify text packaging rules (only partial values ​​are allowed to be modified)    | -       |
| fontRule      | Partial\<RuleSetRule\>      | No                | -                         | Modify font packaging rules (only partial values ​​are allowed to be modified)    | -       |
| imageRule     | Partial\<RuleSetRule\>      | No                | -                         | Modify image packaging rules (only partial values ​​are allowed to be modified)   | -       |
| audioRule     | Partial\<RuleSetRule\>      | No                | -                         | Modify audio packaging rules (only partial values ​​are allowed to be modified)   | -       |
| videoRule     | Partial\<RuleSetRule\>      | No                | -                         | Modify video packaging rules (only partial values ​​are allowed to be modified)   | -       |
| rules         | OrNil\<RuleSetRule\>[]      | No                | -                         | Add packaging rules (can override some default rules)                             | -       |

```typescript
// cjs: CommonJS module; glb: global module; umd: UMD module;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// For details, please see: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// For details, please see: https://webpack.js.org/configuration/module/#rule
// If you modify the packaging rules, except for `type` and `generator.filename`, all other fields can be modified.
// If you add packaging rules, you can override the packaging rules of text, fonts, images, audio, and video.
type RuleSetRule = Webpack.RuleSetRule
```

## Commands

### Main Commands

| Options   | Abbreviation | Type | Required | Default | Description        | Example |
| --------- | ------------ | ---- | -------- | ------- | ------------------ | ------- |
| --version | -v           | -    | -        | -       | View version       | sdin -v |
| --help    | -h           | -    | -        | -       | View help document | sdin -h |

### build Commands

Used to build projects

| Parameters | Parent | Type   | Required | Default                   | Description                                           | Example       |
| ---------- | ------ | ------ | -------- | ------------------------- | ----------------------------------------------------- | ------------- |
| path       | -      | string | No       | Current working directory | Specify the root directory of the project to be built | sdin build ./ |

| Options   | Abbreviation | Type   | Required | Default     | Description                                                                  | Example                   |
| --------- | ------------ | ------ | -------- | ----------- | ---------------------------------------------------------------------------- | ------------------------- |
| --modules | -m           | string | No       | All modules | Specify the module names to be built, multiple items are separated by commas | sdin build -m diana,elise |

### create command

Used to create a project

| Parameter | Parent | Type   | Required | Default | Description                                                   | Example                 |
| --------- | ------ | ------ | -------- | ------- | ------------------------------------------------------------- | ----------------------- |
| name      | -      | string | No       | -       | Specify the package name, composed of "@,a-z,0-9,-,/" symbols | sdin create new-project |

| Option     | Abbreviation | Type   | Required | Default                   | Description                                        | Example                         |
| ---------- | ------------ | ------ | -------- | ------------------------- | -------------------------------------------------- | ------------------------------- |
| --output   | -o           | string | No       | Current working directory | Specify the parent path of the new project         | sdin create -o ./               |
| --template | -t           | string | No       | -                         | Specify the template name used for the new project | sdin create -t ​​common-package |

## Interface

### readSdinConfig

Read project configuration

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Project root directory */
  root: string
}
```

### createSdinProject

Create a project

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Template name */
  templateName?: string
  /** Folder path where the project is stored (default: current working directory) */
  projectParentPath?: string
  /** Project name */
  projectName?: string
  /** Project version number (default: 0.0.1) */
  projectVersion?: string
  /** Project description */
  projectDescription?: string
  /** Author name (default: Git username) */
  authorName?: string
  /** Author email (default: Git email) */
  authorEmail?: string
}
```

### buildSdinProject

Build a project

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Sdin configuration */
  config: SdinConfig
  /** Module name to build */
  moduleNames?: string[]
}
```
