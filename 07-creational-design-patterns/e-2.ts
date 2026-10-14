import { HttpClientBuilder } from './e-2-http-client-builder.ts'

const httpClient = new HttpClientBuilder()
  .setMethod('get')
  .setUrl('https://httpbin.org/get')
  .setHeaders({ 'x-token': '123' })
  .build()

console.log()

try {
  const res = await httpClient.invoke()
  console.log(res)
} catch (e) {
  console.log(e)
}
