import { createReadStream, createWriteStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { pipeline } from 'node:stream/promises'
import parallelTransform from 'parallel-transform'

// the urls in 21-results are in same order of the urls of 21-urls.txt
// parallet-transform: https://github.com/mafintosh/parallel-transform
// node 21-ordered-limited-concurrent-stream.ts 21-urls.txt  21-results.txt
const inputFile = createReadStream(process.argv[2])
const fileLines = createInterface({
  input: inputFile,
  terminal: false,
})
const TIMEOUT_MS = 3 * 1000

const checkUrls = parallelTransform(8, async function (url: string, done) {
  if (!url) return done()

  try {
    await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })
    done(null, `${url} is up\n`)
  } catch (e) {
    done(null, `${url} is down: ${(e as Error).message}\n`)
  }
})

const outputFile = createWriteStream('21-results.txt')

try {
  await pipeline(
    fileLines,
    checkUrls,
    outputFile,
  )
  console.log('All urls have been checked')
} catch (e) {
  console.log(e)
}

