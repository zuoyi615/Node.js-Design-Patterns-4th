import { pipeline } from 'node:stream'
import { createReadStream, createWriteStream } from 'node:fs'
import { createDecryptAndDecompress } from './22-combined-streams.ts'

// 72ddbb94762a454b8c85e00d087b00e2

const [, , password, ivHex, source, destination] = process.argv
const iv = Buffer.from(ivHex, 'hex')

console.log({
  iv,
  ivHex,
})

// usage: node 22-unarchive.ts <password> <ivHex> <sourceFile> <destFile>
pipeline(
  createReadStream(source),
  createDecryptAndDecompress(password, iv),
  createWriteStream(destination),
  err => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log(`${destination} created`)
  }
)
