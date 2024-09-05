# sdin

- [sdin](#sdin)
  - [Beispiel](#beispiel)
  - [Konfiguration](#konfiguration)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Befehl](#befehl)
    - [Hauptbefehl](#hauptbefehl)
    - [`build` Befehl](#build-befehl)
    - [`create` Befehl](#create-befehl)
  - [Schnittstelle](#schnittstelle)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Beispiel

Bauprojekt auf der Kommandozeile:

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

Bauprojekt im Code:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Konfiguration

Der Pfad der Konfigurationsdatei für das Projekt: `pro/configs/project.ts`。

Der Inhalt der Konfigurationsdatei des Projekts:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Projektkonfiguration

| Attribut    | Typ                         | Erforderlich | Standard                     | Beschreibung                                                       | Beispiel              |
| ----------- | --------------------------- | ------------ | ---------------------------- | ------------------------------------------------------------------ | --------------------- |
| root        | string                      | Nein         | Aktuelles Arbeitsverzeichnis | Projektstammverzeichnis                                            | -                     |
| mode        | SdinBuildMode               | Nein         | production                   | Baumuster                                                          | -                     |
| alias       | Record\<string, string\>    | Nein         | -                            | Modul-Alias，\<Alias, Pfad (relativ zum Projektstammverzeichnis)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | Nein         | -                            | Globale Definition，\<Originalcode, Ersetzter Code\>               | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | Nein         | -                            | Liste der Modulkonfigurationselemente                              | -                     |

```typescript
// production: Produktionsart; development: Entwicklungsumfeld;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

Das Programm hat einige globale Definitionen für das Projekt bereitgestellt, die direkt im Projekt verwendet werden können:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // Bauart des Projekts
  const SDIN_PROJECT_NAME: string // Projektname
  const SDIN_PROJECT_VERSION: string // Projektversion
  const SDIN_PROJECT_AUTHOR_NAME: string // Name des Projektautors
  const SDIN_PROJECT_AUTHOR_EMAIL: string // E-Mail des Projektautors
  const SDIN_MODULE_TYPE: string // Bei der Kompilierung wird die Art des Moduls
  const SDIN_MODULE_MODE: string // Der Konstruktionsmodus von Modulen während der Kompilierung
  const SDIN_MODULE_NAME: string // Modulname während der Kompilierung
}
```

### SdinDeclarationModuleParams

Modulkonfiguration definieren

| Attribut | Typ                       | Erforderlich | Standard            | Beschreibung                                                                      | Beispiel |
| -------- | ------------------------- | ------------ | ------------------- | --------------------------------------------------------------------------------- | -------- |
| type     | 'declaration'             | Ja           | -                   | Modultyp                                                                          | -        |
| mode     | SdinDeclarationModuleMode | Nein         | 'dts'               | Modulbaumodus                                                                     | -        |
| name     | string                    | Ja           | -                   | Modulname                                                                         | -        |
| src      | string                    | Nein         | 'src'               | Der Speicherort des eingegebenen Quellcodes (relativ zum Projektstammverzeichnis) | -        |
| tar      | string                    | Nein         | 'tar/Modulbaumodus' | Ausgabezielort (relativ zum Projektstammverzeichnis)                              | -        |
| includes | OrNil\<string\>[]         | Nein         | -                   | Enthält Dateien (relativ zum Stammverzeichnis des Projekts)                       | -        |
| excludes | OrNil\<string\>[]         | Nein         | -                   | Ausgeschlossene Dateien (relativ zum Projektstammverzeichnis)                     | -        |

```typescript
// dts: TypeScript Definition Module;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Grundmodulkonfiguration

| Attribut     | Typ                      | Erforderlich | Standard                              | Beschreibung                                                                      | Beispiel |
| ------------ | ------------------------ | ------------ | ------------------------------------- | --------------------------------------------------------------------------------- | -------- |
| type         | 'foundation'             | Ja           | -                                     | Modultyp                                                                          | -        |
| mode         | SdinFoundationModuleMode | Nein         | 'cjs'                                 | Modulbaumodus                                                                     | -        |
| name         | string                   | Ja           | -                                     | Modulname                                                                         | -        |
| src          | string                   | Nein         | 'src'                                 | Der Speicherort des eingegebenen Quellcodes (relativ zum Projektstammverzeichnis) | -        |
| tar          | string                   | Nein         | 'tar/Modulbaumodus'                   | Ausgabezielort (relativ zum Projektstammverzeichnis)                              | -        |
| includes     | OrNil\<string\>[]        | Nein         | -                                     | Enthält Dateien (relativ zum Stammverzeichnis des Projekts)                       | -        |
| excludes     | OrNil\<string\>[]        | Nein         | -                                     | Ausgeschlossene Dateien (relativ zum Projektstammverzeichnis)                     | -        |
| minify       | boolean                  | Nein         | Im Produktionsmodus aktivieren        | Code komprimieren                                                                 | -        |
| uglify       | boolean                  | Nein         | Im Produktionsmodus aktivieren        | Hässlicher Code (gültig, wenn minify aktiviert ist)                               | -        |
| sassModule   | boolean                  | Nein         | true                                  | SASS-Modulschalter                                                                | -        |
| styleImports | boolean                  | Nein         | Öffnen bei eingeschaltetem SASS-Modul | Konvertierte CSS-Dateien in JS-Dateien importieren                                | -        |

```typescript
// cjs: CommonJS-Modul; esm: ESModulmodul;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Integrierte Modulkonfiguration

| Attribut      | Typ                         | Erforderlich                     | Standard                       | Beschreibung                                                                          | Beispiel |
| ------------- | --------------------------- | -------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------- | -------- |
| type          | 'integration'               | Ja                               | -                              | Modultyp                                                                              | -        |
| mode          | SdinIntegrationModuleMode   | Nein                             | 'umd'                          | Modulbaumodus                                                                         | -        |
| name          | string                      | Ja                               | -                              | Modulname                                                                             | -        |
| src           | string                      | Nein                             | 'src/index.{jsx?\|tsx?}'       | Der Speicherort des eingegebenen Quellcodes (relativ zum Projektstammverzeichnis)     | -        |
| tar           | string                      | Nein                             | 'tar/Modulbaumodus'            | Ausgabezielort (relativ zum Projektstammverzeichnis)                                  | -        |
| entryName     | string                      | Nein                             | 'index'                        | Name des Moduleingangs                                                                | -        |
| globalName    | string                      | Effektiv muss übermittelt werden | -                              | Geben Sie den globalen Namen des Paketexportobjekts an (gültig im cjs- und umd-Modus) | "React"  |
| minify        | boolean                     | Nein                             | Im Produktionsmodus aktivieren | Code komprimieren                                                                     | -        |
| uglify        | boolean                     | Nein                             | Im Produktionsmodus aktivieren | Hässlicher Code (gültig, wenn minify aktiviert ist)                                   | -        |
| externals     | Record\<string, string\>    | Nein                             | -                              | Entfernen Sie externe Module, die im Code verwendet werden                            | -        |
| sassModule    | boolean                     | Nein                             | true                           | SASS-Modulschalter                                                                    | -        |
| babelIncludes | OrNil\<RuleSetCondition\>[] | Nein                             | -                              | Babel-Zusammenstellung enthält Artikel                                                | -        |
| babelExcludes | OrNil\<RuleSetCondition\>[] | Nein                             | -                              | Ausschluss der Babel-Kompilierung                                                     | -        |
| rawRule       | Partial\<RuleSetRule\>      | Nein                             | -                              | Textverpackungsregeln ändern                                                          | -        |
| fontRule      | Partial\<RuleSetRule\>      | Nein                             | -                              | Schriftpaketierungsregeln ändern                                                      | -        |
| imageRule     | Partial\<RuleSetRule\>      | Nein                             | -                              | Ändern der Bildverpackungsregeln                                                      | -        |
| audioRule     | Partial\<RuleSetRule\>      | Nein                             | -                              | Audio-Verpackungsregeln ändern                                                        | -        |
| videoRule     | Partial\<RuleSetRule\>      | Nein                             | -                              | Regeln für Videoverpackungen ändern                                                   | -        |
| rules         | OrNil\<RuleSetRule\>[]      | Nein                             | -                              | Packaging-Regeln hinzufügen (kann einige Standardregeln überschreiben)                | -        |

```typescript
// cjs: CommonJS-Modul; glb: Globales Modul; umd: UMD-Modul;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// Weitere Informationen finden Sie unter: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// Weitere Informationen finden Sie unter: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Wenn die Verpackungsregeln geändert werden, alle Felder außer 'type' und 'generator'. filename' kann geändert werden.

Wenn Sie Verpackungsregeln hinzufügen, können Sie die Verpackungsregeln für Text, Schriftarten, Bilder, Audio und Video überschreiben.

## Befehl

### Hauptbefehl

| Option    | Abkürzung | Typ | Erforderlich | Standard | Beschreibung           | Beispiel |
| --------- | --------- | --- | ------------ | -------- | ---------------------- | -------- |
| --version | -v        | -   | -            | -        | Version anzeigen       | sdin -v  |
| --help    | -h        | -   | -            | -        | Hilfedokument anzeigen | sdin -h  |

### `build` Befehl

Verwendet für Bauprojekte

| Parameter | Übergeordnete Ebene | Typ    | Erforderlich | Standard                     | Beschreibung                                                   | Beispiel      |
| --------- | ------------------- | ------ | ------------ | ---------------------------- | -------------------------------------------------------------- | ------------- |
| path      | -                   | string | Nein         | Aktuelles Arbeitsverzeichnis | Geben Sie das Stammverzeichnis des zu erstellenden Projekts an | sdin build ./ |

| Option    | Abkürzung | Typ    | Erforderlich | Standard    | Beschreibung                                                                                               | Beispiel                  |
| --------- | --------- | ------ | ------------ | ----------- | ---------------------------------------------------------------------------------------------------------- | ------------------------- |
| --modules | -m        | string | Nein         | Alle Module | Geben Sie die Modulnamen an, die erstellt werden sollen, wobei mehrere Elemente durch Kommas getrennt sind | sdin build -m diana,elise |

### `create` Befehl

Wird zum Erstellen von Projekten verwendet

| Parameter | Übergeordnete Ebene | Typ    | Erforderlich | Standard | Beschreibung                                                     | Beispiel                |
| --------- | ------------------- | ------ | ------------ | -------- | ---------------------------------------------------------------- | ----------------------- |
| name      | -                   | string | Nein         | -        | Geben Sie den Paketnamen mit den Symbolen "@, a-z, 0-9, -,/" an. | sdin create new-project |

| Option     | Abkürzung | Typ    | Erforderlich | Standard                     | Beschreibung                                              | Beispiel                      |
| ---------- | --------- | ------ | ------------ | ---------------------------- | --------------------------------------------------------- | ----------------------------- |
| --output   | -o        | string | Nein         | Aktuelles Arbeitsverzeichnis | Geben Sie den übergeordneten Pfad für das neue Projekt an | sdin create -o ./             |
| --template | -t        | string | Nein         | -                            | Geben Sie den Vorlagennamen für das neue Projekt an       | sdin create -t common-package |

## Schnittstelle

### readSdinConfig

Lesen der Projektkonfiguration

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Projektstammverzeichnis */
  root: string
}
```

### createSdinProject

Projekt erstellen

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Vorlagenname */
  templateName?: string
  /** Der Ordnerpfad, in dem das Projekt gespeichert ist (Standard: aktuelles Arbeitsverzeichnis) */
  projectParentPath?: string
  /** Projektname */
  projectName?: string
  /** Projektversion (Standard: 0.0.1) */
  projectVersion?: string
  /** Projektbeschreibung */
  projectDescription?: string
  /** Name des Autors (Standard: Git Benutzername) */
  authorName?: string
  /** Autor E-Mail (Standard: Git E-Mail) */
  authorEmail?: string
}
```

### buildSdinProject

Bauvorhaben

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Sdin-Konfiguration */
  config: SdinConfig
  /** Geben Sie den Namen des zu bauenden Moduls an */
  moduleNames?: string[]
}
```
