import { DatabaseSync } from 'node:sqlite'

export function createDb(filename: string) {
  return new DatabaseSync(filename)
}
