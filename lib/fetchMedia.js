import fetch from 'node-fetch';

export async function fetchUnsplashImages(query, count = 2) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&client_id=${accessKey}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results ? data.results.map(img => img.urls.regular) : [];
}

export async function fetchYouTubeVideos(query, count = 2) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${count}&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.items ? data.items.map(item => `https://www.youtube.com/watch?v=${item.id.videoId}`) : [];
}