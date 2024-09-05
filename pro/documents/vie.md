# sdin

- [sdin](#sdin)
  - [Ví dụ](#ví-dụ)
  - [Cấu hình](#cấu-hình)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Sở chỉ huy](#sở-chỉ-huy)
    - [Lệnh chính](#lệnh-chính)
    - [`build` Sở chỉ huy](#build-sở-chỉ-huy)
    - [`create` Sở chỉ huy](#create-sở-chỉ-huy)
  - [Giao diện](#giao-diện)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Ví dụ

Xây dựng dự án trên dòng lệnh:

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

Quy tắc công trình xây dựng:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Cấu hình

Đường dẫn hồ sơ cho dự án: `pro/configs/project.ts`。

Nội dung hồ sơ của dự án:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Cấu hình dự án

| Thuộc tính  | Loại                        | Yêu cầu | Mặc định                  | Mô tả                                                                          | Ví dụ                 |
| ----------- | --------------------------- | ------- | ------------------------- | ------------------------------------------------------------------------------ | --------------------- |
| root        | string                      | Không   | Thư mục làm việc hiện tại | Mục gốc                                                                        | -                     |
| mode        | SdinBuildMode               | Không   | production                | Chế độ xây dựng                                                                | -                     |
| alias       | Record\<string, string\>    | Không   | -                         | Mô- đun Bí danh，\<Tên khác, Đường dẫn (tương đối với thư mục gốc của dự án)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | Không   | -                         | Định nghĩa toàn cầu，\<Mã gốc, Mã thay thế\>                                   | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | Không   | -                         | Danh sách các mục cấu hình môđun                                               | -                     |

```typescript
// production: Chế độ sản xuất; development: Môi trường phát triển;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

Chương trình này cung cấp một số định nghĩa toàn cục cho dự án và có thể được sử dụng trực tiếp trong dự án:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // Mô hình xây dựng dự án
  const SDIN_PROJECT_NAME: string // Tên dự án
  const SDIN_PROJECT_VERSION: string // Phiên bản dự án
  const SDIN_PROJECT_AUTHOR_NAME: string // Tên tác giả dự án
  const SDIN_PROJECT_AUTHOR_EMAIL: string // Email tác giả dự án
  const SDIN_MODULE_TYPE: string // Tại thời điểm biên dịch, các loại module
  const SDIN_MODULE_MODE: string // Mô hình xây dựng mô-đun trong quá trình biên dịch
  const SDIN_MODULE_NAME: string // Name
}
```

### SdinDeclarationModuleParams

Định nghĩa cấu hình mô-đun

| Thuộc tính | Loại                      | Yêu cầu | Mặc định                      | Mô tả                                                       | Ví dụ |
| ---------- | ------------------------- | ------- | ----------------------------- | ----------------------------------------------------------- | ----- |
| type       | 'declaration'             | Vâng.   | -                             | Loại mô-đun                                                 | -     |
| mode       | SdinDeclarationModuleMode | Không   | 'dts'                         | Mô hình xây dựng mô-đun                                     | -     |
| name       | string                    | Vâng.   | -                             | Mô- đun Name                                                | -     |
| src        | string                    | Không   | 'src'                         | Nơi bạn nhập mã nguồn (liên quan đến thư mục gốc của dự án) | -     |
| tar        | string                    | Không   | 'tar/Mô hình xây dựng mô-đun' | Xuất vị trí đích (so với thư mục gốc của dự án)             | -     |
| includes   | OrNil\<string\>[]         | Không   | -                             | Bao gồm các tệp (tương đối với thư mục gốc của dự án)       | -     |
| excludes   | OrNil\<string\>[]         | Không   | -                             | Các tệp bị loại trừ (so với thư mục gốc của dự án)          | -     |

```typescript
// dts: Mô đun định nghĩa TypeScript;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Cấu hình mô-đun cơ bản

| Thuộc tính   | Loại                     | Yêu cầu | Mặc định                        | Mô tả                                                       | Ví dụ |
| ------------ | ------------------------ | ------- | ------------------------------- | ----------------------------------------------------------- | ----- |
| type         | 'foundation'             | Vâng.   | -                               | Loại mô-đun                                                 | -     |
| mode         | SdinFoundationModuleMode | Không   | 'cjs'                           | Mô hình xây dựng mô-đun                                     | -     |
| name         | string                   | Vâng.   | -                               | Mô- đun Name                                                | -     |
| src          | string                   | Không   | 'src'                           | Nơi bạn nhập mã nguồn (liên quan đến thư mục gốc của dự án) | -     |
| tar          | string                   | Không   | 'tar/Mô hình xây dựng mô-đun'   | Xuất vị trí đích (so với thư mục gốc của dự án)             | -     |
| includes     | OrNil\<string\>[]        | Không   | -                               | Bao gồm các tệp (tương đối với thư mục gốc của dự án)       | -     |
| excludes     | OrNil\<string\>[]        | Không   | -                               | Các tệp bị loại trừ (so với thư mục gốc của dự án)          | -     |
| minify       | boolean                  | Không   | Kích hoạt trong chế độ sản xuất | Mã nén                                                      | -     |
| uglify       | boolean                  | Không   | Kích hoạt trong chế độ sản xuất | Mã xấu xí (hoạt động khi thu nhỏ được bật)                  | -     |
| sassModule   | boolean                  | Không   | true                            | Công tắc mô-đun SASS                                        | -     |
| styleImports | boolean                  | Không   | Mở module SASS khi mở           | Nhập các tập tin CSS đã chuyển đổi vào các tập tin JS       | -     |

```typescript
// cjs: Mô- đun CommonJS; esm: Mô- đun ESModule;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Cấu hình mô-đun tích hợp

| Thuộc tính    | Loại                        | Yêu cầu                              | Mặc định                        | Mô tả                                                                       | Ví dụ   |
| ------------- | --------------------------- | ------------------------------------ | ------------------------------- | --------------------------------------------------------------------------- | ------- |
| type          | 'integration'               | Vâng.                                | -                               | Loại mô-đun                                                                 | -       |
| mode          | SdinIntegrationModuleMode   | Không                                | 'umd'                           | Mô hình xây dựng mô-đun                                                     | -       |
| name          | string                      | Vâng.                                | -                               | Mô- đun Name                                                                | -       |
| src           | string                      | Không                                | 'src/index.{jsx?\|tsx?}'        | Nơi bạn nhập mã nguồn (liên quan đến thư mục gốc của dự án)                 | -       |
| tar           | string                      | Không                                | 'tar/Mô hình xây dựng mô-đun'   | Xuất vị trí đích (so với thư mục gốc của dự án)                             | -       |
| entryName     | string                      | Không                                | 'index'                         | Name                                                                        | -       |
| globalName    | string                      | Thông tin hợp lệ phải được truyền đi | -                               | Chỉ định tên toàn cục của đối tượng xuất gói (hợp lệ trong cjs và umd mode) | "React" |
| minify        | boolean                     | Không                                | Kích hoạt trong chế độ sản xuất | Mã nén                                                                      | -       |
| uglify        | boolean                     | Không                                | Kích hoạt trong chế độ sản xuất | Mã xấu xí (hoạt động khi thu nhỏ được bật)                                  | -       |
| externals     | Record\<string, string\>    | Không                                | -                               | Xóa các module bên ngoài được sử dụng trong code                            | -       |
| sassModule    | boolean                     | Không                                | true                            | Công tắc mô-đun SASS                                                        | -       |
| babelIncludes | OrNil\<RuleSetCondition\>[] | Không                                | -                               | Babel Compilation bao gồm các dự án                                         | -       |
| babelExcludes | OrNil\<RuleSetCondition\>[] | Không                                | -                               | Babel biên dịch loại trừ                                                    | -       |
| rawRule       | Partial\<RuleSetRule\>      | Không                                | -                               | Sửa đổi quy tắc đóng gói văn bản                                            | -       |
| fontRule      | Partial\<RuleSetRule\>      | Không                                | -                               | Sửa đổi quy tắc đóng gói phông chữ                                          | -       |
| imageRule     | Partial\<RuleSetRule\>      | Không                                | -                               | Sửa đổi quy tắc đóng gói ảnh                                                | -       |
| audioRule     | Partial\<RuleSetRule\>      | Không                                | -                               | Sửa đổi quy tắc đóng gói âm thanh                                           | -       |
| videoRule     | Partial\<RuleSetRule\>      | Không                                | -                               | Thay đổi quy tắc đóng gói video                                             | -       |
| rules         | OrNil\<RuleSetRule\>[]      | Không                                | -                               | Thêm quy tắc đóng gói (có thể ghi đè lên một số quy tắc mặc định)           | -       |

```typescript
// cjs: Mô- đun CommonJS; glb: Mô- đun toàn cục; umd: Mô- đun UMD;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// Xem chi tiết: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// Xem chi tiết: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Nếu bạn thay đổi quy tắc đóng gói, tất cả các trường ngoại trừ Type và Generator. "File name" có thể thay đổi.

Nếu bạn thêm quy tắc đóng gói, bạn có thể ghi đè quy tắc đóng gói cho văn bản, phông chữ, hình ảnh, âm thanh và video.

## Sở chỉ huy

### Lệnh chính

| Tùy chọn  | Viết tắt | Loại | Yêu cầu | Mặc định | Mô tả                 | Ví dụ   |
| --------- | -------- | ---- | ------- | -------- | --------------------- | ------- |
| --version | -v       | -    | -       | -        | Xem phiên bản         | sdin -v |
| --help    | -h       | -    | -       | -        | Xem tài liệu trợ giúp | sdin -h |

### `build` Sở chỉ huy

Đối với dự án xây dựng

| Tham số | Cấp bậc phụ huynh | Loại   | Yêu cầu | Mặc định                  | Mô tả                                       | Ví dụ         |
| ------- | ----------------- | ------ | ------- | ------------------------- | ------------------------------------------- | ------------- |
| path    | -                 | string | Không   | Thư mục làm việc hiện tại | Chỉ định thư mục gốc của dự án bạn muốn tạo | sdin build ./ |

| Tùy chọn  | Viết tắt | Loại   | Yêu cầu | Mặc định          | Mô tả                                                                           | Ví dụ                     |
| --------- | -------- | ------ | ------- | ----------------- | ------------------------------------------------------------------------------- | ------------------------- |
| --modules | -m       | string | Không   | Tất cả các module | Chỉ định tên mô-đun bạn muốn xây dựng, nhiều dự án được phân tách bằng dấu phẩy | sdin build -m diana,elise |

### `create` Sở chỉ huy

Để tạo dự án

| Tham số | Cấp bậc phụ huynh | Loại   | Yêu cầu | Mặc định | Mô tả                                            | Ví dụ                   |
| ------- | ----------------- | ------ | ------- | -------- | ------------------------------------------------ | ----------------------- |
| name    | -                 | string | Không   | -        | Chỉ định tên gói bằng ký hiệu "@, a-z, 0-9, -,/" | sdin create new-project |

| Tùy chọn   | Viết tắt | Loại   | Yêu cầu | Mặc định                  | Mô tả                                | Ví dụ                         |
| ---------- | -------- | ------ | ------- | ------------------------- | ------------------------------------ | ----------------------------- |
| --output   | -o       | string | Không   | Thư mục làm việc hiện tại | Chỉ định đường dẫn cha của dự án mới | sdin create -o ./             |
| --template | -t       | string | Không   | -                         | Name                                 | sdin create -t common-package |

## Giao diện

### readSdinConfig

Đọc cấu hình dự án

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Mục gốc */
  root: string
}
```

### createSdinProject

Tạo dự án

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Tên mẫu */
  templateName?: string
  /** Lưu đường dẫn thư mục của dự án (mặc định: thư mục làm việc hiện tại) */
  projectParentPath?: string
  /** Tên dự án */
  projectName?: string
  /** Phiên bản dự án (Mặc định: 0.0.1) */
  projectVersion?: string
  /** Mô tả dự án */
  projectDescription?: string
  /** Tên tác giả (Mặc định: Tên người dùng Git) */
  authorName?: string
  /** Email tác giả (Mặc định: Git Email) */
  authorEmail?: string
}
```

### buildSdinProject

Công trình xây dựng

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Cấu hình Sdin */
  config: SdinConfig
  /** Chỉ định tên của module bạn muốn xây dựng */
  moduleNames?: string[]
}
```
