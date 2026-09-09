import { type Readable, type Writable } from 'node:stream'
import { createWriteStream } from 'node:fs'
import { createServer } from 'node:net'

function demultiplexChannel(source: Readable, destinations: Writable[]) {
  let currentChannel: number | undefined
  let currentLength: number | undefined

  source
    .on('readable', () => {
      let chunk: Buffer | null
      if (currentChannel == null) {
        chunk = source.read(1)
        currentChannel = chunk?.readUInt8(0)
        if (currentChannel == null) return null
      }

      if (currentLength == null) {
        chunk = source.read(4)
        currentLength = chunk?.readUInt32BE(0)
        if (currentLength == null) return null
      }

      chunk = source.read(currentLength)
      if (chunk == null) return null

      console.log(`Received packet from: ${currentChannel}`)
      destinations[currentChannel].write(chunk)

      currentChannel = undefined
      currentLength = undefined
    })
    .on('end', () => {
      for (const dest of destinations) {
        dest.end()
      }
    })
}

const server = createServer(socket => {
  const stdoutStream = createWriteStream('stdout.log')
  const stderrStream = createWriteStream('stderr.log')
  demultiplexChannel(socket, [stdoutStream, stderrStream])
})

server.listen(3000, () => console.log('Server started'))
