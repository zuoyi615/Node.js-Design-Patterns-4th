import { parse } from 'csv-parse'
import { createReadStream } from 'node:fs'
import { CountCrimesByParam } from './e-2-count-crimes-by-param.ts'
import { ResultToString } from './e-2-result-to-string.ts'
import { SortAndLimit } from './e-2-sort-and-limit.ts'
import { pipeline } from 'node:stream'

const filename = '/home/zuoyi/git/london_crime_by_lsoa.csv'
const readStream = createReadStream(filename)
const csvParser = parse({
  columns: true,
  skip_records_with_error: true,
})

function callback(error: Error | null) {
  if (!error) return
  console.log('an Error occurred in pipeline', error)
}

// 03. What is the least common crime?
pipeline(
  readStream,
  csvParser,
  new CountCrimesByParam({ param: 'major_category' }),
  new SortAndLimit({ sortDirection: 'asc', limit: 20 }),
  new ResultToString({ label: 'Top least common crimes' }),
  process.stdout,
  callback
)
