# sdin

- [sdin](#sdin)
  - [Näide](#näide)
  - [Seadistamine](#seadistamine)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Käsk](#käsk)
    - [Peakäsk](#peakäsk)
    - [`build` Käsk](#build-käsk)
    - [`create` Käsk](#create-käsk)
  - [Liides](#liides)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Näide

Ehitusprojekt käsureal:

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

Ehitusprojekt koodis:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Seadistamine

Projekti seadistusfaili asukoht: `pro/configs/project.ts`。

Projekti seadistustefaili sisu:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Projekti seadistamine

| Atribuut    | Tüüp                        | Nõutav | Vaikimisi            | Kirjeldus                                                             | Näide                 |
| ----------- | --------------------------- | ------ | -------------------- | --------------------------------------------------------------------- | --------------------- |
| root        | string                      | Ei     | Aktiivne töökataloog | Projekti juurkataloog                                                 | -                     |
| mode        | SdinBuildMode               | Ei     | production           | Ehitusmuster                                                          | -                     |
| alias       | Record\<string, string\>    | Ei     | -                    | Mooduli alias，\<Varjunimi, Asukoht (projekti juurkataloogi suhtes)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | Ei     | -                    | Üldine definitsioon，\<Algkood, Asendatud kood\>                      | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | Ei     | -                    | Mooduli seadistamise elementide nimekiri                              | -                     |

```typescript
// production: Tootmisviis; development: Arengukeskkond;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

Programm on esitanud projekti mõned globaalsed definitsioonid, mida saab otse projektis kasutada:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // Projekti ehitusviis
  const SDIN_PROJECT_NAME: string // Projekti nimi
  const SDIN_PROJECT_VERSION: string // Projekti versioon
  const SDIN_PROJECT_AUTHOR_NAME: string // Projekti autori nimi
  const SDIN_PROJECT_AUTHOR_EMAIL: string // Projekti autori e- kiri
  const SDIN_MODULE_TYPE: string // Komileerimise ajal mooduli tüüp
  const SDIN_MODULE_MODE: string // Moodulite konstruktsioonirežiim koostamisel
  const SDIN_MODULE_NAME: string // Mooduli nimi koostamisel
}
```

### SdinDeclarationModuleParams

Mooduli seadistuse määramine

| Atribuut | Tüüp                      | Nõutav | Vaikimisi                           | Kirjeldus                                                | Näide |
| -------- | ------------------------- | ------ | ----------------------------------- | -------------------------------------------------------- | ----- |
| type     | 'declaration'             | Jah    | -                                   | Mooduli tüüp                                             | -     |
| mode     | SdinDeclarationModuleMode | Ei     | 'dts'                               | Mooduli konstruktsioonirežiim                            | -     |
| name     | string                    | Jah    | -                                   | Mooduli nimi                                             | -     |
| src      | string                    | Ei     | 'src'                               | Sisendlähtekoodi asukoht (projekti juurkataloogi suhtes) | -     |
| tar      | string                    | Ei     | 'tar/Mooduli konstruktsioonirežiim' | Väljunduse sihtkoht (projekti juurkataloogi suhtes)      | -     |
| includes | OrNil\<string\>[]         | Ei     | -                                   | Sisaldab faile (projekti juurkataloogi suhtes)           | -     |
| excludes | OrNil\<string\>[]         | Ei     | -                                   | Välistatud failid (projekti juurkataloogi suhtes)        | -     |

```typescript
// dts: TypeScripti definitsiooni moodul;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Mooduli põhiseadistus

| Atribuut     | Tüüp                     | Nõutav | Vaikimisi                              | Kirjeldus                                                | Näide |
| ------------ | ------------------------ | ------ | -------------------------------------- | -------------------------------------------------------- | ----- |
| type         | 'foundation'             | Jah    | -                                      | Mooduli tüüp                                             | -     |
| mode         | SdinFoundationModuleMode | Ei     | 'cjs'                                  | Mooduli konstruktsioonirežiim                            | -     |
| name         | string                   | Jah    | -                                      | Mooduli nimi                                             | -     |
| src          | string                   | Ei     | 'src'                                  | Sisendlähtekoodi asukoht (projekti juurkataloogi suhtes) | -     |
| tar          | string                   | Ei     | 'tar/Mooduli konstruktsioonirežiim'    | Väljunduse sihtkoht (projekti juurkataloogi suhtes)      | -     |
| includes     | OrNil\<string\>[]        | Ei     | -                                      | Sisaldab faile (projekti juurkataloogi suhtes)           | -     |
| excludes     | OrNil\<string\>[]        | Ei     | -                                      | Välistatud failid (projekti juurkataloogi suhtes)        | -     |
| minify       | boolean                  | Ei     | Aktiveerimine tootmisrežiimis          | Pakkimiskood                                             | -     |
| uglify       | boolean                  | Ei     | Aktiveerimine tootmisrežiimis          | Kole kood (kehtib siis, kui minify on lubatud)           | -     |
| sassModule   | boolean                  | Ei     | true                                   | SASS mooduli lüliti                                      | -     |
| styleImports | boolean                  | Ei     | Avatakse SASS mooduli sisselülitamisel | Teisendatud CSS- failide import JS- failidesse           | -     |

```typescript
// cjs: CommonJS moodul; esm: ESModule moodul;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Integreeritud mooduli konfiguratsioon

| Atribuut      | Tüüp                        | Nõutav               | Vaikimisi                           | Kirjeldus                                                                      | Näide   |
| ------------- | --------------------------- | -------------------- | ----------------------------------- | ------------------------------------------------------------------------------ | ------- |
| type          | 'integration'               | Jah                  | -                                   | Mooduli tüüp                                                                   | -       |
| mode          | SdinIntegrationModuleMode   | Ei                   | 'umd'                               | Mooduli konstruktsioonirežiim                                                  | -       |
| name          | string                      | Jah                  | -                                   | Mooduli nimi                                                                   | -       |
| src           | string                      | Ei                   | 'src/index.{jsx?\|tsx?}'            | Sisendlähtekoodi asukoht (projekti juurkataloogi suhtes)                       | -       |
| tar           | string                      | Ei                   | 'tar/Mooduli konstruktsioonirežiim' | Väljunduse sihtkoht (projekti juurkataloogi suhtes)                            | -       |
| entryName     | string                      | Ei                   | 'index'                             | Mooduli sisenemise nimi                                                        | -       |
| globalName    | string                      | Tuleb edastada tõhus | -                                   | Paketi ekspordiobjekti globaalse nime määramine (kehtib režiimides cjs ja umd) | "React" |
| minify        | boolean                     | Ei                   | Aktiveerimine tootmisrežiimis       | Pakkimiskood                                                                   | -       |
| uglify        | boolean                     | Ei                   | Aktiveerimine tootmisrežiimis       | Kole kood (kehtib siis, kui minify on lubatud)                                 | -       |
| externals     | Record\<string, string\>    | Ei                   | -                                   | Eemalda koodis kasutatud välised moodulid                                      | -       |
| sassModule    | boolean                     | Ei                   | true                                | SASS mooduli lüliti                                                            | -       |
| babelIncludes | OrNil\<RuleSetCondition\>[] | Ei                   | -                                   | Baabeli koostamine sisaldab elemente                                           | -       |
| babelExcludes | OrNil\<RuleSetCondition\>[] | Ei                   | -                                   | Baabeli koostamise välistamise kirje                                           | -       |
| rawRule       | Partial\<RuleSetRule\>      | Ei                   | -                                   | Tekstipakendi eeskirjade muutmine                                              | -       |
| fontRule      | Partial\<RuleSetRule\>      | Ei                   | -                                   | Fondi pakendamise reeglite muutmine                                            | -       |
| imageRule     | Partial\<RuleSetRule\>      | Ei                   | -                                   | Pildi pakendamise eeskirjade muutmine                                          | -       |
| audioRule     | Partial\<RuleSetRule\>      | Ei                   | -                                   | Muuda helipakendi eeskirju                                                     | -       |
| videoRule     | Partial\<RuleSetRule\>      | Ei                   | -                                   | Videopakendi eeskirjade muutmine                                               | -       |
| rules         | OrNil\<RuleSetRule\>[]      | Ei                   | -                                   | Pakendireeglite lisamine (võib tühistada mõned vaikereeglid)                   | -       |

```typescript
// cjs: CommonJS moodul; glb: Globaalne moodul; umd: UMD moodul;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// Üksikasjalikuma teabe saamiseks vt: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// Üksikasjalikuma teabe saamiseks vt: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Kui pakendamiseeskirju muudetakse, siis kõik väljad, välja arvatud "tüüp" ja "generaator". failinimi saab muuta.

Pakendireeglite lisamisel saate teksti, fontide, piltide, heli ja video pakendireeglid tühistada.

## Käsk

### Peakäsk

| Valik     | Lühend | Tüüp | Nõutav | Vaikimisi | Kirjeldus          | Näide   |
| --------- | ------ | ---- | ------ | --------- | ------------------ | ------- |
| --version | -v     | -    | -      | -         | Vaata versiooni    | sdin -v |
| --help    | -h     | -    | -      | -         | Abidokumendi vaade | sdin -h |

### `build` Käsk

Kasutatakse ehitusprojektides

| Parameeter | Ematase | Tüüp   | Nõutav | Vaikimisi            | Kirjeldus                               | Näide         |
| ---------- | ------- | ------ | ------ | -------------------- | --------------------------------------- | ------------- |
| path       | -       | string | Ei     | Aktiivne töökataloog | Määrab ehitatava projekti juurkataloogi | sdin build ./ |

| Valik     | Lühend | Tüüp   | Nõutav | Vaikimisi     | Kirjeldus                                                             | Näide                     |
| --------- | ------ | ------ | ------ | ------------- | --------------------------------------------------------------------- | ------------------------- |
| --modules | -m     | string | Ei     | Kõik moodulid | Määra moodulite nimed, mida luuakse komadega eraldatud mitme üksusega | sdin build -m diana,elise |

### `create` Käsk

Kasutatakse projektide loomiseks

| Parameeter | Ematase | Tüüp   | Nõutav | Vaikimisi | Kirjeldus                                             | Näide                   |
| ---------- | ------- | ------ | ------ | --------- | ----------------------------------------------------- | ----------------------- |
| name       | -       | string | Ei     | -         | Paketi nime määramine sümbolitega "@, a- z, 0- 9, ,/" | sdin create new-project |

| Valik      | Lühend | Tüüp   | Nõutav | Vaikimisi            | Kirjeldus                         | Näide                         |
| ---------- | ------ | ------ | ------ | -------------------- | --------------------------------- | ----------------------------- |
| --output   | -o     | string | Ei     | Aktiivne töökataloog | Uue projekti algasukoha määramine | sdin create -o ./             |
| --template | -t     | string | Ei     | -                    | Uue projekti malli nime määramine | sdin create -t common-package |

## Liides

### readSdinConfig

Projekti seadistuste lugemine

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Projekti juurkataloog */
  root: string
}
```

### createSdinProject

Projekti loomine

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Malli nimi */
  templateName?: string
  /** Kataloogi asukoht, kuhu projekt salvestatakse (vaikimisi: praegune töökataloog) */
  projectParentPath?: string
  /** Projekti nimi */
  projectName?: string
  /** Projekti versioon (vaikimisi 0. 0. 1) */
  projectVersion?: string
  /** Projekti kirjeldus */
  projectDescription?: string
  /** Autori nimi (vaikimisi Git kasutajanimi) */
  authorName?: string
  /** Autori e- kiri (vaikimisi Giti e- kiri) */
  authorEmail?: string
}
```

### buildSdinProject

Ehitusprojekt

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Sdin seadistused */
  config: SdinConfig
  /** Määra ehitatava mooduli nimi */
  moduleNames?: string[]
}
```
