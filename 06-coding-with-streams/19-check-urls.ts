import { createReadStream, createWriteStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { pipeline } from 'node:stream/promises';
import { UnorderedConcurrentStream } from './19-unordered-concurrent-stream.ts'

const inputFile = createReadStream(process.argv[2])
const fileLines = createInterface({
  input: inputFile
})

const TIMEOUT_MS = 5 * 1000

const checkUrls = new UnorderedConcurrentStream(
  async function transform(url, _, push, done) {
    if (!url) return done()

    try {
      await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(TIMEOUT_MS) })
      push(`${url} is up\n`)
    } catch (err) {
      push(`${url} is down\n`)
    }

    done()
  }
)

const outputFile = createWriteStream('results.txt')

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
