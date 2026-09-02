import { writeFile } from 'node:fs';
import { dirname } from 'node:path';
import { urlToFilename, exists, get, recursiveMkdir } from './utils.ts';

type Callback = (err: Error | null, filename?: string, downloaded?: boolean) => void

// callback hell
export function spider(url: string, cb: Callback) {
  const filename = urlToFilename(url)

  exists(filename, (err, isExisted) => {
    if (err) return cb(err)

    if (isExisted) return cb(null, filename, false)

    console.log(`Downloading ${url} into ${filename}`)

    get(url, (err, content) => {
      if (err) return cb(err)

      recursiveMkdir(dirname(filename), err => {
        if (err) return cb(err)

        if (!content) return cb(new Error('No content to write'), filename, false)

        writeFile(filename, content, err => {
          if (err) return cb(err)
          cb(null, filename, true)
        })
      })
    })
  })
}
