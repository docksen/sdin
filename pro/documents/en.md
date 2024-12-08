# sdin

- [sdin](#sdin)
  - [Example](#example)
  - [Configuration](#configuration)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Command](#command)
    - [Main command](#main-command)
    - [`build` Command](#build-command)
    - [`create` Command](#create-command)
  - [Interface](#interface)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Example

Building project on the command line:

```shell
$ sdin build
i Project hello, version 0.0.1.
i Project files are qualified, checking took 0.003 s.
√ Successfully built foundation cjs module camille, it took 0.32 s.
√ Successfully built foundation esm module elise, it took 0.06 s.
√ Successfully built declaration dts module diana, it took 1.361 s.
√ Successfully built integration umd module urgoth, it took 12.173 s.
i Webpack compiled information: ...
```

Building project in code:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Configuration

The configuration file path for the project: `pro/configs/project.ts`。

The configuration file content of the project:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Project Configuration

| Attribute   | Type                        | Required | Default                   | Description                                                            | Example               |
| ----------- | --------------------------- | -------- | ------------------------- | ---------------------------------------------------------------------- | --------------------- |
| root        | string                      | No       | Current working directory | Project root directory                                                 | -                     |
| mode        | SdinBuildMode               | No       | production                | Building pattern                                                       | -                     |
| alias       | Record\<string, string\>    | No       | -                         | Module alias，\<Alias, Path (relative to the project root directory)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | No       | -                         | Global Definition，\<Original code, Replaced code\>                    | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | No       | -                         | Module configuration item list                                         | -                     |

```typescript
// production: Production mode; development: Development environment ;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

The program has provided some global definitions for the project, which can be directly used in the project:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // The construction mode of the project
  const SDIN_PROJECT_NAME: string // Project name
  const SDIN_PROJECT_VERSION: string // Project version
  const SDIN_PROJECT_AUTHOR_NAME: string // Project author name
  const SDIN_PROJECT_AUTHOR_EMAIL: string // Project author email
  const SDIN_MODULE_TYPE: string // At compile time, the type of module
  const SDIN_MODULE_MODE: string // The construction mode of modules during compilation
  const SDIN_MODULE_NAME: string // Module name during compilation
}
```

### SdinDeclarationModuleParams

Define module configuration

| Attribute | Type                      | Required | Default                        | Description                                                                    | Example |
| --------- | ------------------------- | -------- | ------------------------------ | ------------------------------------------------------------------------------ | ------- |
| type      | 'declaration'             | Yes      | -                              | Module type                                                                    | -       |
| mode      | SdinDeclarationModuleMode | No       | 'dts'                          | Module construction mode                                                       | -       |
| name      | string                    | Yes      | -                              | Module Name                                                                    | -       |
| src       | string                    | No       | 'src'                          | The location of the input source code (relative to the project root directory) | -       |
| tar       | string                    | No       | 'tar/Module construction mode' | Output target location (relative to the project root directory)                | -       |
| includes  | OrNil\<string\>[]         | No       | -                              | Contains files (relative to the project root directory)                        | -       |
| excludes  | OrNil\<string\>[]         | No       | -                              | Excluded files (relative to the project root directory)                        | -       |

```typescript
// dts: TypeScript Definition Module;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Basic module configuration

| Attribute    | Type                     | Required | Default                            | Description                                                                    | Example |
| ------------ | ------------------------ | -------- | ---------------------------------- | ------------------------------------------------------------------------------ | ------- |
| type         | 'foundation'             | Yes      | -                                  | Module type                                                                    | -       |
| mode         | SdinFoundationModuleMode | No       | 'cjs'                              | Module construction mode                                                       | -       |
| name         | string                   | Yes      | -                                  | Module Name                                                                    | -       |
| src          | string                   | No       | 'src'                              | The location of the input source code (relative to the project root directory) | -       |
| tar          | string                   | No       | 'tar/Module construction mode'     | Output target location (relative to the project root directory)                | -       |
| includes     | OrNil\<string\>[]        | No       | -                                  | Contains files (relative to the project root directory)                        | -       |
| excludes     | OrNil\<string\>[]        | No       | -                                  | Excluded files (relative to the project root directory)                        | -       |
| minify       | boolean                  | No       | Activate in production mode        | Compress code                                                                  | -       |
| uglify       | boolean                  | No       | Activate in production mode        | Ugly code (valid when minify is enabled)                                       | -       |
| sassModule   | boolean                  | No       | true                               | SASS module switch                                                             | -       |
| styleImports | boolean                  | No       | Open when SASS module is turned on | Import converted CSS files into JS files                                       | -       |

```typescript
// cjs: CommonJS module; esm: ESModule module;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Integrated module configuration

| Attribute     | Type                        | Required                      | Default                        | Description                                                                       | Example |
| ------------- | --------------------------- | ----------------------------- | ------------------------------ | --------------------------------------------------------------------------------- | ------- |
| type          | 'integration'               | Yes                           | -                              | Module type                                                                       | -       |
| mode          | SdinIntegrationModuleMode   | No                            | 'umd'                          | Module construction mode                                                          | -       |
| name          | string                      | Yes                           | -                              | Module Name                                                                       | -       |
| src           | string                      | No                            | 'src/index.{jsx?\|tsx?}'       | The location of the input source code (relative to the project root directory)    | -       |
| tar           | string                      | No                            | 'tar/Module construction mode' | Output target location (relative to the project root directory)                   | -       |
| entryName     | string                      | No                            | 'index'                        | Module entrance name                                                              | -       |
| globalName    | string                      | Effective must be transmitted | -                              | Specify the global name of the package export object (valid in cjs and umd modes) | "React" |
| minify        | boolean                     | No                            | Activate in production mode    | Compress code                                                                     | -       |
| uglify        | boolean                     | No                            | Activate in production mode    | Ugly code (valid when minify is enabled)                                          | -       |
| externals     | Record\<string, string\>    | No                            | -                              | Remove external modules used in the code                                          | -       |
| sassModule    | boolean                     | No                            | true                           | SASS module switch                                                                | -       |
| babelIncludes | OrNil\<RuleSetCondition\>[] | No                            | -                              | Babel compilation includes items                                                  | -       |
| babelExcludes | OrNil\<RuleSetCondition\>[] | No                            | -                              | Babel compilation exclusion item                                                  | -       |
| rawRule       | Partial\<RuleSetRule\>      | No                            | -                              | Modify text packaging rules                                                       | -       |
| fontRule      | Partial\<RuleSetRule\>      | No                            | -                              | Modify font packaging rules                                                       | -       |
| imageRule     | Partial\<RuleSetRule\>      | No                            | -                              | Modify the image packaging rules                                                  | -       |
| audioRule     | Partial\<RuleSetRule\>      | No                            | -                              | Modify audio packaging rules                                                      | -       |
| videoRule     | Partial\<RuleSetRule\>      | No                            | -                              | Modify video packaging rules                                                      | -       |
| rules         | OrNil\<RuleSetRule\>[]      | No                            | -                              | Add packaging rules (can override some default rules)                             | -       |

```typescript
// cjs: CommonJS module; glb: Global module; umd: UMD module; jsp: jsonp module;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd' | 'jsp'
type OrNil<T> = T | undefined | null
// For details, please refer to: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// For details, please refer to: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

If the packaging rules are modified, all fields except for 'type' and 'generator. filename' can be modified.

If you add packaging rules, you can override the packaging rules for text, fonts, images, audio, and video.

## Command

### Main command

| Option    | Abbreviation | Type | Required | Default | Description        | Example |
| --------- | ------------ | ---- | -------- | ------- | ------------------ | ------- |
| --version | -v           | -    | -        | -       | View version       | sdin -v |
| --help    | -h           | -    | -        | -       | View Help Document | sdin -h |

### `build` Command

Used for building projects

| Parameter | Parent level | Type   | Required | Default                   | Description                                           | Example       |
| --------- | ------------ | ------ | -------- | ------------------------- | ----------------------------------------------------- | ------------- |
| path      | -            | string | No       | Current working directory | Specify the root directory of the project to be built | sdin build ./ |

| Option    | Abbreviation | Type   | Required | Default     | Description                                                                   | Example                   |
| --------- | ------------ | ------ | -------- | ----------- | ----------------------------------------------------------------------------- | ------------------------- |
| --modules | -m           | string | No       | All modules | Specify the module names to be built, with multiple items separated by commas | sdin build -m diana,elise |

### `create` Command

Used for creating projects

| Parameter | Parent level | Type   | Required | Default | Description                                                   | Example                 |
| --------- | ------------ | ------ | -------- | ------- | ------------------------------------------------------------- | ----------------------- |
| name      | -            | string | No       | -       | Specify the package name using the symbols "@, a-z, 0-9, -,/" | sdin create new-project |

| Option     | Abbreviation | Type   | Required | Default                   | Description                                   | Example                       |
| ---------- | ------------ | ------ | -------- | ------------------------- | --------------------------------------------- | ----------------------------- |
| --output   | -o           | string | No       | Current working directory | Specify the parent path for the new project   | sdin create -o ./             |
| --template | -t           | string | No       | -                         | Specify the template name for the new project | sdin create -t common-package |

## Interface

### readSdinConfig

Reading project configuration

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Project root directory */
  root: string
}
```

### createSdinProject

Creating Project

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Template Name */
  templateName?: string
  /** The folder path where the project is stored (default: current working directory) */
  projectParentPath?: string
  /** Project name */
  projectName?: string
  /** Project version (default: 0.0.1) */
  projectVersion?: string
  /** Project Description */
  projectDescription?: string
  /** Author name (default: Git username) */
  authorName?: string
  /** Author email (default: Git email) */
  authorEmail?: string
}
```

### buildSdinProject

Building project

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Sdin configuration */
  config: SdinConfig
  /** Specify the name of the module to be built */
  moduleNames?: string[]
}
```
