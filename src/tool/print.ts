import { SdinModule } from 'config/module'
import { SdinProject } from 'config/project'
import { ms2s } from 'util/unit'
import { blue, cyan, green, magenta, printInfo, printSuccess, yellow } from 'util/print'

export function printHeader(project: SdinProject) {
  const pkg = project.pkg
  printInfo(`Project ${blue(pkg.name)}, version ${magenta(pkg.version)}.`)
}

export function printBuildingSuccess(module: SdinModule, startTime: number) {
  printSuccess(
    `Successfully built ${green(module.type)} ${magenta(module.mode)} module ${yellow(
      module.name
    )}, it took ${cyan(ms2s(Date.now() - startTime))} s.`
  )
}
