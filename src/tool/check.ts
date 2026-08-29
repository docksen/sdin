export const FILE_NAME_EXP = /^([a-z][a-z0-9]+)(\-[a-z][a-z0-9]+){0,5}(\.[a-z0-9]+){0,3}$/

export const MODULE_NAME_EXP = /^([a-z][a-z0-9]+)(\-[a-z][a-z0-9]+){0,5}$/

export const APP_PAGE_NAME_EXP = /^([a-z][a-z0-9]+)(\-[a-z][a-z0-9]+){0,5}$/

export const ABSOLUTE_URL_PATH_EXP = /^\/(([a-z][a-z0-9]+)([\-\/][a-z][a-z0-9]+){0,5}\/?)?$/

export const RELATIVE_URL_PATH_EXP = /^([a-z][a-z0-9]+)([\-\/][a-z][a-z0-9]+){0,5}\/?$/

export function isSdinFileName(it: string): boolean {
  return FILE_NAME_EXP.test(it)
}
