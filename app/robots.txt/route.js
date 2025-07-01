export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin area
Disallow: /admin

# Sitemap
Sitemap: ${process.env.NEXTAUTH_URL || 'https://trendwise.vercel.app'}/sitemap.xml

# Crawl-delay
Crawl-delay: 1`
  
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
} 