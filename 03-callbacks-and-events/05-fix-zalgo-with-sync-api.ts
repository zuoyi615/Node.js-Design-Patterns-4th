import { readFileSync } from 'node:fs'
import { URL } from 'node:url'

const cache = new Map()

function consistentRead(filename: string) {
  if (cache.has(filename)) {
    return cache.get(filename)
  }

  const data = readFileSync(filename, 'utf8')
  cache.set(filename, data)
  return data
}

const filePath = new URL('data.txt', import.meta.url) as any

console.log(consistentRead(filePath))

console.log(consistentRead(filePath))
