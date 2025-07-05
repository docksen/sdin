import { outputFile } from 'fs-extra'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { mapValues, defaultsDeep, padStart } from 'lodash'
import { TJSXS_FILE_EXTENSIONS, withModulePath, withRootPath } from 'utils/path'
import { SdinApplicationModule } from 'configs/application-module'
import { getScriptString, getHtmlString } from './template'
import {
  Configuration,
  DefinePlugin,
  EntryObject,
  ProgressPlugin,
  RuleSetRule,
  WebpackPluginInstance
} from 'webpack'

export async function getWebpackEntry(module: SdinApplicationModule): Promise<EntryObject> {
  const tasks: Promise<void>[] = []
  const entry: EntryObject = {}
  for (let page of module.pages) {
    const index = module.withTmp(module.name, `${page.name}.jsx`)
    tasks.push(outputFile(index, getScriptString(page, index)))
    entry[page.name] = index
  }
  await Promise.all(tasks)
  return entry
}

export function getWebpackPlugins(module: SdinApplicationModule): WebpackPluginInstance[] {
  const plugins: WebpackPluginInstance[] = [
    new ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css'
    }),
    new DefinePlugin(module.toMacros())
  ]
  for (let page of module.pages) {
    plugins.push(
      new HtmlWebpackPlugin({
        minify: true,
        inject: true,
        chunks: [page.name],
        filename: `htm/${[page.path]}.html`,
        templateContent: getHtmlString(page)
      })
    )
  }
  return plugins
}

/**
 * webpack.config.resolve
 */
export function getWebpackResolve(module: SdinApplicationModule): Configuration['resolve'] {
  return {
    extensions: TJSXS_FILE_EXTENSIONS,
    alias: {
      // 指定 react 和 react-dom 的绝对路径，防止出现 react 版本不一致的问题
      react: module.withRoot('node_modules/react'),
      'react-dom': module.withRoot('node_modules/react-dom'),
      ...mapValues(module.alias, value => module.withRoot(value))
    }
  }
}

/**
 * webpack.config.resolveLoader
 */
export function getWebpackResolveLoader(
  module: SdinApplicationModule
): Configuration['resolveLoader'] {
  return {
    modules: [module.withRoot('node_modules'), withRootPath('node_modules')]
  }
}

/**
 * 分割代码的设置
 */
export function getWebpackSplitChunks(): {
  maxSize: number
  cacheGroups: any
} {
  const srcDots: number[] = [2, 4, 8, 16, 32, 64]
  const mdlDots: number[] = [2, 4, 8, 16, 32, 64]
  return {
    maxSize: 524288,
    cacheGroups: {
      // 打包业务公共代码
      ...getSplitConfigList(srcDots, 's', 101, getSplitSourceConfig),
      // 打包第三方库文件
      ...getSplitConfigList(mdlDots, 'm', 201, getSplitModuleConfig)
    }
  }
}

function getSplitConfigList(
  dots: number[],
  prefix: string,
  priority: number,
  getConfig: (name: string, priority: number, minCount: number) => any
) {
  const target: Record<string, any> = {}
  for (let i = 0; i < dots.length; i++) {
    const next = dots[i + 1]
    const start = dots[i]
    const end = next ? next - 1 : 0
    const startStr = padStart(start.toString(), 2, '0')
    const endStr = padStart(end.toString(), 2, '0')
    const name = `${prefix}${startStr}${endStr}`
    target[name] = getConfig(name, priority + i, start)
  }
  return target
}

/**
 * 获取公共源代码分割配置
 * @param priority 优先级
 * @param minCount 最少被引用多少次
 */
function getSplitSourceConfig(name: string, priority: number, minCount: number) {
  return {
    name: name,
    chunks: 'initial',
    minSize: 1,
    priority: priority,
    minChunks: minCount
  }
}

/**
 * 获取外部模块分割配置
 * @param priority 优先级
 * @param minCount 最少被引用多少次
 */
function getSplitModuleConfig(name: string, priority: number, minCount: number) {
  return {
    test: /node_modules/,
    name: name,
    chunks: 'initial',
    priority: priority,
    minChunks: minCount
  }
}

/**
 * 获取webpack的loader配置
 */
export function getWebpackRules(module: SdinApplicationModule): RuleSetRule[] {
  return [
    getRowRule(module),
    getFontRule(module),
    getImageRule(module),
    getAudioRule(module),
    getVideoRule(module),
    ...module.rules,
    getCssRule(),
    getSassRule(module),
    getBableRule(module)
  ]
}

function getRowRule(module: SdinApplicationModule) {
  return defaultsDeep(
    {
      generator: {
        filename: 'raw/[name].[contenthash][ext]'
      }
    },
    module.rawRule,
    {
      type: 'asset/source',
      test: /\.txt$/
    }
  )
}

function getFontRule(module: SdinApplicationModule) {
  return defaultsDeep(
    {
      generator: {
        filename: 'fnt/[name].[contenthash][ext]'
      }
    },
    module.fontRule,
    {
      type: 'asset',
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      parser: {
        dataUrlCondition: {
          maxSize: 10 * 1024
        }
      }
    }
  )
}

function getImageRule(module: SdinApplicationModule) {
  return defaultsDeep(
    {
      generator: {
        filename: 'img/[name].[contenthash][ext]'
      }
    },
    module.imageRule,
    {
      type: 'asset',
      test: /\.(png|jpg|jpeg|svg|webp|gif|bmp|tif)(\?.*)?$/,
      parser: {
        dataUrlCondition: {
          maxSize: 10 * 1024
        }
      }
    }
  )
}

function getAudioRule(module: SdinApplicationModule) {
  return defaultsDeep(
    {
      generator: {
        filename: 'ado/[name].[contenthash][ext]'
      }
    },
    module.audioRule,
    {
      type: 'asset',
      test: /\.(mp3|wma|wav|aac|amr|ogg)(\?.*)?$/,
      parser: {
        dataUrlCondition: {
          maxSize: 20 * 1024
        }
      }
    }
  )
}

function getVideoRule(module: SdinApplicationModule) {
  return defaultsDeep(
    {
      generator: {
        filename: 'vdo/[name].[contenthash][ext]'
      }
    },
    module.videoRule,
    {
      type: 'asset',
      test: /\.(mp4|3gp|webm|mpg|avi|wmv|flv)(\?.*)?$/,
      parser: {
        dataUrlCondition: {
          maxSize: 20 * 1024
        }
      }
    }
  )
}

function getCssRule(): RuleSetRule {
  return {
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 1,
          modules: false
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          postcssOptions: {
            plugins: [withModulePath('postcss-import'), withModulePath('postcss-preset-env')]
          }
        }
      }
    ]
  }
}

function getSassRule(module: SdinApplicationModule): RuleSetRule {
  return {
    test: /\.(sass|scss)$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 2,
          modules: module.sassModule && {
            localIdentName: module.mixinClass ? '[hash:base64:10]' : '[local]_[hash:base64:7]',
            localIdentContext: module.src,
            exportLocalsConvention: 'camelCaseOnly'
          }
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          postcssOptions: {
            plugins: [withModulePath('postcss-import'), withModulePath('postcss-preset-env')]
          }
        }
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }
    ]
  }
}

function getBableRule(module: SdinApplicationModule): RuleSetRule {
  const { babelIncludes, babelExcludes } = module
  const rule: Partial<RuleSetRule> = {}
  if (babelIncludes.length > 0) {
    rule.include = babelIncludes
  }
  rule.exclude = [/node_modules/]
  if (babelExcludes.length > 0) {
    rule.exclude = rule.exclude.concat(babelExcludes)
  }
  return {
    ...rule,
    test: /\.(js|jsx|ts|tsx)$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          compact: false,
          babelrc: false,
          sourceMap: true,
          configFile: false,
          cacheDirectory: false,
          cacheCompression: false,
          presets: [
            [
              withModulePath('@babel/preset-env'),
              {
                targets: ['>= 0.2%', 'not dead', 'node >= 16']
              }
            ],
            withModulePath('@babel/preset-react'),
            withModulePath('@babel/preset-typescript')
          ],
          plugins: [withModulePath('@babel/plugin-transform-runtime')]
        }
      }
    ]
  }
}
