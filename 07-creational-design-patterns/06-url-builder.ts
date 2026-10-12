import { Url } from './06-url.ts'

export class UrlBuilder {
  #protocol: string
  #username: string
  #password: string
  #hostname: string
  #port: string
  #pathname: string
  #search: string
  #hash: string

  setProtocol(protocol: string) {
    this.#protocol = protocol
    return this
  }

  setAuthentication(username: string, password: string) {
    this.#username = username
    this.#password = password
    return this
  }

  setHostname(hostname: string) {
    this.#hostname = hostname
    return this
  }

  setPort(port: string) {
    this.#port = port
    return this
  }

  setPathname(pathname: string) {
    this.#pathname = pathname
    return this
  }

  setSearch(search: string) {
    this.#search = search
    return this
  }

  setHash(hash: string) {
    this.#hash = hash
    return this
  }

  build() {
    return new Url(
      this.#protocol,
      this.#username,
      this.#password,
      this.#hostname,
      this.#port,
      this.#pathname,
      this.#search,
      this.#hash,
    )
  }
}
