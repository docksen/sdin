# sdin

- [sdin](#sdin)
  - [Exemplo](#exemplo)
  - [Configuração](#configuração)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Comando](#comando)
    - [Comando principal](#comando-principal)
    - [`build` Comando](#build-comando)
    - [`create` Comando](#create-comando)
  - [Interface](#interface)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Exemplo

Projecto de construção na linha de comandos:

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

Projecto de construção em código:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Configuração

A localização do ficheiro de configuração do projecto: `pro/configs/project.ts`。

O conteúdo do ficheiro de configuração do projecto:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Configuração do Projecto

| Atributo    | Tipo                        | Obrigatório | Predefinição             | Descrição                                                                     | Exemplo               |
| ----------- | --------------------------- | ----------- | ------------------------ | ----------------------------------------------------------------------------- | --------------------- |
| root        | string                      | Não         | Pasta de trabalho actual | Pasta raiz do projecto                                                        | -                     |
| mode        | SdinBuildMode               | Não         | production               | Padrão de construção                                                          | -                     |
| alias       | Record\<string, string\>    | Não         | -                        | Alinome do módulo，\<Alias, Localização (relativa à pasta raiz do projecto)\> | {utils: "src/utils" } |
| definitions | Record<string, string>      | Não         | -                        | Definição Global，\<Código original, Código substituído\>                     | -                     |
| modules     | OrNil\<SdinModuleParams\>[] | Não         | -                        | Lista de itens de configuração do módulo                                      | -                     |

```typescript
// production: Modo de produção; development: Ambiente de desenvolvimento;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

O programa forneceu algumas definições globais para o projeto, que podem ser usadas diretamente no projeto:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // O modo de construção do projecto
  const SDIN_PROJECT_NAME: string // Nome do projecto
  const SDIN_PROJECT_VERSION: string // Versão do projecto
  const SDIN_PROJECT_AUTHOR_NAME: string // Nome do autor do projecto
  const SDIN_PROJECT_AUTHOR_EMAIL: string // E- mail do autor do projecto
  const SDIN_MODULE_TYPE: string // No momento da compilação, o tipo de módulo
  const SDIN_MODULE_MODE: string // O modo de construção dos módulos durante a compilação
  const SDIN_MODULE_NAME: string // Nome do módulo durante a compilação
}
```

### SdinDeclarationModuleParams

Definir a configuração do módulo

| Atributo | Tipo                      | Obrigatório | Predefinição                       | Descrição                                                                        | Exemplo |
| -------- | ------------------------- | ----------- | ---------------------------------- | -------------------------------------------------------------------------------- | ------- |
| type     | 'declaration'             | Sim         | -                                  | Tipo de módulo                                                                   | -       |
| mode     | SdinDeclarationModuleMode | Não         | 'dts'                              | Modo de construção do módulo                                                     | -       |
| name     | string                    | Sim         | -                                  | Nome do Módulo                                                                   | -       |
| src      | string                    | Não         | 'src'                              | A localização do código fonte de entrada (relativo ao diretório raiz do projeto) | -       |
| tar      | string                    | Não         | 'tar/Modo de construção do módulo' | Local de destino de saída (relativo ao diretório raiz do projeto)                | -       |
| includes | OrNil\<string\>[]         | Não         | -                                  | Contém ficheiros (relativos ao directório raiz do projecto)                      | -       |
| excludes | OrNil\<string\>[]         | Não         | -                                  | Arquivos excluídos (relativos ao diretório raiz do projeto)                      | -       |

```typescript
// dts: Módulo de Definição do TypeScript;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Configuração básica do módulo

| Atributo     | Tipo                     | Obrigatório | Predefinição                           | Descrição                                                                        | Exemplo |
| ------------ | ------------------------ | ----------- | -------------------------------------- | -------------------------------------------------------------------------------- | ------- |
| type         | 'foundation'             | Sim         | -                                      | Tipo de módulo                                                                   | -       |
| mode         | SdinFoundationModuleMode | Não         | 'cjs'                                  | Modo de construção do módulo                                                     | -       |
| name         | string                   | Sim         | -                                      | Nome do Módulo                                                                   | -       |
| src          | string                   | Não         | 'src'                                  | A localização do código fonte de entrada (relativo ao diretório raiz do projeto) | -       |
| tar          | string                   | Não         | 'tar/Modo de construção do módulo'     | Local de destino de saída (relativo ao diretório raiz do projeto)                | -       |
| includes     | OrNil\<string\>[]        | Não         | -                                      | Contém ficheiros (relativos ao directório raiz do projecto)                      | -       |
| excludes     | OrNil\<string\>[]        | Não         | -                                      | Arquivos excluídos (relativos ao diretório raiz do projeto)                      | -       |
| minify       | boolean                  | Não         | Activar no modo de produção            | Código de compressão                                                             | -       |
| uglify       | boolean                  | Não         | Activar no modo de produção            | Código feio (válido quando o minify está ativado)                                | -       |
| sassModule   | boolean                  | Não         | true                                   | Interruptor do módulo SASS                                                       | -       |
| styleImports | boolean                  | Não         | Abrir quando o módulo SASS está ligado | Importar ficheiros CSS convertidos para ficheiros JS                             | -       |

```typescript
// cjs: Módulo CommonJS; esm: Módulo ESModule;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Configuração integrada do módulo

| Atributo      | Tipo                        | Obrigatório                      | Predefinição                       | Descrição                                                                                | Exemplo |
| ------------- | --------------------------- | -------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------- | ------- |
| type          | 'integration'               | Sim                              | -                                  | Tipo de módulo                                                                           | -       |
| mode          | SdinIntegrationModuleMode   | Não                              | 'umd'                              | Modo de construção do módulo                                                             | -       |
| name          | string                      | Sim                              | -                                  | Nome do Módulo                                                                           | -       |
| src           | string                      | Não                              | 'src/index.{jsx?\|tsx?}'           | A localização do código fonte de entrada (relativo ao diretório raiz do projeto)         | -       |
| tar           | string                      | Não                              | 'tar/Modo de construção do módulo' | Local de destino de saída (relativo ao diretório raiz do projeto)                        | -       |
| entryName     | string                      | Não                              | 'index'                            | Nome da entrada do módulo                                                                | -       |
| globalName    | string                      | Devem ser transmitidos efectivos | -                                  | Especifique o nome global do objeto de exportação do pacote (válido nos modos cjs e umd) | "React" |
| minify        | boolean                     | Não                              | Activar no modo de produção        | Código de compressão                                                                     | -       |
| uglify        | boolean                     | Não                              | Activar no modo de produção        | Código feio (válido quando o minify está ativado)                                        | -       |
| externals     | Record\<string, string\>    | Não                              | -                                  | Remover os módulos externos usados no código                                             | -       |
| sassModule    | boolean                     | Não                              | true                               | Interruptor do módulo SASS                                                               | -       |
| babelIncludes | OrNil\<RuleSetCondition\>[] | Não                              | -                                  | A compilação do Babel inclui itens                                                       | -       |
| babelExcludes | OrNil\<RuleSetCondition\>[] | Não                              | -                                  | Item de exclusão da compilação do Babel                                                  | -       |
| rawRule       | Partial\<RuleSetRule\>      | Não                              | -                                  | Modificar as regras de embalagem de texto                                                | -       |
| fontRule      | Partial\<RuleSetRule\>      | Não                              | -                                  | Modificar as regras de embalagem do tipo de letra                                        | -       |
| imageRule     | Partial\<RuleSetRule\>      | Não                              | -                                  | Modificar as regras de embalagem das imagens                                             | -       |
| audioRule     | Partial\<RuleSetRule\>      | Não                              | -                                  | Modificar as regras de embalagem de áudio                                                | -       |
| videoRule     | Partial\<RuleSetRule\>      | Não                              | -                                  | Modificar as regras de embalagem de vídeo                                                | -       |
| rules         | OrNil\<RuleSetRule\>[]      | Não                              | -                                  | Adicionar regras de embalagem (pode substituir algumas regras padrão)                    | -       |

```typescript
// cjs: Módulo CommonJS; glb: Módulo global; umd: Módulo UMD;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// Para mais detalhes, consulte:: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// Para mais detalhes, consulte:: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Se as regras de embalagem forem modificadas, todos os campos exceto "tipo" e "gerador". filename' pode ser modificado.

Se você adicionar regras de empacotamento, poderá substituir as regras de empacotamento para texto, fontes, imagens, áudio e vídeo.

## Comando

### Comando principal

| Opção     | Abreviatura | Tipo | Obrigatório | Predefinição | Descrição                | Exemplo |
| --------- | ----------- | ---- | ----------- | ------------ | ------------------------ | ------- |
| --version | -v          | -    | -           | -            | Ver a versão             | sdin -v |
| --help    | -h          | -    | -           | -            | Ver o Documento de Ajuda | sdin -h |

### `build` Comando

Utilizado para projectos de construção

| Parâmetro | Nível dos pais | Tipo   | Obrigatório | Predefinição             | Descrição                                                | Exemplo       |
| --------- | -------------- | ------ | ----------- | ------------------------ | -------------------------------------------------------- | ------------- |
| path      | -              | string | Não         | Pasta de trabalho actual | Especificar o diretório raiz do projeto a ser construído | sdin build ./ |

| Opção     | Abreviatura | Tipo   | Obrigatório | Predefinição     | Descrição                                                                                     | Exemplo                   |
| --------- | ----------- | ------ | ----------- | ---------------- | --------------------------------------------------------------------------------------------- | ------------------------- |
| --modules | -m          | string | Não         | Todos os módulos | Especifique os nomes dos módulos a serem construídos, com vários itens separados por vírgulas | sdin build -m diana,elise |

### `create` Comando

Usado para criar projectos

| Parâmetro | Nível dos pais | Tipo   | Obrigatório | Predefinição | Descrição                                                         | Exemplo                 |
| --------- | -------------- | ------ | ----------- | ------------ | ----------------------------------------------------------------- | ----------------------- |
| name      | -              | string | Não         | -            | Especifique o nome do pacote usando os símbolos "@, a-z, 0-9, ,/" | sdin create new-project |

| Opção      | Abreviatura | Tipo   | Obrigatório | Predefinição             | Descrição                                        | Exemplo                       |
| ---------- | ----------- | ------ | ----------- | ------------------------ | ------------------------------------------------ | ----------------------------- |
| --output   | -o          | string | Não         | Pasta de trabalho actual | Especificar o caminho pai para o novo projeto    | sdin create -o ./             |
| --template | -t          | string | Não         | -                        | Especificar o nome do modelo para o novo projeto | sdin create -t common-package |

## Interface

### readSdinConfig

A ler a configuração do projecto

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Pasta raiz do projecto */
  root: string
}
```

### createSdinProject

Criar Projecto

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Nome do Modelo */
  templateName?: string
  /** O caminho da pasta onde o projeto está armazenado (padrão: diretório de trabalho atual) */
  projectParentPath?: string
  /** Nome do projecto */
  projectName?: string
  /** Versão do projecto (por omissão: 0. 0. 1) */
  projectVersion?: string
  /** Descrição do Projecto */
  projectDescription?: string
  /** Nome do autor (por omissão: nome de utilizador Git) */
  authorName?: string
  /** E- mail do autor (por omissão: e- mail Git) */
  authorEmail?: string
}
```

### buildSdinProject

Projecto de construção

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Configuração do Sdin */
  config: SdinConfig
  /** Especificar o nome do módulo a ser construído */
  moduleNames?: string[]
}
```
