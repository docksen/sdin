import { Big } from 'big.js'

export function ms2s(it: number) {
  return Big(it).div(1000).toNumber()
}
