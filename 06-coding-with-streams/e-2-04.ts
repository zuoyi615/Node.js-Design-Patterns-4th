import { parse } from 'csv-parse'
import { createReadStream } from 'node:fs'
import { ResultToString } from './e-2-result-to-string.ts'
import { TopCategoryPerArea } from './e-2-top-category-per-area.ts'
import { pipeline } from 'node:stream'

const filename = process.argv[2]
const readStream = createReadStream(filename)
const csvParser = parse({
  columns: true,
  skip_records_with_error: true,
})

function callback(error: Error | null) {
  if (!error) return
  console.log('an Error occurred in pipeline', error)
}

// 04. What is the most common crime per area?
pipeline(
  readStream,
  csvParser,
  new TopCategoryPerArea(),
  new ResultToString({ label: 'Most common crime per area' }),
  process.stdout,
  callback
)
