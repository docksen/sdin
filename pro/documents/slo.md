# sdin

- [sdin](#sdin)
  - [Primer](#primer)
  - [Nastavitve](#nastavitve)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Ukaz](#ukaz)
    - [Glavni ukaz](#glavni-ukaz)
    - [`build` Ukaz](#build-ukaz)
    - [`create` Ukaz](#create-ukaz)
  - [Vmesnik](#vmesnik)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Primer

Projekt gradnje na ukazni vrstici:

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

Gradbeni projekt v kodi:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Nastavitve

Pot konfiguracijske datoteke za projekt: `pro/configs/project.ts`。

Vsebina nastavitvene datoteke projekta:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Nastavitve projekta

| Atribut     | Vrsta                       | Zahtevano | Privzeto                | Opis                                                                 | Primer                |
| ----------- | --------------------------- | --------- | ----------------------- | -------------------------------------------------------------------- | --------------------- |
| root        | string                      | Ne        | Trenutni delovni imenik | Korenski imenik projekta                                             | -                     |
| mode        | SdinBuildMode               | Ne        | production              | Vzorec stavbe                                                        | -                     |
| alias       | Record\<string, string\>    | Ne        | -                       | Vzdevek modula，\<Vzdevek, Pot (glede na korenski imenik projekta)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | Ne        | -                       | Globalna opredelitev，\<Prvotna oznaka, Zamenjana oznaka\>           | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | Ne        | -                       | Seznam elementov nastavitve modula                                   | -                     |

```typescript
// production: Način proizvodnje; development: Razvojno okolje;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

Program je zagotovil nekaj globalnih definicij za projekt, ki jih je mogoče neposredno uporabiti v projektu:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // Način gradnje projekta
  const SDIN_PROJECT_NAME: string // Ime projekta
  const SDIN_PROJECT_VERSION: string // Različica projekta
  const SDIN_PROJECT_AUTHOR_NAME: string // Ime avtorja projekta
  const SDIN_PROJECT_AUTHOR_EMAIL: string // E- pošta avtorja projekta
  const SDIN_MODULE_TYPE: string // V času prevajanja vrsta modula
  const SDIN_MODULE_MODE: string // Način konstrukcije modulov med sestavljanjem
  const SDIN_MODULE_NAME: string // Ime modula med prevajanjem
}
```

### SdinDeclarationModuleParams

Določi nastavitev modula

| Atribut  | Vrsta                     | Zahtevano | Privzeto                        | Opis                                                             | Primer |
| -------- | ------------------------- | --------- | ------------------------------- | ---------------------------------------------------------------- | ------ |
| type     | 'declaration'             | Da        | -                               | Tip modula                                                       | -      |
| mode     | SdinDeclarationModuleMode | Ne        | 'dts'                           | Način konstrukcije modula                                        | -      |
| name     | string                    | Da        | -                               | Ime modula                                                       | -      |
| src      | string                    | Ne        | 'src'                           | Lokacija vhodne izvorne kode (glede na korenski imenik projekta) | -      |
| tar      | string                    | Ne        | 'tar/Način konstrukcije modula' | Izhodna ciljna lokacija (glede na korenski imenik projekta)      | -      |
| includes | OrNil\<string\>[]         | Ne        | -                               | Vsebuje datoteke (glede na korenski imenik projekta)             | -      |
| excludes | OrNil\<string\>[]         | Ne        | -                               | Izključene datoteke (glede na korenski imenik projekta)          | -      |

```typescript
// dts: Modul za opredelitev tipaScripta;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Osnovna nastavitev modula

| Atribut      | Vrsta                    | Zahtevano | Privzeto                            | Opis                                                             | Primer |
| ------------ | ------------------------ | --------- | ----------------------------------- | ---------------------------------------------------------------- | ------ |
| type         | 'foundation'             | Da        | -                                   | Tip modula                                                       | -      |
| mode         | SdinFoundationModuleMode | Ne        | 'cjs'                               | Način konstrukcije modula                                        | -      |
| name         | string                   | Da        | -                                   | Ime modula                                                       | -      |
| src          | string                   | Ne        | 'src'                               | Lokacija vhodne izvorne kode (glede na korenski imenik projekta) | -      |
| tar          | string                   | Ne        | 'tar/Način konstrukcije modula'     | Izhodna ciljna lokacija (glede na korenski imenik projekta)      | -      |
| includes     | OrNil\<string\>[]        | Ne        | -                                   | Vsebuje datoteke (glede na korenski imenik projekta)             | -      |
| excludes     | OrNil\<string\>[]        | Ne        | -                                   | Izključene datoteke (glede na korenski imenik projekta)          | -      |
| minify       | boolean                  | Ne        | Aktiviraj v načinu proizvodnje      | Stisni kodo                                                      | -      |
| uglify       | boolean                  | Ne        | Aktiviraj v načinu proizvodnje      | Grda koda (velja, ko je omogočena minify)                        | -      |
| sassModule   | boolean                  | Ne        | true                                | Stikalo modula SASS                                              | -      |
| styleImports | boolean                  | Ne        | Odprite, ko je vklopljen modul SASS | Uvozi pretvorjene datoteke CSS v datoteke JS                     | -      |

```typescript
// cjs: Modul CommonJS; esm: Modul ESModule;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Vgrajena konfiguracija modula

| Atribut       | Vrsta                       | Zahtevano                       | Privzeto                        | Opis                                                                        | Primer  |
| ------------- | --------------------------- | ------------------------------- | ------------------------------- | --------------------------------------------------------------------------- | ------- |
| type          | 'integration'               | Da                              | -                               | Tip modula                                                                  | -       |
| mode          | SdinIntegrationModuleMode   | Ne                              | 'umd'                           | Način konstrukcije modula                                                   | -       |
| name          | string                      | Da                              | -                               | Ime modula                                                                  | -       |
| src           | string                      | Ne                              | 'src/index.{jsx?\|tsx?}'        | Lokacija vhodne izvorne kode (glede na korenski imenik projekta)            | -       |
| tar           | string                      | Ne                              | 'tar/Način konstrukcije modula' | Izhodna ciljna lokacija (glede na korenski imenik projekta)                 | -       |
| entryName     | string                      | Ne                              | 'index'                         | Ime vnosa modula                                                            | -       |
| globalName    | string                      | Učinkovito je treba posredovati | -                               | Določite globalno ime izvoznega predmeta paketa (velja v načinu cjs in umd) | "React" |
| minify        | boolean                     | Ne                              | Aktiviraj v načinu proizvodnje  | Stisni kodo                                                                 | -       |
| uglify        | boolean                     | Ne                              | Aktiviraj v načinu proizvodnje  | Grda koda (velja, ko je omogočena minify)                                   | -       |
| externals     | Record\<string, string\>    | Ne                              | -                               | Odstrani zunanje module, uporabljene v kodi                                 | -       |
| sassModule    | boolean                     | Ne                              | true                            | Stikalo modula SASS                                                         | -       |
| babelIncludes | OrNil\<RuleSetCondition\>[] | Ne                              | -                               | Zbiranje babelov vključuje elemente                                         | -       |
| babelExcludes | OrNil\<RuleSetCondition\>[] | Ne                              | -                               | Postavka izključitve zbiranja babelov                                       | -       |
| rawRule       | Partial\<RuleSetRule\>      | Ne                              | -                               | Sprememba pravil o pakiranju besedila                                       | -       |
| fontRule      | Partial\<RuleSetRule\>      | Ne                              | -                               | Spremeni pravila za pakiranje pisav                                         | -       |
| imageRule     | Partial\<RuleSetRule\>      | Ne                              | -                               | Spremenite pravila o pakiranju slik                                         | -       |
| audioRule     | Partial\<RuleSetRule\>      | Ne                              | -                               | Spremeni pravila zvočnega pakiranja                                         | -       |
| videoRule     | Partial\<RuleSetRule\>      | Ne                              | -                               | Sprememba pravil glede videopakiranja                                       | -       |
| rules         | OrNil\<RuleSetRule\>[]      | Ne                              | -                               | Dodajanje pravil pakiranja (lahko prevzame nekatera privzeta pravila)       | -       |

```typescript
// cjs: Modul CommonJS; glb: Globalni modul; umd: Modul UMD;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// Za podrobnosti glejte:: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// Za podrobnosti glejte:: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Če se pravila pakiranja spremenijo, vsa polja razen "tip" in "generator". ime datoteke" je mogoče spremeniti.

Če dodate pravila pakiranja, lahko preglasite pravila pakiranja za besedilo, pisave, slike, zvok in video.

## Ukaz

### Glavni ukaz

| Možnost   | Okrajšava | Vrsta | Zahtevano | Privzeto | Opis                   | Primer  |
| --------- | --------- | ----- | --------- | -------- | ---------------------- | ------- |
| --version | -v        | -     | -         | -        | Prikaži različico      | sdin -v |
| --help    | -h        | -     | -         | -        | Ogled dokumenta pomoči | sdin -h |

### `build` Ukaz

Uporablja se za gradbene projekte

| Parameter | Matična raven | Vrsta  | Zahtevano | Privzeto                | Opis                                                     | Primer        |
| --------- | ------------- | ------ | --------- | ----------------------- | -------------------------------------------------------- | ------------- |
| path      | -             | string | Ne        | Trenutni delovni imenik | Določite korenski imenik projekta, ki ga želite zgraditi | sdin build ./ |

| Možnost   | Okrajšava | Vrsta  | Zahtevano | Privzeto   | Opis                                                                           | Primer                    |
| --------- | --------- | ------ | --------- | ---------- | ------------------------------------------------------------------------------ | ------------------------- |
| --modules | -m        | string | Ne        | Vsi moduli | Določite imena modulov, ki jih je treba zgraditi, z vejicami ločenimi vejicami | sdin build -m diana,elise |

### `create` Ukaz

Uporablja se za ustvarjanje projektov

| Parameter | Matična raven | Vrsta  | Zahtevano | Privzeto | Opis                                              | Primer                  |
| --------- | ------------- | ------ | --------- | -------- | ------------------------------------------------- | ----------------------- |
| name      | -             | string | Ne        | -        | Določite ime paketa s simboli "@, a- z, 0- 9, ,/" | sdin create new-project |

| Možnost    | Okrajšava | Vrsta  | Zahtevano | Privzeto                | Opis                                  | Primer                        |
| ---------- | --------- | ------ | --------- | ----------------------- | ------------------------------------- | ----------------------------- |
| --output   | -o        | string | Ne        | Trenutni delovni imenik | Določite nadrejeno pot za nov projekt | sdin create -o ./             |
| --template | -t        | string | Ne        | -                       | Določite ime predloge za nov projekt  | sdin create -t common-package |

## Vmesnik

### readSdinConfig

Branje nastavitev projekta

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Korenski imenik projekta */
  root: string
}
```

### createSdinProject

Ustvarjanje projekta

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Ime predloge */
  templateName?: string
  /** Pot mape, kjer je shranjen projekt (privzeto: trenutni delovni imenik) */
  projectParentPath?: string
  /** Ime projekta */
  projectName?: string
  /** Različica projekta (privzeta: 0. 0. 1) */
  projectVersion?: string
  /** Opis projekta */
  projectDescription?: string
  /** Ime avtorja (privzeto: Git uporabniško ime) */
  authorName?: string
  /** Avtorska e- pošta (privzeto: Git e- pošta) */
  authorEmail?: string
}
```

### buildSdinProject

Gradbeni projekt

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Nastavitve Sdin */
  config: SdinConfig
  /** Določite ime modula, ki ga je treba zgraditi */
  moduleNames?: string[]
}
```
