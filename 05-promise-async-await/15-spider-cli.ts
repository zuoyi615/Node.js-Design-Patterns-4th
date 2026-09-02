import { spider } from './15-async-await-web-spider-v5.ts';

// node 15-spider-cli.ts https://nodejsdesignpatterns.com/blog 3

const url = process.argv[2]
const maxDepth = Number.parseInt(process.argv[3], 10) || 1

try {
  await spider(url, maxDepth)
  console.log('Download complete')
} catch (e) {
  console.log(e)
  process.exit(1)
}
