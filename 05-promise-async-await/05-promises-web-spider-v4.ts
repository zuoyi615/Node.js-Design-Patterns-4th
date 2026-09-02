import { readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { urlToFilename, exists, get, recursiveMkdir, getPageLinks } from './utils.ts';
import { TaskQueue } from './task-queue.ts';

export function spider(url: string, maxDepth: number, queue: TaskQueue) {
  const filename = urlToFilename(url)

  return exists(filename).then(isExisted => {
    // conditional logic: branch 1
    if (isExisted) {
      if (!filename.endsWith('.html')) return
      return readFile(filename, 'utf8').then(content => {
        spiderLinks(url, content, maxDepth, queue)
        return
      })
    }

    // conditional logic: branch 2
    return download(url, filename).then(content => {
      if (filename.endsWith('.html')) {
        spiderLinks(url, content, maxDepth, queue)
        return
      }

      return
    })
  })
}

function saveFile(filename: string, content: string) {
  return recursiveMkdir(dirname(filename))
    .then(() => writeFile(filename, content))
    .then(() => content)
}

function download(url: string, filename: string) {
  console.log(`Downloading ${url} into ${filename}`)
  return get(url).then(content => saveFile(filename, content))
}

const spidering = new Set()

function spiderLinks(url: string, content: string, maxDepth: number, queue: TaskQueue) {
  let promise = Promise.resolve<void[]>([])

  if (maxDepth === 0) return promise

  const links = getPageLinks(url, content)
  if (links.length === 0) return promise

  for (const link of links) {
    if (!spidering.has(link)) {
      queue.pushTask(spider.bind(null, link, maxDepth - 1, queue))
      spidering.add(link)
    }
  }

  return promise
}
