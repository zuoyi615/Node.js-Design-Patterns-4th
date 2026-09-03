import { createReadStream, createWriteStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';

const inputFile = createReadStream(process.argv[2])
const outputFile = createWriteStream('results.txt')
const fileLines = createInterface({
  input: inputFile,
  terminal: false,
})

const TIMEOUT_MS = 5 * 1000

const checkUrls = new Transform({
  objectMode: true,
  async transform(url: string, _, cb) {
    console.log({ url })

    if (!url) return cb()

    try {
      await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(TIMEOUT_MS) })
      cb(null, `${url} is up\n`)
    } catch (e) {
      cb(null, `${url} is down\n`)
    }
  }
})


try {
  await pipeline(
    fileLines,
    checkUrls,
    outputFile,
  )
  console.log('All urls have been checked.')
} catch (err) {
  console.log(err)
}
