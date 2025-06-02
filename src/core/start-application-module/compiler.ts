import Webpack, { Compiler } from 'webpack'
import { SdinApplicationModule } from 'configs/application-module'
import {
  getWebpackEntry,
  getWebpackExternals,
  getWebpackPlugins,
  getWebpackResolve,
  getWebpackResolveLoader,
  getWebpackRules
} from './webpack'

export async function createCompiler(module: SdinApplicationModule): Promise<Compiler> {
  return Webpack({
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    context: module.root,
    entry: await getWebpackEntry(module),
    output: {
      path: module.tar,
      publicPath: module.path,
      pathinfo: true,
      hashDigest: 'base64url',
      hashDigestLength: 10,
      filename: 'js/[name].js',
      chunkFilename: 'js/[id].js'
    },
    module: {
      rules: getWebpackRules(module)
    },
    externals: getWebpackExternals(module),
    resolve: getWebpackResolve(module),
    resolveLoader: getWebpackResolveLoader(module),
    plugins: getWebpackPlugins(module)
  })
}
