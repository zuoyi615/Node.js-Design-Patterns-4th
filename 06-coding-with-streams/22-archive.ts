import { randomBytes } from 'node:crypto';
import { createCompressAndEncrypt } from './22-combined-streams.ts';
import { pipeline } from 'node:stream';
import { createReadStream, createWriteStream } from 'node:fs';

const [, , password, source] = process.argv
const iv = randomBytes(16)
const destination = `${source}.gz.enc`

pipeline(
  createReadStream(source),
  createCompressAndEncrypt(password, iv),
  createWriteStream(destination),
  err => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log(`${destination} created with iv: ${iv.toString('hex')}`)
  }
)
