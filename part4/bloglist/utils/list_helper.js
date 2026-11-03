const dummy = () => 1

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((fav, blog) => (blog.likes > fav.likes ? blog : fav))
}

const totalsByAuthor = (blogs, valueOf) => {
  const totals = {}
  blogs.forEach((blog) => {
    totals[blog.author] = (totals[blog.author] || 0) + valueOf(blog)
  })
  return totals
}

const topAuthor = (totals, key) => {
  const entries = Object.entries(totals)
  if (entries.length === 0) return null
  const [author, value] = entries.reduce((best, entry) => (entry[1] > best[1] ? entry : best))
  return { author, [key]: value }
}

const mostBlogs = (blogs) => topAuthor(totalsByAuthor(blogs, () => 1), 'blogs')

const mostLikes = (blogs) => topAuthor(totalsByAuthor(blogs, (blog) => blog.likes), 'likes')

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
