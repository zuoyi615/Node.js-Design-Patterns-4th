import { writeFile } from 'node:fs';
import { dirname } from 'node:path';
import { urlToFilename, exists, get, recursiveMkdir } from './utils.ts';

type Callback = (err: Error | null, filename?: string, downloaded?: boolean) => void

// 0. entry
export function spider(url: string, cb: Callback) {
  const filename = urlToFilename(url)
  exists(filename, (err, isExisted) => {
    if (err) return cb(err)
    if (isExisted) return cb(null, filename, false)
    download(url, filename, cb)
  })
}

// 1. download resource
function download(url: string, filename: string, cb: Callback) {
  console.log(`Downloading ${url} into ${filename}`)
  get(url, (err, content) => {
    if (err) return cb(err)
    if (content) saveFile(filename, content, cb)
  })
}

// 2. save content into file
function saveFile(filename: string, content: Buffer, cb: Callback) {
  recursiveMkdir(dirname(filename), err => {
    if (err) return cb(err)

    writeFile(filename, content, err => {
      if (err) return cb(err)
      cb(null, filename, true)
    })
  })
}

