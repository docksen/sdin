const EMAIL_REG = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/

const CODE_FILE_NAME_REG = /^([a-z][a-z0-9]+)(\-[a-z][a-z0-9]+){0,5}(\.[a-z0-9]+){0,3}$/

const CODE_MODULE_NAME_REG = /^([a-z][a-z0-9]+)(\-[a-z][a-z0-9]+){0,5}$/

const PACKAGE_NAME_REG =
  /^@?([a-z][a-z0-9]{0,29}([\.\-]?[a-z0-9]{1,30}){0,5}){1}(\/[a-z0-9]{0,30}([\.\-]?[a-z0-9]{1,30}){0,5})?$/

export function isEmail(it: string) {
  return EMAIL_REG.test(it)
}

export function isCodeFileName(it: string): boolean {
  return CODE_FILE_NAME_REG.test(it)
}

export function isCodeModuleName(it: string): boolean {
  return CODE_MODULE_NAME_REG.test(it)
}

export function isPackageName(it: string): boolean {
  return PACKAGE_NAME_REG.test(it)
}
