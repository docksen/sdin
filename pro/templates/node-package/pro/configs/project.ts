import type { SdinProjectParams, SdinTestingParams } from 'sdin'

export const sdinProjectParams: SdinProjectParams = {
  testing: getSdinTestingParams(),
  alias: {},
  modules: [
    {
      type: 'foundation',
      name: 'camille',
      mode: 'cjs'
    },
    {
      type: 'declaration',
      name: 'diana'
    },
    {
      type: 'integration',
      name: 'urgoth',
      mode: 'umd',
      variable: '<%= projectVariableName %>'
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
