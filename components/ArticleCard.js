import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

export default function ArticleCard({ article }) {
  const excerpt = article.excerpt || article.content?.substring(0, 150) + '...'
  const imageUrl = article.media?.images?.[0] || 'https://picsum.photos/400/250'
  
  return (
    <Link href={`/article/${article.slug}`} className="group">
      <article className="card hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
            {excerpt}
          </p>
          
          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
            <span>
              {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
            </span>
            {article.meta?.readTime && (
              <span>{article.meta.readTime} min read</span>
            )}
          </div>
          
          {/* Tags */}
          {article.meta?.keywords && article.meta.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {article.meta.keywords.slice(0, 3).map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
} 