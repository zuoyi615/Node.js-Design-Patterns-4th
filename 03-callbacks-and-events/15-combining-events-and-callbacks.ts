import { EventEmitter } from 'node:events'
import { get } from 'node:https'

function download(url: string, cb: (err: Error | null, data?: any) => void) {
  const emitter = new EventEmitter()

  const req = get(url, resp => {
    const chunks: Buffer[] = []
    let downloadedBytes = 0
    const fileSize = Number(resp.headers['content-length'] ?? '0')

    resp
      .on('error', cb)
      .on('data', (chunk: Buffer) => {
        chunks.push(chunk)
        downloadedBytes += chunk.length
        emitter.emit('progress', downloadedBytes, fileSize)
      })
      .on('end', () => {
        const data = Buffer.concat(chunks)
        cb(null, data)
      })
  })

  req.on('error', err => {
    emitter.emit('error', err)
    cb(err)
  })

  return emitter
}

const downloadEmitter = download('https://www.nodejsdesignpatterns.com/img/node-js-design-patterns.jpg', (err, data) => {
  if (err) {
    return console.error(`Download failed: ${err.message}`)
  }

  console.log('Download completed', data)
})

downloadEmitter
  .on('progress', (downloaded: number, total) => {
    console.log(`${downloaded}/${total} (${((downloaded / total) * 100).toFixed(2)}%)`)
  })
  .on('error', error => console.log(error.message))
