import { Writable, type WritableOptions } from 'node:stream'
import { writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { mkdirp } from 'mkdirp'

type Chunk = {
  path: string,
  content: string
}

export class ToFileSystem extends Writable {
  constructor(options?: WritableOptions) {
    super({ ...(options ?? {}), objectMode: true })
  }

  _write(chunk: Chunk, _encoding: string, cb: (error?: Error | null) => void) {
    mkdirp(dirname(chunk.path))
      .then(() => writeFile(chunk.path, chunk.content))
      .then(cb.bind(null, null))
      .catch(cb)
  }
}
