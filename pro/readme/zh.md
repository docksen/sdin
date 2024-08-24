# sdin

> [中文](./pro/readme/readme-zh.md) | [English](./pro/readme/readme-en.md)  
> Sdin /s'dɪn/ means Small Dinosaur.  
> 作者会谨慎升级依赖，非必要不发版，以保证程序的正确性。  
> 作者不会修改接口字段名称、类型及其含义，本包将长期维持 v1 版本，请放心使用。

这是一个 JavaScript 包构建器，内部使用 Webpack、Gulp 打包，具备如下特性：

1. 支持压缩和混淆代码
1. 支持全局定义
1. 支持路径别名
1. 支持自定义生成多份模块
1. 可打包成 ESM、CJS、UMD 模块
1. 可生成“多文件”产物和“单文件”产物
1. 支持引用文本、字体、图片、音频、视频
1. 支持 React、JSX、SCSS、CSS
1. 支持 TypeScript 和 JavaScript
1. 使用 TypeScript 作为配置文件的语言

## 目录

- [sdin](#sdin)
  - [目录](#目录)
  - [示例](#示例)
  - [配置](#配置)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [命令](#命令)
    - [主命令](#主命令)
    - [build 命令](#build-命令)
    - [create 命令](#create-命令)
  - [接口](#接口)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## 示例

在命令行中构建项目：

```shell
$ sdin build

i Project hello, version 0.0.1.
i Project files are qualified, checking took 0.003 s.
√ Successfully built foundation cjs module camille, it took 0.32 s.
√ Successfully built foundation esm module elise, it took 0.06 s.
√ Successfully built declaration dts module diana, it took 1.361 s.
√ Successfully built integration umd module urgoth, it took 12.173 s.
i Webpack compiled information:
  asset demo.0d177d92e9.png 60 KiB [emitted] [immutable] ...
  asset index.js 13.1 KiB [emitted] [minimized] ...
  asset index.css 272 bytes [emitted] [minimized] ...
  ...
```

在代码中构建项目：

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'

main()

async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## 配置

项目的配置文件路径： `pro/configs/project.ts`。

项目的配置文件内容：

```typescript
import { SdinConfigParams } from 'sdin'

export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

项目配置

| 属性名      | 值类型                      | 值必传 | 默认值       | 说明                                         | 示例                  |
| ----------- | --------------------------- | ------ | ------------ | -------------------------------------------- | --------------------- |
| root        | string                      | 否     | 当前工作目录 | 项目根目录                                   | -                     |
| mode        | SdinBuildMode               | 否     | production   | 构建模式                                     | -                     |
| alias       | Record\<string, string\>    | 否     | -            | 模块别名，\<别名, 路径(相对项目根目录而言)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | 否     | -            | 全局定义，\<原代码, 替换后的代码\>           | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | 是     | -            | 模块配置项列表                               | -                     |

```typescript
// production: 生产模式; development: 开发环境;
type SdinBuildMode = 'development' | 'production'

type OrNil<T> = T | undefined | null

type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

### SdinDeclarationModuleParams

定义模块配置

| 键名     | 值类型                    | 值必传 | 默认值             | 说明                                 | 示例 |
| -------- | ------------------------- | ------ | ------------------ | ------------------------------------ | ---- |
| type     | 'declaration'             | 是     | -                  | 模块类型                             | -    |
| mode     | SdinDeclarationModuleMode | 否     | 'dts'              | 模块构建模式                         | -    |
| name     | string                    | 是     | -                  | 模块名称                             | -    |
| src      | string                    | 否     | 'src'              | 输入的源码位置（相对项目根目录而言） | -    |
| tar      | string                    | 否     | 'tar/模块构建模式' | 输出的目标位置（相对项目根目录而言） | -    |
| includes | OrNil\<string\>[]         | 否     | -                  | 包含的文件（相对项目根目录而言）     | -    |
| excludes | OrNil\<string\>[]         | 否     | -                  | 不包含的文件（相对项目根目录而言）   | -    |

```typescript
// dts: TypeScript 定义模块;
type SdinnDeclarationModuleMode = 'dts'

type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

基础模块配置

| 键名         | 值类型                   | 值必传 | 默认值                  | 说明                                 | 示例 |
| ------------ | ------------------------ | ------ | ----------------------- | ------------------------------------ | ---- |
| type         | 'foundation'             | 是     | -                       | 模块类型                             | -    |
| mode         | SdinFoundationModuleMode | 否     | 'cjs'                   | 模块构建模式                         | -    |
| name         | string                   | 是     | -                       | 模块名称                             | -    |
| src          | string                   | 否     | 'src'                   | 输入的源码位置（相对项目根目录而言） | -    |
| tar          | string                   | 否     | 'tar/模块构建模式'      | 输出的目标位置（相对项目根目录而言） | -    |
| includes     | OrNil\<string\>[]        | 否     | -                       | 包含的文件（相对项目根目录而言）     | -    |
| excludes     | OrNil\<string\>[]        | 否     | -                       | 不包含的文件（相对项目根目录而言）   | -    |
| minify       | boolean                  | 否     | 生产模式下默认开启      | 压缩代码                             | -    |
| uglify       | boolean                  | 否     | 生产模式下默认开启      | 丑化代码（minify 开启时有效）        | -    |
| sassModule   | boolean                  | 否     | true                    | SASS 模块开关                        | -    |
| styleImports | boolean                  | 否     | SASS 模块启用时默认开启 | 在 JS 文件中引入转换后的 CSS 文件    | -    |

```typescript
// cjs: CommonJS 模块; esm: ESModule 模块;
type SdinFoundationModuleMode = 'cjs' | 'esm'

type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

集成模块配置

| 键名          | 值类型                      | 值必传   | 默认值             | 说明                                                    | 示例 |
| ------------- | --------------------------- | -------- | ------------------ | ------------------------------------------------------- | ---- |
| type          | 'integration'               | 是       | -                  | 模块类型                                                | -    |
| mode          | SdinIntegrationModuleMode   | 否       | 'umd'              | 模块构建模式                                            | -    |
| name          | string                      | 是       | -                  | 模块名称                                                | -    |
| src           | string                      | 否       | 'src'              | 输入的源码位置（相对项目根目录而言）                    | -    |
| tar           | string                      | 否       | 'tar/模块构建模式' | 输出的目标位置（相对项目根目录而言）                    | -    |
| entryName     | string                      | 否       | 'index'            | 模块入口名                                              | -    |
| globalName    | string                      | 有效必传 | -                  | 用于指定包的导出对象，在全局的名称（cjs、umd 模式有效） | -    |
| minify        | boolean                     | 否       | 生产模式下开启     | 压缩代码                                                | -    |
| uglify        | boolean                     | 否       | 生产模式下开启     | 丑化代码（minify 开启时有效）                           | -    |
| externals     | Record\<string, string\>    | 否       | -                  | 去除代码里使用到的外部模块                              | -    |
| sassModule    | Record\<string, string\>    | 否       | true               | SASS 模块                                               | -    |
| babelIncludes | OrNil\<RuleSetCondition\>[] | 否       | -                  | babel 编译包含项                                        | -    |
| babelExcludes | OrNil\<RuleSetCondition\>[] | 否       | -                  | babel 编译排除项                                        | -    |
| rawRule       | Partial\<RuleSetRule\>[]    | 否       | -                  | 修改文本打包规则（仅允许修改部分值）                    | -    |
| fontRule      | Partial\<RuleSetRule\>[]    | 否       | -                  | 修改字体打包规则（仅允许修改部分值）                    | -    |
| imageRule     | Partial\<RuleSetRule\>[]    | 否       | -                  | 修改图片打包规则（仅允许修改部分值）                    | -    |
| audioRule     | Partial\<RuleSetRule\>[]    | 否       | -                  | 修改音频打包规则（仅允许修改部分值）                    | -    |
| videoRule     | Partial\<RuleSetRule\>[]    | 否       | -                  | 修改视频打包规则（仅允许修改部分值）                    | -    |
| cssRule       | Partial\<RuleSetRule\>[]    | 否       | -                  | 修改 CSS 打包规则（仅允许修改部分值）                   | -    |
| sassRule      | Partial\<RuleSetRule\>[]    | 否       | -                  | 修改 SASS 打包规则（仅允许修改部分值）                  | -    |
| babelRule     | Partial\<RuleSetRule\>[]    | 否       | -                  | 修改 babel 打包规则（仅允许修改部分值）                 | -    |
| rules         | OrNil\<RuleSetRule\>[]      | 否       | -                  | 添加打包规则（位于 video 和 css 规则之间）              | -    |

```typescript
// cjs: CommonJS 模块; glb: 全局模块; umd: UMD 模块;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'

type OrNil<T> = T | undefined | null

// 详情请见：https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition

// 详情请见：https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

## 命令

### 主命令

| 选项名    | 简写 | 值类型 | 值必传 | 默认值 | 说明         | 示例    |
| --------- | ---- | ------ | ------ | ------ | ------------ | ------- |
| --version | -v   | -      | -      | -      | 查看版本     | sdin -v |
| --help    | -h   | -      | -      | -      | 查看帮助文档 | sdin -h |

### build 命令

用于构建项目

| 参数名 | 上级参数 | 类型   | 必传 | 默认值       | 说明                   | 示例          |
| ------ | -------- | ------ | ---- | ------------ | ---------------------- | ------------- |
| path   | -        | string | 否   | 当前工作目录 | 指定需构建的项目根目录 | sdin build ./ |

| 选项名    | 简写 | 值类型 | 值必传 | 默认值   | 说明                               | 示例                      |
| --------- | ---- | ------ | ------ | -------- | ---------------------------------- | ------------------------- |
| --modules | -m   | string | 否     | 所有模块 | 指定需构建的模块名，多项以逗号分隔 | sdin build -m diana,elise |

### create 命令

用于创建项目

| 参数名 | 上级参数 | 类型   | 必传 | 默认值 | 说明                                  | 示例                    |
| ------ | -------- | ------ | ---- | ------ | ------------------------------------- | ----------------------- |
| name   | -        | string | 否   | -      | 指定包名，以 “@,a-z,0-9,-,/” 符号组成 | sdin create new-project |

| 选项名     | 简写 | 值类型 | 值必传 | 默认值       | 说明                 | 示例                          |
| ---------- | ---- | ------ | ------ | ------------ | -------------------- | ----------------------------- |
| --output   | -o   | string | 否     | 当前工作目录 | 指定新项目的父级路径 | sdin create -o ./             |
| --template | -t   | string | 否     | -            | 指定新项目所用模板名 | sdin create -t common-package |

## 接口

### readSdinConfig

读取项目配置

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** 项目根目录 */
  root: string
}
```

### createSdinProject

创建项目

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** 模板名称 */
  templateName?: string
  /** 存放项目的文件夹路径（默认：当前工作目录） */
  projectParentPath?: string
  /** 项目名称 */
  projectName?: string
  /** 项目版本号（默认：0.0.1） */
  projectVersion?: string
  /** 项目的描述 */
  projectDescription?: string
  /** 作者姓名（默认：Git 用户名） */
  authorName?: string
  /** 作者邮箱（默认：Git 邮箱名） */
  authorEmail?: string
}
```

### buildSdinProject

构建项目

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Sdin 配置 */
  config: SdinConfig
  /** 要构建的模块名称 */
  moduleNames?: string[]
}
```
