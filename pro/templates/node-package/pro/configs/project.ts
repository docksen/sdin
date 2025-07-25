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
      type: 'foundation',
      name: 'elise',
      mode: 'esm'
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
      '<%= projectName %>': 'src'
    }
  }
}
