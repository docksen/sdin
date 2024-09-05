# sdin

- [sdin](#sdin)
  - [Voorbeeld](#voorbeeld)
  - [Configuratie](#configuratie)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Commando](#commando)
    - [Hoofdcommando](#hoofdcommando)
    - [`build` Commando](#build-commando)
    - [`create` Commando](#create-commando)
  - [Interface](#interface)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Voorbeeld

Bouwproject op de opdrachtregel:

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

Bouwproject in code:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Configuratie

Het pad van het configuratiebestand voor het project: `pro/configs/project.ts`。

De inhoud van het configuratiebestand van het project:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Projectconfiguratie

| Attribut    | Type                        | Vereist | Standaard       | Beschrijving                                                                | Voorbeeld             |
| ----------- | --------------------------- | ------- | --------------- | --------------------------------------------------------------------------- | --------------------- |
| root        | string                      | Nee     | Huidige werkmap | Hoofdmap van het project                                                    | -                     |
| mode        | SdinBuildMode               | Nee     | production      | Bouwpatroon                                                                 | -                     |
| alias       | Record\<string, string\>    | Nee     | -               | Module alias，\<Alias, Pad (ten opzichte van de hoofdmap van het project)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | Nee     | -               | Globale definitie，\<Originele code, Vervangende code\>                     | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | Nee     | -               | Lijst met moduleconfiguratieitems                                           | -                     |

```typescript
// production: Productiemodus; development: Ontwikkelingsomgeving;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

Het programma heeft enkele globale definities voor het project verstrekt, die direct in het project kunnen worden gebruikt:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // De bouwwijze van het project
  const SDIN_PROJECT_NAME: string // Projectnaam
  const SDIN_PROJECT_VERSION: string // Projectversie
  const SDIN_PROJECT_AUTHOR_NAME: string // Naam van de auteur van het project
  const SDIN_PROJECT_AUTHOR_EMAIL: string // E-mail van projectauteur
  const SDIN_MODULE_TYPE: string // Bij compileren wordt het type module
  const SDIN_MODULE_MODE: string // De bouwwijze van modules tijdens compilatie
  const SDIN_MODULE_NAME: string // Modulenaam tijdens compilatie
}
```

### SdinDeclarationModuleParams

Moduleconfiguratie definiëren

| Attribut | Type                      | Vereist | Standaard             | Beschrijving                                                                    | Voorbeeld |
| -------- | ------------------------- | ------- | --------------------- | ------------------------------------------------------------------------------- | --------- |
| type     | 'declaration'             | Ja      | -                     | Moduletype                                                                      | -         |
| mode     | SdinDeclarationModuleMode | Nee     | 'dts'                 | Modulebouwmodus                                                                 | -         |
| name     | string                    | Ja      | -                     | Modulenaam                                                                      | -         |
| src      | string                    | Nee     | 'src'                 | De locatie van de invoerbroncode (ten opzichte van de hoofdmap van het project) | -         |
| tar      | string                    | Nee     | 'tar/Modulebouwmodus' | Uitvoerdoellocatie (ten opzichte van de hoofdmap van het project)               | -         |
| includes | OrNil\<string\>[]         | Nee     | -                     | Bevat bestanden (ten opzichte van de hoofdmap van het project)                  | -         |
| excludes | OrNil\<string\>[]         | Nee     | -                     | Uitgesloten bestanden (ten opzichte van de hoofdmap van het project)            | -         |

```typescript
// dts: TypeScript Definition Module;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Basismodule configuratie

| Attribut     | Type                     | Vereist | Standaard                                  | Beschrijving                                                                    | Voorbeeld |
| ------------ | ------------------------ | ------- | ------------------------------------------ | ------------------------------------------------------------------------------- | --------- |
| type         | 'foundation'             | Ja      | -                                          | Moduletype                                                                      | -         |
| mode         | SdinFoundationModuleMode | Nee     | 'cjs'                                      | Modulebouwmodus                                                                 | -         |
| name         | string                   | Ja      | -                                          | Modulenaam                                                                      | -         |
| src          | string                   | Nee     | 'src'                                      | De locatie van de invoerbroncode (ten opzichte van de hoofdmap van het project) | -         |
| tar          | string                   | Nee     | 'tar/Modulebouwmodus'                      | Uitvoerdoellocatie (ten opzichte van de hoofdmap van het project)               | -         |
| includes     | OrNil\<string\>[]        | Nee     | -                                          | Bevat bestanden (ten opzichte van de hoofdmap van het project)                  | -         |
| excludes     | OrNil\<string\>[]        | Nee     | -                                          | Uitgesloten bestanden (ten opzichte van de hoofdmap van het project)            | -         |
| minify       | boolean                  | Nee     | Activeren in productiemodus                | Comprimeer code                                                                 | -         |
| uglify       | boolean                  | Nee     | Activeren in productiemodus                | Lelijke code (geldig wanneer minify is ingeschakeld)                            | -         |
| sassModule   | boolean                  | Nee     | true                                       | SASS module switch                                                              | -         |
| styleImports | boolean                  | Nee     | Openen wanneer SASS-module is ingeschakeld | Converteerde CSS-bestanden importeren in JS-bestanden                           | -         |

```typescript
// cjs: CommonJS module; esm: ESModule module;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Geïntegreerde moduleconfiguratie

| Attribut      | Type                        | Vereist                           | Standaard                   | Beschrijving                                                                      | Voorbeeld |
| ------------- | --------------------------- | --------------------------------- | --------------------------- | --------------------------------------------------------------------------------- | --------- |
| type          | 'integration'               | Ja                                | -                           | Moduletype                                                                        | -         |
| mode          | SdinIntegrationModuleMode   | Nee                               | 'umd'                       | Modulebouwmodus                                                                   | -         |
| name          | string                      | Ja                                | -                           | Modulenaam                                                                        | -         |
| src           | string                      | Nee                               | 'src/index.{jsx?\|tsx?}'    | De locatie van de invoerbroncode (ten opzichte van de hoofdmap van het project)   | -         |
| tar           | string                      | Nee                               | 'tar/Modulebouwmodus'       | Uitvoerdoellocatie (ten opzichte van de hoofdmap van het project)                 | -         |
| entryName     | string                      | Nee                               | 'index'                     | Naam module ingang                                                                | -         |
| globalName    | string                      | Effectief moet worden doorgegeven | -                           | Geef de globale naam op van het pakketexportobject (geldig in de modi cjs en umd) | "React"   |
| minify        | boolean                     | Nee                               | Activeren in productiemodus | Comprimeer code                                                                   | -         |
| uglify        | boolean                     | Nee                               | Activeren in productiemodus | Lelijke code (geldig wanneer minify is ingeschakeld)                              | -         |
| externals     | Record\<string, string\>    | Nee                               | -                           | Externe modules verwijderen die in de code zijn gebruikt                          | -         |
| sassModule    | boolean                     | Nee                               | true                        | SASS module switch                                                                | -         |
| babelIncludes | OrNil\<RuleSetCondition\>[] | Nee                               | -                           | Babel compilatie bevat items                                                      | -         |
| babelExcludes | OrNil\<RuleSetCondition\>[] | Nee                               | -                           | Uitsluiting van Babel-compilatie                                                  | -         |
| rawRule       | Partial\<RuleSetRule\>      | Nee                               | -                           | Tekstverpakkingsregels wijzigen                                                   | -         |
| fontRule      | Partial\<RuleSetRule\>      | Nee                               | -                           | Lettertypeverpakkingsregels wijzigen                                              | -         |
| imageRule     | Partial\<RuleSetRule\>      | Nee                               | -                           | De regels voor het verpakken van afbeeldingen wijzigen                            | -         |
| audioRule     | Partial\<RuleSetRule\>      | Nee                               | -                           | Regels voor audioverpakking wijzigen                                              | -         |
| videoRule     | Partial\<RuleSetRule\>      | Nee                               | -                           | Regels voor videoverpakkingen wijzigen                                            | -         |
| rules         | OrNil\<RuleSetRule\>[]      | Nee                               | -                           | Verpakkingsregels toevoegen (kan sommige standaardregels overschrijven)           | -         |

```typescript
// cjs: CommonJS module; glb: Globale module; umd: UMD-module;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// Voor meer informatie verwijzen wij naar:: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// Voor meer informatie verwijzen wij naar:: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Als de verpakkingsregels zijn gewijzigd, alle velden behalve 'type' en 'generator'. bestandsnaam' kan worden gewijzigd.

Als u verpakkingsregels toevoegt, kunt u de verpakkingsregels voor tekst, lettertypen, afbeeldingen, audio en video overschrijven.

## Commando

### Hoofdcommando

| Optie     | Afkorting | Type | Vereist | Standaard | Beschrijving            | Voorbeeld |
| --------- | --------- | ---- | ------- | --------- | ----------------------- | --------- |
| --version | -v        | -    | -       | -         | Versie bekijken         | sdin -v   |
| --help    | -h        | -    | -       | -         | Help-document weergeven | sdin -h   |

### `build` Commando

Gebruikt voor bouwprojecten

| Parameter | Ouderniveau | Type   | Vereist | Standaard       | Beschrijving                                  | Voorbeeld     |
| --------- | ----------- | ------ | ------- | --------------- | --------------------------------------------- | ------------- |
| path      | -           | string | Nee     | Huidige werkmap | Geef de hoofdmap op van het te bouwen project | sdin build ./ |

| Optie     | Afkorting | Type   | Vereist | Standaard    | Beschrijving                                                                 | Voorbeeld                 |
| --------- | --------- | ------ | ------- | ------------ | ---------------------------------------------------------------------------- | ------------------------- |
| --modules | -m        | string | Nee     | Alle modules | Geef de te bouwen modulenamen op, met meerdere items gescheiden door komma's | sdin build -m diana,elise |

### `create` Commando

Gebruikt voor het maken van projecten

| Parameter | Ouderniveau | Type   | Vereist | Standaard | Beschrijving                                                      | Voorbeeld               |
| --------- | ----------- | ------ | ------- | --------- | ----------------------------------------------------------------- | ----------------------- |
| name      | -           | string | Nee     | -         | Geef de pakketnaam op met behulp van de symbolen "@, a-z, 0-9, /" | sdin create new-project |

| Optie      | Afkorting | Type   | Vereist | Standaard       | Beschrijving                                             | Voorbeeld                     |
| ---------- | --------- | ------ | ------- | --------------- | -------------------------------------------------------- | ----------------------------- |
| --output   | -o        | string | Nee     | Huidige werkmap | Het bovenliggende pad voor het nieuwe project opgeven    | sdin create -o ./             |
| --template | -t        | string | Nee     | -               | Geef de naam van het sjabloon op voor het nieuwe project | sdin create -t common-package |

## Interface

### readSdinConfig

Projectconfiguratie lezen

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Hoofdmap van het project */
  root: string
}
```

### createSdinProject

Project aanmaken

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Sjabloonnaam */
  templateName?: string
  /** Het mappad waar het project is opgeslagen (standaard: huidige werkmap) */
  projectParentPath?: string
  /** Projectnaam */
  projectName?: string
  /** Projectversie (standaard: 0.0.1) */
  projectVersion?: string
  /** Projectbeschrijving */
  projectDescription?: string
  /** Auteursnaam (standaard: Git gebruikersnaam) */
  authorName?: string
  /** Auteur e-mail (standaard: Git e-mail) */
  authorEmail?: string
}
```

### buildSdinProject

Bouwproject

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Sdin-configuratie */
  config: SdinConfig
  /** Geef de naam op van de te bouwen module */
  moduleNames?: string[]
}
```
