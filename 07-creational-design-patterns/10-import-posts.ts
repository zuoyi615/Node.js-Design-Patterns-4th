import { join } from 'node:path'
import { Blog } from './10-blog.ts'
import { createDb } from './10-db.ts'


const posts = [
  {
    id: 'my-first-post',
    title: 'My first post',
    content: 'Hello World!\nThis is my first post',
    created_at: new Date('2020-02-03'),
  },
  {
    id: 'iterator-patterns',
    title: 'Node.js iterator patterns',
    content: "Let's talk about some iterator patterns in Node.js\n\n...",
    created_at: new Date('2020-02-06'),
  },
  {
    id: 'dependency-injection',
    title: 'Dependency injection in Node.js',
    content:
      'Today we will discuss about dependency injection in Node.js\n\n...',
    created_at: new Date('2020-02-29'),
  },
]

const storagePath = join(import.meta.dirname, '10-data.db')
const db = createDb(storagePath)
const blog = new Blog(db)

blog.initialize()

await Promise.all(
  posts.map(post =>
    blog.createPost(post.id, post.title, post.content, post.created_at)
  )
)
console.log('All posts imported')
