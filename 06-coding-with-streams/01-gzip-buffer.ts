import { readFile, writeFile } from 'node:fs/promises';
import { gzip } from 'node:zlib';
import { promisify } from 'node:util';

const gzipPromise = promisify(gzip) // NOTE: gzip is a callback-based function

try {
  const filename = process.argv[2]
  const data = await readFile(filename) // read whole data into memory
  const gzippedData = await gzipPromise(data) // gzip the entire data from memory
  await writeFile(`${filename}.gz`, gzippedData) // write all data into filename.gz once time
  console.log('File successfully compressed.')
} catch (e) {
  console.error(e)
}
