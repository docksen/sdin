/**
 * Sdin 抽象配置
 */
export abstract class SdinAbstractConfig<
  TAncestor extends Object | null,
  TParent extends Object | null,
  TParams extends Object
> {
  /** 顶层配置对象 */
  public readonly ancestor: TAncestor
  /** 上层配置对象 */
  public readonly parent: TParent
  /** 原始配置参数 */
  public readonly params: TParams

  public constructor(ancestor: TAncestor, parent: TParent, params: TParams) {
    this.ancestor = ancestor
    this.parent = parent
    this.params = params
  }

  /**
   * 初始化数据
   */
  public initialize(): Promise<void> {
    return Promise.resolve()
  }

  /**
   * 校验合法性
   */
  public validate(): Promise<void> {
    return Promise.resolve()
  }
}
