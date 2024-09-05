# sdin

- [sdin](#sdin)
  - [ตัวอย่าง](#ตัวอย่าง)
  - [การกำหนดค่า](#การกำหนดค่า)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [กองบัญชาการ](#กองบัญชาการ)
    - [คำสั่งหลัก](#คำสั่งหลัก)
    - [`build` กองบัญชาการ](#build-กองบัญชาการ)
    - [`create` กองบัญชาการ](#create-กองบัญชาการ)
  - [อินเตอร์เฟซ](#อินเตอร์เฟซ)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## ตัวอย่าง

สร้างรายการบนบรรทัดคำสั่ง:

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

รหัสวิศวกรรมอาคาร:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## การกำหนดค่า

พาธของโปรไฟล์สำหรับโครงการ: `pro/configs/project.ts`。

เนื้อหาโปรไฟล์ของโครงการ:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

การกำหนดค่ารายการ

| คุณสมบัติ   | ประเภท                      | คำขอ | การละเมิดสัญญา       | คำแนะนำ                                                 | ตัวอย่าง              |
| ----------- | --------------------------- | ---- | -------------------- | ------------------------------------------------------- | --------------------- |
| root        | string                      | ไม่  | ไดเรกทอรีงานปัจจุบัน | รากโครงการ                                              | -                     |
| mode        | SdinBuildMode               | ไม่  | production           | รูปแบบอาคาร                                             | -                     |
| alias       | Record\<string, string\>    | ไม่  | -                    | นามแฝงโมดูล，\<นามแฝง, พาธ (สัมพันธ์กับรากของโครงการ)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | ไม่  | -                    | นิยามสากล，\<รหัสต้นฉบับ, รหัสทดแทน\>                   | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | ไม่  | -                    | รายการการกำหนดค่าโมดูล                                  | -                     |

```typescript
// production: โหมดการผลิต; development: การพัฒนาสิ่งแวดล้อม;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

โปรแกรมนี้มีคำจำกัดความทั่วโลกสำหรับโครงการที่สามารถนำมาใช้โดยตรงในโครงการ:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // รูปแบบการก่อสร้างโครงการ
  const SDIN_PROJECT_NAME: string // ชื่อโครงการ
  const SDIN_PROJECT_VERSION: string // รุ่นโครงการ
  const SDIN_PROJECT_AUTHOR_NAME: string // ชื่อผู้เขียนโครงการ
  const SDIN_PROJECT_AUTHOR_EMAIL: string // อีเมล์ผู้เขียนโครงการ
  const SDIN_MODULE_TYPE: string // เมื่อคอมไพล์ชนิดของโมดูล
  const SDIN_MODULE_MODE: string // รูปแบบการสร้างของโมดูลในกระบวนการคอมไพล์
  const SDIN_MODULE_NAME: string // ชื่อโมดูลในระหว่างการคอมไพล์
}
```

### SdinDeclarationModuleParams

กำหนดการกำหนดค่าโมดูล

| คุณสมบัติ | ประเภท                    | คำขอ | การละเมิดสัญญา          | คำแนะนำ                                            | ตัวอย่าง |
| --------- | ------------------------- | ---- | ----------------------- | -------------------------------------------------- | -------- |
| type      | 'declaration'             | ใช่  | -                       | ประเภทโมดูล                                        | -        |
| mode      | SdinDeclarationModuleMode | ไม่  | 'dts'                   | โหมดการสร้างโมดูล                                  | -        |
| name      | string                    | ใช่  | -                       | ชื่อโมดูล                                          | -        |
| src       | string                    | ไม่  | 'src'                   | ป้อนตำแหน่งของซอร์สโค้ด (สัมพันธ์กับรากของรายการ)  | -        |
| tar       | string                    | ไม่  | 'tar/โหมดการสร้างโมดูล' | ตำแหน่งเป้าหมายการส่งออก (สัมพันธ์กับรากของรายการ) | -        |
| includes  | OrNil\<string\>[]         | ไม่  | -                       | มีแฟ้ม (สัมพันธ์กับรากของรายการ)                   | -        |
| excludes  | OrNil\<string\>[]         | ไม่  | -                       | ไฟล์ที่ได้รับการยกเว้น (สัมพันธ์กับรากของรายการ)   | -        |

```typescript
// dts: โมดูลการกำหนด TypeScript;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

การกำหนดค่าโมดูลพื้นฐาน

| คุณสมบัติ    | ประเภท                   | คำขอ | การละเมิดสัญญา           | คำแนะนำ                                            | ตัวอย่าง |
| ------------ | ------------------------ | ---- | ------------------------ | -------------------------------------------------- | -------- |
| type         | 'foundation'             | ใช่  | -                        | ประเภทโมดูล                                        | -        |
| mode         | SdinFoundationModuleMode | ไม่  | 'cjs'                    | โหมดการสร้างโมดูล                                  | -        |
| name         | string                   | ใช่  | -                        | ชื่อโมดูล                                          | -        |
| src          | string                   | ไม่  | 'src'                    | ป้อนตำแหน่งของซอร์สโค้ด (สัมพันธ์กับรากของรายการ)  | -        |
| tar          | string                   | ไม่  | 'tar/โหมดการสร้างโมดูล'  | ตำแหน่งเป้าหมายการส่งออก (สัมพันธ์กับรากของรายการ) | -        |
| includes     | OrNil\<string\>[]        | ไม่  | -                        | มีแฟ้ม (สัมพันธ์กับรากของรายการ)                   | -        |
| excludes     | OrNil\<string\>[]        | ไม่  | -                        | ไฟล์ที่ได้รับการยกเว้น (สัมพันธ์กับรากของรายการ)   | -        |
| minify       | boolean                  | ไม่  | เปิดใช้งานในโหมดการผลิต  | รหัสการบีบอัด                                      | -        |
| uglify       | boolean                  | ไม่  | เปิดใช้งานในโหมดการผลิต  | รหัสน่าเกลียด (เปิดใช้งานการหดตัวที่ถูกต้อง)       | -        |
| sassModule   | boolean                  | ไม่  | true                     | สวิตช์โมดูล SASS                                   | -        |
| styleImports | boolean                  | ไม่  | เปิดโมดูล SASS เมื่อเปิด | นำเข้าไฟล์ CSS ที่แปลงแล้วไปยังไฟล์ JS             | -        |

```typescript
// cjs: โมดูล CommonJS; esm: โมดูล ESModule;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

การกำหนดค่าโมดูลแบบบูรณาการ

| คุณสมบัติ     | ประเภท                      | คำขอ                    | การละเมิดสัญญา           | คำแนะนำ                                                        | ตัวอย่าง |
| ------------- | --------------------------- | ----------------------- | ------------------------ | -------------------------------------------------------------- | -------- |
| type          | 'integration'               | ใช่                     | -                        | ประเภทโมดูล                                                    | -        |
| mode          | SdinIntegrationModuleMode   | ไม่                     | 'umd'                    | โหมดการสร้างโมดูล                                              | -        |
| name          | string                      | ใช่                     | -                        | ชื่อโมดูล                                                      | -        |
| src           | string                      | ไม่                     | 'src/index.{jsx?\|tsx?}' | ป้อนตำแหน่งของซอร์สโค้ด (สัมพันธ์กับรากของรายการ)              | -        |
| tar           | string                      | ไม่                     | 'tar/โหมดการสร้างโมดูล'  | ตำแหน่งเป้าหมายการส่งออก (สัมพันธ์กับรากของรายการ)             | -        |
| entryName     | string                      | ไม่                     | 'index'                  | ชื่อรายการโมดูล                                                | -        |
| globalName    | string                      | ต้องส่งข้อมูลที่ถูกต้อง | -                        | ระบุชื่อทั่วโลกของวัตถุส่งออกแพคเกจ (ใช้ได้ในโหมด cjs และ umd) | "React"  |
| minify        | boolean                     | ไม่                     | เปิดใช้งานในโหมดการผลิต  | รหัสการบีบอัด                                                  | -        |
| uglify        | boolean                     | ไม่                     | เปิดใช้งานในโหมดการผลิต  | รหัสน่าเกลียด (เปิดใช้งานการหดตัวที่ถูกต้อง)                   | -        |
| externals     | Record\<string, string\>    | ไม่                     | -                        | ลบโมดูลภายนอกที่ใช้ในรหัส                                      | -        |
| sassModule    | boolean                     | ไม่                     | true                     | สวิตช์โมดูล SASS                                               | -        |
| babelIncludes | OrNil\<RuleSetCondition\>[] | ไม่                     | -                        | Babel รวบรวมช็อตเด็ด includes รายการ                           | -        |
| babelExcludes | OrNil\<RuleSetCondition\>[] | ไม่                     | -                        | Babel การรวบรวม การยกเว้น รายการ                               | -        |
| rawRule       | Partial\<RuleSetRule\>      | ไม่                     | -                        | แก้ไขกฎการบรรจุข้อความ                                         | -        |
| fontRule      | Partial\<RuleSetRule\>      | ไม่                     | -                        | แก้ไขกฎการบรรจุแบบอักษร                                        | -        |
| imageRule     | Partial\<RuleSetRule\>      | ไม่                     | -                        | แก้ไขกฎการบรรจุภาพ                                             | -        |
| audioRule     | Partial\<RuleSetRule\>      | ไม่                     | -                        | แก้ไขกฎการบรรจุเสียง                                           | -        |
| videoRule     | Partial\<RuleSetRule\>      | ไม่                     | -                        | แก้ไขกฎการบรรจุวิดีโอ                                          | -        |
| rules         | OrNil\<RuleSetRule\>[]      | ไม่                     | -                        | เพิ่มกฎการบรรจุ (สามารถเขียนทับกฎเริ่มต้นบางอย่าง)             | -        |

```typescript
// cjs: โมดูล CommonJS; glb: โมดูลทั่วโลก; umd: โมดูล UMD;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// ดูรายละเอียด: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// ดูรายละเอียด: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

หากมีการแก้ไขกฎการบรรจุฟิลด์ทั้งหมดยกเว้น "ประเภท" และ "เครื่องกำเนิดไฟฟ้า" "ชื่อไฟล์" สามารถแก้ไขได้

หากเพิ่มกฎการบรรจุคุณสามารถเขียนทับกฎการบรรจุสำหรับข้อความแบบอักษรรูปภาพเสียงและวิดีโอ

## กองบัญชาการ

### คำสั่งหลัก

| ตัวเลือก  | ชื่อย่อ | ประเภท | คำขอ | การละเมิดสัญญา | คำแนะนำ         | ตัวอย่าง |
| --------- | ------- | ------ | ---- | -------------- | --------------- | -------- |
| --version | -v      | -      | -    | -              | ดูเวอร์ชั่น     | sdin -v  |
| --help    | -h      | -      | -    | -              | ดูเอกสารวิธีใช้ | sdin -h  |

### `build` กองบัญชาการ

สำหรับโครงการก่อสร้าง

| พารามิเตอร์ | ระดับผู้ปกครอง | ประเภท | คำขอ | การละเมิดสัญญา       | คำแนะนำ                            | ตัวอย่าง      |
| ----------- | -------------- | ------ | ---- | -------------------- | ---------------------------------- | ------------- |
| path        | -              | string | ไม่  | ไดเรกทอรีงานปัจจุบัน | ระบุรากของรายการที่คุณต้องการสร้าง | sdin build ./ |

| ตัวเลือก  | ชื่อย่อ | ประเภท | คำขอ | การละเมิดสัญญา | คำแนะนำ                                                                    | ตัวอย่าง                  |
| --------- | ------- | ------ | ---- | -------------- | -------------------------------------------------------------------------- | ------------------------- |
| --modules | -m      | string | ไม่  | โมดูลทั้งหมด   | ระบุชื่อโมดูลที่คุณต้องการสร้างและหลายรายการจะถูกคั่นด้วยเครื่องหมายจุลภาค | sdin build -m diana,elise |

### `create` กองบัญชาการ

สำหรับการสร้างโครงการ

| พารามิเตอร์ | ระดับผู้ปกครอง | ประเภท | คำขอ | การละเมิดสัญญา | คำแนะนำ                                              | ตัวอย่าง                |
| ----------- | -------------- | ------ | ---- | -------------- | ---------------------------------------------------- | ----------------------- |
| name        | -              | string | ไม่  | -              | ใช้สัญลักษณ์ "@, a-z, 0-9, -, /" เพื่อระบุชื่อแพคเกจ | sdin create new-project |

| ตัวเลือก   | ชื่อย่อ | ประเภท | คำขอ | การละเมิดสัญญา       | คำแนะนำ                         | ตัวอย่าง                      |
| ---------- | ------- | ------ | ---- | -------------------- | ------------------------------- | ----------------------------- |
| --output   | -o      | string | ไม่  | ไดเรกทอรีงานปัจจุบัน | ระบุเส้นทางหลักของรายการใหม่    | sdin create -o ./             |
| --template | -t      | string | ไม่  | -                    | ระบุชื่อแม่แบบสำหรับโครงการใหม่ | sdin create -t common-package |

## อินเตอร์เฟซ

### readSdinConfig

อ่านการกำหนดค่ารายการ

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** รากโครงการ */
  root: string
}
```

### createSdinProject

สร้างโครงการ

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** ชื่อแม่แบบ */
  templateName?: string
  /** จัดเก็บพาธของโฟลเดอร์สำหรับรายการ (ค่าเริ่มต้น: ไดเรกทอรีที่ทำงานอยู่ในปัจจุบัน) */
  projectParentPath?: string
  /** ชื่อโครงการ */
  projectName?: string
  /** รุ่นรายการ (ค่าเริ่มต้น: 0.0.1) */
  projectVersion?: string
  /** รายละเอียดโครงการ */
  projectDescription?: string
  /** ชื่อผู้เขียน (ค่าเริ่มต้น: ชื่อผู้ใช้ Git) */
  authorName?: string
  /** ผู้เขียนอีเมล์ (ค่าเริ่มต้น: Git อีเมล์) */
  authorEmail?: string
}
```

### buildSdinProject

งานก่อสร้าง

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** การกำหนดค่า Sdin */
  config: SdinConfig
  /** ระบุชื่อของโมดูลที่คุณต้องการสร้าง */
  moduleNames?: string[]
}
```
