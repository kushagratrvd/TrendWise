import puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import googleTrends from 'google-trends-api'

export async function fetchTrendingTopics() {
  try {
    // For demo purposes, return some trending topics
    // In production, you would scrape Google Trends, Twitter, or other sources
    const trendingTopics = [
      'Artificial Intelligence Developments',
      'Climate Change Solutions',
      'Space Exploration News',
      'Cryptocurrency Market Trends',
      'Electric Vehicle Technology',
      'Renewable Energy Innovations',
      'Digital Privacy and Security',
      'Remote Work Trends',
      'Mental Health Awareness',
      'Sustainable Living Tips'
    ]

    // Shuffle the array to get random topics
    const shuffled = trendingTopics.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 5) // Return 5 random topics
  } catch (error) {
    console.error('Error fetching trending topics:', error)
    // Fallback topics
    return [
      'Technology Trends',
      'Current Events',
      'Innovation News',
      'Digital Transformation',
      'Future of Work'
    ]
  }
}

// Scrape Google Trends
export async function fetchGoogleTrends() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://trends.google.com/trends/trendingsearches/daily?geo=US', { waitUntil: 'networkidle2' });

  // Wait for at least one topic to appear
  await page.waitForSelector('div.mZ3RIc');

  // Extract all topic names
  const topics = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div.mZ3RIc')).map(div => div.textContent.trim());
  });

  await browser.close();
  return topics;
}

// Function to get trending topics from multiple sources
export async function getTrendingTopicsFromMultipleSources() {
  try {
    const [googleTrends, staticTrends] = await Promise.allSettled([
      fetchGoogleTrends(),
      fetchTrendingTopics()
    ])

    const allTopics = []
    
    if (googleTrends.status === 'fulfilled') {
      allTopics.push(...googleTrends.value)
    }
    
    if (staticTrends.status === 'fulfilled') {
      allTopics.push(...staticTrends.value)
    }

    // Remove duplicates and return unique topics
    const uniqueTopics = [...new Set(allTopics)]
    return uniqueTopics.slice(0, 10)
  } catch (error) {
    console.error('Error fetching from multiple sources:', error)
    return fetchTrendingTopics() // Fallback to static topics
  }
} 