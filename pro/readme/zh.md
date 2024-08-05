# sdin

> [中文](./pro/readme/readme-zh.md) | [English](./pro/readme/readme-en.md)  
> 我们将尽可能减少依赖，少升级依赖包，非必要不发版，以保证程序的正确性。

JavaScript 包构建器，内部使用 Webpack、Gulp 打包，具备如下特性：

1. 支持压缩和混淆代码
1. 支持全局定义和路径别名
1. 支持自定义生成多份模块
1. 可打包成 ESM、CJS、UMD 模块
1. 可生成基础产物（多文件形式）和集成产物（单文件形式）
1. 支持引用文本、字体、图片、音频、视频
1. 支持 React、JSX、SCSS、CSS
1. 支持 TypeScript 和 JavaScript
1. 使用 TypeScript 作为配置文件的语言

## 用例

在命令行中构建项目：

```shell
$ sdin build

i Project hello, version 0.0.1.
i Project files are qualified, checking took 0.003 s.
√ Successfully built foundation cjs module camille, it took 0.32 s.
√ Successfully built foundation esm module elise, it took 0.06 s.
√ Successfully built declaration dts module diana, it took 3.361 s.
√ Successfully built integration umd module urgoth, it took 31.173 s.
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

项目的配置文件是 `pro/configs/project.ts`。

项目的配置文件内容：

```typescript
import { SdinConfigParams } from 'sdin'

export const sdinConfigParams: SdinConfigParams = {...}
```

### 配置定义

```typescript
export interface SdinConfigParams {
  /** 项目根目录（默认：当前工作目录） */
  root?: string
  /** 构建模式（默认：pro，生产模式） */
  mode?: SdinBuildMode
  /** 模块别名（默认：不设置，相对项目根目录而言） */
  alias?: Record<string, string>
  /** 模块配置项列表 */
  modules: OrNil<SdinModuleParams>[]
  /** 全局定义（key 是原代码，value 是替换后的代码） */
  definitions?: Record<string, string>
}
```

```typescript
export interface SdinConfigParams {
  /** 模块构建模式（默认：dts） */
  mode?: SdinDeclarationModuleMode
  /** 输入的源码位置（默认：src，相对项目根目录而言，只适用于 d.ts 文件） */
  src?: string
  /** 输出的目标位置（默认：tar/dts，相对项目根目录而言） */
  tar?: string
  /** 包含的文件（默认：src，相对项目根目录而言，只适用于 d.ts 文件） */
  includes?: OrNil<string>[]
  /** 不包含的文件（默认：没有，相对项目根目录而言，只适用于 d.ts 文件） */
  excludes?: OrNil<string>[]
}
```

## 命令

### 主命令

| 选项名    | 简写 | 值类型 | 值必传 | 默认值 | 说明         | 示例    |
| --------- | ---- | ------ | ------ | ------ | ------------ | ------- |
| --version | -v   | -      | -      | -      | 查看版本     | sdin -v |
| --help    | -h   | -      | -      | -      | 查看帮助文档 | sdin -h |

### build 命令

| 参数名 | 父参 | 类型   | 必传 | 默认值       | 说明                   | 示例          |
| ------ | ---- | ------ | ---- | ------------ | ---------------------- | ------------- |
| path   | 无   | string | 否   | 当前工作目录 | 指定需构建的项目根目录 | sdin build ./ |

| 选项名    | 简写 | 值类型 | 值必传 | 默认值   | 说明                               | 示例                      |
| --------- | ---- | ------ | ------ | -------- | ---------------------------------- | ------------------------- |
| --modules | -m   | string | 否     | 所有模块 | 指定需构建的模块名，多项以逗号分隔 | sdin build -m diana,elise |

### create 命令

| 参数名 | 父参 | 类型   | 必传 | 默认值 | 说明                                  | 示例                    |
| ------ | ---- | ------ | ---- | ------ | ------------------------------------- | ----------------------- |
| name   | -    | string | 否   | -      | 指定包名，以 “@,a-z,0-9,-,/” 符号组成 | sdin create new-project |

| 选项名     | 简写 | 值类型 | 值必传 | 默认值       | 说明                 | 示例                          |
| ---------- | ---- | ------ | ------ | ------------ | -------------------- | ----------------------------- |
| --output   | -o   | string | 否     | 当前工作目录 | 指定新项目的父级路径 | sdin create -o ./             |
| --template | -t   | string | 否     | -            | 指定新项目所用模板名 | sdin create -t common-package |

## 接口
