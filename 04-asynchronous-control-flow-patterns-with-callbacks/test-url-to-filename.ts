import { join, extname } from 'node:path'
import slug from 'slug'

// debug
// node --inspect-brk test-url-to-filename.ts
function urlToFilename(url: string) {
  debugger
  const parsedUrl = new URL(url)
  const urlComponents = parsedUrl.pathname.split('/')
  const originalFileName = urlComponents.pop()
  const urlPath = urlComponents
    .filter(component => component !== '')
    .map(component => slug(component))
    .join('/')
  const basePath = join(parsedUrl.hostname, urlPath)
  const missingExtension = !originalFileName || extname(originalFileName) === ''

  if (missingExtension) {
    return join(basePath, originalFileName ?? '', 'index.html')
  }

  return join(basePath, originalFileName)
}
const filename = urlToFilename('https://nodejsdesignpatterns.com/blog/')

console.log(filename)
