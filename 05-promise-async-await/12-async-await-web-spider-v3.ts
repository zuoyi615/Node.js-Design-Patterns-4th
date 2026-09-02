import { readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { urlToFilename, exists, get, recursiveMkdir, getPageLinks } from './utils.ts';

export async function spider(url: string, maxDepth: number) {
  const filename = urlToFilename(url)

  let content: string = ''

  if (!(await exists(filename))) content = await download(url, filename)

  if (!filename.endsWith('.html')) return

  if (!content) content = await readFile(filename, 'utf8')

  return spiderLinks(url, content, maxDepth)
}

async function saveFile(filename: string, content: string) {
  await recursiveMkdir(dirname(filename))
  return writeFile(filename, content)
}

async function download(url: string, filename: string) {
  console.log(`Downloading ${url} into ${filename}`)
  const content = await get(url)
  await saveFile(filename, content)
  return content
}

async function spiderLinks(url: string, content: string, maxDepth: number) {
  let promise = Promise.resolve()

  if (maxDepth === 0) return promise

  const links = getPageLinks(url, content)
  if (links.length === 0) return promise

  const promises = links.map(link => spider(link, maxDepth - 1))

  Promise.all(promises)
}
