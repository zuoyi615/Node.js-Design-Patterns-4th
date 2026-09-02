import { createServer } from 'node:http'
import Chance from 'chance'

/**
 * NOTE: the default `highWaterMark` is 16*1024, which is 16k
 */
const CHUNK_SIZE = 16 * 1024 - 1
const chance = new Chance()

const server = createServer((_req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' })

  let backPressureCount = 0
  let bytesSent = 0

  function generateMore() {
    do {
      const shouldContinue = res.write(`${chance.string({ length: CHUNK_SIZE })}\n`)
      bytesSent += CHUNK_SIZE

      if (!shouldContinue) {
        console.warn(`back-pressure x${++backPressureCount}`)
        return res.once('drain', generateMore)
      }
    } while (chance.bool({ likelihood: 95 }))
    res.end('\n\n')
  }

  generateMore()

  res.on('finish', () => console.log(`Sent ${bytesSent} bytes`))
})

server.listen(3000, () => console.log('listening on http://localhost:3000'))
