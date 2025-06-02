import { resolve } from 'path'
import { readExports } from 'utils/read'
import { SdinConfigError } from 'tools/errors'
import { SdinProject } from 'configs/project'

const PROJECT_CONFIG_FILE_PATH = 'pro/configs/project.ts'

export interface SdinProjectReadingParams {
  /** 项目根目录 */
  root: string
}

export async function readSdinProject(params: SdinProjectReadingParams): Promise<SdinProject> {
  const configPath = resolve(params.root, PROJECT_CONFIG_FILE_PATH)
  const configExports = await readExports(configPath, true)
  const sdinProjectParams = configExports?.sdinProjectParams
  if (!sdinProjectParams) {
    throw new SdinConfigError(
      SdinConfigError.READ_CONFIG_FILE_FAILED,
      `Read sdinProjectParams failed: ${configPath}`
    )
  }
  if (!sdinProjectParams.root) {
    sdinProjectParams.root = params.root
  }
  const sdinConfig = new SdinProject(sdinProjectParams)
  await sdinConfig.initialize()
  await sdinConfig.validate()
  return sdinConfig
}
