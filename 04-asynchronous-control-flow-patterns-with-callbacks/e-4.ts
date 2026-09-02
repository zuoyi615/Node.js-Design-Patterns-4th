import { readFile } from 'node:fs';
import { urlToFilename, exists, get, getPageLinks } from './utils.ts';
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

    download(url, (err, content) => {
      if (!filename.endsWith('.html')) return cb()
      if (!content) return cb()
      const option = { url, content, maxDepth, queue }
      spiderLinksFromContent(option, err, cb)
    })
  })
}

// INFO: 2. asynchronous
function download(
  url: string,
  cb: (err: Error | null, content: Buffer | null) => void,
) {
  get(url, err => {
    if (err) {
      if (err.code === 404) {
        console.log({
          status: err.code,
          url,
        })
      }

      return cb(err, null)
    }

    return cb(null, null);
  })
}

type SpiderLinksFromContentOption = {
  url: string
  content: Buffer | null
  maxDepth: number
  queue: TaskQueue
}

// INFO: 3. synchronous, used either in callback of download() or in callback of exists
function spiderLinksFromContent(option: SpiderLinksFromContentOption, err: Error | null, cb: Callback) {
  const { url, content, maxDepth, queue } = option
  if (err) return cb(err)
  if (!content?.toString('utf8')) return cb(new Error('no content'))
  spiderLinks(url, content.toString('utf8'), maxDepth, queue)
  return cb()
}

// INFO: 4. synchronous
function spiderLinks(url: string, content: string, maxDepth: number, queue: TaskQueue) {
  if (maxDepth === 0) return

  const links = getPageLinks(url, content)
  if (links.length === 0) return

  for (const link of links) {
    spider(link, maxDepth - 1, queue)
  }
}
