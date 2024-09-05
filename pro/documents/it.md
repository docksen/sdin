# sdin

- [sdin](#sdin)
  - [Esempio](#esempio)
  - [Configurazione](#configurazione)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Comando](#comando)
    - [Comando principale](#comando-principale)
    - [`build` Comando](#build-comando)
    - [`create` Comando](#create-comando)
  - [Interfaccia](#interfaccia)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Esempio

Progetto di costruzione sulla riga di comando:

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

Progetto edilizio in codice:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Configurazione

Il percorso del file di configurazione per il progetto: `pro/configs/project.ts`。

Il contenuto del file di configurazione del progetto:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Configurazione progetto

| Attributo   | Tipo                        | Obbligatorio | Predefinito                 | Descrizione                                                                         | Esempio               |
| ----------- | --------------------------- | ------------ | --------------------------- | ----------------------------------------------------------------------------------- | --------------------- |
| root        | string                      | No           | Cartella di lavoro corrente | Cartella radice del progetto                                                        | -                     |
| mode        | SdinBuildMode               | No           | production                  | Modello di costruzione                                                              | -                     |
| alias       | Record\<string, string\>    | No           | -                           | alias modulo，\<Alias, Percorso (relativo alla directory principale del progetto)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | No           | -                           | Definizione globale，\<Codice originale, Codice sostituito\>                        | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | No           | -                           | Elenco elementi di configurazione del modulo                                        | -                     |

```typescript
// production: Modalità di produzione; development: Ambiente di sviluppo;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

Il programma ha fornito alcune definizioni globali per il progetto, che possono essere utilizzate direttamente nel progetto:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // La modalità di costruzione del progetto
  const SDIN_PROJECT_NAME: string // Nome progetto
  const SDIN_PROJECT_VERSION: string // Versione del progetto
  const SDIN_PROJECT_AUTHOR_NAME: string // Nome autore del progetto
  const SDIN_PROJECT_AUTHOR_EMAIL: string // Email dell'autore del progetto
  const SDIN_MODULE_TYPE: string // Al momento della compilazione, il tipo di modulo
  const SDIN_MODULE_MODE: string // La modalità di costruzione dei moduli durante la compilazione
  const SDIN_MODULE_NAME: string // Nome modulo durante la compilazione
}
```

### SdinDeclarationModuleParams

Definisci la configurazione del modulo

| Attributo | Tipo                      | Obbligatorio | Predefinito                              | Descrizione                                                                           | Esempio |
| --------- | ------------------------- | ------------ | ---------------------------------------- | ------------------------------------------------------------------------------------- | ------- |
| type      | 'declaration'             | Sì           | -                                        | Tipo di modulo                                                                        | -       |
| mode      | SdinDeclarationModuleMode | No           | 'dts'                                    | Modalità di costruzione del modulo                                                    | -       |
| name      | string                    | Sì           | -                                        | Nome modulo                                                                           | -       |
| src       | string                    | No           | 'src'                                    | La posizione del codice sorgente di input (relativo alla directory root del progetto) | -       |
| tar       | string                    | No           | 'tar/Modalità di costruzione del modulo' | Posizione dell'obiettivo di output (relativa alla directory principale del progetto)  | -       |
| includes  | OrNil\<string\>[]         | No           | -                                        | Contiene file (relativi alla directory principale del progetto)                       | -       |
| excludes  | OrNil\<string\>[]         | No           | -                                        | File esclusi (relativi alla directory principale del progetto)                        | -       |

```typescript
// dts: TipoScript Definition Module;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Configurazione del modulo di base

| Attributo    | Tipo                     | Obbligatorio | Predefinito                              | Descrizione                                                                           | Esempio |
| ------------ | ------------------------ | ------------ | ---------------------------------------- | ------------------------------------------------------------------------------------- | ------- |
| type         | 'foundation'             | Sì           | -                                        | Tipo di modulo                                                                        | -       |
| mode         | SdinFoundationModuleMode | No           | 'cjs'                                    | Modalità di costruzione del modulo                                                    | -       |
| name         | string                   | Sì           | -                                        | Nome modulo                                                                           | -       |
| src          | string                   | No           | 'src'                                    | La posizione del codice sorgente di input (relativo alla directory root del progetto) | -       |
| tar          | string                   | No           | 'tar/Modalità di costruzione del modulo' | Posizione dell'obiettivo di output (relativa alla directory principale del progetto)  | -       |
| includes     | OrNil\<string\>[]        | No           | -                                        | Contiene file (relativi alla directory principale del progetto)                       | -       |
| excludes     | OrNil\<string\>[]        | No           | -                                        | File esclusi (relativi alla directory principale del progetto)                        | -       |
| minify       | boolean                  | No           | Attiva in modalità di produzione         | Comprimi codice                                                                       | -       |
| uglify       | boolean                  | No           | Attiva in modalità di produzione         | Codice brutto (valido quando minify è abilitato)                                      | -       |
| sassModule   | boolean                  | No           | true                                     | Interruttore modulo SASS                                                              | -       |
| styleImports | boolean                  | No           | Apri quando il modulo SASS è acceso      | Importa file CSS convertiti in file JS                                                | -       |

```typescript
// cjs: Modulo CommonJS; esm: Modulo ESModule;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Configurazione integrata del modulo

| Attributo     | Tipo                        | Obbligatorio                      | Predefinito                              | Descrizione                                                                                              | Esempio |
| ------------- | --------------------------- | --------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------- |
| type          | 'integration'               | Sì                                | -                                        | Tipo di modulo                                                                                           | -       |
| mode          | SdinIntegrationModuleMode   | No                                | 'umd'                                    | Modalità di costruzione del modulo                                                                       | -       |
| name          | string                      | Sì                                | -                                        | Nome modulo                                                                                              | -       |
| src           | string                      | No                                | 'src/index.{jsx?\|tsx?}'                 | La posizione del codice sorgente di input (relativo alla directory root del progetto)                    | -       |
| tar           | string                      | No                                | 'tar/Modalità di costruzione del modulo' | Posizione dell'obiettivo di output (relativa alla directory principale del progetto)                     | -       |
| entryName     | string                      | No                                | 'index'                                  | Nome dell'entrata del modulo                                                                             | -       |
| globalName    | string                      | L'efficacia deve essere trasmessa | -                                        | Specificare il nome globale dell'oggetto di esportazione del pacchetto (valido nelle modalità cjs e umd) | "React" |
| minify        | boolean                     | No                                | Attiva in modalità di produzione         | Comprimi codice                                                                                          | -       |
| uglify        | boolean                     | No                                | Attiva in modalità di produzione         | Codice brutto (valido quando minify è abilitato)                                                         | -       |
| externals     | Record\<string, string\>    | No                                | -                                        | Rimuovi i moduli esterni utilizzati nel codice                                                           | -       |
| sassModule    | boolean                     | No                                | true                                     | Interruttore modulo SASS                                                                                 | -       |
| babelIncludes | OrNil\<RuleSetCondition\>[] | No                                | -                                        | Babel compilation include elementi                                                                       | -       |
| babelExcludes | OrNil\<RuleSetCondition\>[] | No                                | -                                        | Voce di esclusione della compilazione Babel                                                              | -       |
| rawRule       | Partial\<RuleSetRule\>      | No                                | -                                        | Modifica delle norme sull'imballaggio del testo                                                          | -       |
| fontRule      | Partial\<RuleSetRule\>      | No                                | -                                        | Modifica regole di imballaggio dei caratteri                                                             | -       |
| imageRule     | Partial\<RuleSetRule\>      | No                                | -                                        | Modifica le regole di imballaggio delle immagini                                                         | -       |
| audioRule     | Partial\<RuleSetRule\>      | No                                | -                                        | Modifica regole di imballaggio audio                                                                     | -       |
| videoRule     | Partial\<RuleSetRule\>      | No                                | -                                        | Modifica le regole di imballaggio video                                                                  | -       |
| rules         | OrNil\<RuleSetRule\>[]      | No                                | -                                        | Aggiungi regole di imballaggio (può ignorare alcune regole predefinite)                                  | -       |

```typescript
// cjs: Modulo CommonJS; glb: Modulo globale; umd: Modulo UMD;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// Per maggiori dettagli, consultare il sito:: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// Per maggiori dettagli, consultare il sito:: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Se le regole di imballaggio sono modificate, tutti i campi tranne "tipo" e "generatore. filename' può essere modificato.

Se si aggiungono regole di imballaggio, è possibile ignorare le regole di imballaggio per testo, font, immagini, audio e video.

## Comando

### Comando principale

| Opzione   | Abbreviazione | Tipo | Obbligatorio | Predefinito | Descrizione                      | Esempio |
| --------- | ------------- | ---- | ------------ | ----------- | -------------------------------- | ------- |
| --version | -v            | -    | -            | -           | Visualizza versione              | sdin -v |
| --help    | -h            | -    | -            | -           | Visualizza documento della Guida | sdin -h |

### `build` Comando

Utilizzato per progetti edilizi

| Parametro | Livello genitore | Tipo   | Obbligatorio | Predefinito                 | Descrizione                                                 | Esempio       |
| --------- | ---------------- | ------ | ------------ | --------------------------- | ----------------------------------------------------------- | ------------- |
| path      | -                | string | No           | Cartella di lavoro corrente | Specifica la directory principale del progetto da costruire | sdin build ./ |

| Opzione   | Abbreviazione | Tipo   | Obbligatorio | Predefinito    | Descrizione                                                                      | Esempio                   |
| --------- | ------------- | ------ | ------------ | -------------- | -------------------------------------------------------------------------------- | ------------------------- |
| --modules | -m            | string | No           | Tutti i moduli | Specificare i nomi dei moduli da costruire, con più elementi separati da virgole | sdin build -m diana,elise |

### `create` Comando

Utilizzato per creare progetti

| Parametro | Livello genitore | Tipo   | Obbligatorio | Predefinito | Descrizione                                                                | Esempio                 |
| --------- | ---------------- | ------ | ------------ | ----------- | -------------------------------------------------------------------------- | ----------------------- |
| name      | -                | string | No           | -           | Specificare il nome del pacchetto utilizzando i simboli "@, a-z, 0-9, -,/" | sdin create new-project |

| Opzione    | Abbreviazione | Tipo   | Obbligatorio | Predefinito                 | Descrizione                                              | Esempio                       |
| ---------- | ------------- | ------ | ------------ | --------------------------- | -------------------------------------------------------- | ----------------------------- |
| --output   | -o            | string | No           | Cartella di lavoro corrente | Specificare il percorso principale per il nuovo progetto | sdin create -o ./             |
| --template | -t            | string | No           | -                           | Specificare il nome del modello per il nuovo progetto    | sdin create -t common-package |

## Interfaccia

### readSdinConfig

Lettura della configurazione del progetto

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Cartella radice del progetto */
  root: string
}
```

### createSdinProject

Creazione progetto

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Nome modello */
  templateName?: string
  /** Il percorso della cartella in cui è memorizzato il progetto (predefinito: directory di lavoro corrente) */
  projectParentPath?: string
  /** Nome progetto */
  projectName?: string
  /** Versione del progetto (default: 0.0.1) */
  projectVersion?: string
  /** Descrizione del progetto */
  projectDescription?: string
  /** Nome autore (predefinito: nome utente Git) */
  authorName?: string
  /** Email dell'autore (predefinito: Git email) */
  authorEmail?: string
}
```

### buildSdinProject

Progetto edilizio

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Configurazione Sdin */
  config: SdinConfig
  /** Specificare il nome del modulo da costruire */
  moduleNames?: string[]
}
```
