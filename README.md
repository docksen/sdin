# sdin

[中文文档](https://github.com/docksen/sdin/blob/main/README_zh.md)

Sdin /s'dɪn/ means **_Small Dinosaur_**.

Sdin is a JavaScript package builder, which uses Webpack and Gulp for packaging internally, and has the following features:

1. Support ESM, CJS, UMD, JSONP modules.
2. Support React, JSX, SCSS, CSS syntax.
3. Support Text, font, image, audio, video assets.
4. Support Global definition.
5. Support multiple modules.
6. Support Multi-file and single-file products.
7. Support Path aliases.
8. Support Compression and obfuscation of code.
9. Support TypeScript and JavaScript languages.
10. Config file written in typescript.

## Contents

- [sdin](#sdin)
  - [Contents](#contents)
  - [How to use it?](#how-to-use-it)
    - [Method 1: Build project with command](#method-1-build-project-with-command)
    - [Method 2: Build project with JavaScript](#method-2-build-project-with-javascript)
  - [How to choose project type?](#how-to-choose-project-type)
  - [How to modify the project configuration file?](#how-to-modify-the-project-configuration-file)
  - [Commands](#commands)
    - [`sdin`](#sdin-1)
    - [`sdin create`](#sdin-create)
    - [`sdin build`](#sdin-build)
    - [`sdin start`](#sdin-start)
    - [`sdin test`](#sdin-test)
    - [`sdin play`](#sdin-play)
  - [Exports](#exports)
  - [Macros](#macros)
  - [Configuration](#configuration)
    - [SdinAbstractProjectParams](#sdinabstractprojectparams)
    - [SdinProjectParams](#sdinprojectparams)
    - [SdinAbstractModuleParams](#sdinabstractmoduleparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
    - [SdinApplicationModuleParams](#sdinapplicationmoduleparams)
    - [SdinApplicationPageParams](#sdinapplicationpageparams)
    - [SdinTestingParams](#sdintestingparams)
    - [SdinPlayingParams](#sdinplayingparams)

## How to use it?

There are two ways to use Sdin.

### Method 1: Build project with command

This method is recommended because you only need to run two commands.

1. `sdin create` creates a project. During this process, you need to select the type of project and then answer a few questions, such as project name, version, description, etc.
2. `npm run build` builds the project. If you have installed Sdin globally, you can also use `sdin build` instead.

### Method 2: Build project with JavaScript

This provides other scripts with the ability to call Sdin functions. Here is a simple example:

```typescript
#!/usr/bin/env node

const { readSdinConfig, buildSdinProject } = require('sdin')

main()

async function main() {
  // Read project config
  const config = await readSdinConfig({ root: 'path/to/project' })
  // Build project
  await buildSdinProject({ config })
}
```

## How to choose project type?

Sdin provides six project templates.

> Regardless of the template, the construction method and steps are determined by the project configuration.

1. `browser-node-package`: Packages used in browsers and NodeJS environments.
2. `browser-package`: Packages used in browser environment.
3. `node-package`: Packages used in NodeJS environment.
4. `command-package`: NodeJS command line tool.
5. `react-package`: React package, supports browsers and NodeJS environments.
6. `react-application`: React web application, only supports browser environment (CSR mode).

## How to modify the project configuration file?

The configuration content of the project is in the `pro/configs/project.ts` file in the project root directory. Its structure is as follows:

```typescript
import { SdinConfigParams } from 'sdin'

const sdinConfigParams: SdinConfigParams = {...}
```

You can write any TypeScript code in the configuration file as long as there is an export item `sdinConfigParams`.

For the various fields of `sdinConfigParams` and their functions, see [Configuration](#configuration) below.

## Commands

### `sdin`

This command is responsible for providing auxiliary information of the tool.

- `-v, --version`, view the sdin version, example: `sdin -v`.
- `-h, --help`, view the help information of sdin, example: `sdin -h`.

### `sdin create`

This command is responsible for creating a project.

- `[name]`, specify the project name, example: `sdin create project-name`.

- `-o, --output <projectParentPath>`, specify the directory where the project is located, the default value is the current working directory, example: `sdin create -o ./`.
- `-t, --template <templateName>`, specify the project template, example: `sdin create -t ​​react-package`.

### `sdin build`

This command is responsible for building the production product of the project.

- `[path]`, specifies the project root directory, the default value is the current working directory, example: `sdin build ./`.
- `-m, --modules <moduleNames>`, specifies the module name, multiple items are separated by commas, the default value is all modules, example: `sdin build -m diana,elise`.

### `sdin start`

This command is responsible for running the project in development mode, only for web application modules.

- `[path]`, specifies the project root directory, the default value is the current working directory, example: `sdin start ./`.
- `-m, --module <moduleName>`, specifies the module name, the default value is the first defined executable module, example: `sdin start -m diana`.

### `sdin test`

This command is responsible for testing the project, only for NodeJS environment. It will build the test project first and then execute it directly. In the test project, no test framework is installed, and users need to develop a suitable test plan by themselves.

- `[path]`, specifies the project root directory, the default value is the current working directory, example: `sdin build ./`.

### `sdin play`

This command is responsible for debugging the project and is only used in the browser environment. It will start a web page for developers to debug on the web page.

- `[path]`, specifies the project root directory, the default value is the current working directory, example: `sdin build ./`.

## Exports

`readSdinProject` is used to read the configuration content of the project.

```typescript
function readSdinProject(params: SdinProjectReadingParams): Promise<SdinProject>
```

The following methods correspond to the commands `create`, `start`, `build`, `test`, and `play`.

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>
function startSdinProject(options: SdinProjectStartingOptions): Promise<void>
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>
function testSdinProject(options: SdinProjectTestingOptions): Promise<void>
function playSdinProject(options: SdinProjectPlayingOptions): Promise<void>
```

These are basic tool-level errors that may be thrown in the Sdin program.

```typescript
class RuntimeError extends Error {}
class GitError extends RuntimeError {}
class NpmError extends RuntimeError {}
class PathError extends RuntimeError {}
class ReadingError extends RuntimeError {}
class SteamError extends RuntimeError {}
class WritingError extends RuntimeError {}
class InquiringError extends RuntimeError {}
```

These are business-level errors that can be thrown in Sdin programs.

```typescript
class SdinBusinessError extends RuntimeError {}
class SdinCheckingError extends SdinBusinessError {}
class SdinConfigError extends SdinBusinessError {}
class SdinCreatingError extends SdinBusinessError {}
class SdinStartingError extends SdinBusinessError {}
class SdinBuildingError extends SdinBusinessError {}
class SdinTestingError extends SdinBusinessError {}
class SdinPlayingError extends SdinBusinessError {}
```

## Macros

Sdin provides some useful global constants that you can use directly in your code without defining them.

Sdin will automatically replace these constants with corresponding values ​​when compiling.

```typescript
declare global {
  const SDIN_PROJECT_NAME: string // Project name
  const SDIN_PROJECT_VERSION: string // Project version
  const SDIN_PROJECT_DESCRIPTION: string // Project description
  const SDIN_PROJECT_AUTHOR_NAME: string // Project author name
  const SDIN_PROJECT_AUTHOR_EMAIL: string // Project author email
  const SDIN_MODULE_ENV: string // Module build environment
  const SDIN_MODULE_TYPE: string // Module type
  const SDIN_MODULE_MODE: string // Module build mode
  const SDIN_MODULE_NAME: string // Module name
  const SDIN_MODULE_TITLE: string | null // Module title (only for web application modules)
  const SDIN_MODULE_PATH: string // Module URL path (only for web application modules)
  const SDIN_MODULE_ASSETS_PATH: string // Module asset URL path (only for web application modules)
}
```

## Configuration

### SdinAbstractProjectParams

Basic configuration parameters for the project.

```typescript
interface SdinAbstractProjectParams {
  /** Project root directory (default: current working directory) */
  root?: string
  /** Module alias (default: not set, relative to the project root directory) */
  alias?: Record<string, string>
  /** Code macro definition (key is the original code, value is the replaced code) */
  codes?: Record<string, string>
  /** Data macro definition (key is the original code, value is the replaced data. In web applications, it will be mounted on the global variable datas) */
  datas?: Record<string, string>
}
```

### SdinProjectParams

Project configuration parameters.

```typescript
interface SdinProjectParams extends SdinAbstractProjectParams {
  /** Module list */
  modules: OrNil<SdinModuleParams>[]
  /** Test configuration */
  testing?: SdinTestingParams
  /** Demonstration configuration */
  playing?: SdinPlayingParams
}
```

### SdinAbstractModuleParams

Basic configuration parameters of the module.

```typescript
interface SdinAbstractModuleParams<TType extends string, TMode extends string>
  extends SdinAbstractProjectParams {
  /** Module type */
  type: TType
  /** Module name */
  name: string
  /** Module build mode */
  mode?: TMode
  /** Module source directory */
  src?: string
  /** Module target directory */
  tar?: string
}
```

### SdinDeclarationModuleParams

Declaration module configuration parameters.

> Declaration module: only generate a module with TypeScript definition file.

```typescript
type SdinDeclarationModuleType = 'declaration'

type SdinDeclarationModuleMode = 'dts'

interface SdinDeclarationModuleParams
  extends SdinAbstractModuleParams<SdinDeclarationModuleType, SdinDeclarationModuleMode> {
  /** Module build mode (default: dts) */
  mode?: SdinDeclarationModuleMode
  /** Module source directory (default: src, relative to the project root directory) */
  src?: string
  /** Module target directory (default: tar/dts, relative to the project root directory) */
  tar?: string
  /** Included files (relative to the module source directory) */
  includes?: OrNil<string>[]
  /** Excluded files (relative to the module source directory) */
  excludes?: OrNil<string>[]
}
```

### SdinFoundationModuleParams

Foundation module configuration parameters.

> Foundation module: compile the files in the source code one by one to generate a product similar to the structure of a source code file.

```typescript
type SdinFoundationModuleType = 'foundation'

type SdinFoundationModuleMode = 'cjs' | 'esm'

interface SdinFoundationModuleParams
  extends SdinAbstractModuleParams<SdinFoundationModuleType, SdinFoundationModuleMode> {
  /** Module build mode (default: cjs) */
  mode?: SdinFoundationModuleMode
  /** Module source directory (default: src, relative to the project root directory) */
  src?: string
  /** Module target directory (default: tar/ mode, relative to the project root directory) */
  tar?: string
  /** Included files (relative to the module source directory) */
  includes?: OrNil<string>[]
  /** Excluded files (relative to the module source directory) */
  excludes?: OrNil<string>[]
  /** Minify code (default: true) */
  minify?: boolean
  /** Uglyify code (default: true) */
  uglify?: boolean
  /** Source map (default: enabled when minifying or uglifying) */
  sourceMap?: boolean
  /** SASS module switch (default: enabled) */
  sassModule?: boolean
  /** Obfuscate CSS class names (default: enabled) */
  mixinClass?: boolean
  /** Import the transformed CSS file into the JS file (enabled by default when SASS module is enabled) */
  styleImports?: boolean
}
```

### SdinIntegrationModuleParams

Integration module configuration parameters.

> Integration module: Start packaging from the entry file in the source code and generate a JavaScript file product.

```typescript
type SdinIntegrationModuleType = 'integration'

type SdinIntegrationModuleMode = 'cjs' | 'umd' | 'jsp' | 'glb'

interface SdinIntegrationModuleParams
  extends SdinAbstractModuleParams<SdinIntegrationModuleType, SdinIntegrationModuleMode> {
  /** Module build mode (default: umd) */
  mode?: SdinIntegrationModuleMode
  /** Module source directory (default: src, relative to the project root directory) */
  src?: string
  /** Module target directory (default: tar/module build mode, relative to the project root directory) */
  tar?: string
  /** Module entry file (default: index.(ts|tsx|js|jsx), relative to the module source directory) */
  index?: string
  /** Module bundle name (default: index, used to specify the generated main file name) */
  bundle?: string
  /** Global object (specify the global object variable name in the environment to be mounted) */
  global?: string
  /** Global variable name (used to specify the export object of the package, the global name, valid in cjs and umd modes) */
  variable?: string
  /** Compress code (default: true) */
  minify?: boolean
  /** Ugly code (default: true) */
  uglify?: boolean
  /** Source code map (default: enabled when compressing or uglifying) */
  sourceMap?: boolean
  /** Remove external modules used in the code */
  externals?: Record<string, string>
  /** SASS module (default: enabled) */
  sassModule?: boolean
  /** Obfuscate CSS class names (default: enabled) */
  mixinClass?: boolean
  /** babel compilation includes */
  babelIncludes?: OrNil<RuleSetCondition>[]
  /** babel compilation excludes */
  babelExcludes?: OrNil<RuleSetCondition>[]
  /** Modify text packaging rules (only partial values ​​are allowed to be modified)*/
  rawRule?: Partial<RuleSetRule>
  /** Modify font packaging rules (only partial values ​​are allowed to be modified)*/
  fontRule?: Partial<RuleSetRule>
  /** Modify image packaging rules (only partial values ​​are allowed to be modified)*/
  imageRule?: Partial<RuleSetRule>
  /** Modify audio packaging rules (only partial values ​​are allowed to be modified)*/
  audioRule?: Partial<RuleSetRule>
  /** Modify video packaging rules (only partial values ​​are allowed to be modified)*/
  videoRule?: Partial<RuleSetRule>
  /** Add packaging rules (can override some default rules)*/
  rules?: OrNil<RuleSetRule>[]
}
```

### SdinApplicationModuleParams

Web application module configuration parameters.

> Web application module: package the source code into a front-end web application.

```typescript
type SdinApplicationModuleType = 'application'
type SdinApplicationModuleMode = 'csr'

interface SdinApplicationModuleParams
  extends SdinAbstractModuleParams<SdinApplicationModuleType, SdinApplicationModuleMode> {
  /** Module build mode (default: csr) */
  mode?: SdinApplicationModuleMode
  /** Module title */
  title?: string
  /** Module source directory (default: src, relative to the project root directory) */
  src?: string
  /** Module target directory (default: tar/module build mode, relative to the project root directory) */
  tar?: string
  /** Module network path (default: /module name/) */
  path?: string
  /** Module source directory (default: pro/assets, relative to the project root directory) */
  astSrc?: string
  /** Module source network path (default: ast/, relative to the module network path) */
  astPath?: string
  /** Minify code (default: true) */
  minify?: boolean
  /** Uglyify code (default: true) */
  uglify?: boolean
  /** Source map (default: enabled when minifying or uglifying) */
  sourceMap?: boolean
  /** Remove external modules used in the code */
  externals?: Record<string, string>
  /** SASS module (default: enabled) */
  sassModule?: boolean
  /** Obfuscate CSS class names (default: enabled) */
  mixinClass?: boolean
  /** babel compilation includes */
  babelIncludes?: OrNil<RuleSetCondition>[]
  /** babel compilation excludes */
  babelExcludes?: OrNil<RuleSetCondition>[]
  /** Modify text bundling rules (only partial values ​​are allowed) */
  rawRule?: Partial<RuleSetRule>
  /** Modify font packaging rules (only partial values ​​are allowed to be modified)*/
  fontRule?: Partial<RuleSetRule>
  /** Modify image packaging rules (only partial values ​​are allowed to be modified)*/
  imageRule?: Partial<RuleSetRule>
  /** Modify audio packaging rules (only partial values ​​are allowed to be modified)*/
  audioRule?: Partial<RuleSetRule>
  /** Modify video packaging rules (only partial values ​​are allowed to be modified)*/
  videoRule?: Partial<RuleSetRule>
  /** Add packaging rules (can override some default rules)*/
  rules?: OrNil<RuleSetRule>[]
  /** Enable logging in development mode (default: not enabled)*/
  devLog?: boolean
  /** Display emojis on page titles in development mode (default: ⚡)*/
  devEmoji?: string
  /** Server port number in development environment (default: 8080)*/
  devPort?: number
  /** Proxy settings for the server in the development environment <https://github.com/edorivai/koa-proxy> */
  devProxies?: OrNil<ProxyOptions>[]
  /** Page list */
  pages: OrNil<SdinApplicationPageParams>[]
  /** Root page name (default: index) */
  index?: string
  /** Error page name (default: error) */
  error?: string
  /** Page meta information tag list */
  metas?: OrNil<SdinApplicationPageElement>[]
  /** Page style tag list */
  links?: OrNil<SdinApplicationPageElement>[]
  /** Page style tag list */
  styles?: OrNil<SdinApplicationPageElement>[]
  /** Page script tag list */
  scripts?: OrNil<SdinApplicationPageElement>[]
  /** Page skeleton renderer */
  skeleton?: SdinApplicationPageSkeleton
}
```

### SdinApplicationPageParams

Web application page configuration parameters.

```typescript
interface SdinApplicationPageElement extends Record<string, string | boolean | undefined> {
  key: string
}

type SdinApplicationPageSkeleton = (page: SdinApplicationPage) => string

interface SdinApplicationPageParams {
  /** Page name */
  name: string
  /** Page title */
  title: string
  /** Page entry file (default: page name/index.(ts|tsx|js|jsx), relative to the module source directory) */
  index?: string
  /** Page network path (default: page name, relative to the module network path) */
  path?: string
  /** Page meta information tag list */
  metas?: OrNil<SdinApplicationPageElement>[]
  /** Page link tag list */
  links?: OrNil<SdinApplicationPageElement>[]
  /** Page style tag list */
  styles?: OrNil<SdinApplicationPageElement>[]
  /** Page script tag list */
  scripts?: OrNil<SdinApplicationPageElement>[]
  /** Page skeleton renderer */
  skeleton?: SdinApplicationPageSkeleton
  /** Data macro definition */
  datas?: Record<string, string>
}
```

### SdinTestingParams

Testing module configuration parameters.

```typescript
interface SdinTestingParams
  extends Omit<
    SdinFoundationModuleParams,
    'type' | 'name' | 'mode' | 'monify' | 'uglify' | 'sourceMap'
  > {
  /** entry file (default: index.(ts|tsx|js|jsx), relative to the module source directory) */
  index?: string
}
```

### SdinPlayingParams

Playing module configuration parameters.

```typescript
interface SdinPlayingParams
  extends Omit<
    SdinApplicationModuleParams,
    'type' | 'name' | 'mode' | 'minify' | 'uglify' | 'sourceMap' | 'devEmoji'
  > {}
```
