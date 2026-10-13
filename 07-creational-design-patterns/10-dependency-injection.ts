import { join } from 'node:path'
import { Blog } from './10-blog.ts'
import { createDb } from './10-db.ts'

const storagePath = join(import.meta.dirname, '10-data.db')
const db = createDb(storagePath)
const blog = new Blog(db)

blog.initialize()

const posts = blog.getAllPosts()

if (posts.length === 0) {
  console.log(
    'No post available. Run `node import-posts.js`' +
    ' to load some sample posts'
  )
}

for (const post of posts) {
  console.log(post.title)
  console.log('-'.repeat(post.title.length))
  console.log(`Published on ${new Date(post.created_at).toISOString()}`)
  console.log(post.content)
}
