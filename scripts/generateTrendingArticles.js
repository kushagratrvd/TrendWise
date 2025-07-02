import mongoose from 'mongoose';
import { fetchGoogleTrends } from '../lib/fetchTrends.js';
import { generateArticle } from '../lib/generateArticle.js';
import Article from '../models/Article.js';

const MONGODB_URI = process.env.MONGODB_URI

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  const googleTrends = await fetchGoogleTrends();
  console.log('Fetched trends:', googleTrends);

  for (const topic of googleTrends) {
    const exists = await Article.findOne({ title: topic });
    if (exists) {
      console.log('Already exists:', topic);
      continue;
    }

    console.log('Generating article for:', topic);
    const articleData = await generateArticle(topic);
    articleData.fromTrend = true;
    articleData.createdAt = new Date();

    await Article.create(articleData);
    console.log('Saved article:', articleData.title);

    const count = await Article.countDocuments();
    if (count > 50) {
      const toDelete = await Article.find().sort({ createdAt: 1 }).limit(count - 50);
      const ids = toDelete.map(a => a._id);
      await Article.deleteMany({ _id: { $in: ids } });
      console.log('Deleted oldest articles to maintain limit.');
    }
  }

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 