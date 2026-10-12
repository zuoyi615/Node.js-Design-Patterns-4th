import { UrlBuilder } from './06-url-builder.ts'

const url = new UrlBuilder()
  .setProtocol('https')
  // .setAuthentication('zuoyi', '123456')
  .setHostname('zuoyi.dev')
  .build()

console.log(url.toString())
