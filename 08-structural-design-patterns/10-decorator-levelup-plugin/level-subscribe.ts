import { type Level } from 'level'

export function levelSubscribe(db: Level) {
  db.subscribe = () => { }
}
