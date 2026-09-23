import { createServer } from 'node:net';
import { createWriteStream } from 'node:fs';
import { type Writable } from 'node:stream'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
let writeStream: Writable | null

const server = createServer(socket => {
  socket.on('data', chunk => {
    if (!writeStream) {
      const filename = chunk.toString()
      writeStream = createWriteStream(join(__dirname, filename))
      console.log('Started accepting file', filename)
      return
    }

    writeStream.write(chunk)
  })

  socket.on('close', () => {
    writeStream?.destroy()
    writeStream = null
    console.log('close')
  })

  socket.on('error', e => {
    console.log('Error', e)
  })
})

server.listen(3000)
