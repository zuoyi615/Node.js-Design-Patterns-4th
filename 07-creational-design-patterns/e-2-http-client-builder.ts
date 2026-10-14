import { HttpClient } from './e-2-http-client.ts'

export class HttpClientBuilder {
  #method: string
  #url: string
  #headers: Record<string, string>
  #body: any

  setMethod(method: string) {
    this.#method = method
    return this
  }

  setUrl(url: string) {
    this.#url = url
    return this
  }

  setHeaders(headers: Record<string, string>) {
    this.#headers = headers
    return this
  }

  setBody(body: any) {
    this.#body = body
    return this
  }

  build() {
    return new HttpClient(
      this.#method,
      this.#url,
      this.#headers,
      this.#body,
    )
  }
}
