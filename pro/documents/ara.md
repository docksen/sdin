# sdin

- [sdin](#sdin)
  - [أمثلة](#أمثلة)
  - [تكوين](#تكوين)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [مقر القيادة](#مقر-القيادة)
    - [القيادة الرئيسية](#القيادة-الرئيسية)
    - [`build` مقر القيادة](#build-مقر-القيادة)
    - [`create` مقر القيادة](#create-مقر-القيادة)
  - [واجهة .](#واجهة-)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## أمثلة

بناء المشروع على سطر الأوامر :

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

مواصفات البناء :

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## تكوين

مسار الملف الشخصي للمشروع : `pro/configs/project.ts`。

ملامح المشروع :

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

تكوين المشروع

| صفة         | نوع .                       | مطلوب | خرق               | إيضاحات                                                                       | أمثلة                 |
| ----------- | --------------------------- | ----- | ----------------- | ----------------------------------------------------------------------------- | --------------------- |
| root        | string                      | لا .  | دليل العمل الحالي | مشروع الدليل الجذر                                                            | -                     |
| mode        | SdinBuildMode               | لا .  | production        | نمط البناء                                                                    | -                     |
| alias       | Record\<string, string\>    | لا .  | -                 | وحدة الاسم المستعار，\<الاسم المستعار, المسار ( بالنسبة إلى المشروع الجذر )\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | لا .  | -                 | تعريف عالمي，\<الكود الأصلي, استبدال رمز\>                                    | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | لا .  | -                 | تكوين وحدة قائمة البند                                                        | -                     |

```typescript
// production: نمط الإنتاج; development: بيئة التطوير;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

يوفر البرنامج بعض التعاريف العالمية للمشروع ويمكن استخدامها مباشرة في المشروع :

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // طريقة بناء المشروع
  const SDIN_PROJECT_NAME: string // اسم المشروع
  const SDIN_PROJECT_VERSION: string // نسخة المشروع
  const SDIN_PROJECT_AUTHOR_NAME: string // اسم المؤلف
  const SDIN_PROJECT_AUTHOR_EMAIL: string // مشروع البريد الإلكتروني
  const SDIN_MODULE_TYPE: string // نوع الوحدة في تجميع الوقت
  const SDIN_MODULE_MODE: string // طريقة بناء وحدة في عملية التجميع
  const SDIN_MODULE_NAME: string // اسم الوحدة في عملية التجميع
}
```

### SdinDeclarationModuleParams

تعريف وحدة التكوين

| صفة      | نوع .                     | مطلوب | خرق                | إيضاحات                                             | أمثلة |
| -------- | ------------------------- | ----- | ------------------ | --------------------------------------------------- | ----- |
| type     | 'declaration'             | نعم . | -                  | نوع الوحدة                                          | -     |
| mode     | SdinDeclarationModuleMode | لا .  | 'dts'              | نموذج البناء                                        | -     |
| name     | string                    | نعم . | -                  | اسم الوحدة                                          | -     |
| src      | string                    | لا .  | 'src'              | أدخل موقع شفرة المصدر ( بالنسبة إلى المشروع الجذر ) | -     |
| tar      | string                    | لا .  | 'tar/نموذج البناء' | إخراج الموقع المستهدف ( بالنسبة إلى المشروع الجذر ) | -     |
| includes | OrNil\<string\>[]         | لا .  | -                  | يحتوي على ملفات ( بالنسبة إلى المشروع الجذر )       | -     |
| excludes | OrNil\<string\>[]         | لا .  | -                  | استبعاد الملفات ( بالنسبة إلى مشروع الدليل الجذر )  | -     |

```typescript
// dts: typescript تعريف الوحدة;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

تكوين وحدة أساسية

| صفة          | نوع .                    | مطلوب | خرق                  | إيضاحات                                             | أمثلة |
| ------------ | ------------------------ | ----- | -------------------- | --------------------------------------------------- | ----- |
| type         | 'foundation'             | نعم . | -                    | نوع الوحدة                                          | -     |
| mode         | SdinFoundationModuleMode | لا .  | 'cjs'                | نموذج البناء                                        | -     |
| name         | string                   | نعم . | -                    | اسم الوحدة                                          | -     |
| src          | string                   | لا .  | 'src'                | أدخل موقع شفرة المصدر ( بالنسبة إلى المشروع الجذر ) | -     |
| tar          | string                   | لا .  | 'tar/نموذج البناء'   | إخراج الموقع المستهدف ( بالنسبة إلى المشروع الجذر ) | -     |
| includes     | OrNil\<string\>[]        | لا .  | -                    | يحتوي على ملفات ( بالنسبة إلى المشروع الجذر )       | -     |
| excludes     | OrNil\<string\>[]        | لا .  | -                    | استبعاد الملفات ( بالنسبة إلى مشروع الدليل الجذر )  | -     |
| minify       | boolean                  | لا .  | تفعيل في وضع الإنتاج | رمز مضغوط                                           | -     |
| uglify       | boolean                  | لا .  | تفعيل في وضع الإنتاج | رمز القبيح ( صالح عند تمكين التصغير )               | -     |
| sassModule   | boolean                  | لا .  | true                 | ساس وحدة التبديل                                    | -     |
| styleImports | boolean                  | لا .  | فتح وحدة ساس         | تحويل الملف المغلق إلى ملف شبيبة                    | -     |

```typescript
// cjs: وحدة مشتركة شبيبة; esm: esmodule وحدة;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

تكوين وحدة متكاملة

| صفة           | نوع .                       | مطلوب                     | خرق                      | إيضاحات                                                              | أمثلة   |
| ------------- | --------------------------- | ------------------------- | ------------------------ | -------------------------------------------------------------------- | ------- |
| type          | 'integration'               | نعم .                     | -                        | نوع الوحدة                                                           | -       |
| mode          | SdinIntegrationModuleMode   | لا .                      | 'umd'                    | نموذج البناء                                                         | -       |
| name          | string                      | نعم .                     | -                        | اسم الوحدة                                                           | -       |
| src           | string                      | لا .                      | 'src/index.{jsx?\|tsx?}' | أدخل موقع شفرة المصدر ( بالنسبة إلى المشروع الجذر )                  | -       |
| tar           | string                      | لا .                      | 'tar/نموذج البناء'       | إخراج الموقع المستهدف ( بالنسبة إلى المشروع الجذر )                  | -       |
| entryName     | string                      | لا .                      | 'index'                  | اسم وحدة الدخول                                                      | -       |
| globalName    | string                      | يجب نقل المعلومات الصحيحة | -                        | يحدد الاسم العالمي من حزمة تصدير الكائنات ( صالحة في وضع CJS و UMD ) | "React" |
| minify        | boolean                     | لا .                      | تفعيل في وضع الإنتاج     | رمز مضغوط                                                            | -       |
| uglify        | boolean                     | لا .                      | تفعيل في وضع الإنتاج     | رمز القبيح ( صالح عند تمكين التصغير )                                | -       |
| externals     | Record\<string, string\>    | لا .                      | -                        | حذف الوحدات الخارجية المستخدمة في المدونة                            | -       |
| sassModule    | boolean                     | لا .                      | true                     | ساس وحدة التبديل                                                     | -       |
| babelIncludes | OrNil\<RuleSetCondition\>[] | لا .                      | -                        | بابل تجميع يشمل المشروع                                              | -       |
| babelExcludes | OrNil\<RuleSetCondition\>[] | لا .                      | -                        | بابل تجميع الاستبعاد                                                 | -       |
| rawRule       | Partial\<RuleSetRule\>      | لا .                      | -                        | تعديل نص حزمة المادة                                                 | -       |
| fontRule      | Partial\<RuleSetRule\>      | لا .                      | -                        | تعديل خط التعبئة والتغليف للمادة                                     | -       |
| imageRule     | Partial\<RuleSetRule\>      | لا .                      | -                        | تعديل قواعد التعبئة والتغليف الصورة                                  | -       |
| audioRule     | Partial\<RuleSetRule\>      | لا .                      | -                        | تعديل قواعد التعبئة والتغليف الصوت                                   | -       |
| videoRule     | Partial\<RuleSetRule\>      | لا .                      | -                        | تعديل الفيديو حزمة القاعدة                                           | -       |
| rules         | OrNil\<RuleSetRule\>[]      | لا .                      | -                        | إضافة حزمة القواعد ( يمكنك تجاوز بعض القواعد الافتراضية )            | -       |

```typescript
// cjs: وحدة مشتركة شبيبة; glb: الوحدة العالمية; umd: الخفة وحدة;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// لمزيد من التفاصيل انظر: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// لمزيد من التفاصيل انظر: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

إذا قمت بتعديل قواعد التعبئة والتغليف ، جميع الحقول ما عدا نوع منشئ . اسم الملف يمكن تعديلها .

إذا قمت بإضافة قواعد التعبئة والتغليف ، يمكنك تجاوز قواعد التعبئة والتغليف من النص ، الخط ، الصورة ، الصوت ، الفيديو .

## مقر القيادة

### القيادة الرئيسية

| خيارات    | المختصرات | نوع . | مطلوب | خرق | إيضاحات            | أمثلة   |
| --------- | --------- | ----- | ----- | --- | ------------------ | ------- |
| --version | -v        | -     | -     | -   | عرض النسخة         | sdin -v |
| --help    | -h        | -     | -     | -   | عرض وثائق المساعدة | sdin -h |

### `build` مقر القيادة

مشاريع البناء

| بارامتر | مستوى الوالدين | نوع .  | مطلوب | خرق               | إيضاحات                                | أمثلة         |
| ------- | -------------- | ------ | ----- | ----------------- | -------------------------------------- | ------------- |
| path    | -              | string | لا .  | دليل العمل الحالي | تحديد الدليل الجذر من المشروع إلى بناء | sdin build ./ |

| خيارات    | المختصرات | نوع .  | مطلوب | خرق          | إيضاحات                                                              | أمثلة                     |
| --------- | --------- | ------ | ----- | ------------ | -------------------------------------------------------------------- | ------------------------- |
| --modules | -m        | string | لا .  | جميع الوحدات | يحدد اسم الوحدة التي سيتم بناؤها ، مع العديد من البنود مفصولة بفواصل | sdin build -m diana,elise |

### `create` مقر القيادة

إنشاء مشروع

| بارامتر | مستوى الوالدين | نوع .  | مطلوب | خرق | إيضاحات                                         | أمثلة                   |
| ------- | -------------- | ------ | ----- | --- | ----------------------------------------------- | ----------------------- |
| name    | -              | string | لا .  | -   | تحديد اسم الحزمة باستخدام الرمز @ ض ، 0-9 - / ' | sdin create new-project |

| خيارات     | المختصرات | نوع .  | مطلوب | خرق               | إيضاحات                       | أمثلة                         |
| ---------- | --------- | ------ | ----- | ----------------- | ----------------------------- | ----------------------------- |
| --output   | -o        | string | لا .  | دليل العمل الحالي | تحديد مسار المشروع الجديد     | sdin create -o ./             |
| --template | -t        | string | لا .  | -                 | تحديد قالب اسم المشروع الجديد | sdin create -t common-package |

## واجهة .

### readSdinConfig

قراءة تكوين المشروع

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** مشروع الدليل الجذر */
  root: string
}
```

### createSdinProject

إنشاء مشروع

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** اسم القالب */
  templateName?: string
  /** مسار المجلد لتخزين البنود ( الافتراضي : دليل العمل الحالي ) */
  projectParentPath?: string
  /** اسم المشروع */
  projectName?: string
  /** نسخة المشروع ( الافتراضي : 0.0.1 ) */
  projectVersion?: string
  /** وصف المشروع */
  projectDescription?: string
  /** اسم المؤلف ( الافتراضي : بوابة اسم المستخدم ) */
  authorName?: string
  /** الكاتب البريد الإلكتروني ( الافتراضي : بوابة البريد الإلكتروني ) */
  authorEmail?: string
}
```

### buildSdinProject

هندسة معمارية

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** الدين التكوين */
  config: SdinConfig
  /** تحديد اسم الوحدة التي تريد بناء */
  moduleNames?: string[]
}
```
