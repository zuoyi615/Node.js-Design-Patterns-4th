import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path';
import { logger } from "./logger.ts";
import './colorize-logger.ts'

logger.info('Hello, World!')

logger.warn('Free disk space is running low')

logger.error('Failed to connect to database')

logger.debug('main() is starting')

console.log(import.meta.filename)
console.log(import.meta.dirname)

console.log(import.meta.url) // file://

const __filename = fileURLToPath(import.meta.url) // /path/to/main.ts
console.log(__filename)

const __dirname = dirname(__filename) // /path/to/project
console.log(__dirname)
