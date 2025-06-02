import { resolve } from 'path'
import { createLazyer } from './cache'
import { getPackageRootPath } from './npm'

const rootPath = createLazyer<string>(() => {
  return getPackageRootPath(__dirname)
})

/**
 * 获取本项目的根目录
 */
export function getRootPath(): string {
  return rootPath.get()
}

/**
 * 获取本项目的根目录下的路径
 */
export function withRootPath(path: string): string {
  const prefix = rootPath.get()
  return path.startsWith(prefix) ? path : resolve(prefix, path)
}

/**
 * 用户工作目录
 */
const workPath = createLazyer<string>(() => {
  return process.cwd()
})

/**
 * 获取当前命令行工作目录
 */
export function getWorkPath(): string {
  return workPath.get()
}

/**
 * 获取当前命令行工作目录下的路径
 */
export function withWorkPath(path: string): string {
  const prefix = workPath.get()
  return path.startsWith(prefix) ? path : resolve(prefix, path)
}
