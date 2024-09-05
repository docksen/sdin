# sdin

- [sdin](#sdin)
  - [Esimerkki](#esimerkki)
  - [Asetus](#asetus)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Komento](#komento)
    - [Pääkomento](#pääkomento)
    - [`build` Komento](#build-komento)
    - [`create` Komento](#create-komento)
  - [Liitäntä](#liitäntä)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Esimerkki

Rakennusprojekti komentorivillä:

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

Rakennushanke koodilla:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Asetus

Projektin asetustiedostopolku: `pro/configs/project.ts`。

Projektin asetustiedoston sisältö:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Projektin asetukset

| Attribuutti | Tyyppi                      | Pakollinen | Oletus             | Kuvaus                                                             | Esimerkki             |
| ----------- | --------------------------- | ---------- | ------------------ | ------------------------------------------------------------------ | --------------------- |
| root        | string                      | Ei         | Nykyinen työkansio | Projektin pääkansio                                                | -                     |
| mode        | SdinBuildMode               | Ei         | production         | Rakennusmalli                                                      | -                     |
| alias       | Record\<string, string\>    | Ei         | -                  | Moduulin alias，\<Alias, Polku (suhteessa projektin pääkansioon)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | Ei         | -                  | Yleinen määritelmä，\<Alkuperäinen koodi, Korvattu koodi\>         | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | Ei         | -                  | Moduulin määritystietoluettelo                                     | -                     |

```typescript
// production: Tuotantotapa; development: Kehitysyhteistyö;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

Ohjelma on antanut joitakin globaaleja määritelmiä projektille, joita voidaan käyttää suoraan hankkeessa:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // Hankkeen rakennustapa
  const SDIN_PROJECT_NAME: string // Projektin nimi
  const SDIN_PROJECT_VERSION: string // Projektin versio
  const SDIN_PROJECT_AUTHOR_NAME: string // Projektin tekijän nimi
  const SDIN_PROJECT_AUTHOR_EMAIL: string // Projektin tekijän sähköposti
  const SDIN_MODULE_TYPE: string // Kääntämisaikana moduulin tyyppi
  const SDIN_MODULE_MODE: string // Moduulien rakennustapa kokoamisen aikana
  const SDIN_MODULE_NAME: string // Moduulin nimi kokoamisen aikana
}
```

### SdinDeclarationModuleParams

Määritä moduulin asetukset

| Attribuutti | Tyyppi                    | Pakollinen | Oletus                      | Kuvaus                                                               | Esimerkki |
| ----------- | ------------------------- | ---------- | --------------------------- | -------------------------------------------------------------------- | --------- |
| type        | 'declaration'             | Kyllä      | -                           | Moduulityyppi                                                        | -         |
| mode        | SdinDeclarationModuleMode | Ei         | 'dts'                       | Moduulin rakennustapa                                                | -         |
| name        | string                    | Kyllä      | -                           | Moduulin nimi                                                        | -         |
| src         | string                    | Ei         | 'src'                       | Syötteen lähdekoodin sijainti (suhteessa projektin juurihakemistoon) | -         |
| tar         | string                    | Ei         | 'tar/Moduulin rakennustapa' | Tulostuksen kohdesijainti (suhteessa projektin pääkansioon)          | -         |
| includes    | OrNil\<string\>[]         | Ei         | -                           | Sisältää tiedostoja (suhteessa projektin pääkansioon)                | -         |
| excludes    | OrNil\<string\>[]         | Ei         | -                           | Poistetut tiedostot (suhteessa projektin pääkansioon)                | -         |

```typescript
// dts: TypeScript Definition Module;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Moduulin perusasetukset

| Attribuutti  | Tyyppi                   | Pakollinen | Oletus                           | Kuvaus                                                               | Esimerkki |
| ------------ | ------------------------ | ---------- | -------------------------------- | -------------------------------------------------------------------- | --------- |
| type         | 'foundation'             | Kyllä      | -                                | Moduulityyppi                                                        | -         |
| mode         | SdinFoundationModuleMode | Ei         | 'cjs'                            | Moduulin rakennustapa                                                | -         |
| name         | string                   | Kyllä      | -                                | Moduulin nimi                                                        | -         |
| src          | string                   | Ei         | 'src'                            | Syötteen lähdekoodin sijainti (suhteessa projektin juurihakemistoon) | -         |
| tar          | string                   | Ei         | 'tar/Moduulin rakennustapa'      | Tulostuksen kohdesijainti (suhteessa projektin pääkansioon)          | -         |
| includes     | OrNil\<string\>[]        | Ei         | -                                | Sisältää tiedostoja (suhteessa projektin pääkansioon)                | -         |
| excludes     | OrNil\<string\>[]        | Ei         | -                                | Poistetut tiedostot (suhteessa projektin pääkansioon)                | -         |
| minify       | boolean                  | Ei         | Aktivoi tuotantotilassa          | Pakkauskoodi                                                         | -         |
| uglify       | boolean                  | Ei         | Aktivoi tuotantotilassa          | Ruma koodi (kelvollinen, kun minify on käytössä)                     | -         |
| sassModule   | boolean                  | Ei         | true                             | SASS-moduulikytkin                                                   | -         |
| styleImports | boolean                  | Ei         | Avaa, kun SASS-moduuli on päällä | Tuo muunnetut CSS-tiedostot JS-tiedostoiksi                          | -         |

```typescript
// cjs: CommonJS- moduuli; esm: ESModule-moduuli;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Integroitu moduulikokoonpano

| Attribuutti   | Tyyppi                      | Pakollinen              | Oletus                      | Kuvaus                                                                      | Esimerkki |
| ------------- | --------------------------- | ----------------------- | --------------------------- | --------------------------------------------------------------------------- | --------- |
| type          | 'integration'               | Kyllä                   | -                           | Moduulityyppi                                                               | -         |
| mode          | SdinIntegrationModuleMode   | Ei                      | 'umd'                       | Moduulin rakennustapa                                                       | -         |
| name          | string                      | Kyllä                   | -                           | Moduulin nimi                                                               | -         |
| src           | string                      | Ei                      | 'src/index.{jsx?\|tsx?}'    | Syötteen lähdekoodin sijainti (suhteessa projektin juurihakemistoon)        | -         |
| tar           | string                      | Ei                      | 'tar/Moduulin rakennustapa' | Tulostuksen kohdesijainti (suhteessa projektin pääkansioon)                 | -         |
| entryName     | string                      | Ei                      | 'index'                     | Moduulin sisäänkäynnin nimi                                                 | -         |
| globalName    | string                      | Tehokas on toimitettava | -                           | Määritä paketin vientiobjektin yleinen nimi (voimassa cjs- ja umd-tiloissa) | "React"   |
| minify        | boolean                     | Ei                      | Aktivoi tuotantotilassa     | Pakkauskoodi                                                                | -         |
| uglify        | boolean                     | Ei                      | Aktivoi tuotantotilassa     | Ruma koodi (kelvollinen, kun minify on käytössä)                            | -         |
| externals     | Record\<string, string\>    | Ei                      | -                           | Poista koodissa käytetyt ulkoiset moduulit                                  | -         |
| sassModule    | boolean                     | Ei                      | true                        | SASS-moduulikytkin                                                          | -         |
| babelIncludes | OrNil\<RuleSetCondition\>[] | Ei                      | -                           | Babelin kokoelma sisältää nimikkeitä                                        | -         |
| babelExcludes | OrNil\<RuleSetCondition\>[] | Ei                      | -                           | Babelin kokoamisen poissulkemiskohta                                        | -         |
| rawRule       | Partial\<RuleSetRule\>      | Ei                      | -                           | Tekstinpakkaussääntöjen muuttaminen                                         | -         |
| fontRule      | Partial\<RuleSetRule\>      | Ei                      | -                           | Muokkaa kirjasinten pakkaussääntöjä                                         | -         |
| imageRule     | Partial\<RuleSetRule\>      | Ei                      | -                           | Kuvapakkaussääntöjen muuttaminen                                            | -         |
| audioRule     | Partial\<RuleSetRule\>      | Ei                      | -                           | Äänipakkaussääntöjen muuttaminen                                            | -         |
| videoRule     | Partial\<RuleSetRule\>      | Ei                      | -                           | Videopakkausten sääntöjen muuttaminen                                       | -         |
| rules         | OrNil\<RuleSetRule\>[]      | Ei                      | -                           | Lisää pakkaussääntöjä (voi ohittaa joitakin oletussääntöjä)                 | -         |

```typescript
// cjs: CommonJS- moduuli; glb: Globaali moduuli; umd: UMD-moduuli;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// Lisätietoja on seuraavassa osoitteessa:: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// Lisätietoja on seuraavassa osoitteessa:: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Jos pakkaussääntöjä muutetaan, kaikki kentät lukuun ottamatta "tyyppi" ja "generaattori". filename' voidaan muokata.

Jos lisäät pakkaussääntöjä, voit ohittaa tekstin, fonttien, kuvien, äänen ja videon pakkaussäännöt.

## Komento

### Pääkomento

| Vaihtoehto | Lyhenne | Tyyppi | Pakollinen | Oletus | Kuvaus              | Esimerkki |
| ---------- | ------- | ------ | ---------- | ------ | ------------------- | --------- |
| --version  | -v      | -      | -          | -      | Näytä versio        | sdin -v   |
| --help     | -h      | -      | -          | -      | Näytä ohjeasiakirja | sdin -h   |

### `build` Komento

Käytetään rakennushankkeissa

| Parametri | Emotaso | Tyyppi | Pakollinen | Oletus             | Kuvaus                                    | Esimerkki     |
| --------- | ------- | ------ | ---------- | ------------------ | ----------------------------------------- | ------------- |
| path      | -       | string | Ei         | Nykyinen työkansio | Määritä rakennettavan projektin pääkansio | sdin build ./ |

| Vaihtoehto | Lyhenne | Tyyppi | Pakollinen | Oletus          | Kuvaus                                                                             | Esimerkki                 |
| ---------- | ------- | ------ | ---------- | --------------- | ---------------------------------------------------------------------------------- | ------------------------- |
| --modules  | -m      | string | Ei         | Kaikki moduulit | Määritä rakennettavien moduulien nimet, joissa useita kohteita erotetaan pilkuilla | sdin build -m diana,elise |

### `create` Komento

Käytetään hankkeiden luomiseen

| Parametri | Emotaso | Tyyppi | Pakollinen | Oletus | Kuvaus                                             | Esimerkki               |
| --------- | ------- | ------ | ---------- | ------ | -------------------------------------------------- | ----------------------- |
| name      | -       | string | Ei         | -      | Määritä paketin nimi tunnuksilla "@, a-z, 0-9, ,/" | sdin create new-project |

| Vaihtoehto | Lyhenne | Tyyppi | Pakollinen | Oletus             | Kuvaus                              | Esimerkki                     |
| ---------- | ------- | ------ | ---------- | ------------------ | ----------------------------------- | ----------------------------- |
| --output   | -o      | string | Ei         | Nykyinen työkansio | Määritä uuden projektin pääpolku    | sdin create -o ./             |
| --template | -t      | string | Ei         | -                  | Määritä uuden projektin mallin nimi | sdin create -t common-package |

## Liitäntä

### readSdinConfig

Luetaan projektin asetuksia

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Projektin pääkansio */
  root: string
}
```

### createSdinProject

Luodaan projekti

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Mallin nimi */
  templateName?: string
  /** Kansiopolku, johon projekti on tallennettu (oletus: nykyinen työkansio) */
  projectParentPath?: string
  /** Projektin nimi */
  projectName?: string
  /** Projektin versio (oletus: 0. 0. 1) */
  projectVersion?: string
  /** Hankkeen kuvaus */
  projectDescription?: string
  /** Tekijän nimi (oletus: Git-käyttäjätunnus) */
  authorName?: string
  /** Kirjoittajan sähköposti (oletus: Git- sähköposti) */
  authorEmail?: string
}
```

### buildSdinProject

Rakennushanke

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Sdin- asetukset */
  config: SdinConfig
  /** Määritä rakennettavan moduulin nimi */
  moduleNames?: string[]
}
```
