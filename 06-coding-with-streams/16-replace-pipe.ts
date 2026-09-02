import { ReplaceStream } from './12-transform-stream-replace.ts'

process
  .stdin
  .pipe(new ReplaceStream(process.argv[2], process.argv[3]))
  .pipe(process.stdout)

// echo Hello World! | node 16-replace.ts World Node.js
