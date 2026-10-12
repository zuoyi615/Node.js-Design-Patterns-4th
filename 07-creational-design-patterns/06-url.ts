export class Url {
  protocol: string
  username: string
  password: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string

  constructor(
    protocol: string,
    username: string,
    password: string,
    hostname: string,
    port: string,
    pathname: string,
    search: string,
    hash: string,
  ) {
    this.protocol = protocol
    this.username = username
    this.password = password
    this.hostname = hostname
    this.port = port
    this.pathname = pathname
    this.search = search
    this.hash = hash
  }

  validate() {
    if (!(this.protocol && this.hostname)) {
      throw new Error('Must specify at least a protocal and a hostname')
    }
  }

  toString() {
    let url = ''
    url += `${this.protocol}://`

    if (this.username && this.password) {
      url += `${this.username}:${this.password}@`
    }

    url += this.hostname

    if (this.port) {
      url += this.port
    }

    if (this.pathname) {
      url += this.pathname
    }

    if (this.search) {
      url += `?${this.search}`
    }

    if (this.hash) {
      url += `#${this.hash}`
    }

    return url
  }
}
