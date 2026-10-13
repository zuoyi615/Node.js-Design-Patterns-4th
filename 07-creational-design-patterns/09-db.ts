import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const storagePath = join(import.meta.dirname, '09-data.db')

export const db = new DatabaseSync(storagePath)
