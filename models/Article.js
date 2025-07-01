import mongoose from 'mongoose'

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  excerpt: {
    type: String,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  meta: {
    description: String,
    keywords: [String],
    readTime: Number,
  },
  media: {
    images: [String],
    videos: [String],
    tweets: [String],
  },
  fromTrend: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
ArticleSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

// Create index for search functionality
ArticleSchema.index({
  title: 'text',
  content: 'text',
  'meta.keywords': 'text'
})

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema) 