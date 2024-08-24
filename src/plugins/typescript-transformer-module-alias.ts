import { mapValues } from 'lodash'
import { resolve } from 'path'
import {
  Node,
  TransformationContext,
  visitEachChild,
  isImportDeclaration,
  isExportDeclaration,
  isStringLiteral,
  CustomTransformerFactory,
  VisitResult,
  ExportDeclaration,
  ImportDeclaration,
  SourceFile
} from 'typescript'
import { aliasPosix, relativePosix } from 'utils/path'

export interface ModuleAliasTypescriptTransformerOptions {
  /** 项目根目录 */
  root?: string
  /** 模块别名 */
  alias?: Record<string, string>
}

interface ModuleAliasVisitorOptions {
  /** 项目根目录 */
  root: string
  /** 模块别名 */
  alias: Record<string, string>
  /** 完整别名 */
  resolvedAlias: Record<string, string>
}

/**
 * 模块别名插件
 *
 * 仅用于 afterDeclarations 阶段（只修改定义，不修改JS代码）
 */
export function createModuleAliasTypescriptTransformer(
  options: ModuleAliasTypescriptTransformerOptions
): CustomTransformerFactory {
  const root = options.root ?? process.cwd()
  const alias = options.alias ?? {}
  const resolvedAlias = mapValues(alias, value => resolve(root, value))
  const visitorOptions: ModuleAliasVisitorOptions = {
    root,
    alias,
    resolvedAlias
  }
  return context => {
    const visitor = (node: Node, source: SourceFile): VisitResult<Node> => {
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

/**
 * 涉及以下场景：
 * import "source" (Import)
 * import { x } from "source" (Import)
 * import { x as y } from "source" (Import)
 * import { default as y } from 'source' (Import)
 * import x from "source" (ImportDefault)
 * import x, { x as y } from "source" (ImportDefault + ImportNamespace)
 * import * from "source" (ImportNamespace)
 * import * as y from "source" (ImportNamespace)
 */
function visitImportDeclaration(
  node: ImportDeclaration,
  source: SourceFile,
  context: TransformationContext,
  options: ModuleAliasVisitorOptions
): VisitResult<Node> {
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

/**
 * 涉及以下场景：
 * export { x } from 'source (ExportNamed)
 * export { x as y } from 'source (ExportNamed)
 * export { default as y } from 'source' (ExportNamed)
 * export * from 'source' (ExportAll)
 * export * as y from 'source' (ExportAll)
 */
function visitExportDeclaration(
  node: ExportDeclaration,
  source: SourceFile,
  context: TransformationContext,
  options: ModuleAliasVisitorOptions
): VisitResult<Node> {
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
