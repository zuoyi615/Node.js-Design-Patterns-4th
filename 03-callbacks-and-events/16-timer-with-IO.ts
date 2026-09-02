import { readFile } from 'node:fs'
import { URL } from 'node:url'

function readFileAsync(callback: (err: Error | null, data: string) => void) {
  const filePath = new URL('file-B.json', import.meta.url)
  readFile(filePath, 'utf8', callback)
}

const timeoutScheduled = Date.now()

readFileAsync((err, data) => {
  console.log({
    err,
    data,
  })
  const start = Date.now()
  while (Date.now() - start < 10) { }
})

setImmediate(() => {
  const delay = Date.now() - timeoutScheduled
  console.log(`[setImmediate] ${delay}ms have passed since I was scheduled`)
})

process.nextTick(() => {
  const delay = Date.now() - timeoutScheduled
  console.log(`[process.nextTick] ${delay}ms have passed since I was scheduled`)
  Promise.resolve(5).then(n => console.log(n))
})

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled
  console.log(`[setTimeout] ${delay}ms have passed since I was scheduled`)
}, 5)

