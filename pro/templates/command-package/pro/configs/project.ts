import type { SdinProjectParams, SdinTestingParams } from 'sdin'

export const sdinProjectParams: SdinProjectParams = {
  testing: getSdinTestingParams(),
  alias: {
    main: 'src/main',
    tools: 'src/tools',
    utils: 'src/utils'
  },
  modules: [
    {
      type: 'foundation',
      name: 'camille',
      mode: 'cjs'
    },
    {
      type: 'foundation',
      name: 'elise',
      mode: 'esm'
    },
    {
      type: 'declaration',
      name: 'diana'
    }
  ]
}

function getSdinTestingParams(): SdinTestingParams {
  return {
    alias: {
      '<%= projectName %>': 'tar/cjs'
    }
  }
}
