import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useMemo } from 'react'

function extractYouTubeId(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com.*v=)([^&]+)/);
  return match ? match[1] : '';
}

const MarkdownWithEmbeds = ({ content, videos }) => {
  let firstHeadingRendered = false;
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children }) => {
          if (
            href &&
            (href.includes('youtube.com/watch') || href.includes('youtu.be/')) &&
            videos &&
            videos.includes(href)
          ) {
            const id = extractYouTubeId(href);
            if (id) {
              return (
                <div className="aspect-video my-4">
                  <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  />
                </div>
              );
            }
          }
          return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
        },
        h1: ({ node, ...props }) => {
          if (!firstHeadingRendered) {
            firstHeadingRendered = true;
            return (
              <h2 className="text-3xl font-bold underline mb-4 mt-6" {...props} />
            );
          }
          return <h2 className="text-2xl font-semibold mb-3 mt-5" {...props} />;
        },
        h2: ({ node, ...props }) => (
          <h3 className="text-xl font-semibold mb-2 mt-4" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default function ArticleDetail({ article }) {
  const imageUrl = article.media?.images?.[0] || 'https://picsum.photos/800/400'
  
  // Remove meta description and estimated reading time from markdown before rendering
  const cleanedContent = useMemo(() =>
    article.content
      .replace(/<!--.*?-->/s, '') // Remove meta description comment
      .replace(/^Estimated Reading Time:.*$/im, '') // Remove estimated reading time line
      .replace(/^\s*[\r\n]/gm, '\n') // Remove extra blank lines
      .trim()
  , [article.content]);

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Hero Image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-4xl md:text-5xl font-extrabold underline text-white mb-4">
            {article.title}
          </h1>
          <div className="flex items-center text-white/90 text-base space-x-6 mb-2">
            <span>
              {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
            </span>
            {article.meta?.readTime && (
              <span className="italic bg-white/20 px-3 py-1 rounded-lg text-lg font-medium border border-white/30">
                Estimated Reading Time: ~{article.meta.readTime} minutes
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Article Content */}
      <div className="p-6 md:p-8">
        {/* Meta Information */}
        {article.meta?.description && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 italic">{article.meta.description}</p>
          </div>
        )}
        
        {/* Tags */}
        {article.meta?.keywords && article.meta.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {article.meta.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
        
        {/* Main Content */}
        <div className="prose prose-lg max-w-none prose-p:mb-6 prose-p:leading-relaxed">
          <MarkdownWithEmbeds content={cleanedContent} videos={article.media?.videos || []} />
        </div>
        
        {/* Embedded Media */}
        {article.media && (
          <div className="mt-8 space-y-6">
            {/* Images */}
            {article.media.images && article.media.images.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {article.media.images.slice(1).map((image, index) => (
                  <div key={index} className="relative h-48 overflow-hidden rounded-lg">
                    <Image
                      src={image}
                      alt={`${article.title} - Image ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Videos */}
            {article.media.videos && article.media.videos.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Related Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {article.media.videos.map((video, index) => (
                    <div key={index} className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <iframe
                        src={`https://www.youtube.com/embed/${extractYouTubeId(video)}`}
                        title={`YouTube video player ${index + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-64 rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Tweets */}
            {article.media.tweets && article.media.tweets.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Related Tweets</h3>
                <div className="space-y-4">
                  {article.media.tweets.map((tweet, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <a
                        href={tweet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View Tweet {index + 1}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  )
} 