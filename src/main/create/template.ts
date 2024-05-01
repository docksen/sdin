import { pathExists } from 'fs-extra'
import { green, magenta, printError, printLoading, red } from 'utils/print'
import { deepCopy } from 'utils/write'
import { replaceByLodash } from 'utils/string'
import { EnquireSdinQuestionsResult, TEMPLATE_META_FILE_PATH } from 'core/enquire'

export interface SdinTemplateVariables {}

export async function copySdinTemplate(
  source: string,
  target: string,
  variables: EnquireSdinQuestionsResult
): Promise<void> {
  if (await pathExists(target)) {
    printError(`Project ${variables.projectName} already exists in ${target}.`, 2080417)
  }
  return printLoading({
    exitCode: 2947098,
    pendding: `Copy project to ${magenta(target)}.`,
    success: `Project copied to ${green(target)} successfully.`,
    failed: `Project cope to ${red(target)} failed.`,
    task: () => {
      return deepCopy({
        source,
        target,
        filter: node => {
          return node.offset !== TEMPLATE_META_FILE_PATH
        },
        handler: (_node, content) => {
          return replaceByLodash(content, variables)
        }
      })
    }
  })
}
