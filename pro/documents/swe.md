# sdin

- [sdin](#sdin)
  - [Exempel](#exempel)
  - [Inställning](#inställning)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Kommando](#kommando)
    - [Huvudkommando](#huvudkommando)
    - [`build` Kommando](#build-kommando)
    - [`create` Kommando](#create-kommando)
  - [Gränssnitt](#gränssnitt)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Exempel

Byggprojekt på kommandoraden:

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

Byggnadsprojekt med kod:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Inställning

Sökvägen för konfigurationsfilen för projektet: `pro/configs/project.ts`。

Projektets konfigurationsfilinnehåll:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Projektinställning

| Attribut    | Typ                         | Krävs | Standard                | Beskrivning                                                              | Exempel               |
| ----------- | --------------------------- | ----- | ----------------------- | ------------------------------------------------------------------------ | --------------------- |
| root        | string                      | Nej   | Nuvarande arbetskatalog | Projektrotkatalog                                                        | -                     |
| mode        | SdinBuildMode               | Nej   | production              | Byggnadsmönster                                                          | -                     |
| alias       | Record\<string, string\>    | Nej   | -                       | Modulalias，\<Alias, Sökväg (i förhållande till projektets rotkatalog)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | Nej   | -                       | Global definition，\<Ursprunglig kod, Ersatt kod\>                       | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | Nej   | -                       | Modulinställningsobjektlista                                             | -                     |

```typescript
// production: Produktionssätt; development: Utvecklingsmiljö;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

Programmet har gett några globala definitioner för projektet, som kan användas direkt i projektet:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // Projektets konstruktionssätt
  const SDIN_PROJECT_NAME: string // Projektnamn
  const SDIN_PROJECT_VERSION: string // Projektversion
  const SDIN_PROJECT_AUTHOR_NAME: string // Projektförfattarens namn
  const SDIN_PROJECT_AUTHOR_EMAIL: string // Projektförfattarens e-post
  const SDIN_MODULE_TYPE: string // Vid kompileringstiden, typen av modul
  const SDIN_MODULE_MODE: string // Modulernas konstruktionssätt under sammanställning
  const SDIN_MODULE_NAME: string // Modulnamn under kompilering
}
```

### SdinDeclarationModuleParams

Definiera modulkonfiguration

| Attribut | Typ                       | Krävs | Standard                     | Beskrivning                                                                | Exempel |
| -------- | ------------------------- | ----- | ---------------------------- | -------------------------------------------------------------------------- | ------- |
| type     | 'declaration'             | Ja    | -                            | Modultyp                                                                   | -       |
| mode     | SdinDeclarationModuleMode | Nej   | 'dts'                        | Modulkonstruktionsläge                                                     | -       |
| name     | string                    | Ja    | -                            | Modulnamn                                                                  | -       |
| src      | string                    | Nej   | 'src'                        | Platsen för inmatningskällkoden (i förhållande till projektets rotkatalog) | -       |
| tar      | string                    | Nej   | 'tar/Modulkonstruktionsläge' | Utdatamålplats (i förhållande till projektets rotkatalog)                  | -       |
| includes | OrNil\<string\>[]         | Nej   | -                            | Innehåller filer (i förhållande till projektets rotkatalog)                | -       |
| excludes | OrNil\<string\>[]         | Nej   | -                            | Uteslutna filer (i förhållande till projektets rotkatalog)                 | -       |

```typescript
// dts: TypeScript Definition Module;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Grundläggande modulkonfiguration

| Attribut     | Typ                      | Krävs | Standard                           | Beskrivning                                                                | Exempel |
| ------------ | ------------------------ | ----- | ---------------------------------- | -------------------------------------------------------------------------- | ------- |
| type         | 'foundation'             | Ja    | -                                  | Modultyp                                                                   | -       |
| mode         | SdinFoundationModuleMode | Nej   | 'cjs'                              | Modulkonstruktionsläge                                                     | -       |
| name         | string                   | Ja    | -                                  | Modulnamn                                                                  | -       |
| src          | string                   | Nej   | 'src'                              | Platsen för inmatningskällkoden (i förhållande till projektets rotkatalog) | -       |
| tar          | string                   | Nej   | 'tar/Modulkonstruktionsläge'       | Utdatamålplats (i förhållande till projektets rotkatalog)                  | -       |
| includes     | OrNil\<string\>[]        | Nej   | -                                  | Innehåller filer (i förhållande till projektets rotkatalog)                | -       |
| excludes     | OrNil\<string\>[]        | Nej   | -                                  | Uteslutna filer (i förhållande till projektets rotkatalog)                 | -       |
| minify       | boolean                  | Nej   | Aktivera i produktionsläge         | Komprimera kod                                                             | -       |
| uglify       | boolean                  | Nej   | Aktivera i produktionsläge         | Ful kod (giltig när minify är aktiverat)                                   | -       |
| sassModule   | boolean                  | Nej   | true                               | SASS modulomkopplare                                                       | -       |
| styleImports | boolean                  | Nej   | Öppna när SASS-modulen är påslagen | Importera konverterade CSS-filer till JS-filer                             | -       |

```typescript
// cjs: CommonJS- modul; esm: Modul ESModule;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Integrerad modulkonfiguration

| Attribut      | Typ                         | Krävs                    | Standard                     | Beskrivning                                                                   | Exempel |
| ------------- | --------------------------- | ------------------------ | ---------------------------- | ----------------------------------------------------------------------------- | ------- |
| type          | 'integration'               | Ja                       | -                            | Modultyp                                                                      | -       |
| mode          | SdinIntegrationModuleMode   | Nej                      | 'umd'                        | Modulkonstruktionsläge                                                        | -       |
| name          | string                      | Ja                       | -                            | Modulnamn                                                                     | -       |
| src           | string                      | Nej                      | 'src/index.{jsx?\|tsx?}'     | Platsen för inmatningskällkoden (i förhållande till projektets rotkatalog)    | -       |
| tar           | string                      | Nej                      | 'tar/Modulkonstruktionsläge' | Utdatamålplats (i förhållande till projektets rotkatalog)                     | -       |
| entryName     | string                      | Nej                      | 'index'                      | Modulens ingångsnamn                                                          | -       |
| globalName    | string                      | Effektiv måste överföras | -                            | Ange det globala namnet på paketexportobjektet (giltigt i cjs- och umd-lägen) | "React" |
| minify        | boolean                     | Nej                      | Aktivera i produktionsläge   | Komprimera kod                                                                | -       |
| uglify        | boolean                     | Nej                      | Aktivera i produktionsläge   | Ful kod (giltig när minify är aktiverat)                                      | -       |
| externals     | Record\<string, string\>    | Nej                      | -                            | Ta bort externa moduler som används i koden                                   | -       |
| sassModule    | boolean                     | Nej                      | true                         | SASS modulomkopplare                                                          | -       |
| babelIncludes | OrNil\<RuleSetCondition\>[] | Nej                      | -                            | Babel sammanställning innehåller objekt                                       | -       |
| babelExcludes | OrNil\<RuleSetCondition\>[] | Nej                      | -                            | Babel sammanställning uteslutning post                                        | -       |
| rawRule       | Partial\<RuleSetRule\>      | Nej                      | -                            | Ändra regler för textförpackning                                              | -       |
| fontRule      | Partial\<RuleSetRule\>      | Nej                      | -                            | Ändra regler för teckensnittsförpackning                                      | -       |
| imageRule     | Partial\<RuleSetRule\>      | Nej                      | -                            | Ändra reglerna för bildförpackning                                            | -       |
| audioRule     | Partial\<RuleSetRule\>      | Nej                      | -                            | Ändra regler för ljudförpackning                                              | -       |
| videoRule     | Partial\<RuleSetRule\>      | Nej                      | -                            | Ändra regler för videoförpackning                                             | -       |
| rules         | OrNil\<RuleSetRule\>[]      | Nej                      | -                            | Lägg till förpackningsregler (kan åsidosätta vissa standardregler)            | -       |

```typescript
// cjs: CommonJS- modul; glb: Global modul; umd: UMD- modul;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// För mer information, se: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// För mer information, se: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Om förpackningsreglerna ändras ska alla fält utom "typ" och "generator". filnamn' kan ändras.

Om du lägger till förpackningsregler kan du åsidosätta förpackningsreglerna för text, teckensnitt, bilder, ljud och video.

## Kommando

### Huvudkommando

| Alternativ | Förkortning | Typ | Krävs | Standard | Beskrivning        | Exempel |
| ---------- | ----------- | --- | ----- | -------- | ------------------ | ------- |
| --version  | -v          | -   | -     | -        | Visa version       | sdin -v |
| --help     | -h          | -   | -     | -        | Visa hjälpdokument | sdin -h |

### `build` Kommando

Används för byggprojekt

| Parameter | Modernivå | Typ    | Krävs | Standard                | Beskrivning                                    | Exempel       |
| --------- | --------- | ------ | ----- | ----------------------- | ---------------------------------------------- | ------------- |
| path      | -         | string | Nej   | Nuvarande arbetskatalog | Ange rotkatalogen för projektet som ska byggas | sdin build ./ |

| Alternativ | Förkortning | Typ    | Krävs | Standard     | Beskrivning                                                                | Exempel                   |
| ---------- | ----------- | ------ | ----- | ------------ | -------------------------------------------------------------------------- | ------------------------- |
| --modules  | -m          | string | Nej   | Alla moduler | Ange modulnamnen som ska byggas, med flera objekt åtskilda med kommatecken | sdin build -m diana,elise |

### `create` Kommando

Används för att skapa projekt

| Parameter | Modernivå | Typ    | Krävs | Standard | Beskrivning                                        | Exempel                 |
| --------- | --------- | ------ | ----- | -------- | -------------------------------------------------- | ----------------------- |
| name      | -         | string | Nej   | -        | Ange paketnamnet med symbolerna "@, a-z, 0-9, -,/" | sdin create new-project |

| Alternativ | Förkortning | Typ    | Krävs | Standard                | Beskrivning                                  | Exempel                       |
| ---------- | ----------- | ------ | ----- | ----------------------- | -------------------------------------------- | ----------------------------- |
| --output   | -o          | string | Nej   | Nuvarande arbetskatalog | Ange överordnad sökväg för det nya projektet | sdin create -o ./             |
| --template | -t          | string | Nej   | -                       | Ange mallnamnet för det nya projektet        | sdin create -t common-package |

## Gränssnitt

### readSdinConfig

Läser projektkonfiguration

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Projektrotkatalog */
  root: string
}
```

### createSdinProject

Skapa projekt

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Mallnamn */
  templateName?: string
  /** Mappsökvägen där projektet lagras (standard: aktuell arbetskatalog) */
  projectParentPath?: string
  /** Projektnamn */
  projectName?: string
  /** Projektversion (standard: 0. 0. 1) */
  projectVersion?: string
  /** Projektbeskrivning */
  projectDescription?: string
  /** Författarens namn (standard: Git- användarnamn) */
  authorName?: string
  /** Författare e- post (standard: Git- e- post) */
  authorEmail?: string
}
```

### buildSdinProject

Byggprojekt

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Inställning av Sdin */
  config: SdinConfig
  /** Ange namnet på modulen som ska byggas */
  moduleNames?: string[]
}
```
