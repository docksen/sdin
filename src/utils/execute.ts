import { exec } from 'child_process'

/**
 * 执行命令
 *
 * @param command 命令行
 * @param silence 是否安静执行（不显示任何信息）
 * @returns 执行结果
 */
export function execute(command: string, loading?: (chunk: any) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const childProcess = exec(command, (error, text) => {
      if (error) {
        reject(error)
      } else {
        resolve(text)
      }
    })
    if (loading && childProcess.stdout) {
      childProcess.stdout.on('data', data => {
        loading(data)
      })
    }
  })
}
