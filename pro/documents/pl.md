# sdin

- [sdin](#sdin)
  - [Przykład](#przykład)
  - [Konfiguracja](#konfiguracja)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Polecenie](#polecenie)
    - [Główne polecenie](#główne-polecenie)
    - [`build` Polecenie](#build-polecenie)
    - [`create` Polecenie](#create-polecenie)
  - [Interfejs](#interfejs)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Przykład

Projekt budowlany na wierszu poleceń:

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

Projekt budowlany w kodzie:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Konfiguracja

Ścieżka pliku konfiguracyjnego dla projektu: `pro/configs/project.ts`。

Zawartość pliku konfiguracyjnego projektu:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Konfiguracja projektu

| Atrybut     | Typ                         | Wymagane | Domyślne                | Opis                                                                       | Przykład              |
| ----------- | --------------------------- | -------- | ----------------------- | -------------------------------------------------------------------------- | --------------------- |
| root        | string                      | Nie      | Bieżący katalog roboczy | Katalog główny projektu                                                    | -                     |
| mode        | SdinBuildMode               | Nie      | production              | Wzór budowy                                                                | -                     |
| alias       | Record\<string, string\>    | Nie      | -                       | Alias modułu，\<AliasName, Ścieżka (względem katalogu głównego projektu)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | Nie      | -                       | Definicja globalna，\<Kod oryginalny, Kod zastąpiony\>                     | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | Nie      | -                       | Lista elementów konfiguracji modułu                                        | -                     |

```typescript
// production: Tryb produkcji; development: Środowisko rozwoju;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

Program dostarczył kilka globalnych definicji projektu, które można bezpośrednio wykorzystać w projekcie:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // Tryb budowy projektu
  const SDIN_PROJECT_NAME: string // Nazwa projektu
  const SDIN_PROJECT_VERSION: string // Wersja projektu
  const SDIN_PROJECT_AUTHOR_NAME: string // Nazwa autora projektu
  const SDIN_PROJECT_AUTHOR_EMAIL: string // E-mail autora projektu
  const SDIN_MODULE_TYPE: string // W czasie kompilacji rodzaj modułu
  const SDIN_MODULE_MODE: string // Tryb budowy modułów podczas kompilacji
  const SDIN_MODULE_NAME: string // Nazwa modułu podczas kompilacji
}
```

### SdinDeclarationModuleParams

Zdefiniuj konfigurację modułu

| Atrybut  | Typ                       | Wymagane | Domyślne                 | Opis                                                                          | Przykład |
| -------- | ------------------------- | -------- | ------------------------ | ----------------------------------------------------------------------------- | -------- |
| type     | 'declaration'             | Tak      | -                        | Typ modułu                                                                    | -        |
| mode     | SdinDeclarationModuleMode | Nie      | 'dts'                    | Tryb budowy modułu                                                            | -        |
| name     | string                    | Tak      | -                        | Nazwa modułu                                                                  | -        |
| src      | string                    | Nie      | 'src'                    | Lokalizacja wejściowego kodu źródłowego (względem katalogu głównego projektu) | -        |
| tar      | string                    | Nie      | 'tar/Tryb budowy modułu' | Lokalizacja docelowa wyjścia (względem katalogu głównego projektu)            | -        |
| includes | OrNil\<string\>[]         | Nie      | -                        | Zawiera pliki (względem katalogu głównego projektu)                           | -        |
| excludes | OrNil\<string\>[]         | Nie      | -                        | Wykluczone pliki (względem katalogu głównego projektu)                        | -        |

```typescript
// dts: Moduł definicji typeScript;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Podstawowa konfiguracja modułu

| Atrybut      | Typ                      | Wymagane | Domyślne                             | Opis                                                                          | Przykład |
| ------------ | ------------------------ | -------- | ------------------------------------ | ----------------------------------------------------------------------------- | -------- |
| type         | 'foundation'             | Tak      | -                                    | Typ modułu                                                                    | -        |
| mode         | SdinFoundationModuleMode | Nie      | 'cjs'                                | Tryb budowy modułu                                                            | -        |
| name         | string                   | Tak      | -                                    | Nazwa modułu                                                                  | -        |
| src          | string                   | Nie      | 'src'                                | Lokalizacja wejściowego kodu źródłowego (względem katalogu głównego projektu) | -        |
| tar          | string                   | Nie      | 'tar/Tryb budowy modułu'             | Lokalizacja docelowa wyjścia (względem katalogu głównego projektu)            | -        |
| includes     | OrNil\<string\>[]        | Nie      | -                                    | Zawiera pliki (względem katalogu głównego projektu)                           | -        |
| excludes     | OrNil\<string\>[]        | Nie      | -                                    | Wykluczone pliki (względem katalogu głównego projektu)                        | -        |
| minify       | boolean                  | Nie      | Aktywacja w trybie produkcyjnym      | Kompresuj kod                                                                 | -        |
| uglify       | boolean                  | Nie      | Aktywacja w trybie produkcyjnym      | Brzydki kod (ważny, gdy włączone jest minify)                                 | -        |
| sassModule   | boolean                  | Nie      | true                                 | Przełącznik modułu SASS                                                       | -        |
| styleImports | boolean                  | Nie      | Otwórz, gdy moduł SASS jest włączony | Importuj przekonwertowane pliki CSS do plików JS                              | -        |

```typescript
// cjs: Moduł CommonJS; esm: Moduł ESModule;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Konfiguracja zintegrowanego modułu

| Atrybut       | Typ                         | Wymagane                     | Domyślne                        | Opis                                                                          | Przykład |
| ------------- | --------------------------- | ---------------------------- | ------------------------------- | ----------------------------------------------------------------------------- | -------- |
| type          | 'integration'               | Tak                          | -                               | Typ modułu                                                                    | -        |
| mode          | SdinIntegrationModuleMode   | Nie                          | 'umd'                           | Tryb budowy modułu                                                            | -        |
| name          | string                      | Tak                          | -                               | Nazwa modułu                                                                  | -        |
| src           | string                      | Nie                          | 'src/index.{jsx?\|tsx?}'        | Lokalizacja wejściowego kodu źródłowego (względem katalogu głównego projektu) | -        |
| tar           | string                      | Nie                          | 'tar/Tryb budowy modułu'        | Lokalizacja docelowa wyjścia (względem katalogu głównego projektu)            | -        |
| entryName     | string                      | Nie                          | 'index'                         | Nazwa wejścia modułu                                                          | -        |
| globalName    | string                      | Należy przekazać skuteczność | -                               | Określ globalną nazwę obiektu eksportu pakietu (ważną w trybie cjs i rund)    | "React"  |
| minify        | boolean                     | Nie                          | Aktywacja w trybie produkcyjnym | Kompresuj kod                                                                 | -        |
| uglify        | boolean                     | Nie                          | Aktywacja w trybie produkcyjnym | Brzydki kod (ważny, gdy włączone jest minify)                                 | -        |
| externals     | Record\<string, string\>    | Nie                          | -                               | Usuń moduły zewnętrzne użyte w kodzie                                         | -        |
| sassModule    | boolean                     | Nie                          | true                            | Przełącznik modułu SASS                                                       | -        |
| babelIncludes | OrNil\<RuleSetCondition\>[] | Nie                          | -                               | Kompilacja Babela zawiera pozycje                                             | -        |
| babelExcludes | OrNil\<RuleSetCondition\>[] | Nie                          | -                               | Pozycja wykluczenia kompilacji Babela                                         | -        |
| rawRule       | Partial\<RuleSetRule\>      | Nie                          | -                               | Zmień reguły pakowania tekstu                                                 | -        |
| fontRule      | Partial\<RuleSetRule\>      | Nie                          | -                               | Zmień reguły pakowania czcionek                                               | -        |
| imageRule     | Partial\<RuleSetRule\>      | Nie                          | -                               | Zmień reguły pakowania obrazów                                                | -        |
| audioRule     | Partial\<RuleSetRule\>      | Nie                          | -                               | Zmień reguły pakowania audio                                                  | -        |
| videoRule     | Partial\<RuleSetRule\>      | Nie                          | -                               | Zmień zasady pakowania wideo                                                  | -        |
| rules         | OrNil\<RuleSetRule\>[]      | Nie                          | -                               | Dodaj reguły pakowania (może zastąpić niektóre domyślne reguły)               | -        |

```typescript
// cjs: Moduł CommonJS; glb: Moduł globalny; umd: Moduł UMD;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// Szczegółowe informacje znajdują się na stronie internetowej:: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// Szczegółowe informacje znajdują się na stronie internetowej:: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Jeśli reguły pakowania zostaną zmodyfikowane, wszystkie pola z wyjątkiem 'type' i 'generator'. plik" można zmodyfikować.

Jeśli dodasz reguły pakowania, możesz zastąpić reguły pakowania tekstu, czcionek, obrazów, dźwięku i wideo.

## Polecenie

### Główne polecenie

| Wariant   | Skrót | Typ | Wymagane | Domyślne | Opis                     | Przykład |
| --------- | ----- | --- | -------- | -------- | ------------------------ | -------- |
| --version | -v    | -   | -        | -        | Zobacz wersję            | sdin -v  |
| --help    | -h    | -   | -        | -        | Wyświetl dokument pomocy | sdin -h  |

### `build` Polecenie

Wykorzystywane do projektów budowlanych

| Parametr | Poziom nadrzędny | Typ    | Wymagane | Domyślne                | Opis                                                   | Przykład      |
| -------- | ---------------- | ------ | -------- | ----------------------- | ------------------------------------------------------ | ------------- |
| path     | -                | string | Nie      | Bieżący katalog roboczy | Określ katalog główny projektu, który ma być zbudowany | sdin build ./ |

| Wariant   | Skrót | Typ    | Wymagane | Domyślne         | Opis                                                                                          | Przykład                  |
| --------- | ----- | ------ | -------- | ---------------- | --------------------------------------------------------------------------------------------- | ------------------------- |
| --modules | -m    | string | Nie      | Wszystkie moduły | Określ nazwy modułów, które mają być zbudowane, z wieloma elementami oddzielonymi przecinkami | sdin build -m diana,elise |

### `create` Polecenie

Używane do tworzenia projektów

| Parametr | Poziom nadrzędny | Typ    | Wymagane | Domyślne | Opis                                                   | Przykład                |
| -------- | ---------------- | ------ | -------- | -------- | ------------------------------------------------------ | ----------------------- |
| name     | -                | string | Nie      | -        | Podaj nazwę pakietu za pomocą symboli "@, a-z, 0-9, /" | sdin create new-project |

| Wariant    | Skrót | Typ    | Wymagane | Domyślne                | Opis                                         | Przykład                      |
| ---------- | ----- | ------ | -------- | ----------------------- | -------------------------------------------- | ----------------------------- |
| --output   | -o    | string | Nie      | Bieżący katalog roboczy | Określ ścieżkę nadrzędną dla nowego projektu | sdin create -o ./             |
| --template | -t    | string | Nie      | -                       | Określ nazwę szablonu nowego projektu        | sdin create -t common-package |

## Interfejs

### readSdinConfig

Odczyt konfiguracji projektu

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Katalog główny projektu */
  root: string
}
```

### createSdinProject

Tworzenie projektu

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Nazwa szablonu */
  templateName?: string
  /** Ścieżka folderu, w którym przechowywany jest projekt (domyślnie: bieżący katalog roboczy) */
  projectParentPath?: string
  /** Nazwa projektu */
  projectName?: string
  /** Wersja projektu (domyślnie: 0.0.1) */
  projectVersion?: string
  /** Opis projektu */
  projectDescription?: string
  /** Nazwa autora (domyślnie: nazwa użytkownika Git) */
  authorName?: string
  /** Autor e-mail (domyślnie: email Git) */
  authorEmail?: string
}
```

### buildSdinProject

Projekt budowlany

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Konfiguracja Sdin */
  config: SdinConfig
  /** Podaj nazwę modułu, który ma być zbudowany */
  moduleNames?: string[]
}
```
