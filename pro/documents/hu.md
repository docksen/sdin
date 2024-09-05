# sdin

- [sdin](#sdin)
  - [Példa](#példa)
  - [Beállítás](#beállítás)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Parancs](#parancs)
    - [Főparancs](#főparancs)
    - [`build` Parancs](#build-parancs)
    - [`create` Parancs](#create-parancs)
  - [Interfész](#interfész)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Példa

Építési projekt a parancssoron:

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

Építési projekt kóddal:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Beállítás

A projekt konfigurációs fájl elérési útja: `pro/configs/project.ts`。

A projekt konfigurációs fájltartalma:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Projektbeállítások

| Attribute   | Típus                       | Szükséges | Alapértelmezett         | Leírás                                                                       | Példa                 |
| ----------- | --------------------------- | --------- | ----------------------- | ---------------------------------------------------------------------------- | --------------------- |
| root        | string                      | Nem       | Jelenlegi munkakönyvtár | Projektgyökérkönyvtár                                                        | -                     |
| mode        | SdinBuildMode               | Nem       | production              | Épületminta                                                                  | -                     |
| alias       | Record\<string, string\>    | Nem       | -                       | Modulalias，\<Alias, Elérési út (a projekt gyökérkönyvtárához viszonyítva)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | Nem       | -                       | Globális meghatározás，\<Eredeti kód, Cserélt kód\>                          | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | Nem       | -                       | Modulbeállítási elemek listája                                               | -                     |

```typescript
// production: Gyártási mód; development: Fejlesztési környezet;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

A program megadott néhány globális definíciót a projekthez, amelyek közvetlenül a projektben használhatók:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // A projekt építési módja
  const SDIN_PROJECT_NAME: string // Projekt neve
  const SDIN_PROJECT_VERSION: string // Projektverzió
  const SDIN_PROJECT_AUTHOR_NAME: string // A projekt szerzője neve
  const SDIN_PROJECT_AUTHOR_EMAIL: string // A projekt szerzői e-mail
  const SDIN_MODULE_TYPE: string // A fordításkor a modul típusa
  const SDIN_MODULE_MODE: string // A modulok építési módja az összeállítás során
  const SDIN_MODULE_NAME: string // A modul neve az összeállítás során
}
```

### SdinDeclarationModuleParams

A modulbeállítás meghatározása

| Attribute | Típus                     | Szükséges | Alapértelmezett        | Leírás                                                                | Példa |
| --------- | ------------------------- | --------- | ---------------------- | --------------------------------------------------------------------- | ----- |
| type      | 'declaration'             | Igen      | -                      | Modultípus                                                            | -     |
| mode      | SdinDeclarationModuleMode | Nem       | 'dts'                  | Modulépítési mód                                                      | -     |
| name      | string                    | Igen      | -                      | Modulnév                                                              | -     |
| src       | string                    | Nem       | 'src'                  | A beviteli forráskód helye (a projekt gyökérkönyvtárához viszonyítva) | -     |
| tar       | string                    | Nem       | 'tar/Modulépítési mód' | A kimeneti cél helye (a projekt gyökérkönyvtárához viszonyítva)       | -     |
| includes  | OrNil\<string\>[]         | Nem       | -                      | Fájlokat tartalmaz (a projekt gyökérkönyvtárához viszonyítva)         | -     |
| excludes  | OrNil\<string\>[]         | Nem       | -                      | Kizárt fájlok (a projekt gyökérkönyvtárához viszonyítva)              | -     |

```typescript
// dts: TípusScript Definition Module;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Alapvető modulbeállítások

| Attribute    | Típus                    | Szükséges | Alapértelmezett                      | Leírás                                                                | Példa |
| ------------ | ------------------------ | --------- | ------------------------------------ | --------------------------------------------------------------------- | ----- |
| type         | 'foundation'             | Igen      | -                                    | Modultípus                                                            | -     |
| mode         | SdinFoundationModuleMode | Nem       | 'cjs'                                | Modulépítési mód                                                      | -     |
| name         | string                   | Igen      | -                                    | Modulnév                                                              | -     |
| src          | string                   | Nem       | 'src'                                | A beviteli forráskód helye (a projekt gyökérkönyvtárához viszonyítva) | -     |
| tar          | string                   | Nem       | 'tar/Modulépítési mód'               | A kimeneti cél helye (a projekt gyökérkönyvtárához viszonyítva)       | -     |
| includes     | OrNil\<string\>[]        | Nem       | -                                    | Fájlokat tartalmaz (a projekt gyökérkönyvtárához viszonyítva)         | -     |
| excludes     | OrNil\<string\>[]        | Nem       | -                                    | Kizárt fájlok (a projekt gyökérkönyvtárához viszonyítva)              | -     |
| minify       | boolean                  | Nem       | Aktiválás gyártási módban            | Kód tömörítése                                                        | -     |
| uglify       | boolean                  | Nem       | Aktiválás gyártási módban            | Ronda kód (érvényes, ha a minify engedélyezve van)                    | -     |
| sassModule   | boolean                  | Nem       | true                                 | SASS modulkapcsoló                                                    | -     |
| styleImports | boolean                  | Nem       | Megnyitás SASS modul bekapcsolásakor | konvertált CSS fájlok importálása JS fájlokba                         | -     |

```typescript
// cjs: CommonJS modul; esm: ESmodulmodul;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Integrált modulkonfiguráció

| Attribute     | Típus                       | Szükséges                        | Alapértelmezett           | Leírás                                                                            | Példa   |
| ------------- | --------------------------- | -------------------------------- | ------------------------- | --------------------------------------------------------------------------------- | ------- |
| type          | 'integration'               | Igen                             | -                         | Modultípus                                                                        | -       |
| mode          | SdinIntegrationModuleMode   | Nem                              | 'umd'                     | Modulépítési mód                                                                  | -       |
| name          | string                      | Igen                             | -                         | Modulnév                                                                          | -       |
| src           | string                      | Nem                              | 'src/index.{jsx?\|tsx?}'  | A beviteli forráskód helye (a projekt gyökérkönyvtárához viszonyítva)             | -       |
| tar           | string                      | Nem                              | 'tar/Modulépítési mód'    | A kimeneti cél helye (a projekt gyökérkönyvtárához viszonyítva)                   | -       |
| entryName     | string                      | Nem                              | 'index'                   | A modul bejáratának neve                                                          | -       |
| globalName    | string                      | A hatékonyságot továbbítani kell | -                         | Adja meg a csomagexportáló objektum globális nevét (cjs és umd módokban érvényes) | "React" |
| minify        | boolean                     | Nem                              | Aktiválás gyártási módban | Kód tömörítése                                                                    | -       |
| uglify        | boolean                     | Nem                              | Aktiválás gyártási módban | Ronda kód (érvényes, ha a minify engedélyezve van)                                | -       |
| externals     | Record\<string, string\>    | Nem                              | -                         | A kódban használt külső modulok eltávolítása                                      | -       |
| sassModule    | boolean                     | Nem                              | true                      | SASS modulkapcsoló                                                                | -       |
| babelIncludes | OrNil\<RuleSetCondition\>[] | Nem                              | -                         | A Bábel összeállítása elemeket tartalmaz                                          | -       |
| babelExcludes | OrNil\<RuleSetCondition\>[] | Nem                              | -                         | Bábelösszeállítás kizárási eleme                                                  | -       |
| rawRule       | Partial\<RuleSetRule\>      | Nem                              | -                         | A szövegcsomagolási szabályok módosítása                                          | -       |
| fontRule      | Partial\<RuleSetRule\>      | Nem                              | -                         | A betűtípuscsomagolási szabályok módosítása                                       | -       |
| imageRule     | Partial\<RuleSetRule\>      | Nem                              | -                         | A kép csomagolására vonatkozó szabályok módosítása                                | -       |
| audioRule     | Partial\<RuleSetRule\>      | Nem                              | -                         | A hangcsomagolási szabályok módosítása                                            | -       |
| videoRule     | Partial\<RuleSetRule\>      | Nem                              | -                         | A videocsomagolási szabályok módosítása                                           | -       |
| rules         | OrNil\<RuleSetRule\>[]      | Nem                              | -                         | Csomagolási szabályok hozzáadása (felülbírálhat néhány alapértelmezett szabályt)  | -       |

```typescript
// cjs: CommonJS modul; glb: Globális modul; umd: UMD modul;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// A részleteket a következő oldalon találja:: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// A részleteket a következő oldalon találja:: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

A csomagolási szabályok módosítása esetén minden mezőt a "típus" és a "generátor" kivételével. A fájlnév módosítható.

Ha csomagolási szabályokat ad hozzá, felülírhatja a szöveg, betűtípusok, képek, hang és videó csomagolási szabályait.

## Parancs

### Főparancs

| Lehetőség | Rövidítés | Típus | Szükséges | Alapértelmezett | Leírás                      | Példa   |
| --------- | --------- | ----- | --------- | --------------- | --------------------------- | ------- |
| --version | -v        | -     | -         | -               | Verzió megtekintése         | sdin -v |
| --help    | -h        | -     | -         | -               | Súgódokumentum megtekintése | sdin -h |

### `build` Parancs

Építési projektekhez használják

| Paraméter | Szülői szint | Típus  | Szükséges | Alapértelmezett         | Leírás                                             | Példa         |
| --------- | ------------ | ------ | --------- | ----------------------- | -------------------------------------------------- | ------------- |
| path      | -            | string | Nem       | Jelenlegi munkakönyvtár | A létrehozandó projekt gyökérkönyvtárának megadása | sdin build ./ |

| Lehetőség | Rövidítés | Típus  | Szükséges | Alapértelmezett | Leírás                                                                   | Példa                     |
| --------- | --------- | ------ | --------- | --------------- | ------------------------------------------------------------------------ | ------------------------- |
| --modules | -m        | string | Nem       | Minden modul    | Adja meg a létrehozandó modulneveket, több elemmel vesszővel elválasztva | sdin build -m diana,elise |

### `create` Parancs

Projektek létrehozásához használt

| Paraméter | Szülői szint | Típus  | Szükséges | Alapértelmezett | Leírás                                                     | Példa                   |
| --------- | ------------ | ------ | --------- | --------------- | ---------------------------------------------------------- | ----------------------- |
| name      | -            | string | Nem       | -               | Adja meg a csomag nevét a "@, a-z, 0-9, -,/"szimbólumokkal | sdin create new-project |

| Lehetőség  | Rövidítés | Típus  | Szükséges | Alapértelmezett         | Leírás                               | Példa                         |
| ---------- | --------- | ------ | --------- | ----------------------- | ------------------------------------ | ----------------------------- |
| --output   | -o        | string | Nem       | Jelenlegi munkakönyvtár | Az új projekt szülőútjának megadása  | sdin create -o ./             |
| --template | -t        | string | Nem       | -                       | Az új projekt sablonnevének megadása | sdin create -t common-package |

## Interfész

### readSdinConfig

A projekt beállításainak olvasása

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Projektgyökérkönyvtár */
  root: string
}
```

### createSdinProject

A projekt létrehozása

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Sablon neve */
  templateName?: string
  /** A mappa elérési útja, ahol a projekt tárolódik (alapértelmezett: aktuális munkakönyvtár) */
  projectParentPath?: string
  /** Projekt neve */
  projectName?: string
  /** Projektverzió (alapértelmezett: 0.0.1) */
  projectVersion?: string
  /** Projektleírás */
  projectDescription?: string
  /** Szerző neve (alapértelmezett: Git felhasználónév) */
  authorName?: string
  /** Szerzői e- mail (alapértelmezett: Git e- mail) */
  authorEmail?: string
}
```

### buildSdinProject

Építési projekt

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Sdin konfiguráció */
  config: SdinConfig
  /** A felépítendő modul nevének megadása */
  moduleNames?: string[]
}
```
