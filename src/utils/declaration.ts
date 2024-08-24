export type OrNil<T> = T | undefined | null

export type OrNone<T> = T | undefined | null | false | ''

export type PromiseData<T> = T extends Promise<infer R> ? R : T

export type FunctionParam<T> = T extends (arg: infer R) => any ? R : any

export type FunctionResult<T> = T extends (...args: any[]) => infer R ? R : any
