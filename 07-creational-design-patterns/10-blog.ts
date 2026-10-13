import { type DatabaseSync } from 'node:sqlite'

export type Post = {
  id: string
  title: string
  content: string
  created_at: string
}

export class Blog {
  #db: DatabaseSync

  constructor(db: DatabaseSync) {
    this.#db = db
  }

  initialize() {
    const initQuery = `CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

    return this.#db.exec(initQuery)
  }

  createPost(id: string, title: string, content: string, createdAt: Date) {
    const insert = this.#db.prepare('INSERT INTO posts VALUES(?, ?, ?, ?)')
    const result = insert.run(
      id,
      title,
      content,
      createdAt.toString(),
    )

    console.log(result)

    return
  }

  getAllPosts() {
    const query = this.#db.prepare('SELECT * FROM posts ORDER BY created_at DESC')
    const posts = query.all()
    return posts as Post[]
  }
}
