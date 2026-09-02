import { readFile } from 'node:fs'
import { URL } from 'node:url'

const cache = new Map()

function inconsistentRead(filename: string, cb: (data: any) => void) {
  if (cache.has(filename)) {
    return cb(cache.get(filename))
  }

  readFile(filename, 'utf8', (_, data) => {
    cache.set(filename, data)
    cb(data)
  })
}

function createFileReader(filename: string) {
  const listeners: Function[] = []

  inconsistentRead(filename, value => {
    for (const listener of listeners) {
      listener(value)
    }
  })

  return {
    onDataReady: (listener: Function) => listeners.push(listener)
  }
}

const filePath = new URL('data.txt', import.meta.url) as any

const reader1 = createFileReader(filePath)

reader1.onDataReady((data: string) => {
  console.log(`First call data: ${data}`)

  const reader2 = createFileReader(filePath)
  reader2.onDataReady((data: string) => {
    console.log(`Second call data: ${data}`)
  })
})
