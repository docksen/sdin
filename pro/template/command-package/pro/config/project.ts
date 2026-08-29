import type { SdinProjectParams, SdinTestingParams } from 'sdin'

export const sdinProjectParams: SdinProjectParams = {
  alias: {
    main: 'src/main',
    tool: 'src/tool',
    util: 'src/util'
  },
  testing: getSdinTestingParams(),
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
      '<%= projectName %>': 'src'
    }
  }
}
