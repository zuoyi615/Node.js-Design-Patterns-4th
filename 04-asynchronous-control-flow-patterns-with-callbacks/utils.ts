import { access, constants } from 'node:fs'
import { extname, join } from 'node:path'
import { Buffer } from 'node:buffer'
import { URL } from 'node:url'
import slug from 'slug'
import { mkdirp } from 'mkdirp'
import { Parser } from 'htmlparser2'
import { HttpError } from './http-error.ts'

export function exists(
  path: string,
  callback: (err: Error | null, isExisted?: boolean) => void,
) {
  access(path, constants.F_OK, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return callback(null, false)
      }

      return callback(err)
    }

    // the file exists
    return callback(null, true)
  })
}

export function urlToFilename(url: string) {
  const parsedUrl = new URL(url)
  const urlComponents = parsedUrl.pathname.split('/')
  const originalFileName = urlComponents.pop()
  const urlPath = urlComponents
    .filter(component => component !== '')
    .map(component => slug(component, { remove: null }))
    .join('/')
  const basePath = join(parsedUrl.hostname, urlPath)
  const missingExtension = !originalFileName || extname(originalFileName) === ''

  if (missingExtension) {
    return join(basePath, originalFileName ?? '', 'index.html')
  }

  return join(basePath, originalFileName)
}

export function header(url: string, cb: (err: HttpError | null) => void) {
  fetch(url, { method: 'HEADER' })
    .then(response => {
      if (!response.ok) {
        throw new HttpError(response.status, response.statusText)
      }
      return null
    })
    .catch(e => cb(e))
}

export function get(
  url: string,
  cb: (err: HttpError | null, content: Buffer | null) => void,
) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new HttpError(response.status, `Failed to fetch ${url}:${response.statusText}`)
      }

      // NOTE: this loads all the content in memory and therefore is not suitable
      // to handle large payloads. stream is more appropriate for this senario
      return response.arrayBuffer()
    })
    .then(content => cb(null, Buffer.from(content)))
    .catch(err => cb(err, null))
}

export function recursiveMkdir(path: string, cb: (err: Error | null) => void) {
  mkdirp(path).then(cb.bind(null, null)).catch(e => cb(e))
}

export function getPageLinks(currentUrl: string, body: string) {
  const url = new URL(currentUrl)
  const internalLinks: string[] = []
  const parser = new Parser({
    onopentag(name, attribs) {
      if (name === 'a' && attribs.href) {
        const newUrl = new URL(attribs.href, url)
        if (
          newUrl.hostname === url.hostname &&
          newUrl.pathname !== url.pathname
        ) {
          internalLinks.push(newUrl.toString())
        }
      }
    },
  })

  parser.end(body)

  return internalLinks
}
