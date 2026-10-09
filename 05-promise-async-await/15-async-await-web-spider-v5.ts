import { readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { urlToFilename, exists, get, recursiveMkdir, getPageLinks } from './utils.ts';
import pLimit from 'p-limit';

const limit = pLimit(2)
const spidering = new Set()

export async function spider(url: string, maxDepth: number) {
  const filename = urlToFilename(url)

  let content: string = ''

  if (!(await exists(filename))) content = await download(url, filename)

  if (!filename.endsWith('.html')) return

  if (!content) content = await readFile(filename, 'utf8')

  if (maxDepth === 0) return

  const links = getPageLinks(url, content)

  await Promise.all(links.map(async link => {
    if (spidering.has(link)) return Promise.resolve()
    spidering.add(link)
    return spider(link, maxDepth - 1)
  }))
}

async function saveFile(filename: string, content: string) {
  await recursiveMkdir(dirname(filename))
  return writeFile(filename, content)
}

/*
 * 不要限制一个需要等待同一限流器内部其他任务完成的递归任务；
 * 尽量把并发限制放在真正需要控制的资源操作上
 */
async function download(url: string, filename: string) {
  console.log(`Downloading ${url} into ${filename}`)
  const content = await limit(get.bind(null, url))
  await saveFile(filename, content)
  return content
}

