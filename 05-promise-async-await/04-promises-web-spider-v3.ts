import { readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { urlToFilename, exists, get, recursiveMkdir, getPageLinks } from './utils.ts';

export function spider(url: string, maxDepth: number) {
  const filename = urlToFilename(url)

  return exists(filename).then(isExisted => {
    // conditional logic: branch 1
    if (isExisted) {
      if (!filename.endsWith('.html')) return
      return readFile(filename, 'utf8').then(content => {
        spiderLinks(url, content, maxDepth)
        return
      })
    }

    // conditional logic: branch 2
    return download(url, filename).then(content => {
      if (filename.endsWith('.html')) {
        spiderLinks(url, content, maxDepth)
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

function spiderLinks(url: string, content: string, maxDepth: number) {
  let promise = Promise.resolve<void[]>([])

  if (maxDepth === 0) return promise

  const links = getPageLinks(url, content)
  if (links.length === 0) return promise

  const promises = links.map(link => spider(link, maxDepth - 1))

  return Promise.all(promises)
}
