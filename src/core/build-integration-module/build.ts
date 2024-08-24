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
import type { SdinConfig, SdinIntegrationModule } from 'core/config'

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

function createCompiler(options: SdinIntegrationModuleBuildingOptions): Compiler {
  const { config, module } = options
  return Webpack({
    mode: 'production',
    target: 'node',
    devtool: 'source-map',
    context: config.root,
    entry: {
      [module.entryName]: {
        import: module.src,
        library: {
          name: module.mode === 'cjs' ? undefined : module.globalName,
          type: module.mode === 'cjs' ? 'commonjs2' : module.mode === 'glb' ? 'global' : 'umd2'
        }
      }
    },
    output: {
      path: module.tar,
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
