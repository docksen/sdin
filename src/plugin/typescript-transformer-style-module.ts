import {
  Node,
  TransformationContext,
  visitEachChild,
  isImportDeclaration,
  isExportDeclaration,
  isStringLiteral,
  CustomTransformerFactory,
  Visitor,
  VisitResult,
  NodeFlags,
  SyntaxKind,
  isNamespaceExport,
  ExportDeclaration,
  ImportDeclaration,
  isNamedExports,
  VariableDeclaration
} from 'typescript'

const STYLE_EXP = /\.(css|sass|scss)$/

/**
 * 样式模块插件
 *
 * 仅用于 afterDeclarations 阶段（只修改定义，不修改JS代码）
 */
export function createStyleModuleTypescriptTransformer(): CustomTransformerFactory {
  return context => {
    const visitor: Visitor = node => {
      if (isImportDeclaration(node)) {
        return visitImportDeclaration(node, context)
      }
      if (isExportDeclaration(node)) {
        return visitExportDeclaration(node, context)
      }
      return visitEachChild(node, visitor, context)
    }
    return {
      transformBundle: source => source,
      transformSourceFile: source => {
        return visitEachChild(source, visitor, context)
      }
    }
  }
}

/**
 * 去除 import 'xxx.css'
 * 去除 import 'xxx.scss'
 * 修改 import s from 'xxx.scss' 为 declare const s: Record<string, string | undefined>
 */
function visitImportDeclaration(
  node: ImportDeclaration,
  context: TransformationContext
): VisitResult<Node> {
  const mdlSpeNode = node.moduleSpecifier
  const impClaNode = node.importClause
  // 不是导入 SCSS 文件，直接返回
  if (!isStringLiteral(mdlSpeNode) || !STYLE_EXP.test(mdlSpeNode.text)) {
    return node
  }
  const f = context.factory
  // import s from 'xxx.scss'
  if (impClaNode && impClaNode.name) {
    // name: Record<string, string | undefined>
    const varDecNode = f.createVariableDeclaration(
      impClaNode.name,
      undefined,
      f.createTypeReferenceNode('Record', [
        f.createKeywordTypeNode(SyntaxKind.StringKeyword),
        f.createUnionTypeNode([
          f.createKeywordTypeNode(SyntaxKind.StringKeyword),
          f.createKeywordTypeNode(SyntaxKind.UndefinedKeyword)
        ])
      ])
    )
    // declare const name: Record<string, string | undefined>;
    return f.createVariableStatement(
      [f.createModifier(SyntaxKind.DeclareKeyword)],
      f.createVariableDeclarationList([varDecNode], NodeFlags.Const)
    )
  }
  return []
}

/**
 * 修改 export { default as s } from './test.scss' 为 export const s: Record<string, string | undefined>
 * 修改 export * as s from './test.scss' 为 export const s: Record<string, string | undefined>
 */
function visitExportDeclaration(
  node: ExportDeclaration,
  context: TransformationContext
): VisitResult<Node> {
  const mdlSpeNode = node.moduleSpecifier
  const expClaNode = node.exportClause
  // 不是导出 SCSS 文件，直接返回
  if (!mdlSpeNode || !isStringLiteral(mdlSpeNode) || !STYLE_EXP.test(mdlSpeNode.text)) {
    return node
  }
  const f = context.factory
  // export * as s from './test.scss'
  if (expClaNode && isNamespaceExport(expClaNode) && expClaNode.name) {
    // name: Record<string, string | undefined>
    const varDecNode = f.createVariableDeclaration(
      expClaNode.name,
      undefined,
      f.createTypeReferenceNode('Record', [
        f.createKeywordTypeNode(SyntaxKind.StringKeyword),
        f.createUnionTypeNode([
          f.createKeywordTypeNode(SyntaxKind.StringKeyword),
          f.createKeywordTypeNode(SyntaxKind.UndefinedKeyword)
        ])
      ])
    )
    // export declare const name: Record<string, string | undefined>;
    return f.createVariableStatement(
      [f.createModifier(SyntaxKind.ExportKeyword), f.createModifier(SyntaxKind.DeclareKeyword)],
      f.createVariableDeclarationList([varDecNode], NodeFlags.Const)
    )
  }
  // export { default as s } from './test.scss'
  if (expClaNode && isNamedExports(expClaNode) && expClaNode.elements.length > 0) {
    const declarations: VariableDeclaration[] = []
    for (const element of expClaNode.elements) {
      if (element.propertyName?.escapedText === 'default') {
        // name: Record<string, string | undefined>
        declarations.push(
          f.createVariableDeclaration(
            element.name,
            undefined,
            f.createTypeReferenceNode('Record', [
              f.createKeywordTypeNode(SyntaxKind.StringKeyword),
              f.createUnionTypeNode([
                f.createKeywordTypeNode(SyntaxKind.StringKeyword),
                f.createKeywordTypeNode(SyntaxKind.UndefinedKeyword)
              ])
            ])
          )
        )
      } else {
        // name: string | undefined
        declarations.push(
          f.createVariableDeclaration(
            element.name,
            undefined,
            f.createUnionTypeNode([
              f.createKeywordTypeNode(SyntaxKind.StringKeyword),
              f.createKeywordTypeNode(SyntaxKind.UndefinedKeyword)
            ])
          )
        )
      }
    }
    // export const s: Record<string, string | undefined>
    return f.createVariableStatement(
      [f.createModifier(SyntaxKind.ExportKeyword), f.createModifier(SyntaxKind.DeclareKeyword)],
      f.createVariableDeclarationList(declarations, NodeFlags.Const)
    )
  }
  return []
}
