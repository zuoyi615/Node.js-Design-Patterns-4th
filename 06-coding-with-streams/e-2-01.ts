import { parse } from 'csv-parse'
import { createReadStream } from 'node:fs'
import { CountCrimesByParam } from './e-2-count-crimes-by-param.ts'
import { ResultToString } from './e-2-result-to-string.ts'
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

// 01. Did the number of crimes go up or down over the years?
pipeline(
  readStream,
  csvParser,
  new CountCrimesByParam({ param: 'year' }),
  new ResultToString({ label: 'Number of crimes by year' }),
  process.stdout,
  callback
)
