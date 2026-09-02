import { createReadStream } from 'node:fs'
import { Parser } from 'csv-parse'
import { createGunzip } from 'node:zlib'
import { join } from 'node:path'
import { FilterByCountry } from './13-filter-and-sum.ts'

const dataPath = join(import.meta.dirname, 'data.csv.gz')
const csvParser = new Parser({ columns: true })

createReadStream(dataPath)
  .pipe(createGunzip())
  .pipe(csvParser)
  .pipe(new FilterByCountry('Italy'))
  .pipe(process.stdout)

