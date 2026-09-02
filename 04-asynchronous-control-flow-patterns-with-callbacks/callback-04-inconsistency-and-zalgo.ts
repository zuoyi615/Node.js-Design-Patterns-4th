import { readFile } from 'node:fs'

const cache = new Map<string, string>()

function getData(
  filename: string,
  cb: (err: Error | null, data: string | null) => void,
) {
  // synchronouse
  if (cache.has(filename)) {
    return cache.get('filename')
  }

  // asynchronous
  readFile(filename, (err, content) => {
    if (err) {
      return cb(err, null)
    }

    const data = content.toString('utf8')

    cache.set(filename, data)

    return cb(null, data)
  })
}
