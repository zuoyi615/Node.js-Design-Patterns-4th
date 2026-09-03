import { createReadStream, createWriteStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { pipeline } from 'node:stream/promises';
import { LimitedUnorderedConcurrentStream } from './20-unordered-limited-concurrent-stream.ts'

const inputFile = createReadStream(process.argv[2])
const outputFile = createWriteStream('20-results.txt')
const fileLines = createInterface({
  input: inputFile,
  terminal: false,
})

const TIMEOUT_MS = 5 * 1000

const checkUrls = new LimitedUnorderedConcurrentStream(
  8,
  async function transform(url, _, push, done) {
    console.log({ url })

    if (!url) return done()

    try {
      await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(TIMEOUT_MS) })
      push(`${url} is up\n`)
    } catch (err) {
      push(`${url} is down: ${(err as Error).message}\n`)
    } finally {
      done()
    }
  }
)

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
