/**
 * Sdin 抽象配置
 */
export abstract class SdinAbstractConfig<
  TConfig extends Object | null,
  TParent extends Object | null,
  TParams extends Object
> {
  /** 顶层配置对象 */
  readonly config: TConfig
  /** 上层配置对象 */
  readonly parent: TParent
  /** 原始配置对象 */
  readonly params: TParams

  constructor(config: TConfig, parent: TParent, params: TParams) {
    this.config = config
    this.parent = parent
    this.params = params
  }

  /**
   * 初始化数据
   */
  initialize(): Promise<void> {
    return Promise.resolve()
  }

  /**
   * 校验合法性
   */
  validate(): Promise<void> {
    return Promise.resolve()
  }
}
