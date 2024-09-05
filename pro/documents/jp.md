# sdin

- [sdin](#sdin)
  - [例](#例)
  - [構成](#構成)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [コマンド](#コマンド)
    - [マスターコマンド](#マスターコマンド)
    - [`build` コマンド](#build-コマンド)
    - [`create` コマンド](#create-コマンド)
  - [インタフェース](#インタフェース)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## 例

コマンドライン上にプロジェクトを構築するには：

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

建築工事規範：

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## 構成

プロジェクトのプロファイルパス： `pro/configs/project.ts`。

プロジェクトのプロファイル内容：

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

プロジェクト構成

| 属性＃ゾクセイ＃ | タイプ                      | 要求   | 約束を破る             | 説明                                                                     | 例                    |
| ---------------- | --------------------------- | ------ | ---------------------- | ------------------------------------------------------------------------ | --------------------- |
| root             | string                      | いいえ | 現在の作業ディレクトリ | プロジェクトルート                                                       | -                     |
| mode             | SdinBuildMode               | いいえ | production             | 建築モード                                                               | -                     |
| alias            | Record\<string, string\>    | いいえ | -                      | モジュール別名，\<別名＃ベツメイ＃, パス（プロジェクトルートに対して）\> | {utils: "src/utils" } |
| definitions      | Record<string, string>      | いいえ | -                      | グローバル定義，\<元のコード, 置換コード\>                               | -                     |
| modules          | OrNil\<SdinModuleParams\>[] | いいえ | -                      | モジュール構成項目リスト                                                 | -                     |

```typescript
// production: 本番モード; development: 発展環境;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

このプログラムは、プロジェクトで直接使用できるグローバルな定義を提供します。

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // プロジェクト建設モデル
  const SDIN_PROJECT_NAME: string // プロジェクト名
  const SDIN_PROJECT_VERSION: string // プロジェクトバージョン
  const SDIN_PROJECT_AUTHOR_NAME: string // プロジェクト作成者名
  const SDIN_PROJECT_AUTHOR_EMAIL: string // プロジェクト作成者のEメール
  const SDIN_MODULE_TYPE: string // コンパイル時のモジュールのタイプ
  const SDIN_MODULE_MODE: string // コンパイル中のモジュールの構築モード
  const SDIN_MODULE_NAME: string // コンパイル時のモジュール名
}
```

### SdinDeclarationModuleParams

モジュール構成の定義

| 属性＃ゾクセイ＃ | タイプ                    | 要求   | 約束を破る                 | 説明                                                 | 例  |
| ---------------- | ------------------------- | ------ | -------------------------- | ---------------------------------------------------- | --- |
| type             | 'declaration'             | はい   | -                          | モジュールタイプ                                     | -   |
| mode             | SdinDeclarationModuleMode | いいえ | 'dts'                      | モジュール構築モード                                 | -   |
| name             | string                    | はい   | -                          | モジュール名                                         | -   |
| src              | string                    | いいえ | 'src'                      | 入力ソースコードの場所（プロジェクトルートに対して） | -   |
| tar              | string                    | いいえ | 'tar/モジュール構築モード' | 出力先位置（プロジェクトルートに対して）             | -   |
| includes         | OrNil\<string\>[]         | いいえ | -                          | インクルードファイル（プロジェクトルートに対して）   | -   |
| excludes         | OrNil\<string\>[]         | いいえ | -                          | 除外されたファイル（プロジェクトルートに対して）     | -   |

```typescript
// dts: TypeScript定義モジュール;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

基本モジュール構成

| 属性＃ゾクセイ＃ | タイプ                   | 要求   | 約束を破る                            | 説明                                                  | 例  |
| ---------------- | ------------------------ | ------ | ------------------------------------- | ----------------------------------------------------- | --- |
| type             | 'foundation'             | はい   | -                                     | モジュールタイプ                                      | -   |
| mode             | SdinFoundationModuleMode | いいえ | 'cjs'                                 | モジュール構築モード                                  | -   |
| name             | string                   | はい   | -                                     | モジュール名                                          | -   |
| src              | string                   | いいえ | 'src'                                 | 入力ソースコードの場所（プロジェクトルートに対して）  | -   |
| tar              | string                   | いいえ | 'tar/モジュール構築モード'            | 出力先位置（プロジェクトルートに対して）              | -   |
| includes         | OrNil\<string\>[]        | いいえ | -                                     | インクルードファイル（プロジェクトルートに対して）    | -   |
| excludes         | OrNil\<string\>[]        | いいえ | -                                     | 除外されたファイル（プロジェクトルートに対して）      | -   |
| minify           | boolean                  | いいえ | 本番モードでのアクティブ化            | 圧縮コード                                            | -   |
| uglify           | boolean                  | いいえ | 本番モードでのアクティブ化            | 醜いコード（縮小が有効な場合に有効）                  | -   |
| sassModule       | boolean                  | いいえ | true                                  | SASS モジュールスイッチ                               | -   |
| styleImports     | boolean                  | いいえ | SASS モジュールが開いているときに開く | 変換された CSS ファイルを JS ファイルにインポートする | -   |

```typescript
// cjs: CommonJSモジュール; esm: ESModuleモジュール;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

統合モジュール構成

| 属性＃ゾクセイ＃ | タイプ                      | 要求                               | 約束を破る                 | 説明                                                                                          | 例      |
| ---------------- | --------------------------- | ---------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------- | ------- |
| type             | 'integration'               | はい                               | -                          | モジュールタイプ                                                                              | -       |
| mode             | SdinIntegrationModuleMode   | いいえ                             | 'umd'                      | モジュール構築モード                                                                          | -       |
| name             | string                      | はい                               | -                          | モジュール名                                                                                  | -       |
| src              | string                      | いいえ                             | 'src/index.{jsx?\|tsx?}'   | 入力ソースコードの場所（プロジェクトルートに対して）                                          | -       |
| tar              | string                      | いいえ                             | 'tar/モジュール構築モード' | 出力先位置（プロジェクトルートに対して）                                                      | -       |
| entryName        | string                      | いいえ                             | 'index'                    | モジュールエントリ名                                                                          | -       |
| globalName       | string                      | 有効な情報を転送する必要があります | -                          | パッケージエクスポートオブジェクトのグローバル名を指定します（cjs モードと umd モードで有効） | "React" |
| minify           | boolean                     | いいえ                             | 本番モードでのアクティブ化 | 圧縮コード                                                                                    | -       |
| uglify           | boolean                     | いいえ                             | 本番モードでのアクティブ化 | 醜いコード（縮小が有効な場合に有効）                                                          | -       |
| externals        | Record\<string, string\>    | いいえ                             | -                          | コードで使用する外部モジュールを削除する                                                      | -       |
| sassModule       | boolean                     | いいえ                             | true                       | SASS モジュールスイッチ                                                                       | -       |
| babelIncludes    | OrNil\<RuleSetCondition\>[] | いいえ                             | -                          | Babel コンパイルにはプロジェクトが含まれています                                              | -       |
| babelExcludes    | OrNil\<RuleSetCondition\>[] | いいえ                             | -                          | Babel コンパイル除外項目                                                                      | -       |
| rawRule          | Partial\<RuleSetRule\>      | いいえ                             | -                          | テキストパッケージング規則の変更                                                              | -       |
| fontRule         | Partial\<RuleSetRule\>      | いいえ                             | -                          | フォントパッケージング規則の変更                                                              | -       |
| imageRule        | Partial\<RuleSetRule\>      | いいえ                             | -                          | 画像パッケージング規則の変更                                                                  | -       |
| audioRule        | Partial\<RuleSetRule\>      | いいえ                             | -                          | オーディオパッケージング規則の変更                                                            | -       |
| videoRule        | Partial\<RuleSetRule\>      | いいえ                             | -                          | ビデオパッケージング規則の変更                                                                | -       |
| rules            | OrNil\<RuleSetRule\>[]      | いいえ                             | -                          | パッケージ・ルールの追加（デフォルト・ルールの一部を上書きできます）                          | -       |

```typescript
// cjs: CommonJSモジュール; glb: グローバルモジュール; umd: UMDモジュール;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// 詳細は、: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// 詳細は、: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

パッケージ規則を変更した場合は、「タイプ」と「ジェネレータ」以外のすべてのフィールド。ファイル名は変更できます。

パッケージ規則を追加すると、テキスト、フォント、イメージ、オーディオ、ビデオのパッケージ規則を上書きできます。

## コマンド

### マスターコマンド

| オプション | 省略形 | タイプ | 要求 | 約束を破る | 説明                       | 例      |
| ---------- | ------ | ------ | ---- | ---------- | -------------------------- | ------- |
| --version  | -v     | -      | -    | -          | バージョンの表示           | sdin -v |
| --help     | -h     | -      | -    | -          | ヘルプ・ドキュメントの表示 | sdin -h |

### `build` コマンド

建築プロジェクト用

| パラメータ | 保護者レベル | タイプ | 要求   | 約束を破る             | 説明                                                 | 例            |
| ---------- | ------------ | ------ | ------ | ---------------------- | ---------------------------------------------------- | ------------- |
| path       | -            | string | いいえ | 現在の作業ディレクトリ | 生成するプロジェクトのルートディレクトリを指定します | sdin build ./ |

| オプション | 省略形 | タイプ | 要求   | 約束を破る         | 説明                                             | 例                        |
| ---------- | ------ | ------ | ------ | ------------------ | ------------------------------------------------ | ------------------------- |
| --modules  | -m     | string | いいえ | すべてのモジュール | 構築するモジュール名をカンマで区切って指定します | sdin build -m diana,elise |

### `create` コマンド

プロジェクトの作成に使用

| パラメータ | 保護者レベル | タイプ | 要求   | 約束を破る | 説明                                                      | 例                      |
| ---------- | ------------ | ------ | ------ | ---------- | --------------------------------------------------------- | ----------------------- |
| name       | -            | string | いいえ | -          | 符号「@、a-z、0-9、-、/」を使用してパッケージ名を指定する | sdin create new-project |

| オプション | 省略形 | タイプ | 要求   | 約束を破る             | 説明                                   | 例                            |
| ---------- | ------ | ------ | ------ | ---------------------- | -------------------------------------- | ----------------------------- |
| --output   | -o     | string | いいえ | 現在の作業ディレクトリ | 新規プロジェクトの親パスの指定         | sdin create -o ./             |
| --template | -t     | string | いいえ | -                      | 新規プロジェクトのテンプレート名の指定 | sdin create -t common-package |

## インタフェース

### readSdinConfig

プロジェクト構成の読み取り

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** プロジェクトルート */
  root: string
}
```

### createSdinProject

プロジェクトの作成

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** テンプレート名 */
  templateName?: string
  /** プロジェクトを保存するフォルダパス（デフォルト：現在の作業ディレクトリ） */
  projectParentPath?: string
  /** プロジェクト名 */
  projectName?: string
  /** プロジェクトバージョン（デフォルト：0.0.1） */
  projectVersion?: string
  /** プロジェクトの説明 */
  projectDescription?: string
  /** 作者名（デフォルト：Gitユーザー名） */
  authorName?: string
  /** 作成者の電子メール（デフォルト：Git電子メール） */
  authorEmail?: string
}
```

### buildSdinProject

けんちくこうじ

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Sdin構成 */
  config: SdinConfig
  /** 構築するモジュールの名前を指定します */
  moduleNames?: string[]
}
```
