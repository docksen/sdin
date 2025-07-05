import { mapValues, defaultsDeep } from 'lodash'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { TJSXS_FILE_EXTENSIONS, withModulePath, withRootPath } from 'utils/path'
import { Configuration, RuleSetRule } from 'webpack'
import { SdinIntegrationModule } from 'configs/integration-module'

/**
 * webpack.config.resolve
 */
export function getWebpackResolve(module: SdinIntegrationModule): Configuration['resolve'] {
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
  module: SdinIntegrationModule
): Configuration['resolveLoader'] {
  return {
    modules: [module.withRoot('node_modules'), withRootPath('node_modules')]
  }
}

/**
 * 获取webpack的loader配置
 */
export function getWebpackRules(module: SdinIntegrationModule): RuleSetRule[] {
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

function getRowRule(module: SdinIntegrationModule) {
  return defaultsDeep(
    {
      generator: {
        filename: '[name].[contenthash][ext]'
      }
    },
    module.rawRule,
    {
      type: 'asset/source',
      test: /\.txt$/
    }
  )
}

function getFontRule(module: SdinIntegrationModule) {
  return defaultsDeep(
    {
      generator: {
        filename: '[name].[contenthash][ext]'
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

function getImageRule(module: SdinIntegrationModule) {
  return defaultsDeep(
    {
      generator: {
        filename: '[name].[contenthash][ext]'
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

function getAudioRule(module: SdinIntegrationModule) {
  return defaultsDeep(
    {
      generator: {
        filename: '[name].[contenthash][ext]'
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

function getVideoRule(module: SdinIntegrationModule) {
  return defaultsDeep(
    {
      generator: {
        filename: '[name].[contenthash][ext]'
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

function getSassRule(module: SdinIntegrationModule): RuleSetRule {
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

function getBableRule(module: SdinIntegrationModule): RuleSetRule {
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
