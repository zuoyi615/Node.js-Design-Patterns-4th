import { spider } from './03-promises-web-spider-v2.ts';

// node 03-spider-cli.ts https://nodejsdesignpatterns.com/blog 3

const url = process.argv[2]
const maxDepth = Number.parseInt(process.argv[3], 10) || 1

spider(url, maxDepth)
  .then(() => console.log('Download complete'))
  .catch(err => { // any error from the entire `spider()` process, any error will propagate to the `catch`
    console.log(err)
    process.exit(1)
  })
