'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default function AdminDashboard({ articles }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [topic, setTopic] = useState('')
  const [generationStatus, setGenerationStatus] = useState('')
  const [trendingTopics, setTrendingTopics] = useState([])
  const [showTrending, setShowTrending] = useState(false)

  const handleGenerateArticle = async (e) => {
    e.preventDefault()
    if (!topic.trim() || isGenerating) return

    setIsGenerating(true)
    setGenerationStatus('Generating article...')

    try {
      const response = await fetch('/api/article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          triggerGeneration: true,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGenerationStatus(`Article generated successfully: ${data.article.title}`)
        setTopic('')
        setTimeout(() => window.location.reload(), 2000)
      } else {
        setGenerationStatus('Failed to generate article. Please try again.')
      }
    } catch (error) {
      console.error('Error generating article:', error)
      setGenerationStatus('Error generating article. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = async (slug) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/article?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        window.location.reload(); // or remove the article from state for instant UI update
      } else {
        alert('Failed to delete article');
      }
    } catch (err) {
      alert('Error deleting article');
    }
  };

  const fetchTrendingTopics = async () => {
    setShowTrending((prev) => !prev)
    if (trendingTopics.length === 0) {
      try {
        const res = await fetch('/api/scrape')
        const data = await res.json()
        setTrendingTopics(data.googleTrends || [])
      } catch (err) {
        setTrendingTopics(['Failed to fetch topics'])
      }
    }
  }

  const handleTopicClick = (selectedTopic) => {
    setTopic(selectedTopic)
    setShowTrending(false)
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Generate New Article
        </h2>
        
        <form onSubmit={handleGenerateArticle} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              Trending Topic
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a trending topic (e.g., 'AI developments', 'Tech news')"
                className="input-field flex-1"
                disabled={isGenerating}
              />
              <button
                type="button"
                onClick={fetchTrendingTopics}
                className="btn-secondary px-3 py-2 text-sm"
                disabled={isGenerating}
              >
                {showTrending ? 'Hide' : 'Show'} Trending
              </button>
            </div>
            {showTrending && trendingTopics.length > 0 && (
              <ul className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                {trendingTopics.map((t, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      className="w-full text-left px-2 py-1 hover:bg-primary-100 rounded transition"
                      onClick={() => handleTopicClick(t)}
                    >
                      {t}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!topic.trim() || isGenerating}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Article'}
          </button>
        </form>
        
        {generationStatus && (
          <div className={`mt-4 p-3 rounded-lg ${
            generationStatus.includes('successfully') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {generationStatus}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Manage Articles ({articles.length})
          </h2>
          <div className="text-sm text-gray-500">
            Total Articles
          </div>
        </div>

        {articles.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No articles available. Generate your first article above!
          </p>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      <Link href={`/article/${article.slug}`} className="hover:text-primary-600">
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {article.excerpt || article.content?.substring(0, 150) + '...'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                      </span>
                      {article.meta?.readTime && (
                        <span>{article.meta.readTime} min read</span>
                      )}
                      <span>Slug: {article.slug}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Link
                      href={`/article/${article.slug}`}
                      className="px-5 py-2 rounded-lg bg-primary-600 text-white text-base font-semibold hover:bg-primary-700 transition-colors duration-200 shadow-md"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(article.slug)}
                      className="px-5 py-2 rounded-lg bg-red-600 text-white text-base font-semibold hover:bg-red-700 transition-colors duration-200 shadow-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {article.meta?.keywords && article.meta.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {article.meta.keywords.map((keyword, index) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 