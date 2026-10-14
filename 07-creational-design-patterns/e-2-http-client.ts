import { request } from 'node:http'
import { parse } from 'node:url'

export class HttpClient {
  #data: any
  #options: Record<string, string>

  constructor(
    method: string,
    url: string,
    headers: Record<string, string>,
    body: any
  ) {
    this.#options = Object.assign(
      {},
      parse(url),
      {
        timeout: 2000,
        method,
        headers,
      },
    )

    this.#data = body
  }

  invoke() {
    return new Promise((resolve, reject) => {
      const req = request(this.#options, res => {
        let body = ''
        res.on('data', chunk => body += chunk.toString())
        res.on('error', reject)
        res.on('end', () => {
          if (res.statusCode == null) {
            return reject('Request Failed')
          }

          if (res.statusCode >= 200 && res.statusCode <= 299) {
            return resolve({ statusCode: res.statusCode, headers: res.headers, body })
          }

          return reject(`Request failed. status: ${res.statusCode} body: ${body}`)
        })
      })

      req.on('error', reject)

      if (this.#data) {
        req.write(this.#data, 'binary')
      }

      req.end()
    })
  }
}
