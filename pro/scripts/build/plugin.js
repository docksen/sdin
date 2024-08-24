const { mapValues } = require('lodash')
const { resolve } = require('path')
const { aliasPosix, relativePosix } = require('../utils/path')
const {
  visitEachChild,
  isImportDeclaration,
  isExportDeclaration,
  isStringLiteral
} = require('typescript')

function moduleAliasBabelPlugin() {
  const cache = new Set()
  return {
    name: 'module-alias',
    pre() {
      if (cache.has(this.opts)) {
        return
      }
      cache.add(this.opts)
      this.opts.root = this.opts.root ?? process.cwd()
      this.opts.alias = this.opts.alias ?? {}
      this.opts.resolvedAlias = mapValues(this.opts.alias, value => resolve(this.opts.root, value))
    },
    visitor: {
      ImportOrExportDeclaration: visitImportOrExportDeclaration
    }
  }
}

function visitImportOrExportDeclaration(path, state) {
  if (!('source' in path.node) || !path.node.source) {
    return
  }
  const source = path.node.source.value
  const current = state.file.opts.filename
  // 若没有引用文件，则不用处理
  if (!current || !source) {
    return
  }
  let target = undefined
  const fragments = source.split('/')
  for (let i = 0, k = ''; i < fragments.length; i++) {
    k = k ? k + '/' + fragments[i] : fragments[i]
    const v = state.opts.resolvedAlias[k]
    if (v) {
      target = resolve(state.opts.root, [v, ...fragments.slice(i + 1)].join('/'))
    } else {
      break
    }
  }
  // 若没有使用路径别名，则不用处理
  if (!target) {
    return
  }
  path.node.source.value = relativePosix(current, target)
}

/**
 * 模块别名插件
 *
 * 仅用于 afterDeclarations 阶段（只修改定义，不修改JS代码）
 */
function createModuleAliasTypescriptTransformer(options) {
  const root = options.root ?? process.cwd()
  const alias = options.alias ?? {}
  const resolvedAlias = mapValues(alias, value => resolve(root, value))
  const visitorOptions = {
    root,
    alias,
    resolvedAlias
  }
  return context => {
    const visitor = (node, source) => {
      if (isImportDeclaration(node)) {
        return visitImportDeclaration(node, source, context, visitorOptions)
      }
      if (isExportDeclaration(node)) {
        return visitExportDeclaration(node, source, context, visitorOptions)
      }
      return visitEachChild(node, node => visitor(node, source), context)
    }
    return {
      transformBundle: source => source,
      transformSourceFile: source => {
        return visitEachChild(source, node => visitor(node, source), context)
      }
    }
  }
}

function visitImportDeclaration(node, source, context, options) {
  const mdlSpeNode = node.moduleSpecifier
  // 不是导入路径，直接返回
  if (!isStringLiteral(mdlSpeNode)) {
    return node
  }
  const mdlPath = mdlSpeNode.text
  const curPath = source.fileName
  // 若没有引用文件，则不用处理
  if (!curPath || !mdlPath) {
    return node
  }
  const target = aliasPosix(mdlPath, options.resolvedAlias)
  // 若没有使用路径别名，则不用处理
  if (!target) {
    return node
  }
  const f = context.factory
  return f.updateImportDeclaration(
    node,
    node.modifiers,
    node.importClause,
    f.createStringLiteral(relativePosix(curPath, target)),
    node.attributes
  )
}

function visitExportDeclaration(node, source, context, options) {
  const mdlSpeNode = node.moduleSpecifier
  // 不是导入路径，直接返回
  if (!mdlSpeNode || !isStringLiteral(mdlSpeNode)) {
    return node
  }
  const mdlPath = mdlSpeNode.text
  const curPath = source.fileName
  // 若没有引用文件，则不用处理
  if (!curPath || !mdlPath) {
    return node
  }
  const target = aliasPosix(mdlPath, options.resolvedAlias)
  // 若没有使用路径别名，则不用处理
  if (!target) {
    return node
  }
  const f = context.factory
  return f.updateExportDeclaration(
    node,
    node.modifiers,
    node.isTypeOnly,
    node.exportClause,
    f.createStringLiteral(relativePosix(curPath, target)),
    node.attributes
  )
}

module.exports = {
  moduleAliasBabelPlugin,
  createModuleAliasTypescriptTransformer
}
