import { fork } from 'node:child_process'
import { connect } from 'node:net'
import { type Readable, type Writable } from 'node:stream'

function multiplexChannels(sources: Readable[], destination: Writable) {
  let openChannels = sources.length

  for (let i = 0; i < sources.length; i++) {
    sources[i]
      .on('readable', function (this: Readable) {
        let chunk: Buffer | null
        while ((chunk = this.read()) !== null) {
          const outBuffer = Buffer.alloc(1 + 4 + chunk.length)
          outBuffer.writeUint8(i, 0) // 1 bytes: channel, total 2**8 channels
          outBuffer.writeUint32BE(chunk.length, 1) // 4 bytes, big endian: data length
          chunk.copy(outBuffer, 5) // offset: 1 + 4
          console.log(`Sending packet to channel: ${i}`)
          destination.write(outBuffer)
        }
      })
      .on('end', () => {
        openChannels--
        if (openChannels === 0) {
          destination.end()
        }
      })
  }
}

const socket = connect(
  {
    port: 3000
  },
  () => {
    console.log(
      process.argv[2],
      process.argv.slice(3),
    )
    const child = fork(process.argv[2], process.argv.slice(3), { silent: true })
    multiplexChannels([child.stdout!, child.stderr!], socket)
  },
)
