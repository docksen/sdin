# sdin

- [sdin](#sdin)
  - [Пример](#пример)
  - [Настройки](#настройки)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Команда](#команда)
    - [Главна команда](#главна-команда)
    - [`build` Команда](#build-команда)
    - [`create` Команда](#create-команда)
  - [Интерфейс](#интерфейс)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Пример

Проект за изграждане на командния ред:

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

Строителен проект в код:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Настройки

Път на конфигурационния файл за проекта: `pro/configs/project.ts`。

Съдържанието на конфигурационния файл на проекта:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Настройка на проекта

| Атрибут     | Тип                         | Изисква се | По подразбиране           | Описание                                                                                  | Пример                |
| ----------- | --------------------------- | ---------- | ------------------------- | ----------------------------------------------------------------------------------------- | --------------------- |
| root        | string                      | Не         | Текуща работна директория | Главна директория на проекта                                                              | -                     |
| mode        | SdinBuildMode               | Не         | production                | Сграден модел                                                                             | -                     |
| alias       | Record\<string, string\>    | Не         | -                         | Псевдоним на модула，\<Псевдоним, Път (относително към основната директория на проекта)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | Не         | -                         | Глобално определение，\<Оригинален код, Заменен код\>                                     | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | Не         | -                         | Списък с елементи за конфигуриране на модули                                              | -                     |

```typescript
// production: Режим на производство; development: Околна среда за развитие;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

Програмата е предоставила някои глобални дефиниции за проекта, които могат да бъдат директно използвани в проекта:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // Режим на строителство на проекта
  const SDIN_PROJECT_NAME: string // Име на проекта
  const SDIN_PROJECT_VERSION: string // Версия на проекта
  const SDIN_PROJECT_AUTHOR_NAME: string // Име на автора на проекта
  const SDIN_PROJECT_AUTHOR_EMAIL: string // Имейл на автора на проекта
  const SDIN_MODULE_TYPE: string // По време на компилиране типът на модула
  const SDIN_MODULE_MODE: string // Режим на конструиране на модулите по време на компилацията
  const SDIN_MODULE_NAME: string // Име на модула по време на компилацията
}
```

### SdinDeclarationModuleParams

Определяне на конфигурацията на модула

| Атрибут  | Тип                       | Изисква се | По подразбиране                       | Описание                                                                                  | Пример |
| -------- | ------------------------- | ---------- | ------------------------------------- | ----------------------------------------------------------------------------------------- | ------ |
| type     | 'declaration'             | Да         | -                                     | Тип модул                                                                                 | -      |
| mode     | SdinDeclarationModuleMode | Не         | 'dts'                                 | Режим на конструиране на модула                                                           | -      |
| name     | string                    | Да         | -                                     | Име на модула                                                                             | -      |
| src      | string                    | Не         | 'src'                                 | Местоположението на входния изходен код (относително към основната директория на проекта) | -      |
| tar      | string                    | Не         | 'tar/Режим на конструиране на модула' | Местоположение на изхода (относително към основната директория на проекта)                | -      |
| includes | OrNil\<string\>[]         | Не         | -                                     | Съдържа файлове (отнасящи се до основната директория на проекта)                          | -      |
| excludes | OrNil\<string\>[]         | Не         | -                                     | Изключени файлове (по отношение на основната директория на проекта)                       | -      |

```typescript
// dts: TypeScript Definition Module;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Основна конфигурация на модула

| Атрибут      | Тип                      | Изисква се | По подразбиране                       | Описание                                                                                  | Пример |
| ------------ | ------------------------ | ---------- | ------------------------------------- | ----------------------------------------------------------------------------------------- | ------ |
| type         | 'foundation'             | Да         | -                                     | Тип модул                                                                                 | -      |
| mode         | SdinFoundationModuleMode | Не         | 'cjs'                                 | Режим на конструиране на модула                                                           | -      |
| name         | string                   | Да         | -                                     | Име на модула                                                                             | -      |
| src          | string                   | Не         | 'src'                                 | Местоположението на входния изходен код (относително към основната директория на проекта) | -      |
| tar          | string                   | Не         | 'tar/Режим на конструиране на модула' | Местоположение на изхода (относително към основната директория на проекта)                | -      |
| includes     | OrNil\<string\>[]        | Не         | -                                     | Съдържа файлове (отнасящи се до основната директория на проекта)                          | -      |
| excludes     | OrNil\<string\>[]        | Не         | -                                     | Изключени файлове (по отношение на основната директория на проекта)                       | -      |
| minify       | boolean                  | Не         | Активиране в производствен режим      | Код за компресиране                                                                       | -      |
| uglify       | boolean                  | Не         | Активиране в производствен режим      | Грозен код (валиден, когато е разрешено минифициране)                                     | -      |
| sassModule   | boolean                  | Не         | true                                  | Превключвател на модула SASS                                                              | -      |
| styleImports | boolean                  | Не         | Отваряне при включване на модула SASS | Импортиране на конвертирани CSS файлове в JS файлове                                      | -      |

```typescript
// cjs: CommonJS модул; esm: ESModule модул;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Интегрирана конфигурация на модула

| Атрибут       | Тип                         | Изисква се                         | По подразбиране                       | Описание                                                                                    | Пример  |
| ------------- | --------------------------- | ---------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------- | ------- |
| type          | 'integration'               | Да                                 | -                                     | Тип модул                                                                                   | -       |
| mode          | SdinIntegrationModuleMode   | Не                                 | 'umd'                                 | Режим на конструиране на модула                                                             | -       |
| name          | string                      | Да                                 | -                                     | Име на модула                                                                               | -       |
| src           | string                      | Не                                 | 'src/index.{jsx?\|tsx?}'              | Местоположението на входния изходен код (относително към основната директория на проекта)   | -       |
| tar           | string                      | Не                                 | 'tar/Режим на конструиране на модула' | Местоположение на изхода (относително към основната директория на проекта)                  | -       |
| entryName     | string                      | Не                                 | 'index'                               | Име на входа на модула                                                                      | -       |
| globalName    | string                      | Трябва да бъде предадено ефективно | -                                     | Задаване на глобалното име на обекта за експортиране на пакета (валиден в режими cjs и umd) | "React" |
| minify        | boolean                     | Не                                 | Активиране в производствен режим      | Код за компресиране                                                                         | -       |
| uglify        | boolean                     | Не                                 | Активиране в производствен режим      | Грозен код (валиден, когато е разрешено минифициране)                                       | -       |
| externals     | Record\<string, string\>    | Не                                 | -                                     | Премахване на външните модули, използвани в кода                                            | -       |
| sassModule    | boolean                     | Не                                 | true                                  | Превключвател на модула SASS                                                                | -       |
| babelIncludes | OrNil\<RuleSetCondition\>[] | Не                                 | -                                     | Компилацията включва елементи                                                               | -       |
| babelExcludes | OrNil\<RuleSetCondition\>[] | Не                                 | -                                     | Елемент за изключване на компилацията на Babel                                              | -       |
| rawRule       | Partial\<RuleSetRule\>      | Не                                 | -                                     | Промяна на правилата за опаковане на текста                                                 | -       |
| fontRule      | Partial\<RuleSetRule\>      | Не                                 | -                                     | Промяна на правилата за опаковане на шрифтове                                               | -       |
| imageRule     | Partial\<RuleSetRule\>      | Не                                 | -                                     | Промяна на правилата за опаковане на изображенията                                          | -       |
| audioRule     | Partial\<RuleSetRule\>      | Не                                 | -                                     | Промяна на правилата за аудио опаковане                                                     | -       |
| videoRule     | Partial\<RuleSetRule\>      | Не                                 | -                                     | Промяна на правилата за видеопакетиране                                                     | -       |
| rules         | OrNil\<RuleSetRule\>[]      | Не                                 | -                                     | Добавяне на правила за опаковане (може да отмени някои правила по подразбиране)             | -       |

```typescript
// cjs: CommonJS модул; glb: Глобален модул; umd: Модул UMD;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// За подробности, моля вижте: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// За подробности, моля вижте: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Ако правилата за опаковане са променени, всички полета с изключение на "тип" и "генератор". име на файла" може да бъде променено.

Ако добавите правила за опаковане, можете да отмените правилата за опаковане за текст, шрифтове, изображения, аудио и видео.

## Команда

### Главна команда

| Опция     | Съкратение | Тип | Изисква се | По подразбиране | Описание                    | Пример  |
| --------- | ---------- | --- | ---------- | --------------- | --------------------------- | ------- |
| --version | -v         | -   | -          | -               | Преглед на версията         | sdin -v |
| --help    | -h         | -   | -          | -               | Преглед на помощен документ | sdin -h |

### `build` Команда

Използва се за строителни проекти

| Параметър | Родителско ниво | Тип    | Изисква се | По подразбиране           | Описание                                                            | Пример        |
| --------- | --------------- | ------ | ---------- | ------------------------- | ------------------------------------------------------------------- | ------------- |
| path      | -               | string | Не         | Текуща работна директория | Задаване на основната директория на проекта, който ще бъде изграден | sdin build ./ |

| Опция     | Съкратение | Тип    | Изисква се | По подразбиране | Описание                                                                                             | Пример                    |
| --------- | ---------- | ------ | ---------- | --------------- | ---------------------------------------------------------------------------------------------------- | ------------------------- |
| --modules | -m         | string | Не         | Всички модули   | Задаване на имената на модулите, които да бъдат изградени, с няколко елемента, разделени със запетаи | sdin build -m diana,elise |

### `create` Команда

Използва се за създаване на проекти

| Параметър | Родителско ниво | Тип    | Изисква се | По подразбиране | Описание                                                               | Пример                  |
| --------- | --------------- | ------ | ---------- | --------------- | ---------------------------------------------------------------------- | ----------------------- |
| name      | -               | string | Не         | -               | Задаване на името на пакета с помощта на символите "@, a- z, 0- 9, ,/" | sdin create new-project |

| Опция      | Съкратение | Тип    | Изисква се | По подразбиране           | Описание                                     | Пример                        |
| ---------- | ---------- | ------ | ---------- | ------------------------- | -------------------------------------------- | ----------------------------- |
| --output   | -o         | string | Не         | Текуща работна директория | Задаване на родителския път за новия проект  | sdin create -o ./             |
| --template | -t         | string | Не         | -                         | Задаване на името на шаблона за новия проект | sdin create -t common-package |

## Интерфейс

### readSdinConfig

Четене на конфигурацията на проекта

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Главна директория на проекта */
  root: string
}
```

### createSdinProject

Създаване на проект

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Име на шаблона */
  templateName?: string
  /** Пътят на папката, където се съхранява проектът (по подразбиране: текуща работна директория) */
  projectParentPath?: string
  /** Име на проекта */
  projectName?: string
  /** Версия на проекта (по подразбиране: 0. 0. 1) */
  projectVersion?: string
  /** Описание на проекта */
  projectDescription?: string
  /** Име на автора (по подразбиране: Git потребителско име) */
  authorName?: string
  /** Имейл на автора (по подразбиране: Git имейл) */
  authorEmail?: string
}
```

### buildSdinProject

Строителен проект

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Настройка на Sdin */
  config: SdinConfig
  /** Задаване на името на модула за изграждане */
  moduleNames?: string[]
}
```
