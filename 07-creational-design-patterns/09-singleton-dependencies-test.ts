import { Blog } from './09-blog.ts'

const blog = new Blog()
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
