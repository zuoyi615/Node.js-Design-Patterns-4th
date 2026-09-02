import { createReadStream } from 'node:fs'
import { request } from 'node:http'
import { basename } from 'node:path'
import { createGzip } from 'node:zlib'

const filename = process.argv[2]
const serverhost = process.argv[3]

const httpRequestOptions = {
  hostname: serverhost,
  port: 3000,
  path: '/',
  method: 'POST',
  headers: {
    'content-type': 'application/octet-stream',
    'content-encoding': 'gzip',
    'x-filename': basename(filename),
  }
}

const req = request(httpRequestOptions, res => {
  console.log(`Server response: ${res.statusCode}`)
})

createReadStream(filename)
  .pipe(createGzip())
  .pipe(req)
  .on('finish', () => {
    console.log('File successfully sent')
  })
  .on('error', error => {
    console.log('File sent failed: ', error)
  })
