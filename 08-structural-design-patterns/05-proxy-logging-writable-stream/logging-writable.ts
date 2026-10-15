import { type Writable } from 'node:stream'

type WriteArgs = Parameters<Writable['write']>

export function createLoggingWritable(writable: Writable) {
  return new Proxy(writable, {
    get(target, propKey, _receiver) {
      if (propKey === 'write') {
        return (...args: WriteArgs) => {
          const [chunk] = args
          console.log('Writing', chunk)
          return writable.write(...args)
        }
      }

      // @ts-ignore
      return target[propKey]
    }
  })
}
