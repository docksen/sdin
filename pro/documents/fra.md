# sdin

- [sdin](#sdin)
  - [Exemples](#exemples)
  - [Configuration](#configuration)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Commandement](#commandement)
    - [La commande principale](#la-commande-principale)
    - [`build` Commandement](#build-commandement)
    - [`create` Commandement](#create-commandement)
  - [Interface](#interface)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Exemples

Construire un projet sur la ligne de commande:

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

Code des travaux de construction:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Configuration

Chemin du fichier de configuration du projet: `pro/configs/project.ts`。

Contenu du fichier de configuration du projet:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Configuration du projet

| Propriétés  | Type                        | Demandé | Violation                    | Description                                                            | Exemples              |
| ----------- | --------------------------- | ------- | ---------------------------- | ---------------------------------------------------------------------- | --------------------- |
| root        | string                      | Non     | Répertoire de travail actuel | Répertoire racine du projet                                            | -                     |
| mode        | SdinBuildMode               | Non     | production                   | Modèle de construction                                                 | -                     |
| alias       | Record\<string, string\>    | Non     | -                            | Alias du module，\<Alias, Chemin (par rapport à la racine du projet)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | Non     | -                            | Définition globale，\<Code original, Remplacer le Code\>               | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | Non     | -                            | Liste des éléments de configuration du module                          | -                     |

```typescript
// production: Mode de production; development: Environnement de développement;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

Le programme fournit quelques définitions globales du projet qui peuvent être utilisées directement dans le projet:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // Modèle de construction de projet
  const SDIN_PROJECT_NAME: string // Nom du projet
  const SDIN_PROJECT_VERSION: string // Version du projet
  const SDIN_PROJECT_AUTHOR_NAME: string // Nom de l'auteur du projet
  const SDIN_PROJECT_AUTHOR_EMAIL: string // Email de l'auteur du projet
  const SDIN_MODULE_TYPE: string // Au moment de la compilation, le type de module
  const SDIN_MODULE_MODE: string // Mode de construction du module pendant la compilation
  const SDIN_MODULE_NAME: string // Nom du module pendant la compilation
}
```

### SdinDeclarationModuleParams

Définir la configuration du module

| Propriétés | Type                      | Demandé | Violation                            | Description                                                                | Exemples |
| ---------- | ------------------------- | ------- | ------------------------------------ | -------------------------------------------------------------------------- | -------- |
| type       | 'declaration'             | Oui     | -                                    | Types de modules                                                           | -        |
| mode       | SdinDeclarationModuleMode | Non     | 'dts'                                | Mode de construction du module                                             | -        |
| name       | string                    | Oui     | -                                    | Nom du module                                                              | -        |
| src        | string                    | Non     | 'src'                                | Emplacement pour entrer le code source (par rapport à la racine du projet) | -        |
| tar        | string                    | Non     | 'tar/Mode de construction du module' | Emplacement de destination de sortie (par rapport à la racine du projet)   | -        |
| includes   | OrNil\<string\>[]         | Non     | -                                    | Contient des fichiers (par rapport à la racine du projet)                  | -        |
| excludes   | OrNil\<string\>[]         | Non     | -                                    | Fichiers exclus (par rapport au Répertoire racine du projet)               | -        |

```typescript
// dts: Module de définition Typescript;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Configuration du module de base

| Propriétés   | Type                     | Demandé | Violation                                   | Description                                                                | Exemples |
| ------------ | ------------------------ | ------- | ------------------------------------------- | -------------------------------------------------------------------------- | -------- |
| type         | 'foundation'             | Oui     | -                                           | Types de modules                                                           | -        |
| mode         | SdinFoundationModuleMode | Non     | 'cjs'                                       | Mode de construction du module                                             | -        |
| name         | string                   | Oui     | -                                           | Nom du module                                                              | -        |
| src          | string                   | Non     | 'src'                                       | Emplacement pour entrer le code source (par rapport à la racine du projet) | -        |
| tar          | string                   | Non     | 'tar/Mode de construction du module'        | Emplacement de destination de sortie (par rapport à la racine du projet)   | -        |
| includes     | OrNil\<string\>[]        | Non     | -                                           | Contient des fichiers (par rapport à la racine du projet)                  | -        |
| excludes     | OrNil\<string\>[]        | Non     | -                                           | Fichiers exclus (par rapport au Répertoire racine du projet)               | -        |
| minify       | boolean                  | Non     | Activé en mode production                   | Code de compression                                                        | -        |
| uglify       | boolean                  | Non     | Activé en mode production                   | Code laid (activer la réduction d'heure valide)                            | -        |
| sassModule   | boolean                  | Non     | true                                        | Commutateur de module Sass                                                 | -        |
| styleImports | boolean                  | Non     | Le module Sass s'ouvre lorsqu'il est ouvert | Importer le fichier CSS converti dans un fichier JS                        | -        |

```typescript
// cjs: Le module commonjs; esm: Le module esmodule;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Configuration du module intégré

| Propriétés    | Type                        | Demandé                                          | Violation                            | Description                                                                            | Exemples |
| ------------- | --------------------------- | ------------------------------------------------ | ------------------------------------ | -------------------------------------------------------------------------------------- | -------- |
| type          | 'integration'               | Oui                                              | -                                    | Types de modules                                                                       | -        |
| mode          | SdinIntegrationModuleMode   | Non                                              | 'umd'                                | Mode de construction du module                                                         | -        |
| name          | string                      | Oui                                              | -                                    | Nom du module                                                                          | -        |
| src           | string                      | Non                                              | 'src/index.{jsx?\|tsx?}'             | Emplacement pour entrer le code source (par rapport à la racine du projet)             | -        |
| tar           | string                      | Non                                              | 'tar/Mode de construction du module' | Emplacement de destination de sortie (par rapport à la racine du projet)               | -        |
| entryName     | string                      | Non                                              | 'index'                              | Nom de l'entrée du module                                                              | -        |
| globalName    | string                      | Les informations valides doivent être transmises | -                                    | Spécifie le nom global de l'objet d'exportation du paquet (valide en mode cjs et UMD)  | "React"  |
| minify        | boolean                     | Non                                              | Activé en mode production            | Code de compression                                                                    | -        |
| uglify        | boolean                     | Non                                              | Activé en mode production            | Code laid (activer la réduction d'heure valide)                                        | -        |
| externals     | Record\<string, string\>    | Non                                              | -                                    | Supprimer les modules externes utilisés dans le Code                                   | -        |
| sassModule    | boolean                     | Non                                              | true                                 | Commutateur de module Sass                                                             | -        |
| babelIncludes | OrNil\<RuleSetCondition\>[] | Non                                              | -                                    | Babel compilation inclut des projets                                                   | -        |
| babelExcludes | OrNil\<RuleSetCondition\>[] | Non                                              | -                                    | Babel compile les exclusions                                                           | -        |
| rawRule       | Partial\<RuleSetRule\>      | Non                                              | -                                    | Modifier les règles d'empaquetage de texte                                             | -        |
| fontRule      | Partial\<RuleSetRule\>      | Non                                              | -                                    | Modifier les règles d'empaquetage des polices                                          | -        |
| imageRule     | Partial\<RuleSetRule\>      | Non                                              | -                                    | Modifier les règles d'empaquetage des images                                           | -        |
| audioRule     | Partial\<RuleSetRule\>      | Non                                              | -                                    | Modifier les règles de Packaging audio                                                 | -        |
| videoRule     | Partial\<RuleSetRule\>      | Non                                              | -                                    | Modifier les règles de Packaging vidéo                                                 | -        |
| rules         | OrNil\<RuleSetRule\>[]      | Non                                              | -                                    | Ajouter des règles d'empaquetage (certaines règles par défaut peuvent être remplacées) | -        |

```typescript
// cjs: Le module commonjs; glb: Module global; umd: Le module UMD;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// Voir détails: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// Voir détails: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Tous les champs sauf "type" et "générateur" si la règle d'empaquetage est modifiée. Le "nom du fichier" peut être modifié.

Si vous ajoutez des règles d'empaquetage, vous pouvez remplacer les règles d'empaquetage pour le texte, les polices, les images, l'audio et la vidéo.

## Commandement

### La commande principale

| Options   | Abréviations | Type | Demandé | Violation | Description               | Exemples |
| --------- | ------------ | ---- | ------- | --------- | ------------------------- | -------- |
| --version | -v           | -    | -       | -         | Voir la version           | sdin -v  |
| --help    | -h           | -    | -       | -         | Voir les documents d'aide | sdin -h  |

### `build` Commandement

Pour les projets de construction

| Paramètres | Niveau des parents | Type   | Demandé | Violation                    | Description                                       | Exemples      |
| ---------- | ------------------ | ------ | ------- | ---------------------------- | ------------------------------------------------- | ------------- |
| path       | -                  | string | Non     | Répertoire de travail actuel | Spécifie le Répertoire racine du projet à générer | sdin build ./ |

| Options   | Abréviations | Type   | Demandé | Violation        | Description                                                                        | Exemples                  |
| --------- | ------------ | ------ | ------- | ---------------- | ---------------------------------------------------------------------------------- | ------------------------- |
| --modules | -m           | string | Non     | Tous les modules | Spécifie le nom du module à construire, plusieurs projets séparés par des virgules | sdin build -m diana,elise |

### `create` Commandement

Pour créer un projet

| Paramètres | Niveau des parents | Type   | Demandé | Violation | Description                                                          | Exemples                |
| ---------- | ------------------ | ------ | ------- | --------- | -------------------------------------------------------------------- | ----------------------- |
| name       | -                  | string | Non     | -         | Spécifiez le nom du paquet avec les symboles "@, a - Z, 0 - 9, -, /" | sdin create new-project |

| Options    | Abréviations | Type   | Demandé | Violation                    | Description                                       | Exemples                      |
| ---------- | ------------ | ------ | ------- | ---------------------------- | ------------------------------------------------- | ----------------------------- |
| --output   | -o           | string | Non     | Répertoire de travail actuel | Spécifie le chemin parent du nouveau projet       | sdin create -o ./             |
| --template | -t           | string | Non     | -                            | Spécifiez le nom du modèle pour le nouveau projet | sdin create -t common-package |

## Interface

### readSdinConfig

Lire la configuration du projet

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Répertoire racine du projet */
  root: string
}
```

### createSdinProject

Créer un projet

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Nom du modèle */
  templateName?: string
  /** Chemin du dossier dans lequel le projet est stocké (par défaut: Répertoire de travail actuel) */
  projectParentPath?: string
  /** Nom du projet */
  projectName?: string
  /** Version du projet (par défaut: 0.0.1) */
  projectVersion?: string
  /** Description du projet */
  projectDescription?: string
  /** Nom de l'auteur (par défaut: nom d'utilisateur GIT) */
  authorName?: string
  /** Email de l'auteur (par défaut: GIT email) */
  authorEmail?: string
}
```

### buildSdinProject

Travaux de construction

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Configuration de sdin */
  config: SdinConfig
  /** Spécifie le nom du module à construire */
  moduleNames?: string[]
}
```
