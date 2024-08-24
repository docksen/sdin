import type { SdinConfigParams } from 'sdin'

export const sdinConfigParams: SdinConfigParams = {
  alias: {
    main: 'src/main',
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
