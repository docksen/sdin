import type { SdinConfigParams } from 'sdin'

export const sdinConfigParams: SdinConfigParams = {
  alias: {},
  testing: {
    alias: {
      <%= projectName %>: 'tar/cjs'
    }
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
    },
    {
      type: 'integration',
      name: 'urgoth',
      mode: 'umd',
      globalName: '<%= projectName %>'
    }
  ]
}
