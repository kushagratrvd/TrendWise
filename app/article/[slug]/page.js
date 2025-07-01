import { getArticleBySlug, getArticles } from '../../../lib/mongodb'
import ArticleDetail from '../../../components/ArticleDetail'
import CommentSection from '../../../components/CommentSection'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }) {
  const article = await getArticleBySlug(params.slug)
  
  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    }
  }

  return {
    title: `${article.title} - TrendWise`,
    description: article.meta?.description || article.excerpt,
    keywords: article.meta?.keywords?.join(', ') || '',
    openGraph: {
      title: article.title,
      description: article.meta?.description || article.excerpt,
      type: 'article',
      publishedTime: article.createdAt,
      authors: ['TrendWise AI'],
      images: article.media?.images?.[0] || '/og-image.jpg',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.meta?.description || article.excerpt,
      images: article.media?.images?.[0] || '/og-image.jpg',
    },
  }
}

export default async function ArticlePage({ params }) {
  const article = await getArticleBySlug(params.slug)
  
  if (!article) {
    notFound()
  }

  // Remove meta description comment from markdown before rendering
  const content = article.content.replace(/<!--.*?-->/s, '').trim();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ArticleDetail article={{ ...article, content }} />
      <CommentSection articleId={article._id} />
    </div>
  )
} 