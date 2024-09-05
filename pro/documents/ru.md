# sdin

- [sdin](#sdin)
  - [Примеры](#примеры)
  - [Настройка](#настройка)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Командование](#командование)
    - [Главный приказ](#главный-приказ)
    - [`build` Командование](#build-командование)
    - [`create` Командование](#create-командование)
  - [Интерфейс](#интерфейс)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Примеры

Построить проект в командной строке:

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

Строительные нормы:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Настройка

Путь к профилю проекта: `pro/configs/project.ts`。

Содержание профиля проекта:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Конфигурация проекта

| Свойства    | Тип                         | Требования | Нарушение обязательств  | Примечания                                                          | Примеры               |
| ----------- | --------------------------- | ---------- | ----------------------- | ------------------------------------------------------------------- | --------------------- |
| root        | string                      | Нет!       | Текущий рабочий каталог | Корневой каталог проекта                                            | -                     |
| mode        | SdinBuildMode               | Нет!       | production              | Строительная модель                                                 | -                     |
| alias       | Record\<string, string\>    | Нет!       | -                       | Имя модуля，\<Имя, Путь (относительно корневого каталога проекта)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | Нет!       | -                       | Глобальное определение，\<Исходный код, Код замены\>                | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | Нет!       | -                       | Список элементов конфигурации модулей                               | -                     |

```typescript
// production: Модель производства; development: Окружающая среда для развития;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

Программа предоставляет некоторые глобальные определения проекта, которые могут быть использованы непосредственно в проекте:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // Модель строительства проекта
  const SDIN_PROJECT_NAME: string // Название проекта
  const SDIN_PROJECT_VERSION: string // Версия проекта
  const SDIN_PROJECT_AUTHOR_NAME: string // Имя автора проекта
  const SDIN_PROJECT_AUTHOR_EMAIL: string // Электронная почта автора проекта
  const SDIN_MODULE_TYPE: string // Тип модуля при компиляции
  const SDIN_MODULE_MODE: string // Режим построения модулей в процессе компиляции
  const SDIN_MODULE_NAME: string // Имя модуля в процессе компиляции
}
```

### SdinDeclarationModuleParams

Настройка модулей

| Свойства | Тип                       | Требования | Нарушение обязательств          | Примечания                                                                      | Примеры |
| -------- | ------------------------- | ---------- | ------------------------------- | ------------------------------------------------------------------------------- | ------- |
| type     | 'declaration'             | - Да.      | -                               | Тип модуля                                                                      | -       |
| mode     | SdinDeclarationModuleMode | Нет!       | 'dts'                           | Модель построения модулей                                                       | -       |
| name     | string                    | - Да.      | -                               | Имя модуля                                                                      | -       |
| src      | string                    | Нет!       | 'src'                           | Введите местоположение исходного кода (относительно корневого каталога проекта) | -       |
| tar      | string                    | Нет!       | 'tar/Модель построения модулей' | Вывод целевого местоположения (относительно корневого каталога проекта)         | -       |
| includes | OrNil\<string\>[]         | Нет!       | -                               | Содержит файлы (по сравнению с корневым каталогом проекта)                      | -       |
| excludes | OrNil\<string\>[]         | Нет!       | -                               | Исключенные файлы (относительно корневого каталога проекта)                     | -       |

```typescript
// dts: Модуль определения TypeScript;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Основные модули

| Свойства     | Тип                      | Требования | Нарушение обязательств               | Примечания                                                                      | Примеры |
| ------------ | ------------------------ | ---------- | ------------------------------------ | ------------------------------------------------------------------------------- | ------- |
| type         | 'foundation'             | - Да.      | -                                    | Тип модуля                                                                      | -       |
| mode         | SdinFoundationModuleMode | Нет!       | 'cjs'                                | Модель построения модулей                                                       | -       |
| name         | string                   | - Да.      | -                                    | Имя модуля                                                                      | -       |
| src          | string                   | Нет!       | 'src'                                | Введите местоположение исходного кода (относительно корневого каталога проекта) | -       |
| tar          | string                   | Нет!       | 'tar/Модель построения модулей'      | Вывод целевого местоположения (относительно корневого каталога проекта)         | -       |
| includes     | OrNil\<string\>[]        | Нет!       | -                                    | Содержит файлы (по сравнению с корневым каталогом проекта)                      | -       |
| excludes     | OrNil\<string\>[]        | Нет!       | -                                    | Исключенные файлы (относительно корневого каталога проекта)                     | -       |
| minify       | boolean                  | Нет!       | Активация в режиме производства      | Код сжатия                                                                      | -       |
| uglify       | boolean                  | Нет!       | Активация в режиме производства      | Уродливый код (включен сокращенный час действителен)                            | -       |
| sassModule   | boolean                  | Нет!       | true                                 | Переключатель модуля SASS                                                       | -       |
| styleImports | boolean                  | Нет!       | Модуль SASS открывается при открытии | Импорт преобразованного файла CSS в файл JS                                     | -       |

```typescript
// cjs: Модуль CommonJS; esm: Модуль ESModule;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Настройка интегрированных модулей

| Свойства      | Тип                         | Требования                                    | Нарушение обязательств          | Примечания                                                                                   | Примеры |
| ------------- | --------------------------- | --------------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------- | ------- |
| type          | 'integration'               | - Да.                                         | -                               | Тип модуля                                                                                   | -       |
| mode          | SdinIntegrationModuleMode   | Нет!                                          | 'umd'                           | Модель построения модулей                                                                    | -       |
| name          | string                      | - Да.                                         | -                               | Имя модуля                                                                                   | -       |
| src           | string                      | Нет!                                          | 'src/index.{jsx?\|tsx?}'        | Введите местоположение исходного кода (относительно корневого каталога проекта)              | -       |
| tar           | string                      | Нет!                                          | 'tar/Модель построения модулей' | Вывод целевого местоположения (относительно корневого каталога проекта)                      | -       |
| entryName     | string                      | Нет!                                          | 'index'                         | Имя входа модуля                                                                             | -       |
| globalName    | string                      | Необходимо передавать эффективную информацию. | -                               | Укажите глобальное имя объекта, экспортируемого пакетом (действительное в режимах cjs и umd) | "React" |
| minify        | boolean                     | Нет!                                          | Активация в режиме производства | Код сжатия                                                                                   | -       |
| uglify        | boolean                     | Нет!                                          | Активация в режиме производства | Уродливый код (включен сокращенный час действителен)                                         | -       |
| externals     | Record\<string, string\>    | Нет!                                          | -                               | Удалить внешние модули, используемые в коде                                                  | -       |
| sassModule    | boolean                     | Нет!                                          | true                            | Переключатель модуля SASS                                                                    | -       |
| babelIncludes | OrNil\<RuleSetCondition\>[] | Нет!                                          | -                               | Компиляция Babel включает в себя проекты                                                     | -       |
| babelExcludes | OrNil\<RuleSetCondition\>[] | Нет!                                          | -                               | Исключения из Babel                                                                          | -       |
| rawRule       | Partial\<RuleSetRule\>      | Нет!                                          | -                               | Изменить правила упаковки текста                                                             | -       |
| fontRule      | Partial\<RuleSetRule\>      | Нет!                                          | -                               | Изменить правила упаковки шрифтов                                                            | -       |
| imageRule     | Partial\<RuleSetRule\>      | Нет!                                          | -                               | Изменить правила упаковки изображений                                                        | -       |
| audioRule     | Partial\<RuleSetRule\>      | Нет!                                          | -                               | Изменить правила упаковки звука                                                              | -       |
| videoRule     | Partial\<RuleSetRule\>      | Нет!                                          | -                               | Изменить правила упаковки видео                                                              | -       |
| rules         | OrNil\<RuleSetRule\>[]      | Нет!                                          | -                               | Добавить правила упаковки (можно заменить некоторые правила по умолчанию)                    | -       |

```typescript
// cjs: Модуль CommonJS; glb: Глобальный модуль; umd: Модуль UMD;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// Подробнее см.: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// Подробнее см.: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Если правила упаковки были изменены, то все поля, кроме "типа" и "генератора". « Имя файла» может быть изменено.

Если добавить правила упаковки, можно будет покрыть правила упаковки текста, шрифтов, изображений, аудио и видео.

## Командование

### Главный приказ

| Параметры | Сокращения | Тип | Требования | Нарушение обязательств | Примечания               | Примеры |
| --------- | ---------- | --- | ---------- | ---------------------- | ------------------------ | ------- |
| --version | -v         | -   | -          | -                      | Просмотреть версию       | sdin -v |
| --help    | -h         | -   | -          | -                      | Просмотреть файл справки | sdin -h |

### `build` Командование

Для строительных проектов

| Параметры | Уровень родительства | Тип    | Требования | Нарушение обязательств  | Примечания                                    | Примеры       |
| --------- | -------------------- | ------ | ---------- | ----------------------- | --------------------------------------------- | ------------- |
| path      | -                    | string | Нет!       | Текущий рабочий каталог | Укажите корневой каталог проекта для создания | sdin build ./ |

| Параметры | Сокращения | Тип    | Требования | Нарушение обязательств | Примечания                                                                           | Примеры                   |
| --------- | ---------- | ------ | ---------- | ---------------------- | ------------------------------------------------------------------------------------ | ------------------------- |
| --modules | -m         | string | Нет!       | Все модули             | Укажите имя модуля, который будет построен, и разделите несколько элементов запятыми | sdin build -m diana,elise |

### `create` Командование

Для создания проекта

| Параметры | Уровень родительства | Тип    | Требования | Нарушение обязательств | Примечания                                                              | Примеры                 |
| --------- | -------------------- | ------ | ---------- | ---------------------- | ----------------------------------------------------------------------- | ----------------------- |
| name      | -                    | string | Нет!       | -                      | Использовать символ "@, a - z, 0 - 9, - /" для указания названия пакета | sdin create new-project |

| Параметры  | Сокращения | Тип    | Требования | Нарушение обязательств  | Примечания                                   | Примеры                       |
| ---------- | ---------- | ------ | ---------- | ----------------------- | -------------------------------------------- | ----------------------------- |
| --output   | -o         | string | Нет!       | Текущий рабочий каталог | Укажите родительский путь для нового проекта | sdin create -o ./             |
| --template | -t         | string | Нет!       | -                       | Укажите имя шаблона для нового проекта       | sdin create -t common-package |

## Интерфейс

### readSdinConfig

Прочитать конфигурацию проекта

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Корневой каталог проекта */
  root: string
}
```

### createSdinProject

Создание проекта

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Имя шаблона */
  templateName?: string
  /** Путь к папке для сохранения проекта (по умолчанию: текущий рабочий каталог) */
  projectParentPath?: string
  /** Название проекта */
  projectName?: string
  /** Версия проекта (значение по умолчанию: 0.0.1) */
  projectVersion?: string
  /** Описание проекта */
  projectDescription?: string
  /** Имя автора (по умолчанию: Git имя пользователя) */
  authorName?: string
  /** Автор электронной почты (по умолчанию: Git электронной почты) */
  authorEmail?: string
}
```

### buildSdinProject

Строительные работы

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Настройка SDIN */
  config: SdinConfig
  /** Укажите имя модуля, который будет построен */
  moduleNames?: string[]
}
```
