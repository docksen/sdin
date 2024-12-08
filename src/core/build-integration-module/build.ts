import Webpack, { DefinePlugin, ProgressPlugin } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { getWebpackResolve, getWebpackResolveLoader, getWebpackRules } from './webpack'
import { compile, showStats } from 'utils/webpack'
import { emptyDir } from 'fs-extra'
import { cyan, green, magenta, printSuccess, yellow } from 'utils/print'
import { ms2s } from 'utils/unit'
import { filterNotNone } from 'utils/array'
import type { Compiler } from 'webpack'
import {
  GLOBAL_MODE_LIST,
  type SdinConfig,
  type SdinIntegrationModule,
  type SdinIntegrationModuleMode
} from 'core/config'

export interface SdinIntegrationModuleBuildingOptions {
  config: SdinConfig
  module: SdinIntegrationModule
}

export async function buildSdinIntegrationModule(
  options: SdinIntegrationModuleBuildingOptions
): Promise<void> {
  const { module } = options
  const startTime = Date.now()
  await emptyDir(module.tar)
  const compiler = createCompiler(options)
  const stats = await compile(compiler)
  showStats({
    stats,
    success: () => {
      printSuccess(
        `Successfully built ${green(module.type)} ${magenta(module.mode)} module ${yellow(
          module.name
        )}, it took ${cyan(ms2s(Date.now() - startTime))} s.`
      )
    }
  })
}

interface ModeConfig {
  libraryType: string
  globalObject?: string
}

const MODE_TO_CONFIG: Record<SdinIntegrationModuleMode, ModeConfig> = {
  cjs: {
    libraryType: 'commonjs2'
  },
  umd: {
    libraryType: 'umd2',
    globalObject: 'typeof self !== "undefined" ? self : this'
  },
  jsp: {
    libraryType: 'jsonp',
    globalObject: 'typeof self !== "undefined" ? self : this'
  },
  glb: {
    libraryType: 'global',
    globalObject: 'typeof self !== "undefined" ? self : this'
  }
}

function createCompiler(options: SdinIntegrationModuleBuildingOptions): Compiler {
  const { config, module } = options
  const globalMode = GLOBAL_MODE_LIST.includes(module.mode)
  const modeConfig = MODE_TO_CONFIG[module.mode]
  return Webpack({
    mode: 'production',
    target: 'node',
    devtool: 'source-map',
    context: config.root,
    entry: {
      [module.entryName]: {
        import: module.src,
        library: {
          name: globalMode ? module.globalName : undefined,
          type: modeConfig.libraryType
        }
      }
    },
    output: {
      path: module.tar,
      globalObject: globalMode ? module.globalObject || modeConfig.globalObject : undefined,
      hashDigestLength: 10,
      filename: '[name].js',
      sourceMapFilename: '[name][ext].map'
    },
    module: {
      rules: getWebpackRules(config, module)
    },
    externals: module.externals,
    resolve: getWebpackResolve(config),
    resolveLoader: getWebpackResolveLoader(config),
    plugins: [
      new ProgressPlugin(),
      new MiniCssExtractPlugin(),
      new DefinePlugin(module.definitions)
    ],
    optimization: {
      minimize: module.minify,
      minimizer: filterNotNone([
        new CssMinimizerPlugin(),
        new TerserPlugin({
          minify: TerserPlugin.uglifyJsMinify,
          extractComments: true,
          terserOptions: {
            compress: true,
            mangle: module.uglify && { toplevel: true }
          }
        })
      ])
    },
    performance: {
      hints: 'warning',
      maxAssetSize: 524288,
      maxEntrypointSize: 1048576
    }
  })
}
