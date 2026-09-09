import { request } from 'node:http'
import consumers from 'node:stream/consumers'

const req = request('http://jsonplaceholder.typicode.com/todos', async res => {
  const jsonData = await consumers.json(res)
  console.log(jsonData)
})

req.end()
