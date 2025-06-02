import http from 'http'
import { SdinApplicationModule } from 'configs/application-module'
import { createCompiler } from './compiler'
import { createKoa } from './koa'
import { green, printTask } from 'utils/print'
import { SdinStartingError } from 'tools/errors'

export interface SdinApplicationModuleStartingOptions {
  module: SdinApplicationModule
}

export async function startSdinApplicationModule(
  options: SdinApplicationModuleStartingOptions
): Promise<void> {
  const { module } = options
  module.setEnv('dev')
  const compiler = await createCompiler(module)
  const koa = createKoa(module, compiler)
  const server = http.createServer(koa.callback())
  const origin = `http://127.0.0.1:${module.devPort}${module.path}`
  await printTask({
    exitCode: SdinStartingError.LISTENING_FAILED,
    task: () => new Promise<void>(resolve => server.listen(module.devPort, resolve)),
    loading: () => `Listening module ${module.name} on ${green(origin)}.`,
    reject: () => `Failed to listen module ${module.name} on ${green(origin)}.`,
    resolve: () => `Successfully listened module ${module.name} on ${green(origin)}.`
  })
}
