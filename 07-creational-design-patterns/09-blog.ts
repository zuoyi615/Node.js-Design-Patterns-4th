import { db } from './09-db.ts'

export type Post = {
  id: string
  title: string
  content: string
  created_at: string
}

export class Blog {
  initialize() {
    const initQuery = `CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

    return db.exec(initQuery)
  }

  createPost(id: string, title: string, content: string, createdAt: Date) {
    const insert = db.prepare('INSERT INTO posts VALUES(?, ?, ?, ?)')
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
    const query = db.prepare('SELECT * FROM posts ORDER BY created_at DESC')
    const posts = query.all()
    return posts as Post[]
  }
}
