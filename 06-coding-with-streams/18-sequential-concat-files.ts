import { createReadStream, createWriteStream } from 'node:fs'
import { Readable, Transform } from 'node:stream'

export function concatFiles(dest: string, files: string[]) {
  return new Promise<void>((resolve, reject) => {
    const destStream = createWriteStream(dest)
    Readable
      .from(files)
      .pipe(new Transform({
        objectMode: true,
        transform(filename, _, done) {
          const src = createReadStream(filename)
          src.pipe(destStream, { end: false })
          src.on('error', done)
          src.on('end', done)
        }
      }))
      .on('error', err => {
        destStream.end()
        reject(err)
      })
      .on('finish', () => {
        destStream.end()
        resolve()
      })
  })
}
