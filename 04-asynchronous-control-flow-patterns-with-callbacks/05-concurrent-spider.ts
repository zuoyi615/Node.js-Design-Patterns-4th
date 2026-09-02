import { readFile, writeFile } from 'node:fs';
import { dirname } from 'node:path';
import { urlToFilename, exists, get, recursiveMkdir, getPageLinks } from './utils.ts';

type Callback = (err?: Error | null) => void

export function spider(url: string, maxDepth: number, cb: Callback) {
  const filename = urlToFilename(url)
  if (!filename.endsWith('.html')) return setImmediate(cb) // ingore non-HTML resources

  exists(filename, (err, isExisted) => {
    if (err) return cb(err)

    function spiderLinksFromContent(
      url: string,
      maxDepth: number,
      err: Error | null,
      content: Buffer | null,
    ) {
      if (err) return cb(err)
      if (!content?.toString('utf8')) return cb(new Error('no content'))
      spiderLinks(url, content.toString('utf8'), maxDepth, cb)
    }

    if (isExisted) {
      return readFile(filename, 'utf8', (err, content) => spiderLinksFromContent(url, maxDepth, err, Buffer.from(content)))
    }

    download(url, filename, (err, content) => spiderLinksFromContent(url, maxDepth, err, content))
  })
}

function saveFile(
  filename: string,
  content: Buffer,
  cb: (err: Error | null) => void,
) {
  recursiveMkdir(dirname(filename), err => {
    if (err) return cb(err)
    writeFile(filename, content, cb)
  })
}

function download(
  url: string,
  filename: string,
  cb: (err: Error | null, content: Buffer | null) => void,
) {
  console.log(`Downloading ${url} into ${filename}`)
  get(url, (err, content) => {
    if (err) return cb(err, null)
    if (content) saveFile(filename, content, err => {
      if (err) return cb(err, null)
      cb(null, content)
    })
  })
}

function spiderLinks(
  url: string,
  content: string,
  maxDepth: number,
  cb: Callback,
) {
  if (maxDepth === 0) return process.nextTick(cb)

  const links = getPageLinks(url, content)
  if (links.length === 0) return process.nextTick(cb)

  let complete = 0
  let hasErrors = false

  for (const link of links) {
    spider(link, maxDepth - 1, done)
  }

  function done(err?: Error | null) {
    if (err) {
      hasErrors = true
      return cb(err)
    }

    if (++complete === links.length && !hasErrors) {
      return cb()
    }
  }

}
