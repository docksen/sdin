import Webpack, { DefinePlugin, ProgressPlugin } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { getWebpackResolve, getWebpackResolveLoader, getWebpackRules } from './webpack'
import { filterNotNone } from 'utils/array'
import { GLOBAL_MODE_LIST } from 'configs/integration-module'
import { Compiler } from 'webpack'
import { SdinIntegrationModule, SdinIntegrationModuleMode } from 'configs/integration-module'

interface ModeConfig {
  libraryType: string
  global?: string
}

const MODE_TO_CONFIG: Record<SdinIntegrationModuleMode, ModeConfig> = {
  cjs: {
    libraryType: 'commonjs2'
  },
  umd: {
    libraryType: 'umd2',
    global: 'typeof self !== "undefined" ? self : this'
  },
  jsp: {
    libraryType: 'jsonp',
    global: 'typeof self !== "undefined" ? self : this'
  },
  glb: {
    libraryType: 'global',
    global: 'typeof self !== "undefined" ? self : this'
  }
}

export function createCompiler(module: SdinIntegrationModule): Compiler {
  const globalMode = GLOBAL_MODE_LIST.includes(module.mode)
  const modeConfig = MODE_TO_CONFIG[module.mode]
  return Webpack({
    mode: 'production',
    target: 'node',
    devtool: 'source-map',
    context: module.root,
    entry: {
      [module.bundle]: {
        import: module.index,
        library: {
          name: globalMode ? module.variable : undefined,
          type: modeConfig.libraryType
        }
      }
    },
    output: {
      path: module.tar,
      globalObject: globalMode ? module.global || modeConfig.global : undefined,
      hashDigest: 'base64url',
      hashDigestLength: 10,
      filename: '[name].js'
    },
    module: {
      rules: getWebpackRules(module)
    },
    externals: module.externals,
    resolve: getWebpackResolve(module),
    resolveLoader: getWebpackResolveLoader(module),
    plugins: [
      new ProgressPlugin(),
      new MiniCssExtractPlugin(),
      new DefinePlugin(module.getMacros())
    ],
    optimization: {
      minimize: module.minify,
      minimizer: filterNotNone([
        new TerserPlugin({
          minify: TerserPlugin.uglifyJsMinify,
          extractComments: true,
          terserOptions: {
            compress: true,
            mangle: module.uglify && { toplevel: true }
          }
        }),
        new CssMinimizerPlugin()
      ])
    },
    performance: {
      hints: 'warning',
      maxAssetSize: 524288,
      maxEntrypointSize: 1048576
    }
  })
}
