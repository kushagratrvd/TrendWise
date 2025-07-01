import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchTrendingTopics } from './fetchTrends'
import { fetchUnsplashImages, fetchYouTubeVideos } from './fetchMedia';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateArticle(topic = null) {
  try {
    // If no topic provided, fetch trending topics
    let selectedTopic = topic
    if (!selectedTopic) {
      const trendingTopics = await fetchTrendingTopics()
      selectedTopic = trendingTopics[0] // Use the first trending topic
    }

    // Fetch real images and videos
    const images = await fetchUnsplashImages(selectedTopic, 2);
    const videos = await fetchYouTubeVideos(selectedTopic, 2);

    // Generate article using Gemini
    const prompt = `Write a comprehensive, SEO-optimized article about "${selectedTopic}" in markdown format.

Requirements:
- Create an engaging title as an H1
- Write 800-1200 words of high-quality content
- Use proper H2 and H3 headings for SEO
- Add relevant keywords naturally
- Make it informative and engaging
- Include a meta description at the top as an HTML comment
- Suggest 5-8 relevant keywords at the end as a markdown list
- Estimate reading time and show it at the top

Return ONLY the markdown content. Do NOT wrap it in JSON or a code block.`

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const articleData = {
      title: `Article about ${selectedTopic}`,
      slug: selectedTopic.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      excerpt: `A comprehensive article about ${selectedTopic}`,
      content: text, // This is now just markdown!
      meta: {
        description: `Learn more about ${selectedTopic} in this comprehensive article.`,
        keywords: [selectedTopic, 'trending', 'news'],
        readTime: 5
      },
      media: {
        images: images.length ? images : ['https://picsum.photos/800/400'],
        videos: videos,
        tweets: []
      }
    };

    return articleData
  } catch (error) {
    console.error('Error generating article:', error)
    throw new Error('Failed to generate article')
  }
}

export async function generateMultipleArticles(count = 3) {
  const articles = []
  const topics = await fetchTrendingTopics()
  
  for (let i = 0; i < Math.min(count, topics.length); i++) {
    try {
      const article = await generateArticle(topics[i])
      articles.push(article)
    } catch (error) {
      console.error(`Error generating article for topic ${topics[i]}:`, error)
    }
  }
  
  return articles
}

function extractArticleMeta(markdown) {
  // Meta Description (HTML comment)
  const metaDescMatch = markdown.match(/<!--\s*Meta Description:\s*([^>]*)-->/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : '';

  // Reading Time
  const readTimeMatch = markdown.match(/Estimated Reading Time:\s*(\d+)\s*minutes?/i);
  const readTime = readTimeMatch ? parseInt(readTimeMatch[1], 10) : 5;

  // Title (first H1)
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Keywords (markdown list at the end)
  // Look for a list of lines starting with "- " at the end of the string
  const keywordsMatch = markdown.match(/(?:^|\n)(- .+\n)+$/m);
  let keywords = [];
  if (keywordsMatch) {
    keywords = keywordsMatch[0]
      .split('\n')
      .map(line => line.replace(/^- /, '').trim())
      .filter(Boolean);
  }

  // Excerpt: first paragraph after title
  let excerpt = '';
  const paraMatch = markdown.match(/^#.+\n+(.+?)(\n|$)/ms);
  if (paraMatch) {
    excerpt = paraMatch[1].replace(/<!--.*?-->/g, '').trim();
  }

  return {
    title,
    meta: {
      description: metaDescription,
      keywords,
      readTime,
    },
    excerpt,
  };
} 