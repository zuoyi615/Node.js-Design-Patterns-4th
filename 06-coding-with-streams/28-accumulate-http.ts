import { request } from 'node:http'

const req = request('http://jsonplaceholder.typicode.com/todos', res => {
  let buffer = '' // the final data is json string, must be parsed as a entire
  res.on('data', chunk => buffer += chunk)
  res.on('end', () => console.log(JSON.parse(buffer)))
})

req.end()
