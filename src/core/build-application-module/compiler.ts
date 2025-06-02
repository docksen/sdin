import Webpack, { Compiler } from 'webpack'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { filterNotNone } from 'utils/array'
import { SdinApplicationModule } from 'configs/application-module'
import {
  getWebpackEntry,
  getWebpackPlugins,
  getWebpackResolve,
  getWebpackResolveLoader,
  getWebpackRules,
  getWebpackSplitChunks
} from './webpack'

export async function createCompiler(module: SdinApplicationModule): Promise<Compiler> {
  return Webpack({
    mode: 'production',
    devtool: 'source-map',
    context: module.root,
    entry: await getWebpackEntry(module),
    output: {
      path: module.tar,
      publicPath: module.path,
      hashDigest: 'base64url',
      hashDigestLength: 10,
      filename: 'js/[name].[chunkhash].js',
      chunkFilename: 'js/[id].[chunkhash].js'
    },
    module: {
      rules: getWebpackRules(module)
    },
    externals: module.externals,
    resolve: getWebpackResolve(module),
    resolveLoader: getWebpackResolveLoader(module),
    plugins: getWebpackPlugins(module),
    optimization: {
      splitChunks: getWebpackSplitChunks(),
      runtimeChunk: {
        name: (entry: any) => entry.name + '.rc'
      },
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
