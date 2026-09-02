import { readFile, writeFile } from 'node:fs';
import { dirname } from 'node:path';
import { urlToFilename, exists, get, recursiveMkdir, getPageLinks } from './utils.ts';
import { type TaskQueue, type Callback } from './08-task-queue-event-emitter.ts'

const spidering = new Set()

// INFO: 0. asynchronous
export function spider(url: string, maxDepth: number, queue: TaskQueue) {
  if (spidering.has(url)) return
  spidering.add(url)
  queue.pushTask(done => spiderTask({ url, maxDepth, queue }, done))
}

type SpiderTaskOption = {
  url: string
  maxDepth: number
  queue: TaskQueue
}

// INFO: 1. asynchronous
export function spiderTask(option: SpiderTaskOption, cb: Callback,) {
  const { url, maxDepth, queue } = option
  const filename = urlToFilename(url)

  exists(filename, (err, isExisted) => {
    if (err) return cb(err)
    if (isExisted) {
      if (!filename.endsWith('.html')) return cb()
      return readFile(filename, 'utf8', (err, content) => {
        const option = { url, content: Buffer.from(content), maxDepth, queue }
        spiderLinksFromContent(option, err, cb,)
      })
    }

    download(url, filename, (err, content) => {
      if (!filename.endsWith('.html')) return cb()
      const option = { url, content, maxDepth, queue }
      spiderLinksFromContent(option, err, cb)
    })
  })
}

// INFO: 2. asynchronous
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

// INFO: 3. asynchronous
function saveFile(filename: string, content: Buffer, cb: (err: Error | null) => void) {
  recursiveMkdir(dirname(filename), err => {
    if (err) return cb(err)
    writeFile(filename, content, cb)
  })
}

type SpiderLinksFromContentOption = {
  url: string
  content: Buffer | null
  maxDepth: number
  queue: TaskQueue
}

// INFO: 4. synchronous, used either in callback of download() or in callback of exists
function spiderLinksFromContent(option: SpiderLinksFromContentOption, err: Error | null, cb: Callback) {
  const { url, content, maxDepth, queue } = option
  if (err) return cb(err)
  if (!content?.toString('utf8')) return cb(new Error('no content'))
  spiderLinks(url, content.toString('utf8'), maxDepth, queue)
  return cb()
}

// INFO: 5. synchronous
function spiderLinks(url: string, content: string, maxDepth: number, queue: TaskQueue) {
  if (maxDepth === 0) return

  const links = getPageLinks(url, content)
  if (links.length === 0) return

  for (const link of links) {
    spider(link, maxDepth - 1, queue)
  }
}
