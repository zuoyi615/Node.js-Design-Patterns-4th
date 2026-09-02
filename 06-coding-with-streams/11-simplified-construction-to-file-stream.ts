import { writeFile } from 'node:fs/promises'
import { Writable } from 'node:stream'
import { dirname, join } from 'node:path'
import { mkdirp } from 'mkdirp'

const tfs = new Writable({
  objectMode: true,
  write(chunk, _, cb) {
    mkdirp(dirname(chunk.path))
      .then(() => writeFile(chunk.path, chunk.content))
      .then(cb.bind(null, null))
      .catch(cb)
  }
})

const outDir = join(import.meta.dirname, 'files')

tfs.write({ path: join(outDir, 'file1.txt'), content: 'Hello' })
tfs.write({ path: join(outDir, 'file2.txt'), content: 'Node.js' })
tfs.write({ path: join(outDir, 'file3.txt'), content: 'streams' })
tfs.end(() => console.log('All files created.'))

