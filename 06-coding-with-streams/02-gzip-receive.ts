import { createWriteStream } from 'node:fs';
import { createServer } from 'node:http';
import { basename, join } from 'node:path';
import { createGunzip } from 'node:zlib';

const server = createServer((req, res) => {
  const filename = basename(req.headers['x-filename'] as string)
  const destFilename = join(import.meta.dirname, 'received_files', filename)
  console.log(`File request received: ${filename}`)

  console.log(`Start streaming data to ${destFilename}`)

  req
    .pipe(createGunzip())
    .pipe(createWriteStream(destFilename))
    .on('finish', () => {
      console.log('Streaming data finished')
      res.writeHead(201, { 'content-type': 'text/plain' })
      res.end('OK\n')
    })
    .on('error', error => {
      console.log(error)
      res.writeHead(500, { 'content-type': 'text/plain' })
      res.end(`${error.message}\n`)
    })
})

server.listen(3000, () => console.log('Listening on http://localhost:3000'))
