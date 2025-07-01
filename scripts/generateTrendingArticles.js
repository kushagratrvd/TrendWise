import mongoose from 'mongoose';
import { fetchGoogleTrends } from '../lib/fetchTrends.js';
import { generateArticle } from '../lib/generateArticle.js';
import Article from '../models/Article.js';

const MONGODB_URI = process.env.MONGODB_URI

async function main() {
  await mongoose.connect(MONGODB_URI);

  // 1. Fetch trending topics
  const googleTrends = await fetchGoogleTrends();

  for (const topic of googleTrends) {
    // 2. Check if article already exists
    const exists = await Article.findOne({ title: topic });
    if (exists) continue;

    // 3. Generate article content
    const articleData = await generateArticle(topic);
    articleData.fromTrend = true;
    articleData.createdAt = new Date();

    // 4. Save new article
    await Article.create(articleData);

    // 5. Enforce limit: keep only 50 newest articles
    const count = await Article.countDocuments();
    if (count > 50) {
      // Find and delete the oldest articles
      const toDelete = await Article.find().sort({ createdAt: 1 }).limit(count - 50);
      const ids = toDelete.map(a => a._id);
      await Article.deleteMany({ _id: { $in: ids } });
    }
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 