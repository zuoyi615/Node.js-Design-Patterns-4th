import { concatFiles } from './18-sequential-concat-files.ts'

try {
  await concatFiles(process.argv[2], process.argv.slice(3))
} catch (err) {
  console.log(err)
  process.exit(1)
}
