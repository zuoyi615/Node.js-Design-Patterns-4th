import { join } from 'node:path'
import { ToFileSystem } from './11-custom-writable-to-file-stream.ts'

const tfs = new ToFileSystem()
const outDir = join(import.meta.dirname, 'files')

tfs.write({ path: join(outDir, 'file1.txt'), content: 'Hello' })
tfs.write({ path: join(outDir, 'file2.txt'), content: 'Node.js' })
tfs.write({ path: join(outDir, 'file3.txt'), content: 'streams' })
tfs.end(() => console.log('All files created.'))

