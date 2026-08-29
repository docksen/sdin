const EMAIL_EXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/

const PACKAGE_NAME_EXP =
  /^@?([a-z][a-z0-9]{0,29}([\.\-]?[a-z0-9]{1,30}){0,5}){1}(\/[a-z0-9]{0,30}([\.\-]?[a-z0-9]{1,30}){0,5})?$/

const PACKAGE_VERSION_EXP = /^[0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,4}(\.[a-z0-9][a-z0-9\-]{0,29})?$/

export function isEmail(it: string) {
  return EMAIL_EXP.test(it)
}

export function isPackageName(it: string): boolean {
  return PACKAGE_NAME_EXP.test(it)
}

export function isPackageVersion(it: string): boolean {
  return PACKAGE_VERSION_EXP.test(it)
}
