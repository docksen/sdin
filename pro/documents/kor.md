# sdin

- [sdin](#sdin)
  - [예제](#예제)
  - [구성](#구성)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [지휘부](#지휘부)
    - [주 명령](#주-명령)
    - [`build` 지휘부](#build-지휘부)
    - [`create` 지휘부](#create-지휘부)
  - [인터페이스](#인터페이스)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## 예제

명령줄에 항목을 만들려면 다음과 같이 하십시오.

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

건축 공정 규범:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## 구성

프로젝트의 구성 파일 경로: `pro/configs/project.ts`。

프로젝트의 프로파일 내용:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

프로젝트 구성

| 속성        | 유형                        | 요구의 | 위약               | 설명                                           | 예제                  |
| ----------- | --------------------------- | ------ | ------------------ | ---------------------------------------------- | --------------------- |
| root        | string                      | 아니요 | 현재 작업 디렉토리 | 프로젝트 루트 디렉토리                         | -                     |
| mode        | SdinBuildMode               | 아니요 | production         | 건축 모델                                      | -                     |
| alias       | Record\<string, string\>    | 아니요 | -                  | 모듈 별칭，\<별칭, 경로 (항목 루트에 상대적)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | 아니요 | -                  | 글로벌 정의，\<원본 코드, 코드 교체\>          | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | 아니요 | -                  | 모듈 구성 항목 목록                            | -                     |

```typescript
// production: 생산 모델; development: 발전 환경;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

이 프로그램은 프로젝트에 대해 다음과 같은 전역 정의를 제공합니다.

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // 프로젝트 건설 모델
  const SDIN_PROJECT_NAME: string // 프로젝트 이름
  const SDIN_PROJECT_VERSION: string // 프로젝트 버전
  const SDIN_PROJECT_AUTHOR_NAME: string // 프로젝트 작성자 이름
  const SDIN_PROJECT_AUTHOR_EMAIL: string // 프로젝트 작성자 이메일
  const SDIN_MODULE_TYPE: string // 컴파일할 때 모듈의 유형
  const SDIN_MODULE_MODE: string // 컴파일 과정 중 모듈의 구축 모드
  const SDIN_MODULE_NAME: string // 컴파일 프로세스의 모듈 이름
}
```

### SdinDeclarationModuleParams

모듈 구성 정의

| 속성     | 유형                      | 요구의 | 위약                 | 설명                                                    | 예제 |
| -------- | ------------------------- | ------ | -------------------- | ------------------------------------------------------- | ---- |
| type     | 'declaration'             | 네     | -                    | 모듈 유형                                               | -    |
| mode     | SdinDeclarationModuleMode | 아니요 | 'dts'                | 모듈 빌드 모드                                          | -    |
| name     | string                    | 네     | -                    | 모듈 이름                                               | -    |
| src      | string                    | 아니요 | 'src'                | 프로젝트 루트를 기준으로 소스 코드의 위치를 입력합니다. | -    |
| tar      | string                    | 아니요 | 'tar/모듈 빌드 모드' | 출력 대상 위치 (항목 루트에 상대적)                     | -    |
| includes | OrNil\<string\>[]         | 아니요 | -                    | 파일 포함 (항목 루트에 상대적)                          | -    |
| excludes | OrNil\<string\>[]         | 아니요 | -                    | 제외된 파일 (항목 루트에 상대적)                        | -    |

```typescript
// dts: TypeScript 정의 모듈;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

기본 모듈 구성

| 속성         | 유형                     | 요구의 | 위약                     | 설명                                                    | 예제 |
| ------------ | ------------------------ | ------ | ------------------------ | ------------------------------------------------------- | ---- |
| type         | 'foundation'             | 네     | -                        | 모듈 유형                                               | -    |
| mode         | SdinFoundationModuleMode | 아니요 | 'cjs'                    | 모듈 빌드 모드                                          | -    |
| name         | string                   | 네     | -                        | 모듈 이름                                               | -    |
| src          | string                   | 아니요 | 'src'                    | 프로젝트 루트를 기준으로 소스 코드의 위치를 입력합니다. | -    |
| tar          | string                   | 아니요 | 'tar/모듈 빌드 모드'     | 출력 대상 위치 (항목 루트에 상대적)                     | -    |
| includes     | OrNil\<string\>[]        | 아니요 | -                        | 파일 포함 (항목 루트에 상대적)                          | -    |
| excludes     | OrNil\<string\>[]        | 아니요 | -                        | 제외된 파일 (항목 루트에 상대적)                        | -    |
| minify       | boolean                  | 아니요 | 프로덕션 모드에서 활성화 | 코드 압축                                               | -    |
| uglify       | boolean                  | 아니요 | 프로덕션 모드에서 활성화 | 흉측한 코드 (축소 활성화 시 유효)                       | -    |
| sassModule   | boolean                  | 아니요 | true                     | SASS 모듈 스위치                                        | -    |
| styleImports | boolean                  | 아니요 | SASS 모듈 켜짐 시 켜짐   | 변환된 CSS 파일을 JS 파일로 가져오기                    | -    |

```typescript
// cjs: CommonJS 모듈; esm: ESModule 모듈;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

통합 모듈 구성

| 속성          | 유형                        | 요구의                         | 위약                     | 설명                                                                          | 예제    |
| ------------- | --------------------------- | ------------------------------ | ------------------------ | ----------------------------------------------------------------------------- | ------- |
| type          | 'integration'               | 네                             | -                        | 모듈 유형                                                                     | -       |
| mode          | SdinIntegrationModuleMode   | 아니요                         | 'umd'                    | 모듈 빌드 모드                                                                | -       |
| name          | string                      | 네                             | -                        | 모듈 이름                                                                     | -       |
| src           | string                      | 아니요                         | 'src/index.{jsx?\|tsx?}' | 프로젝트 루트를 기준으로 소스 코드의 위치를 입력합니다.                       | -       |
| tar           | string                      | 아니요                         | 'tar/모듈 빌드 모드'     | 출력 대상 위치 (항목 루트에 상대적)                                           | -       |
| entryName     | string                      | 아니요                         | 'index'                  | 모듈 포털 이름                                                                | -       |
| globalName    | string                      | 유효한 정보를 전송해야 합니다. | -                        | 패키지 내보내기 객체의 글로벌 이름을 지정합니다 (cjs 및 umd 모드에서 유효함). | "React" |
| minify        | boolean                     | 아니요                         | 프로덕션 모드에서 활성화 | 코드 압축                                                                     | -       |
| uglify        | boolean                     | 아니요                         | 프로덕션 모드에서 활성화 | 흉측한 코드 (축소 활성화 시 유효)                                             | -       |
| externals     | Record\<string, string\>    | 아니요                         | -                        | 코드에 사용된 외부 모듈 제거                                                  | -       |
| sassModule    | boolean                     | 아니요                         | true                     | SASS 모듈 스위치                                                              | -       |
| babelIncludes | OrNil\<RuleSetCondition\>[] | 아니요                         | -                        | Babel 컴파일은 항목을 포함합니다.                                             | -       |
| babelExcludes | OrNil\<RuleSetCondition\>[] | 아니요                         | -                        | Babel 컴파일 제외                                                             | -       |
| rawRule       | Partial\<RuleSetRule\>      | 아니요                         | -                        | 텍스트 패키지 규칙 수정                                                       | -       |
| fontRule      | Partial\<RuleSetRule\>      | 아니요                         | -                        | 글꼴 패키지 규칙 수정                                                         | -       |
| imageRule     | Partial\<RuleSetRule\>      | 아니요                         | -                        | 이미지 패키지 규칙 수정                                                       | -       |
| audioRule     | Partial\<RuleSetRule\>      | 아니요                         | -                        | 오디오 패키지 규칙 수정                                                       | -       |
| videoRule     | Partial\<RuleSetRule\>      | 아니요                         | -                        | 비디오 패키지 규칙 수정                                                       | -       |
| rules         | OrNil\<RuleSetRule\>[]      | 아니요                         | -                        | 패키지 규칙 추가 (기본 규칙 중 일부를 무시할 수 있음)                         | -       |

```typescript
// cjs: CommonJS 모듈; glb: 글로벌 모듈; umd: UMD 모듈;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// 자세한 내용은: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// 자세한 내용은: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

패키지 규칙을 수정하면 유형 및 빌더를 제외한 모든 필드가 표시됩니다.파일 이름을 수정할 수 있습니다.

패키지 규칙을 추가하면 텍스트, 글꼴, 이미지, 오디오 및 비디오의 패키지 규칙을 덮어쓸 수 있습니다.

## 지휘부

### 주 명령

| 옵션      | 약어 | 유형 | 요구의 | 위약 | 설명             | 예제    |
| --------- | ---- | ---- | ------ | ---- | ---------------- | ------- |
| --version | -v   | -    | -      | -    | 버전 보기        | sdin -v |
| --help    | -h   | -    | -      | -    | 도움말 문서 보기 | sdin -h |

### `build` 지휘부

건축 프로젝트에 사용

| 매개변수 | 부모급 | 유형   | 요구의 | 위약               | 설명                             | 예제          |
| -------- | ------ | ------ | ------ | ------------------ | -------------------------------- | ------------- |
| path     | -      | string | 아니요 | 현재 작업 디렉토리 | 생성할 항목의 루트 디렉토리 지정 | sdin build ./ |

| 옵션      | 약어 | 유형   | 요구의 | 위약      | 설명                                                       | 예제                      |
| --------- | ---- | ------ | ------ | --------- | ---------------------------------------------------------- | ------------------------- |
| --modules | -m   | string | 아니요 | 모든 모듈 | 여러 항목을 쉼표로 구분하여 구성할 모듈 이름을 지정합니다. | sdin build -m diana,elise |

### `create` 지휘부

프로젝트 작성

| 매개변수 | 부모급 | 유형   | 요구의 | 위약 | 설명                                                  | 예제                    |
| -------- | ------ | ------ | ------ | ---- | ----------------------------------------------------- | ----------------------- |
| name     | -      | string | 아니요 | -    | 기호 "@, a-z, 0-9, -, /" 를 사용하여 패키지 이름 지정 | sdin create new-project |

| 옵션       | 약어 | 유형   | 요구의 | 위약               | 설명                           | 예제                          |
| ---------- | ---- | ------ | ------ | ------------------ | ------------------------------ | ----------------------------- |
| --output   | -o   | string | 아니요 | 현재 작업 디렉토리 | 새 항목의 상위 경로 지정       | sdin create -o ./             |
| --template | -t   | string | 아니요 | -                  | 새 프로젝트의 템플릿 이름 지정 | sdin create -t common-package |

## 인터페이스

### readSdinConfig

항목 구성 읽기

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** 프로젝트 루트 디렉토리 */
  root: string
}
```

### createSdinProject

프로젝트 만들기

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** 템플릿 이름 */
  templateName?: string
  /** 항목이 저장된 폴더 경로 (기본값: 현재 작업 디렉토리) */
  projectParentPath?: string
  /** 프로젝트 이름 */
  projectName?: string
  /** 프로젝트 버전 (기본값: 0.0.1) */
  projectVersion?: string
  /** 프로젝트 설명 */
  projectDescription?: string
  /** 작성자 이름(기본값: Git 사용자 이름) */
  authorName?: string
  /** 작성자 이메일(기본값: Git 이메일) */
  authorEmail?: string
}
```

### buildSdinProject

건축 공사

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Sdin 구성 */
  config: SdinConfig
  /** 구축할 모듈의 이름을 지정합니다. */
  moduleNames?: string[]
}
```
