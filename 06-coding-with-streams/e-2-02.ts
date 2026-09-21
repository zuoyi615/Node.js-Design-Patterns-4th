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

// 02. What are the most dangerous areas of London?
pipeline(
  readStream,
  csvParser,
  new CountCrimesByParam({ param: 'borough' }),
  new SortAndLimit({ sortDirection: 'desc', limit: 20 }),
  new ResultToString({ label: 'Most dangerous areas in London' }),
  process.stdout,
  callback
)
