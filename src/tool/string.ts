const FILE_NAME_SEPARATOR_EXP = /[^0-9A-Za-z\.]+/
const FOLDER_NAME_SEPARATOR_EXP = /[^0-9A-Za-z]+/

/**
 * 转成合法的文件名称
 */
export function extraFileName(data?: string): string {
  if (!data) {
    return ''
  }
  return data.split(FILE_NAME_SEPARATOR_EXP).filter(Boolean).join('-')
}

/**
 * 转成合法的文件夹名称
 */
export function extraFolderName(data?: string): string {
  if (!data) {
    return ''
  }
  return data.split(FOLDER_NAME_SEPARATOR_EXP).filter(Boolean).join('-')
}
