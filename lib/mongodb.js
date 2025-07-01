import mongoose from 'mongoose'
import Article from '../models/Article'
import Comment from '../models/Comment'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

function toPlain(obj) {
  if (!obj) return obj;
  const plain = { ...obj, _id: obj._id?.toString?.() || obj._id };
  if (plain.createdAt) plain.createdAt = plain.createdAt.toString();
  if (plain.updatedAt) plain.updatedAt = plain.updatedAt.toString();
  return plain;
}

// Article functions
export async function getArticles(query = '') {
  await connectDB()
  
  const filter = query
    ? {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { 'meta.keywords': { $in: [new RegExp(query, 'i')] } },
        ],
      }
    : {}
  
  const articles = await Article.find(filter).sort({ createdAt: -1 }).lean()
  return articles.map(toPlain)
}

export async function getArticleBySlug(slug) {
  await connectDB()
  const article = await Article.findOne({ slug }).lean()
  return toPlain(article)
}

export async function createArticle(articleData) {
  await connectDB()
  // Check for existing article with the same slug
  const existing = await Article.findOne({ slug: articleData.slug })
  if (existing) {
    throw new Error('Article with this slug already exists.')
  }
  const article = new Article({
    ...articleData,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return await article.save()
}

// Comment functions
export async function getComments(articleId) {
  await connectDB()
  return await Comment.find({ articleId }).sort({ createdAt: -1 }).lean()
}

export async function createComment(commentData) {
  await connectDB()
  
  const comment = new Comment({
    ...commentData,
    createdAt: new Date(),
  })
  
  return await comment.save()
}

export async function deleteArticle(slug) {
  await connectDB();
  await Article.deleteOne({ slug });
}

export default connectDB 