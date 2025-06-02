import { magenta } from 'utils/print'

interface ProjectCreatingOptions {
  templateName: string
  projectName: string | undefined
  projectParentPath: string
}

export function createProject(options: ProjectCreatingOptions) {
  return new Promise<string>(resolve => {
    setTimeout(() => {
      console.log('The project name is ' + magenta(options.projectName || 'unknown'))
      console.log('The project config options is ' + JSON.stringify(options))
    }, 1000)
  })
}
