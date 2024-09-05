# sdin

- [sdin](#sdin)
  - [Eksempel](#eksempel)
  - [Indstilling](#indstilling)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Kommando](#kommando)
    - [Hovedkommando](#hovedkommando)
    - [`build` Kommando](#build-kommando)
    - [`create` Kommando](#create-kommando)
  - [Grænseflade](#grænseflade)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Eksempel

Byggeprojekt på kommandolinjen:

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

Bygningsprojekt i kode:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Indstilling

Stien til konfigurationsfilen for projektet: `pro/configs/project.ts`。

Projektets indstillingsfil:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Projektindstilling

| Attribut    | Type                        | Krævet | Standard               | Beskrivelse                                                    | Eksempel              |
| ----------- | --------------------------- | ------ | ---------------------- | -------------------------------------------------------------- | --------------------- |
| root        | string                      | Nej    | Nuværende arbejdsmappe | Projektrodmappe                                                | -                     |
| mode        | SdinBuildMode               | Nej    | production             | Bygningsmønster                                                | -                     |
| alias       | Record\<string, string\>    | Nej    | -                      | Modulalias，\<Alias, Sti (i forhold til projektets rodmappe)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | Nej    | -                      | Global definition，\<Oprindelig kode, Erstattet kode\>         | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | Nej    | -                      | Modulindstillingselementliste                                  | -                     |

```typescript
// production: Produktionsmåde; development: Udviklingsmiljø;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

Programmet har givet nogle globale definitioner for projektet, som kan bruges direkte i projektet:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // Projektets konstruktionsmåde
  const SDIN_PROJECT_NAME: string // Projektnavn
  const SDIN_PROJECT_VERSION: string // Projektversion
  const SDIN_PROJECT_AUTHOR_NAME: string // Projektforfatternavn
  const SDIN_PROJECT_AUTHOR_EMAIL: string // Projektforfatter- e- mail
  const SDIN_MODULE_TYPE: string // Ved kompileringstidspunktet, modulets type
  const SDIN_MODULE_MODE: string // Modulernes konstruktion under udarbejdelsen
  const SDIN_MODULE_NAME: string // Modulnavn under kompilering
}
```

### SdinDeclarationModuleParams

Definer modulkonfiguration

| Attribut | Type                      | Krævet | Standard                         | Beskrivelse                                                         | Eksempel |
| -------- | ------------------------- | ------ | -------------------------------- | ------------------------------------------------------------------- | -------- |
| type     | 'declaration'             | Ja     | -                                | Modultype                                                           | -        |
| mode     | SdinDeclarationModuleMode | Nej    | 'dts'                            | Modulkonstruktionstilstand                                          | -        |
| name     | string                    | Ja     | -                                | Modulnavn                                                           | -        |
| src      | string                    | Nej    | 'src'                            | Placeringen af input kildekoden (i forhold til projektets rodmappe) | -        |
| tar      | string                    | Nej    | 'tar/Modulkonstruktionstilstand' | Outputmålplacering (i forhold til projektets rodmappe)              | -        |
| includes | OrNil\<string\>[]         | Nej    | -                                | Indeholder filer (i forhold til projektets rodmappe)                | -        |
| excludes | OrNil\<string\>[]         | Nej    | -                                | Ekskluderede filer (i forhold til projektets rodmappe)              | -        |

```typescript
// dts: TypeScript Definition Module;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Grundlæggende modulkonfiguration

| Attribut     | Type                     | Krævet | Standard                           | Beskrivelse                                                         | Eksempel |
| ------------ | ------------------------ | ------ | ---------------------------------- | ------------------------------------------------------------------- | -------- |
| type         | 'foundation'             | Ja     | -                                  | Modultype                                                           | -        |
| mode         | SdinFoundationModuleMode | Nej    | 'cjs'                              | Modulkonstruktionstilstand                                          | -        |
| name         | string                   | Ja     | -                                  | Modulnavn                                                           | -        |
| src          | string                   | Nej    | 'src'                              | Placeringen af input kildekoden (i forhold til projektets rodmappe) | -        |
| tar          | string                   | Nej    | 'tar/Modulkonstruktionstilstand'   | Outputmålplacering (i forhold til projektets rodmappe)              | -        |
| includes     | OrNil\<string\>[]        | Nej    | -                                  | Indeholder filer (i forhold til projektets rodmappe)                | -        |
| excludes     | OrNil\<string\>[]        | Nej    | -                                  | Ekskluderede filer (i forhold til projektets rodmappe)              | -        |
| minify       | boolean                  | Nej    | Aktivér i produktionstilstand      | Komprimer kode                                                      | -        |
| uglify       | boolean                  | Nej    | Aktivér i produktionstilstand      | grim kode (gyldig når minify er aktiveret)                          | -        |
| sassModule   | boolean                  | Nej    | true                               | SASS modulskift                                                     | -        |
| styleImports | boolean                  | Nej    | Åbn når SASS- modulet er slået til | Importér konverterede CSS-filer til JS-filer                        | -        |

```typescript
// cjs: CommonJS- modul; esm: ESModulmodul;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Integreret modulkonfiguration

| Attribut      | Type                        | Krævet                   | Standard                         | Beskrivelse                                                                      | Eksempel |
| ------------- | --------------------------- | ------------------------ | -------------------------------- | -------------------------------------------------------------------------------- | -------- |
| type          | 'integration'               | Ja                       | -                                | Modultype                                                                        | -        |
| mode          | SdinIntegrationModuleMode   | Nej                      | 'umd'                            | Modulkonstruktionstilstand                                                       | -        |
| name          | string                      | Ja                       | -                                | Modulnavn                                                                        | -        |
| src           | string                      | Nej                      | 'src/index.{jsx?\|tsx?}'         | Placeringen af input kildekoden (i forhold til projektets rodmappe)              | -        |
| tar           | string                      | Nej                      | 'tar/Modulkonstruktionstilstand' | Outputmålplacering (i forhold til projektets rodmappe)                           | -        |
| entryName     | string                      | Nej                      | 'index'                          | Modulindgangsnavn                                                                | -        |
| globalName    | string                      | Effektiv skal fremsendes | -                                | Angiv det globale navn på pakkeeksportobjektet (gyldigt i cjs- og umd-tilstande) | "React"  |
| minify        | boolean                     | Nej                      | Aktivér i produktionstilstand    | Komprimer kode                                                                   | -        |
| uglify        | boolean                     | Nej                      | Aktivér i produktionstilstand    | grim kode (gyldig når minify er aktiveret)                                       | -        |
| externals     | Record\<string, string\>    | Nej                      | -                                | Fjern eksterne moduler, der bruges i koden                                       | -        |
| sassModule    | boolean                     | Nej                      | true                             | SASS modulskift                                                                  | -        |
| babelIncludes | OrNil\<RuleSetCondition\>[] | Nej                      | -                                | Babel samling omfatter elementer                                                 | -        |
| babelExcludes | OrNil\<RuleSetCondition\>[] | Nej                      | -                                | Babel kompilering udelukkelse element                                            | -        |
| rawRule       | Partial\<RuleSetRule\>      | Nej                      | -                                | Ændre regler for tekstemballage                                                  | -        |
| fontRule      | Partial\<RuleSetRule\>      | Nej                      | -                                | Ændr regler for skrifttypeemballage                                              | -        |
| imageRule     | Partial\<RuleSetRule\>      | Nej                      | -                                | Ændr reglerne for billedemballage                                                | -        |
| audioRule     | Partial\<RuleSetRule\>      | Nej                      | -                                | Ændr regler for lydemballage                                                     | -        |
| videoRule     | Partial\<RuleSetRule\>      | Nej                      | -                                | Ændr regler for videoemballage                                                   | -        |
| rules         | OrNil\<RuleSetRule\>[]      | Nej                      | -                                | Tilføj pakkeregler (kan tilsidesætte nogle standardregler)                       | -        |

```typescript
// cjs: CommonJS- modul; glb: Globalt modul; umd: UMD- modul;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// For yderligere oplysninger henvises til: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// For yderligere oplysninger henvises til: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Hvis emballagereglerne ændres, skal alle felter undtagen"type"og"generator. filnavn' kan ændres.

Hvis du tilføjer pakkeregler, kan du tilsidesætte pakkereglerne for tekst, skrifttyper, billeder, lyd og video.

## Kommando

### Hovedkommando

| Mulighed  | Forkortelse | Type | Krævet | Standard | Beskrivelse        | Eksempel |
| --------- | ----------- | ---- | ------ | -------- | ------------------ | -------- |
| --version | -v          | -    | -      | -        | Vis version        | sdin -v  |
| --help    | -h          | -    | -      | -        | Vis hjælpedokument | sdin -h  |

### `build` Kommando

Anvendes til byggeprojekter

| Parameter | Moderniveau | Type   | Krævet | Standard               | Beskrivelse                                   | Eksempel      |
| --------- | ----------- | ------ | ------ | ---------------------- | --------------------------------------------- | ------------- |
| path      | -           | string | Nej    | Nuværende arbejdsmappe | Angiv rodmappen for projektet der skal bygges | sdin build ./ |

| Mulighed  | Forkortelse | Type   | Krævet | Standard     | Beskrivelse                                                                   | Eksempel                  |
| --------- | ----------- | ------ | ------ | ------------ | ----------------------------------------------------------------------------- | ------------------------- |
| --modules | -m          | string | Nej    | Alle moduler | Angiv de modulnavne, der skal bygges, med flere elementer adskilt med kommaer | sdin build -m diana,elise |

### `create` Kommando

Bruges til at oprette projekter

| Parameter | Moderniveau | Type   | Krævet | Standard | Beskrivelse                                                  | Eksempel                |
| --------- | ----------- | ------ | ------ | -------- | ------------------------------------------------------------ | ----------------------- |
| name      | -           | string | Nej    | -        | Angiv pakkenavnet ved hjælp af symbolerne "@, a-z, 0-9, -,/" | sdin create new-project |

| Mulighed   | Forkortelse | Type   | Krævet | Standard               | Beskrivelse                                   | Eksempel                      |
| ---------- | ----------- | ------ | ------ | ---------------------- | --------------------------------------------- | ----------------------------- |
| --output   | -o          | string | Nej    | Nuværende arbejdsmappe | Angiv den overordnede sti til det nye projekt | sdin create -o ./             |
| --template | -t          | string | Nej    | -                      | Angiv skabelonnavnet for det nye projekt      | sdin create -t common-package |

## Grænseflade

### readSdinConfig

Læser projektkonfiguration

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Projektrodmappe */
  root: string
}
```

### createSdinProject

Oprettelse af projekt

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Skabelonnavn */
  templateName?: string
  /** Mappstien hvor projektet er gemt (standard: nuværende arbejdsmappe) */
  projectParentPath?: string
  /** Projektnavn */
  projectName?: string
  /** Projektversion (standard: 0. 0. 1) */
  projectVersion?: string
  /** Projektbeskrivelse */
  projectDescription?: string
  /** Forfatternavn (standard: Git- brugernavn) */
  authorName?: string
  /** Forfatter- e- mail (standard: Git- e- mail) */
  authorEmail?: string
}
```

### buildSdinProject

Byggeprojekt

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Sdin- indstilling */
  config: SdinConfig
  /** Angiv navnet på modulet der skal bygges */
  moduleNames?: string[]
}
```
