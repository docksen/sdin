# sdin

- [sdin](#sdin)
  - [Ejemplo](#ejemplo)
  - [Configuración](#configuración)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Cuartel General](#cuartel-general)
    - [Orden principal](#orden-principal)
    - [`build` Cuartel General](#build-cuartel-general)
    - [`create` Cuartel General](#create-cuartel-general)
  - [Interfaz](#interfaz)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Ejemplo

Construir un proyecto en la línea de órdenes:

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

Código de ingeniería de construcción:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Configuración

Ruta del archivo de configuración del proyecto: `pro/configs/project.ts`。

Contenido del perfil del proyecto:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Configuración del proyecto

| Atributos   | Tipo                        | Requerido | Incumplimiento de contrato | Explicación                                                              | Ejemplo               |
| ----------- | --------------------------- | --------- | -------------------------- | ------------------------------------------------------------------------ | --------------------- |
| root        | string                      | No, No.   | Catálogo de trabajo actual | Directorio raíz del proyecto                                             | -                     |
| mode        | SdinBuildMode               | No, No.   | production                 | Modelo arquitectónico                                                    | -                     |
| alias       | Record\<string, string\>    | No, No.   | -                          | Alias del módulo，\<Alias, Ruta (en relación con la raíz del proyecto)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | No, No.   | -                          | Definición global，\<Código original, Reemplazar el Código\>             | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | No, No.   | -                          | Lista de elementos de configuración del módulo                           | -                     |

```typescript
// production: Modo de producción; development: Entorno de desarrollo;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

El programa proporciona algunas definiciones globales para el proyecto y se puede usar directamente en el proyecto:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // Modelo de construcción del proyecto
  const SDIN_PROJECT_NAME: string // Nombre del proyecto
  const SDIN_PROJECT_VERSION: string // Versión del proyecto
  const SDIN_PROJECT_AUTHOR_NAME: string // Nombre del autor del proyecto
  const SDIN_PROJECT_AUTHOR_EMAIL: string // Correo electrónico del autor del proyecto
  const SDIN_MODULE_TYPE: string // En el momento de la compilación, el tipo de módulo
  const SDIN_MODULE_MODE: string // El modo de construcción del módulo durante la compilación
  const SDIN_MODULE_NAME: string // Nombre del módulo durante la compilación
}
```

### SdinDeclarationModuleParams

Definir la configuración del módulo

| Atributos | Tipo                      | Requerido | Incumplimiento de contrato            | Explicación                                                                                 | Ejemplo |
| --------- | ------------------------- | --------- | ------------------------------------- | ------------------------------------------------------------------------------------------- | ------- |
| type      | 'declaration'             | Sí, sí.   | -                                     | Tipo de módulo                                                                              | -       |
| mode      | SdinDeclarationModuleMode | No, No.   | 'dts'                                 | Modo de construcción de módulos                                                             | -       |
| name      | string                    | Sí, sí.   | -                                     | Nombre del módulo                                                                           | -       |
| src       | string                    | No, No.   | 'src'                                 | Introduzca la ubicación del código fuente (en relación con el directorio raíz del proyecto) | -       |
| tar       | string                    | No, No.   | 'tar/Modo de construcción de módulos' | Ubicación del objetivo de salida (en relación con la raíz del proyecto)                     | -       |
| includes  | OrNil\<string\>[]         | No, No.   | -                                     | Contiene archivos (en relación con la raíz del proyecto)                                    | -       |
| excludes  | OrNil\<string\>[]         | No, No.   | -                                     | Archivos excluidos (en relación con la raíz del proyecto)                                   | -       |

```typescript
// dts: Módulo de definición de tipescript;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Configuración del módulo básico

| Atributos    | Tipo                     | Requerido | Incumplimiento de contrato            | Explicación                                                                                 | Ejemplo |
| ------------ | ------------------------ | --------- | ------------------------------------- | ------------------------------------------------------------------------------------------- | ------- |
| type         | 'foundation'             | Sí, sí.   | -                                     | Tipo de módulo                                                                              | -       |
| mode         | SdinFoundationModuleMode | No, No.   | 'cjs'                                 | Modo de construcción de módulos                                                             | -       |
| name         | string                   | Sí, sí.   | -                                     | Nombre del módulo                                                                           | -       |
| src          | string                   | No, No.   | 'src'                                 | Introduzca la ubicación del código fuente (en relación con el directorio raíz del proyecto) | -       |
| tar          | string                   | No, No.   | 'tar/Modo de construcción de módulos' | Ubicación del objetivo de salida (en relación con la raíz del proyecto)                     | -       |
| includes     | OrNil\<string\>[]        | No, No.   | -                                     | Contiene archivos (en relación con la raíz del proyecto)                                    | -       |
| excludes     | OrNil\<string\>[]        | No, No.   | -                                     | Archivos excluidos (en relación con la raíz del proyecto)                                   | -       |
| minify       | boolean                  | No, No.   | Activado en modo de producción        | Código comprimido                                                                           | -       |
| uglify       | boolean                  | No, No.   | Activado en modo de producción        | Código feo (habilitar la reducción de horas es válido)                                      | -       |
| sassModule   | boolean                  | No, No.   | true                                  | Interruptor del módulo Sass                                                                 | -       |
| styleImports | boolean                  | No, No.   | Se abre cuando se abre el módulo Sass | Importar el archivo CSS convertido en un archivo js                                         | -       |

```typescript
// cjs: Módulo commonjs; esm: Módulo esmodule;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Configuración del módulo integrado

| Atributos     | Tipo                        | Requerido                            | Incumplimiento de contrato            | Explicación                                                                                 | Ejemplo |
| ------------- | --------------------------- | ------------------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------- | ------- |
| type          | 'integration'               | Sí, sí.                              | -                                     | Tipo de módulo                                                                              | -       |
| mode          | SdinIntegrationModuleMode   | No, No.                              | 'umd'                                 | Modo de construcción de módulos                                                             | -       |
| name          | string                      | Sí, sí.                              | -                                     | Nombre del módulo                                                                           | -       |
| src           | string                      | No, No.                              | 'src/index.{jsx?\|tsx?}'              | Introduzca la ubicación del código fuente (en relación con el directorio raíz del proyecto) | -       |
| tar           | string                      | No, No.                              | 'tar/Modo de construcción de módulos' | Ubicación del objetivo de salida (en relación con la raíz del proyecto)                     | -       |
| entryName     | string                      | No, No.                              | 'index'                               | Nombre de la entrada del módulo                                                             | -       |
| globalName    | string                      | Debe transmitirse información válida | -                                     | Especifica el nombre global del objeto exportado por el paquete (válido en modo cjs y umd)  | "React" |
| minify        | boolean                     | No, No.                              | Activado en modo de producción        | Código comprimido                                                                           | -       |
| uglify        | boolean                     | No, No.                              | Activado en modo de producción        | Código feo (habilitar la reducción de horas es válido)                                      | -       |
| externals     | Record\<string, string\>    | No, No.                              | -                                     | Eliminar los módulos externos utilizados en el Código                                       | -       |
| sassModule    | boolean                     | No, No.                              | true                                  | Interruptor del módulo Sass                                                                 | -       |
| babelIncludes | OrNil\<RuleSetCondition\>[] | No, No.                              | -                                     | La compilación Babel incluye proyectos                                                      | -       |
| babelExcludes | OrNil\<RuleSetCondition\>[] | No, No.                              | -                                     | Exclusión de compilación Babel                                                              | -       |
| rawRule       | Partial\<RuleSetRule\>      | No, No.                              | -                                     | Modificar las reglas de empaquetado de texto                                                | -       |
| fontRule      | Partial\<RuleSetRule\>      | No, No.                              | -                                     | Modificar las reglas de embalaje de la fuente                                               | -       |
| imageRule     | Partial\<RuleSetRule\>      | No, No.                              | -                                     | Modificar las reglas de empaquetado de imágenes                                             | -       |
| audioRule     | Partial\<RuleSetRule\>      | No, No.                              | -                                     | Modificar las reglas de embalaje de audio                                                   | -       |
| videoRule     | Partial\<RuleSetRule\>      | No, No.                              | -                                     | Modificar las reglas de empaquetado de vídeo                                                | -       |
| rules         | OrNil\<RuleSetRule\>[]      | No, No.                              | -                                     | Añadir reglas de embalaje (se pueden sobreescribir algunas reglas predeterminadas)          | -       |

```typescript
// cjs: Módulo commonjs; glb: Módulo global; umd: Módulo UMD;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// Para más detalles, consulte: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// Para más detalles, consulte: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Si se modifican las reglas de embalaje, todos los campos excepto "tipo" y "generador". El "nombre del archivo" se puede modificar.

Si se añaden reglas de embalaje, se pueden cubrir las reglas de embalaje de texto, fuente, imagen, audio y video.

## Cuartel General

### Orden principal

| Opciones  | Siglas | Tipo | Requerido | Incumplimiento de contrato | Explicación             | Ejemplo |
| --------- | ------ | ---- | --------- | -------------------------- | ----------------------- | ------- |
| --version | -v     | -    | -         | -                          | Ver la versión          | sdin -v |
| --help    | -h     | -    | -         | -                          | Ver Documentos de ayuda | sdin -h |

### `build` Cuartel General

Para proyectos de construcción

| Parámetros | Senior | Tipo   | Requerido | Incumplimiento de contrato | Explicación                                          | Ejemplo       |
| ---------- | ------ | ------ | --------- | -------------------------- | ---------------------------------------------------- | ------------- |
| path       | -      | string | No, No.   | Catálogo de trabajo actual | Especifica el directorio raíz del proyecto a generar | sdin build ./ |

| Opciones  | Siglas | Tipo   | Requerido | Incumplimiento de contrato | Explicación                                                                           | Ejemplo                   |
| --------- | ------ | ------ | --------- | -------------------------- | ------------------------------------------------------------------------------------- | ------------------------- |
| --modules | -m     | string | No, No.   | Todos los módulos          | Especifica el nombre del módulo a construir, con varios proyectos separados por comas | sdin build -m diana,elise |

### `create` Cuartel General

Para crear proyectos

| Parámetros | Senior | Tipo   | Requerido | Incumplimiento de contrato | Explicación                                                                      | Ejemplo                 |
| ---------- | ------ | ------ | --------- | -------------------------- | -------------------------------------------------------------------------------- | ----------------------- |
| name       | -      | string | No, No.   | -                          | Use los símbolos "@, a - z, 0 - 9, - y /" para especificar el nombre del paquete | sdin create new-project |

| Opciones   | Siglas | Tipo   | Requerido | Incumplimiento de contrato | Explicación                                                 | Ejemplo                       |
| ---------- | ------ | ------ | --------- | -------------------------- | ----------------------------------------------------------- | ----------------------------- |
| --output   | -o     | string | No, No.   | Catálogo de trabajo actual | Especifica la ruta padre del nuevo proyecto                 | sdin create -o ./             |
| --template | -t     | string | No, No.   | -                          | Especifica el nombre de la plantilla para el nuevo proyecto | sdin create -t common-package |

## Interfaz

### readSdinConfig

Leer la configuración del proyecto

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Directorio raíz del proyecto */
  root: string
}
```

### createSdinProject

Crear proyecto

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Nombre de la plantilla */
  templateName?: string
  /** Ruta de la carpeta para almacenar el proyecto (predeterminada: catálogo de trabajo actual) */
  projectParentPath?: string
  /** Nombre del proyecto */
  projectName?: string
  /** Versión del proyecto (valor predeterminado: 0.0.1) */
  projectVersion?: string
  /** Descripción del proyecto */
  projectDescription?: string
  /** Nombre del autor (predeterminado: nombre de usuario git) */
  authorName?: string
  /** Correo electrónico del autor (predeterminado: correo electrónico git) */
  authorEmail?: string
}
```

### buildSdinProject

Obras de construcción

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Configuración sdin */
  config: SdinConfig
  /** Especifica el nombre del módulo a construir */
  moduleNames?: string[]
}
```
