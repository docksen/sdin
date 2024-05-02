import { pathExists } from 'fs-extra'
import { printError } from 'utils/print'
import { deepCopyWithLoading } from 'utils/write'
import { replaceByLodash } from 'utils/string'
import { EnquireSdinQuestionsResult, TEMPLATE_CONFIG_FILE_PATH } from 'core/enquire'

export async function copySdinTemplate(
  source: string,
  target: string,
  variables: EnquireSdinQuestionsResult
): Promise<void> {
  if (await pathExists(target)) {
    printError(`Project ${variables.projectName} already exists in ${target}.`, 2080417)
  }
  return deepCopyWithLoading({
    source,
    target,
    filter: node => {
      return node.offset !== TEMPLATE_CONFIG_FILE_PATH
    },
    handler: async (_node, content) => {
      return replaceByLodash(content, variables)
    }
  })
}
