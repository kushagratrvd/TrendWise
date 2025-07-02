import mongoose from 'mongoose';
import { fetchGoogleTrends } from '../lib/fetchTrends.js';
import { generateArticle } from '../lib/generateArticle.js';
import Article from '../models/Article.js';

const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB!');

    // 1. Fetch trending topics
    const googleTrends = await fetchGoogleTrends();
    console.log('Fetched Google Trends:', googleTrends);

    for (const topic of googleTrends) {
      // 2. Check if article already exists
      const exists = await Article.findOne({ title: topic });
      if (exists) {
        console.log('Article already exists for topic:', topic);
        continue;
      }

      // 3. Generate article content
      console.log('Generating article for topic:', topic);
      let articleData;
      try {
        articleData = await generateArticle(topic);
      } catch (err) {
        console.error('Error generating article for topic:', topic, err);
        continue;
      }
      articleData.fromTrend = true;
      articleData.createdAt = new Date();

      // 4. Save new article
      try {
        await Article.create(articleData);
        console.log('Saved article:', articleData.title);
      } catch (err) {
        console.error('Error saving article for topic:', topic, err);
        continue;
      }

      // 5. Enforce limit: keep only 50 newest articles
      const count = await Article.countDocuments();
      if (count > 50) {
        const toDelete = await Article.find().sort({ createdAt: 1 }).limit(count - 50);
        const ids = toDelete.map(a => a._id);
        await Article.deleteMany({ _id: { $in: ids } });
        console.log('Deleted oldest articles to maintain limit.');
      }
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB. Script finished successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Fatal error in script:', err);
    try {
      await mongoose.disconnect();
    } catch (e) {
      // ignore
    }
    process.exit(1);
  }
}

main(); 