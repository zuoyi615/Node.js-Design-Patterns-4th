import { createServer } from 'node:http'
import Chance from 'chance'

const chance = new Chance()

const server = createServer((_req, res) => {
  res.writeHead(200, {
    'content-type': 'text/plain'
  })

  do {
    res.write(`${chance.string({ length: 12 })}\n`)
  } while (chance.bool({ likelihood: 95 }))
  res.end('\n\n')
  res.on('finish', () => console.log('All data sent'))
})

server.listen(3000, () => console.log('listening on http://localhost:3000'))
