import { getArticles } from '../lib/mongodb'
import ArticleCard from '../components/ArticleCard'
import SearchBar from '../components/SearchBar'

export default async function HomePage({ searchParams }) {
  const query = searchParams?.q || ''
  const articles = await getArticles(query)

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to TrendWise
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover trending topics and AI-generated articles on the latest news and trends
        </p>
        <SearchBar />
      </div>

      {/* Articles Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            {query ? `Search Results for "${query}"` : 'Latest Articles'}
          </h2>
          <span className="text-gray-500">
            {articles.length} article{articles.length !== 1 ? 's' : ''}
          </span>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {query ? 'No articles found for your search.' : 'No articles available yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 