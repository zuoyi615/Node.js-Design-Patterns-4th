import { readFile } from "node:fs";
import { URL } from "node:url";

const filePath = new URL('file-B.json', import.meta.url)

// However, if you move the two calls within an I/O cycle
// the immediate callback is always executed first
readFile(filePath, (err, cb) => {
  setTimeout(console.log.bind(null, 'timeout'), 0)
  setImmediate(console.log.bind(null, 'immediate'))
})
