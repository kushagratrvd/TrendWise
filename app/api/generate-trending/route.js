import { NextResponse } from 'next/server';
import { fetchGoogleTrends } from '@/lib/fetchTrends';
import { generateArticle } from '@/lib/generateArticle';
import Article from '@/models/Article';
import mongoose from 'mongoose';

export async function GET() {
  await mongoose.connect(process.env.MONGODB_URI);

  const googleTrends = await fetchGoogleTrends();

  for (const topic of googleTrends) {
    const exists = await Article.findOne({ title: topic });
    if (exists) continue;

    const articleData = await generateArticle(topic);
    articleData.fromTrend = true;
    articleData.createdAt = new Date();

    await Article.create(articleData);

    const count = await Article.countDocuments();
    if (count > 50) {
      const toDelete = await Article.find().sort({ createdAt: 1 }).limit(count - 50);
      const ids = toDelete.map(a => a._id);
      await Article.deleteMany({ _id: { $in: ids } });
    }
  }

  await mongoose.disconnect();
  return NextResponse.json({ status: 'ok' });
}