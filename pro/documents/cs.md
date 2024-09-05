# sdin

- [sdin](#sdin)
  - [Příklad](#příklad)
  - [Nastavení](#nastavení)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Příkaz](#příkaz)
    - [Hlavní příkaz](#hlavní-příkaz)
    - [`build` Příkaz](#build-příkaz)
    - [`create` Příkaz](#create-příkaz)
  - [Rozhraní](#rozhraní)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Příklad

Stavební projekt na příkazovém řádku:

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

Stavební projekt v kódu:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Nastavení

Cesta k konfiguračnímu souboru projektu: `pro/configs/project.ts`。

Obsah konfiguračního souboru projektu:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Nastavení projektu

| Atribut     | Typ                         | Požadované | Výchozí                   | Popis                                                                        | Příklad               |
| ----------- | --------------------------- | ---------- | ------------------------- | ---------------------------------------------------------------------------- | --------------------- |
| root        | string                      | Ne         | Aktuální pracovní adresář | Kořenový adresář projektu                                                    | -                     |
| mode        | SdinBuildMode               | Ne         | production                | Vzor stavby                                                                  | -                     |
| alias       | Record\<string, string\>    | Ne         | -                         | Alias modulu，\<Také jako, Cesta (vzhledem k kořenovému adresáři projektu)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | Ne         | -                         | Globální definice，\<Původní kód, Nahrazený kód\>                            | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | Ne         | -                         | Seznam položek konfigurace modulu                                            | -                     |

```typescript
// production: Režim výroby; development: Rozvojové prostředí;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

Program poskytl některé globální definice pro projekt, které lze přímo použít v projektu:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // Režim výstavby projektu
  const SDIN_PROJECT_NAME: string // Název projektu
  const SDIN_PROJECT_VERSION: string // Verze projektu
  const SDIN_PROJECT_AUTHOR_NAME: string // Název autora projektu
  const SDIN_PROJECT_AUTHOR_EMAIL: string // E-mail autora projektu
  const SDIN_MODULE_TYPE: string // V době kompilace, typ modulu
  const SDIN_MODULE_MODE: string // Režim konstrukce modulů během kompilace
  const SDIN_MODULE_NAME: string // Název modulu během kompilace
}
```

### SdinDeclarationModuleParams

Definovat konfiguraci modulu

| Atribut  | Typ                       | Požadované | Výchozí                       | Popis                                                                        | Příklad |
| -------- | ------------------------- | ---------- | ----------------------------- | ---------------------------------------------------------------------------- | ------- |
| type     | 'declaration'             | Ano        | -                             | Typ modulu                                                                   | -       |
| mode     | SdinDeclarationModuleMode | Ne         | 'dts'                         | Režim konstrukce modulu                                                      | -       |
| name     | string                    | Ano        | -                             | Název modulu                                                                 | -       |
| src      | string                    | Ne         | 'src'                         | Umístění vstupního zdrojového kódu (vzhledem k kořenovému adresáři projektu) | -       |
| tar      | string                    | Ne         | 'tar/Režim konstrukce modulu' | Výstupní cílové umístění (vzhledem k kořenovému adresáři projektu)           | -       |
| includes | OrNil\<string\>[]         | Ne         | -                             | Obsahuje soubory (vzhledem k kořenovému adresáři projektu)                   | -       |
| excludes | OrNil\<string\>[]         | Ne         | -                             | Vyloučené soubory (vzhledem k kořenovému adresáři projektu)                  | -       |

```typescript
// dts: Modul definice typeScript;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Základní konfigurace modulu

| Atribut      | Typ                      | Požadované | Výchozí                         | Popis                                                                        | Příklad |
| ------------ | ------------------------ | ---------- | ------------------------------- | ---------------------------------------------------------------------------- | ------- |
| type         | 'foundation'             | Ano        | -                               | Typ modulu                                                                   | -       |
| mode         | SdinFoundationModuleMode | Ne         | 'cjs'                           | Režim konstrukce modulu                                                      | -       |
| name         | string                   | Ano        | -                               | Název modulu                                                                 | -       |
| src          | string                   | Ne         | 'src'                           | Umístění vstupního zdrojového kódu (vzhledem k kořenovému adresáři projektu) | -       |
| tar          | string                   | Ne         | 'tar/Režim konstrukce modulu'   | Výstupní cílové umístění (vzhledem k kořenovému adresáři projektu)           | -       |
| includes     | OrNil\<string\>[]        | Ne         | -                               | Obsahuje soubory (vzhledem k kořenovému adresáři projektu)                   | -       |
| excludes     | OrNil\<string\>[]        | Ne         | -                               | Vyloučené soubory (vzhledem k kořenovému adresáři projektu)                  | -       |
| minify       | boolean                  | Ne         | Aktivovat ve výrobním režimu    | Komprimovat kód                                                              | -       |
| uglify       | boolean                  | Ne         | Aktivovat ve výrobním režimu    | Ošklivý kód (platí, pokud je povoleno minify)                                | -       |
| sassModule   | boolean                  | Ne         | true                            | Přepínač modulu SASS                                                         | -       |
| styleImports | boolean                  | Ne         | Otevřít při zapnutí modulu SASS | Import konvertovaných CSS souborů do JS souborů                              | -       |

```typescript
// cjs: Modul CommonJS; esm: Modul ESModule;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Konfigurace integrovaného modulu

| Atribut       | Typ                         | Požadované                | Výchozí                       | Popis                                                                        | Příklad |
| ------------- | --------------------------- | ------------------------- | ----------------------------- | ---------------------------------------------------------------------------- | ------- |
| type          | 'integration'               | Ano                       | -                             | Typ modulu                                                                   | -       |
| mode          | SdinIntegrationModuleMode   | Ne                        | 'umd'                         | Režim konstrukce modulu                                                      | -       |
| name          | string                      | Ano                       | -                             | Název modulu                                                                 | -       |
| src           | string                      | Ne                        | 'src/index.{jsx?\|tsx?}'      | Umístění vstupního zdrojového kódu (vzhledem k kořenovému adresáři projektu) | -       |
| tar           | string                      | Ne                        | 'tar/Režim konstrukce modulu' | Výstupní cílové umístění (vzhledem k kořenovému adresáři projektu)           | -       |
| entryName     | string                      | Ne                        | 'index'                       | Název vstupu modulu                                                          | -       |
| globalName    | string                      | Účinnost musí být předána | -                             | Zadejte globální název objektu exportu balíčků (platí v režimech cjs a rund) | "React" |
| minify        | boolean                     | Ne                        | Aktivovat ve výrobním režimu  | Komprimovat kód                                                              | -       |
| uglify        | boolean                     | Ne                        | Aktivovat ve výrobním režimu  | Ošklivý kód (platí, pokud je povoleno minify)                                | -       |
| externals     | Record\<string, string\>    | Ne                        | -                             | Odstranit externí moduly použité v kódu                                      | -       |
| sassModule    | boolean                     | Ne                        | true                          | Přepínač modulu SASS                                                         | -       |
| babelIncludes | OrNil\<RuleSetCondition\>[] | Ne                        | -                             | Babel kompilace obsahuje položky                                             | -       |
| babelExcludes | OrNil\<RuleSetCondition\>[] | Ne                        | -                             | Položka vyloučení kompilace Babelu                                           | -       |
| rawRule       | Partial\<RuleSetRule\>      | Ne                        | -                             | Upravit pravidla balení textu                                                | -       |
| fontRule      | Partial\<RuleSetRule\>      | Ne                        | -                             | Upravit pravidla balení písma                                                | -       |
| imageRule     | Partial\<RuleSetRule\>      | Ne                        | -                             | Upravit pravidla balení obrázků                                              | -       |
| audioRule     | Partial\<RuleSetRule\>      | Ne                        | -                             | Upravit pravidla balení zvuku                                                | -       |
| videoRule     | Partial\<RuleSetRule\>      | Ne                        | -                             | Upravit pravidla pro balení videa                                            | -       |
| rules         | OrNil\<RuleSetRule\>[]      | Ne                        | -                             | Přidat pravidla balení (může přepsat některá výchozí pravidla)               | -       |

```typescript
// cjs: Modul CommonJS; glb: Globální modul; umd: UMD modul;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// Podrobnosti naleznete na stránkách:: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// Podrobnosti naleznete na stránkách:: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Pokud jsou změněna pravidla balení, všechna pole kromě typu a generátoru. název souboru" může být změněn.

Pokud přidáte pravidla balení, můžete přepsat pravidla balení pro text, písma, obrázky, zvuk a video.

## Příkaz

### Hlavní příkaz

| Možnost   | Zkratka | Typ | Požadované | Výchozí | Popis                      | Příklad |
| --------- | ------- | --- | ---------- | ------- | -------------------------- | ------- |
| --version | -v      | -   | -          | -       | Zobrazit verzi             | sdin -v |
| --help    | -h      | -   | -          | -       | Zobrazit dokument nápovědy | sdin -h |

### `build` Příkaz

Používá se pro stavební projekty

| Parametr | Nadřazená úroveň | Typ    | Požadované | Výchozí                   | Popis                                                    | Příklad       |
| -------- | ---------------- | ------ | ---------- | ------------------------- | -------------------------------------------------------- | ------------- |
| path     | -                | string | Ne         | Aktuální pracovní adresář | Zadejte kořenový adresář projektu, který má být vytvořen | sdin build ./ |

| Možnost   | Zkratka | Typ    | Požadované | Výchozí        | Popis                                                                             | Příklad                   |
| --------- | ------- | ------ | ---------- | -------------- | --------------------------------------------------------------------------------- | ------------------------- |
| --modules | -m      | string | Ne         | Všechny moduly | Zadejte názvy modulů, které mají být sestaveny, s více položek oddělených čárkami | sdin build -m diana,elise |

### `create` Příkaz

Používá se pro vytváření projektů

| Parametr | Nadřazená úroveň | Typ    | Požadované | Výchozí | Popis                                                   | Příklad                 |
| -------- | ---------------- | ------ | ---------- | ------- | ------------------------------------------------------- | ----------------------- |
| name     | -                | string | Ne         | -       | Zadejte název balíčku pomocí symbolů "@, a-z, 0-9, -,/" | sdin create new-project |

| Možnost    | Zkratka | Typ    | Požadované | Výchozí                   | Popis                                     | Příklad                       |
| ---------- | ------- | ------ | ---------- | ------------------------- | ----------------------------------------- | ----------------------------- |
| --output   | -o      | string | Ne         | Aktuální pracovní adresář | Zadejte nadřazenou cestu pro nový projekt | sdin create -o ./             |
| --template | -t      | string | Ne         | -                         | Zadejte název šablony pro nový projekt    | sdin create -t common-package |

## Rozhraní

### readSdinConfig

Čtení konfigurace projektu

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Kořenový adresář projektu */
  root: string
}
```

### createSdinProject

Vytváření projektu

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Název šablony */
  templateName?: string
  /** Cesta ke složce, ve které je projekt uložen (výchozí: aktuální pracovní adresář) */
  projectParentPath?: string
  /** Název projektu */
  projectName?: string
  /** Verze projektu (výchozí: 0.0.1) */
  projectVersion?: string
  /** Popis projektu */
  projectDescription?: string
  /** Jméno autora (výchozí: uživatelské jméno Git) */
  authorName?: string
  /** Autor e-mailu (výchozí: Git e-mail) */
  authorEmail?: string
}
```

### buildSdinProject

Stavební projekt

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Nastavení Sdin */
  config: SdinConfig
  /** Zadejte název modulu, který má být sestaven */
  moduleNames?: string[]
}
```
