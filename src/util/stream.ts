import { SteamError } from './errors'
import { OrNone } from './declaration'

export type StreamOrNull = OrNone<NodeJS.ReadWriteStream>

export type StreamTransfer = (prev: any) => StreamOrNull

export type StreamSource = StreamTransfer | StreamOrNull

export function pipeline(...sources: StreamSource[]) {
  return new Promise<any>((resolve, reject) => {
    let curr: any = undefined
    let prev: any = undefined
    for (let i = 0; i < sources.length; i++) {
      curr = sources[i]
      if (typeof curr === 'function') {
        prev = curr(prev)
      } else if (curr && curr.write) {
        curr.on('error', reject)
        if (prev && prev.pipe) {
          prev = prev.pipe(curr)
        } else {
          prev = curr
        }
      }
    }
    if (!curr) {
      throw new SteamError(
        SteamError.STREAM_PIPELINE_NO_SOURCES,
        'No streams, cannot concat sources to pipeline'
      )
    }
    if (resolve) {
      curr.on('end', resolve)
    }
    return curr
  })
}
