import { createReadStream } from 'node:fs';
import net from 'node:net'
import { pipeline } from 'node:stream/promises';
import { basename } from 'node:path'

const filePath = process.argv[2]
const filename = basename(filePath)

const client = net.createConnection({ port: 3000 }, () => {
  console.log('Connection listener')
})

client.on('connect', async () => {
  client.write(filename)
  try {
    await pipeline(createReadStream(filePath), client)
  } catch (e) {
    console.log(e)
  } finally {
    client.end()
  }
})
