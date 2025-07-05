# sdin

[English Document](https://github.com/docksen/sdin/blob/main/README.md)

Sdin /s'dɪn/ 的意思是 **_Small Dinosaur_**（小恐龙）。

Sdin 是一个 JavaScript 包构建器，内部使用 Webpack 和 Gulp 进行打包，它有如下特性：

1. 支持 ESM, CJS, UMD, JSONP 模块类型。
2. 支持 React, JSX, SCSS, CSS 语法。
3. 支持 Text, font, image, audio, video 素材。
4. 支持全局定义。
5. 支持构建多份产物。
6. 支持多文件和单文件产物。
7. 支持路径别名。
8. 支持压缩和混淆代码。
9. 支持 TypeScript 和 JavaScript 语言。
10. 使用 TypeScript 作为配置文件的语言。

## 目录

- [sdin](#sdin)
  - [目录](#目录)
  - [如何使用它？](#如何使用它)
    - [方式一：用命令构建项目](#方式一用命令构建项目)
    - [方式二：用 JavaScript 脚本构建项目](#方式二用-javascript-脚本构建项目)
  - [如何选择项目类型？](#如何选择项目类型)
  - [如何修改项目配置文件？](#如何修改项目配置文件)
  - [命令](#命令)
    - [`sdin`](#sdin-1)
    - [`sdin create`](#sdin-create)
    - [`sdin build`](#sdin-build)
    - [`sdin start`](#sdin-start)
    - [`sdin test`](#sdin-test)
    - [`sdin play`](#sdin-play)
  - [导出项](#导出项)
  - [预设宏](#预设宏)
  - [配置参数](#配置参数)
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

## 如何使用它？

Sdin 有两种使用方式。

### 方式一：用命令构建项目

推荐你使用这种方式，因为只需要运行两个命令即可。

1. `sdin create` 创建项目。在此过程中，你需要选择项目的类型，然后回答几个问题，诸如项目名称、版本、描述等信息。
2. `npm run build` 构建项目。如果你已经将 Sdin 安装到了系统全局，也可以使用 `sdin build` 代替。

### 方式二：用 JavaScript 脚本构建项目

这是提供给其他脚本调用 Sdin 功能的能力。下面是一个简单的例子：

```typescript
#!/usr/bin/env node

const { readSdinConfig, buildSdinProject } = require('sdin')

main()

async function main() {
  // 读取项目配置
  const config = await readSdinConfig({ root: 'path/to/project' })
  // 构建项目
  await buildSdinProject({ config })
}
```

## 如何选择项目类型？

Sdin 提供了六种项目模板。

> 无论是哪种模板，其构建方式和步骤，都是由项目配置决定的。

1. `browser-node-package`：在浏览器和 NodeJS 环境中使用的包。
2. `browser-package`：在浏览器环境中使用的包。
3. `node-package`：在 NodeJS 环境中使用的包。
4. `command-package`：NodeJS 命令行工具。
5. `react-package`：React 包，支持浏览器和 NodeJS 环境。
6. `react-application`：React 网页应用程序，只支持浏览器环境（CSR 模式）。

## 如何修改项目配置文件？

项目的配置内容，在项目根目录下的 `pro/configs/project.ts` 文件中，其结构如下：

```typescript
import { SdinConfigParams } from 'sdin'

const sdinConfigParams: SdinConfigParams = {...}
```

你可以在配置文件中，书写任何 TypeScript 代码，只要有导出项 `sdinConfigParams` 即可。

`sdinConfigParams` 的各个字段及其作用，见下方[配置参数](#配置参数)。

## 命令

### `sdin`

此命令负责提供工具的辅助信息。

- `-v, --version`，查看 sdin 版本，示例：`sdin -v`。
- `-h, --help`，查看 sdin 的帮助信息，示例：`sdin -h`。

### `sdin create`

此命令负责创建项目。

- `[name]`，指定项目名称，示例：`sdin create project-name`。
- `-o, --output <projectParentPath>`，指定项目所在目录，默认值是当前工作目录，示例：`sdin create -o ./`。
- `-t, --template <templateName>`，指定项目模板，示例：`sdin create -t react-package`。

### `sdin build`

此命令负责构建项目的生产产物。

- `[path]`，指定项目根目录，默认值是当前工作目录，示例：`sdin build ./`。
- `-m, --modules <moduleNames>`，指定模块名，多项以逗号分隔，默认值是所有模块，示例：`sdin build -m diana,elise`。

### `sdin start`

此命令负责以开发模式运行项目，只用于网页应用模块。

- `[path]`，指定项目根目录，默认值是当前工作目录，示例：`sdin start ./`。
- `-m, --module <moduleName>`，指定模块名，默认值是第一个定义的可运行模块，示例：`sdin start -m diana`。

### `sdin test`

此命令负责测试项目，只用于 NodeJS 环境。它会先构建测试项目，然后直接执行。测试项目中，没有安装任何测试框架，需要用户自己制定合适的测试方案。

- `[path]`，指定项目根目录，默认值是当前工作目录，示例：`sdin build ./`。

### `sdin play`

此命令负责调试项目，只用于浏览器环境。它会启动一个网页，供开发人员在网页上进行调试。

- `[path]`，指定项目根目录，默认值是当前工作目录，示例：`sdin build ./`。

## 导出项

`readSdinProject` 用于读取项目的配置内容。

```typescript
function readSdinProject(params: SdinProjectReadingParams): Promise<SdinProject>
```

以下方法，分别对应命令 `create`、`start`、`build`、`test`、`play`。

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>
function startSdinProject(options: SdinProjectStartingOptions): Promise<void>
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>
function testSdinProject(options: SdinProjectTestingOptions): Promise<void>
function playSdinProject(options: SdinProjectPlayingOptions): Promise<void>
```

这些是 Sdin 程序中可能会抛出的基础工具层面的错误。

```typescript
class RuntimeError extends Error {}
class GitError extends RuntimeError {}
class NpmError extends RuntimeError {}
class PathError extends RuntimeError {}
class ReadingError extends RuntimeError {}
class SteamError extends RuntimeError {}
class WritingError extends RuntimeError {}
class EnquiringError extends RuntimeError {}
```

这些是 Sdin 程序中可能会抛出的业务层面的错误。

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

## 预设宏

Sdin 提供了一些实用的全局常量，你可以在代码中直接使用，无需定义。

Sdin 在编译的时候，会自动将这些常量替换成对应的值。

```typescript
declare global {
  const SDIN_PROJECT_NAME: string // 项目名称
  const SDIN_PROJECT_VERSION: string // 项目版本
  const SDIN_PROJECT_DESCRIPTION: string // 项目描述
  const SDIN_PROJECT_AUTHOR_NAME: string // 项目作者名称
  const SDIN_PROJECT_AUTHOR_EMAIL: string // 项目作者邮箱
  const SDIN_MODULE_ENV: string // 模块构建环境
  const SDIN_MODULE_TYPE: string // 模块类型
  const SDIN_MODULE_MODE: string // 模块构建模式
  const SDIN_MODULE_NAME: string // 模块名称
  const SDIN_MODULE_TITLE: string | null // 模块标题（仅用于网页应用模块）
  const SDIN_MODULE_PATH: string // 模块 URL 路径（仅用于网页应用模块）
  const SDIN_MODULE_ASSETS_PATH: string // 模块素材 URL 路径（仅用于网页应用模块）
}
```

## 配置参数

### SdinAbstractProjectParams

项目的基础配置参数

```typescript
interface SdinAbstractProjectParams {
  /** 项目根目录（默认：当前工作目录） */
  root?: string
  /** 模块别名（默认：不设置，相对项目根目录而言） */
  alias?: Record<string, string>
  /** 代码宏定义（key 是原代码，value 是替换后的代码） */
  codes?: Record<string, string>
  /** 数据宏定义（key 是原代码，value 是替换后的数据。在网页应用里，它会被挂载到全局变量 datas 上） */
  datas?: Record<string, string>
}
```

### SdinProjectParams

项目的配置参数

```typescript
interface SdinProjectParams extends SdinAbstractProjectParams {
  /** 模块列表 */
  modules: OrNil<SdinModuleParams>[]
  /** 测试配置 */
  testing?: SdinTestingParams
  /** 演示配置 */
  playing?: SdinPlayingParams
}
```

### SdinAbstractModuleParams

模块的基础配置参数

```typescript
interface SdinAbstractModuleParams<TType extends string, TMode extends string>
  extends SdinAbstractProjectParams {
  /** 模块类型 */
  type: TType
  /** 模块名称 */
  name: string
  /** 模块构建模式 */
  mode?: TMode
  /** 模块源码目录 */
  src?: string
  /** 模块目标目录 */
  tar?: string
}
```

### SdinDeclarationModuleParams

定义模块配置参数

> 定义模块：只生成 TypeScript 定义文件的模块

```typescript
type SdinDeclarationModuleType = 'declaration'

type SdinDeclarationModuleMode = 'dts'

interface SdinDeclarationModuleParams
  extends SdinAbstractModuleParams<SdinDeclarationModuleType, SdinDeclarationModuleMode> {
  /** 模块构建模式（默认：dts） */
  mode?: SdinDeclarationModuleMode
  /** 模块源码目录（默认：src，相对项目根目录而言） */
  src?: string
  /** 模块目标目录（默认：tar/dts，相对项目根目录而言） */
  tar?: string
  /** 包含的文件（相对模块源码目录而言） */
  includes?: OrNil<string>[]
  /** 不包含的文件（相对模块源码目录而言） */
  excludes?: OrNil<string>[]
}
```

### SdinFoundationModuleParams

基础模块配置参数

> 基础模块：将源码中的文件逐一进行编译，生成和一份源码文件结构类似的产物

```typescript
type SdinFoundationModuleType = 'foundation'

type SdinFoundationModuleMode = 'cjs' | 'esm'

interface SdinFoundationModuleParams
  extends SdinAbstractModuleParams<SdinFoundationModuleType, SdinFoundationModuleMode> {
  /** 模块构建模式（默认：cjs） */
  mode?: SdinFoundationModuleMode
  /** 模块源码目录（默认：src，相对项目根目录而言） */
  src?: string
  /** 模块目标目录（默认：tar/模式，相对项目根目录而言） */
  tar?: string
  /** 包含的文件（相对模块源码目录而言） */
  includes?: OrNil<string>[]
  /** 不包含的文件（相对模块源码目录而言） */
  excludes?: OrNil<string>[]
  /** 压缩代码（默认：true） */
  minify?: boolean
  /** 丑化代码（默认：true） */
  uglify?: boolean
  /** 源代码映射（默认：压缩或丑化时启用） */
  sourceMap?: boolean
  /** SASS 模块开关（默认：开启） */
  sassModule?: boolean
  /** 混淆 CSS 类名（默认：开启） */
  mixinClass?: boolean
  /** 在 JS 文件中引入转换后的 CSS 文件（SASS 模块启用时默认开启） */
  styleImports?: boolean
}
```

### SdinIntegrationModuleParams

集成模块配置参数

> 集成模块：从源码中的入口文件开始打包，生成一个 JavaScript 文件产物

```typescript
type SdinIntegrationModuleType = 'integration'

type SdinIntegrationModuleMode = 'cjs' | 'umd' | 'jsp' | 'glb'

interface SdinIntegrationModuleParams
  extends SdinAbstractModuleParams<SdinIntegrationModuleType, SdinIntegrationModuleMode> {
  /** 模块构建模式（默认：umd） */
  mode?: SdinIntegrationModuleMode
  /** 模块源码目录（默认：src，相对项目根目录而言） */
  src?: string
  /** 模块目标目录（默认：tar/模块构建模式，相对项目根目录而言） */
  tar?: string
  /** 模块入口文件（默认：index.(ts|tsx|js|jsx)，相对模块源码目录而言） */
  index?: string
  /** 模块捆绑包名（默认：index，用于指定生成的主文件名称）  */
  bundle?: string
  /** 全局对象（指定要挂载的环境中的全局对象变量名） */
  global?: string
  /** 全局变量名（用于指定包的导出对象，在全局的名称，cjs、umd 模式有效） */
  variable?: string
  /** 压缩代码（默认：true） */
  minify?: boolean
  /** 丑化代码（默认：true） */
  uglify?: boolean
  /** 源代码映射（默认：压缩或丑化时启用） */
  sourceMap?: boolean
  /** 去除代码里使用到的外部模块 */
  externals?: Record<string, string>
  /** SASS 模块（默认：开启） */
  sassModule?: boolean
  /** 混淆 CSS 类名（默认：开启） */
  mixinClass?: boolean
  /** babel 编译包含项 */
  babelIncludes?: OrNil<RuleSetCondition>[]
  /** babel 编译排除项 */
  babelExcludes?: OrNil<RuleSetCondition>[]
  /** 修改文本打包规则（仅允许修改部分值）*/
  rawRule?: Partial<RuleSetRule>
  /** 修改字体打包规则（仅允许修改部分值）*/
  fontRule?: Partial<RuleSetRule>
  /** 修改图片打包规则（仅允许修改部分值）*/
  imageRule?: Partial<RuleSetRule>
  /** 修改音频打包规则（仅允许修改部分值）*/
  audioRule?: Partial<RuleSetRule>
  /** 修改视频打包规则（仅允许修改部分值）*/
  videoRule?: Partial<RuleSetRule>
  /** 添加打包规则（可以覆盖部分默认规则） */
  rules?: OrNil<RuleSetRule>[]
}
```

### SdinApplicationModuleParams

网页应用模块配置参数

> 网页应用模块：将源码打包成一个前端网页应用

```typescript
type SdinApplicationModuleType = 'application'

type SdinApplicationModuleMode = 'csr'

interface SdinApplicationModuleParams
  extends SdinAbstractModuleParams<SdinApplicationModuleType, SdinApplicationModuleMode> {
  /** 模块构建模式（默认：csr） */
  mode?: SdinApplicationModuleMode
  /** 模块标题 */
  title?: string
  /** 模块源码目录（默认：src，相对项目根目录而言） */
  src?: string
  /** 模块目标目录（默认：tar/模块构建模式，相对项目根目录而言） */
  tar?: string
  /** 模块网络路径（默认：/模块名称/） */
  path?: string
  /** 模块素材源码目录（默认：pro/assets，相对项目根目录而言） */
  astSrc?: string
  /** 模块素材网络路径（默认：ast/，相对模块网络路径而言） */
  astPath?: string
  /** 压缩代码（默认：true） */
  minify?: boolean
  /** 丑化代码（默认：true） */
  uglify?: boolean
  /** 源代码映射（默认：压缩或丑化时启用） */
  sourceMap?: boolean
  /** 去除代码里使用到的外部模块 */
  externals?: Record<string, string>
  /** SASS 模块（默认：开启） */
  sassModule?: boolean
  /** 混淆 CSS 类名（默认：开启） */
  mixinClass?: boolean
  /** babel 编译包含项 */
  babelIncludes?: OrNil<RuleSetCondition>[]
  /** babel 编译排除项 */
  babelExcludes?: OrNil<RuleSetCondition>[]
  /** 修改文本打包规则（仅允许修改部分值）*/
  rawRule?: Partial<RuleSetRule>
  /** 修改字体打包规则（仅允许修改部分值）*/
  fontRule?: Partial<RuleSetRule>
  /** 修改图片打包规则（仅允许修改部分值）*/
  imageRule?: Partial<RuleSetRule>
  /** 修改音频打包规则（仅允许修改部分值）*/
  audioRule?: Partial<RuleSetRule>
  /** 修改视频打包规则（仅允许修改部分值）*/
  videoRule?: Partial<RuleSetRule>
  /** 添加打包规则（可以覆盖部分默认规则） */
  rules?: OrNil<RuleSetRule>[]
  /** 开发模式下，启用日志（默认：不启用） */
  devLog?: boolean
  /** 开发模式下，在页面标题上显示表情符号（默认：⚡） */
  devEmoji?: string
  /** 开发环境下，服务器的端口号（默认：8080） */
  devPort?: number
  /** 开发环境下，服务器的代理设置 <https://github.com/edorivai/koa-proxy> */
  devProxies?: OrNil<ProxyOptions>[]
  /** 页面列表 */
  pages: OrNil<SdinApplicationPageParams>[]
  /** 根页面名称（默认：index） */
  index?: string
  /** 错误页面名称（默认：error） */
  error?: string
  /** 页面元信息标签列表 */
  metas?: OrNil<SdinApplicationPageElement>[]
  /** 页面样式标签列表 */
  links?: OrNil<SdinApplicationPageElement>[]
  /** 页面样式标签列表 */
  styles?: OrNil<SdinApplicationPageElement>[]
  /** 页面脚本标签列表 */
  scripts?: OrNil<SdinApplicationPageElement>[]
  /** 页面骨架渲染器 */
  skeleton?: SdinApplicationPageSkeleton
}
```

### SdinApplicationPageParams

网页应用页面配置参数

```typescript
interface SdinApplicationPageElement extends Record<string, string | boolean | undefined> {
  key: string
}

type SdinApplicationPageSkeleton = (page: SdinApplicationPage) => string

interface SdinApplicationPageParams {
  /** 页面名称 */
  name: string
  /** 页面标题 */
  title: string
  /** 页面入口文件（默认：页面名称/index.(ts|tsx|js|jsx)，相对模块源码目录而言） */
  index?: string
  /** 页面网络路径（默认：页面名称，相对模块网络路径而言） */
  path?: string
  /** 页面元信息标签列表 */
  metas?: OrNil<SdinApplicationPageElement>[]
  /** 页面链接标签列表 */
  links?: OrNil<SdinApplicationPageElement>[]
  /** 页面样式标签列表 */
  styles?: OrNil<SdinApplicationPageElement>[]
  /** 页面脚本标签列表 */
  scripts?: OrNil<SdinApplicationPageElement>[]
  /** 页面骨架渲染器 */
  skeleton?: SdinApplicationPageSkeleton
  /** 数据宏定义 */
  datas?: Record<string, string>
}
```

### SdinTestingParams

测试模块配置参数

```typescript
export interface SdinTestingParams
  extends Omit<
    SdinIntegrationModuleParams,
    'type' | 'name' | 'mode' | 'monify' | 'uglify' | 'sourceMap' | 'mixinClass'
  > {}
```

### SdinPlayingParams

调试模块配置参数

```typescript
interface SdinPlayingParams
  extends Omit<
    SdinApplicationModuleParams,
    'type' | 'name' | 'mode' | 'minify' | 'uglify' | 'sourceMap' | 'devEmoji'
  > {}
```
