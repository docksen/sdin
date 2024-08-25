import { resolve } from 'path'
import { mapValues, defaultsDeep } from 'lodash'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { SdinConfig, SdinIntegrationModule } from 'core/config'
import { withModulePath, withRootPath } from 'utils/path'
import type { Configuration, RuleSetRule } from 'webpack'

/**
 * webpack.config.resolve
 */
export function getWebpackResolve(config: SdinConfig): Configuration['resolve'] {
  return {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: mapValues(config.alias, value => resolve(config.root, value))
  }
}

/**
 * webpack.config.resolveLoader
 */
export function getWebpackResolveLoader(config: SdinConfig): Configuration['resolveLoader'] {
  return {
    modules: [config.withRootPath('node_modules'), withRootPath('node_modules')]
  }
}

/**
 * 获取webpack的loader配置
 */
export function getWebpackRules(config: SdinConfig, module: SdinIntegrationModule): RuleSetRule[] {
  return [
    getRowRule(module),
    getFontRule(module),
    getImageRule(module),
    getAudioRule(module),
    getVideoRule(module),
    ...module.rules,
    getCssRule(),
    getSassRule(config, module),
    getBableRule(module)
  ]
}

function getRowRule(module: SdinIntegrationModule) {
  return defaultsDeep(
    {
      type: 'asset/source',
      generator: {
        filename: '[name].[contenthash][ext]'
      }
    },
    module.rawRule,
    {
      test: /\.txt$/i
    }
  )
}

function getFontRule(module: SdinIntegrationModule) {
  return defaultsDeep(
    {
      type: 'asset',
      generator: {
        filename: '[name].[contenthash][ext]'
      }
    },
    module.fontRule,
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/
    }
  )
}

function getImageRule(module: SdinIntegrationModule) {
  return defaultsDeep(
    {
      type: 'asset',
      generator: {
        filename: '[name].[contenthash][ext]'
      }
    },
    module.imageRule,
    {
      test: /\.(png|jpg|jpeg|svg|webp|gif|bmp|tif)(\?.*)?$/,
      parser: {
        dataUrlCondition: {
          maxSize: 10240
        }
      }
    }
  )
}

function getAudioRule(module: SdinIntegrationModule) {
  return defaultsDeep(
    {
      type: 'asset',
      generator: {
        filename: '[name].[contenthash][ext]'
      }
    },
    module.audioRule,
    {
      test: /\.(mp3|wma|wav|aac|amr|ogg)(\?.*)?$/
    }
  )
}

function getVideoRule(module: SdinIntegrationModule) {
  return defaultsDeep(
    {
      type: 'asset',
      generator: {
        filename: '[name].[contenthash][ext]'
      }
    },
    module.videoRule,
    {
      test: /\.(mp4|3gp|webm|mpg|avi|wmv|flv)(\?.*)?$/
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

function getSassRule(config: SdinConfig, module: SdinIntegrationModule): RuleSetRule {
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
            localIdentName: config.isProduction() ? '[hash:base64:10]' : '[local]_[hash:base64:6]',
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
