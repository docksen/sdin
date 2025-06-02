import Koa from 'koa'
import koaMount from 'koa-mount'
import koaProxy from 'koa-proxy'
import koaLogger from 'koa-logger'
import koaStatic from 'koa-static'
import e2k from 'express-to-koa'
import wdm from 'webpack-dev-middleware'
import whm from 'webpack-hot-middleware'
import { SdinApplicationModule } from 'configs/application-module'
import type { Compiler } from 'webpack'
import type { Middleware, Context } from 'koa'
import { isNonEmptyDir, resolvePosixSlash } from 'utils/path'
import { SdinApplicationPage } from 'configs/application-page'

export function createKoa(module: SdinApplicationModule, compiler: Compiler): Koa {
  const koa = new Koa()
  if (module.devLog) {
    koa.use(koaLogger())
  }
  module.devProxies.forEach(i => {
    koa.use(koaProxy(i))
  })
  koa.use(
    e2k(
      wdm(compiler, {
        stats: 'errors-warnings',
        publicPath: module.path
      })
    )
  )
  koa.use(e2k(whm(compiler)))
  koa.use(getStaticMdw(module))
  koa.use(getPagesMdw(module, compiler))
  return koa
}

function getStaticMdw(module: SdinApplicationModule): Middleware<any, any> {
  return koaMount(module.withPath(module.astPath), koaStatic(module.astSrc))
}

function getPagesMdw(module: SdinApplicationModule, compiler: Compiler): Middleware<any, any> {
  const pubPath = resolvePosixSlash(module.path, true, false)
  const pages: Record<string, SdinApplicationPage> = {}
  for (const page of module.pages) {
    pages[module.withPath(page.path)] = page
  }
  return async (ctx: Context) => {
    if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
      return
    }
    if (ctx.body || ctx.status !== 404) {
      return
    }
    if (!ctx.headers.accept?.includes('text/html')) {
      return
    }
    const path = resolvePosixSlash(ctx.path, true, false)
    let page = undefined
    if (path === pubPath) {
      page = module.index || module.error
    } else {
      page = pages[path] || module.error
    }
    if (page) {
      const file = module.withTar(`htm/${[page.path]}.html`)
      ctx.set('content-type', 'text/html')
      ctx.body = await new Promise<any>((resolve, reject) => {
        if (compiler.outputFileSystem) {
          compiler.outputFileSystem.readFile(file, (err, data) => {
            return err ? reject(err) : resolve(data)
          })
        }
      })
    }
  }
}
