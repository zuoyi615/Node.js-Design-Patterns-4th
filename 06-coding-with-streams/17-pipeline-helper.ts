import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream'
import { createGunzip, createGzip } from 'node:zlib';

export const uppercasify = new Transform({
  transform(chunk, _, cb) {
    this.push(chunk.toString().toUpperCase())
    cb()
  }
})

try {
  await pipeline(
    process.stdin,
    createGunzip(),
    uppercasify,
    createGzip(),
    process.stdout,
  )
} catch (e) {
  console.log(e)
}

// echo hello world! | gzip | node 17-pipeline-helper.ts | gunzip
