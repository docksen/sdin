import { SdinConfigParams } from 'sdin'

export const sdinConfigParams: SdinConfigParams = {
  mode: 'development',
  alias: {},
  definitions: {},
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
      globalName: '<%= projectName %>',
      externals: {
        react: 'React'
      }
    }
  ]
}
