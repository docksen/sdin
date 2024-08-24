import { NodePath, PluginObj, PluginPass } from '@babel/core'
import { MemberExpression, Identifier, UnaryExpression } from '@babel/types'
import { valueToNode } from '@babel/types'
import { mapValues } from 'lodash'
import { executeCode } from 'utils/string'

export interface ModuleAliasBabelPluginOptions {
  /** 全局定义 */
  definitions?: Record<string, string>
}

interface State extends PluginPass {
  opts: Record<string, any>
}

/**
 * 代码全局定义插件
 */
export function codeDefinitionBabelPlugin(): PluginObj {
  return {
    name: 'code-definition',
    pre(this: State) {
      if (this.opts._init) {
        return
      }
      this.opts._init = true
      const defs = this.opts.definitions ?? {}
      this.opts.definitions = mapValues(defs, value => executeCode(value))
      this.opts.definitionKeys = Object.keys(defs).sort((a, b) => b.length - a.length)
    },
    visitor: {
      MemberExpression: visitMemberExpression,
      Identifier: visitIdentifier,
      UnaryExpression: visitUnaryExpression
    }
  }
}

/**
 * process.env.VERSION
 */
function visitMemberExpression(path: NodePath<MemberExpression>, state: State) {
  processNode(path, state, it => path.matchesPattern(it))
}

/**
 * const x = { version: VERSION }
 */
function visitIdentifier(path: NodePath<Identifier>, state: State) {
  if (path.scope.getBinding(path.node.name)) {
    return
  }
  if (path.container && 'type' in path.container) {
    const contType = path.container.type
    if (contType === 'ImportDefaultSpecifier' || contType === 'ImportSpecifier') {
      return
    }
  }
  if ('computed' in path.parent && path.parent.computed === false) {
    if (path.key === 'key' || path.key === 'property') {
      return
    }
  }
  processNode(path, state, it => path.node.name === it)
}

/**
 * typeof VERSION
 */
function visitUnaryExpression(path: NodePath<UnaryExpression>, state: State) {
  if (path.node.operator !== 'typeof') {
    return
  }
  if (!('name' in path.node.argument)) {
    return
  }
  const key = 'typeof ' + path.node.argument.name
  processNode(path, state, it => key === it)
}

function processNode(path: NodePath, state: State, predicate: (it: string) => boolean | undefined) {
  let key: string | undefined = undefined
  let value: any = undefined
  for (const item of state.opts.definitionKeys) {
    if (predicate(item)) {
      key = item
      value = state.opts.definitions[item]
      break
    }
  }
  if (!key) {
    return
  }
  path.replaceWith(valueToNode(value))
  // 如果是二元表达式（“左+运算符+右”结构）
  // 在尝试计算，并得出结果后，直接用结果替换
  if (path.parentPath?.isBinaryExpression()) {
    const result = path.parentPath.evaluate()
    if (result.confident) {
      path.parentPath.replaceWith(valueToNode(result.value))
    }
  }
}
