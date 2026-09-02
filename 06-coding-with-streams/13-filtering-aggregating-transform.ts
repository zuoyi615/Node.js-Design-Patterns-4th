import { createReadStream } from 'node:fs'
import { Parser } from 'csv-parse'
import { createGunzip } from 'node:zlib'
import { join } from 'node:path'
import { FilterByCountry } from './13-filter-by-country.ts'
import { SumProfit } from './13-sum-profit.ts'

const dataPath = join(import.meta.dirname, 'data.csv.gz')
const csvParser = new Parser({ columns: true })

createReadStream(dataPath)
  .pipe(createGunzip())
  .pipe(csvParser)
  .pipe(new FilterByCountry('Italy'))
  .pipe(new SumProfit())
  .pipe(process.stdout)

