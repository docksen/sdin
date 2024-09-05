# sdin

- [sdin](#sdin)
  - [Exemplu](#exemplu)
  - [Configurare](#configurare)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Comandă](#comandă)
    - [Comandă principală](#comandă-principală)
    - [`build` Comandă](#build-comandă)
    - [`create` Comandă](#create-comandă)
  - [Interfață](#interfață)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Exemplu

Proiect de construcție pe linia de comandă:

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

Proiect de construcție în cod:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Configurare

Calea fișierului de configurare pentru proiect: `pro/configs/project.ts`。

Conținutul fișierului de configurare al proiectului:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Configurare proiect

| Atribut     | Tip                         | Necesar | Implicit                | Descriere                                                                     | Exemplu               |
| ----------- | --------------------------- | ------- | ----------------------- | ----------------------------------------------------------------------------- | --------------------- |
| root        | string                      | Nu      | Dosarul de lucru curent | Dosar rădăcină proiect                                                        | -                     |
| mode        | SdinBuildMode               | Nu      | production              | Modelul clădirii                                                              | -                     |
| alias       | Record\<string, string\>    | Nu      | -                       | Alias modul，\<Alias, Cale (relativă la directorul rădăcină al proiectului)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | Nu      | -                       | Definiție globală，\<Codul original, Codul înlocuit\>                         | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | Nu      | -                       | Lista elementelor de configurare a modulului                                  | -                     |

```typescript
// production: Mod de producție; development: Mediul de dezvoltare;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

Programul a furnizat cateva definitii globale pentru proiect, care pot fi folosite direct in proiect:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // Modul de construcție al proiectului
  const SDIN_PROJECT_NAME: string // Numele proiectului
  const SDIN_PROJECT_VERSION: string // Versiunea proiectului
  const SDIN_PROJECT_AUTHOR_NAME: string // Numele autorului proiectului
  const SDIN_PROJECT_AUTHOR_EMAIL: string // E-mail autorului proiectului
  const SDIN_MODULE_TYPE: string // La momentul compilării, tipul de modul
  const SDIN_MODULE_MODE: string // Modul de construcție al modulelor în timpul compilării
  const SDIN_MODULE_NAME: string // Numele modulului în timpul compilării
}
```

### SdinDeclarationModuleParams

Definește configurația modulului

| Atribut  | Tip                       | Necesar | Implicit                               | Descriere                                                                        | Exemplu |
| -------- | ------------------------- | ------- | -------------------------------------- | -------------------------------------------------------------------------------- | ------- |
| type     | 'declaration'             | Da      | -                                      | Tipul modulului                                                                  | -       |
| mode     | SdinDeclarationModuleMode | Nu      | 'dts'                                  | Modul de construcție a modulului                                                 | -       |
| name     | string                    | Da      | -                                      | Numele modulului                                                                 | -       |
| src      | string                    | Nu      | 'src'                                  | Locația codului sursă de intrare (relativ la directorul rădăcină al proiectului) | -       |
| tar      | string                    | Nu      | 'tar/Modul de construcție a modulului' | Locația țintă de ieșire (relativ la directorul rădăcină al proiectului)          | -       |
| includes | OrNil\<string\>[]         | Nu      | -                                      | Conține fișiere (în raport cu directorul rădăcină al proiectului)                | -       |
| excludes | OrNil\<string\>[]         | Nu      | -                                      | Fișiere excluse (în raport cu directorul rădăcină al proiectului)                | -       |

```typescript
// dts: TipeScript Definition Module;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Configurarea modulului de bază

| Atribut      | Tip                      | Necesar | Implicit                                | Descriere                                                                        | Exemplu |
| ------------ | ------------------------ | ------- | --------------------------------------- | -------------------------------------------------------------------------------- | ------- |
| type         | 'foundation'             | Da      | -                                       | Tipul modulului                                                                  | -       |
| mode         | SdinFoundationModuleMode | Nu      | 'cjs'                                   | Modul de construcție a modulului                                                 | -       |
| name         | string                   | Da      | -                                       | Numele modulului                                                                 | -       |
| src          | string                   | Nu      | 'src'                                   | Locația codului sursă de intrare (relativ la directorul rădăcină al proiectului) | -       |
| tar          | string                   | Nu      | 'tar/Modul de construcție a modulului'  | Locația țintă de ieșire (relativ la directorul rădăcină al proiectului)          | -       |
| includes     | OrNil\<string\>[]        | Nu      | -                                       | Conține fișiere (în raport cu directorul rădăcină al proiectului)                | -       |
| excludes     | OrNil\<string\>[]        | Nu      | -                                       | Fișiere excluse (în raport cu directorul rădăcină al proiectului)                | -       |
| minify       | boolean                  | Nu      | Activează în modul de producție         | Comprimare cod                                                                   | -       |
| uglify       | boolean                  | Nu      | Activează în modul de producție         | Cod urât (valabil atunci când minify este activat)                               | -       |
| sassModule   | boolean                  | Nu      | true                                    | Comutator de modul SASS                                                          | -       |
| styleImports | boolean                  | Nu      | Deschide când modulul SASS este activat | Importă fișiere CSS convertite în fișiere JS                                     | -       |

```typescript
// cjs: Modul CommonJS; esm: Modulul ESModule;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Configurare integrată a modulului

| Atribut       | Tip                         | Necesar                     | Implicit                               | Descriere                                                                                        | Exemplu |
| ------------- | --------------------------- | --------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------ | ------- |
| type          | 'integration'               | Da                          | -                                      | Tipul modulului                                                                                  | -       |
| mode          | SdinIntegrationModuleMode   | Nu                          | 'umd'                                  | Modul de construcție a modulului                                                                 | -       |
| name          | string                      | Da                          | -                                      | Numele modulului                                                                                 | -       |
| src           | string                      | Nu                          | 'src/index.{jsx?\|tsx?}'               | Locația codului sursă de intrare (relativ la directorul rădăcină al proiectului)                 | -       |
| tar           | string                      | Nu                          | 'tar/Modul de construcție a modulului' | Locația țintă de ieșire (relativ la directorul rădăcină al proiectului)                          | -       |
| entryName     | string                      | Nu                          | 'index'                                | Denumirea intrării modulului                                                                     | -       |
| globalName    | string                      | Eficiența trebuie transmisă | -                                      | Specificați numele global al obiectului de export al pachetului (valabil în modurile cjs și umd) | "React" |
| minify        | boolean                     | Nu                          | Activează în modul de producție        | Comprimare cod                                                                                   | -       |
| uglify        | boolean                     | Nu                          | Activează în modul de producție        | Cod urât (valabil atunci când minify este activat)                                               | -       |
| externals     | Record\<string, string\>    | Nu                          | -                                      | Eliminarea modulelor externe utilizate în cod                                                    | -       |
| sassModule    | boolean                     | Nu                          | true                                   | Comutator de modul SASS                                                                          | -       |
| babelIncludes | OrNil\<RuleSetCondition\>[] | Nu                          | -                                      | Compilația Babel include elemente                                                                | -       |
| babelExcludes | OrNil\<RuleSetCondition\>[] | Nu                          | -                                      | Elementul excluderii compilatiei Babel                                                           | -       |
| rawRule       | Partial\<RuleSetRule\>      | Nu                          | -                                      | Modificarea regulilor de ambalare a textului                                                     | -       |
| fontRule      | Partial\<RuleSetRule\>      | Nu                          | -                                      | Modifică regulile de ambalare a fonturilor                                                       | -       |
| imageRule     | Partial\<RuleSetRule\>      | Nu                          | -                                      | Modificarea regulilor de ambalare a imaginilor                                                   | -       |
| audioRule     | Partial\<RuleSetRule\>      | Nu                          | -                                      | Modificarea regulilor de ambalare audio                                                          | -       |
| videoRule     | Partial\<RuleSetRule\>      | Nu                          | -                                      | Modificarea regulilor de ambalare video                                                          | -       |
| rules         | OrNil\<RuleSetRule\>[]      | Nu                          | -                                      | Adăugați reguli de ambalare (poate suprascrie unele reguli implicite)                            | -       |

```typescript
// cjs: Modul CommonJS; glb: Modul global; umd: Modul UMD;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// Pentru detalii, vă rugăm să consultaţi: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// Pentru detalii, vă rugăm să consultaţi: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Dacă regulile de ambalare sunt modificate, toate câmpurile, cu excepția "tip" și "generator". numele fișierului" poate fi modificat.

Dacă adăugați reguli de ambalare, puteți să suprascrieți regulile de ambalare pentru text, fonturi, imagini, audio și video.

## Comandă

### Comandă principală

| Opțiune   | Abreviere | Tip | Necesar | Implicit | Descriere                        | Exemplu |
| --------- | --------- | --- | ------- | -------- | -------------------------------- | ------- |
| --version | -v        | -   | -       | -        | Vizualizează versiunea           | sdin -v |
| --help    | -h        | -   | -       | -        | Vizualizați documentul de ajutor | sdin -h |

### `build` Comandă

Utilizat pentru proiecte de construcții

| Parametru | Nivel parental | Tip    | Necesar | Implicit                | Descriere                                                   | Exemplu       |
| --------- | -------------- | ------ | ------- | ----------------------- | ----------------------------------------------------------- | ------------- |
| path      | -              | string | Nu      | Dosarul de lucru curent | Specificați directorul rădăcină al proiectului de construit | sdin build ./ |

| Opțiune   | Abreviere | Tip    | Necesar | Implicit       | Descriere                                                                                                | Exemplu                   |
| --------- | --------- | ------ | ------- | -------------- | -------------------------------------------------------------------------------------------------------- | ------------------------- |
| --modules | -m        | string | Nu      | Toate modulele | Specificați numele modulelor care urmează să fie construite, cu mai multe elemente separate prin virgulă | sdin build -m diana,elise |

### `create` Comandă

Utilizat pentru crearea de proiecte

| Parametru | Nivel parental | Tip    | Necesar | Implicit | Descriere                                                             | Exemplu                 |
| --------- | -------------- | ------ | ------- | -------- | --------------------------------------------------------------------- | ----------------------- |
| name      | -              | string | Nu      | -        | Specificați numele pachetului folosind simbolurile "@, a-z, 0-9, -,/" | sdin create new-project |

| Opțiune    | Abreviere | Tip    | Necesar | Implicit                | Descriere                                         | Exemplu                       |
| ---------- | --------- | ------ | ------- | ----------------------- | ------------------------------------------------- | ----------------------------- |
| --output   | -o        | string | Nu      | Dosarul de lucru curent | Specificați calea părinte pentru noul proiect     | sdin create -o ./             |
| --template | -t        | string | Nu      | -                       | Specificați numele șablonului pentru noul proiect | sdin create -t common-package |

## Interfață

### readSdinConfig

Citirea configurației proiectului

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Dosar rădăcină proiect */
  root: string
}
```

### createSdinProject

Crearea proiectului

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Nume șablon */
  templateName?: string
  /** Calea dosarului unde este stocat proiectul (implicit: directorul de lucru curent) */
  projectParentPath?: string
  /** Numele proiectului */
  projectName?: string
  /** Versiune de proiect (implicit: 0.0.1) */
  projectVersion?: string
  /** Descrierea proiectului */
  projectDescription?: string
  /** Nume autor (implicit: nume de utilizator Git) */
  authorName?: string
  /** Email autor (implicit: Git email) */
  authorEmail?: string
}
```

### buildSdinProject

Proiect de construcție

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Configurare Sdin */
  config: SdinConfig
  /** Specificați numele modulului care urmează să fie construit */
  moduleNames?: string[]
}
```
