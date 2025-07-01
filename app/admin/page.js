import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../lib/auth'
import { redirect } from 'next/navigation'
import { getArticles } from '../../lib/mongodb'
import AdminDashboard from '../../components/AdminDashboard'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  // Simple admin check - in production, you'd want proper role-based access
  if (!session /* || !session.user?.email?.includes('admin') */) {
    redirect('/')
  }

  const articles = await getArticles()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage articles and trigger content generation
        </p>
      </div>
      
      <AdminDashboard articles={articles} />
    </div>
  )
} 