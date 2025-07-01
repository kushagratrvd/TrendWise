import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../lib/auth'
import Navbar from '../components/Navbar'
import { SessionProvider } from '../components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TrendWise - AI-Powered Trending Blog',
  description: 'Discover trending topics and AI-generated articles on the latest news and trends.',
  keywords: 'trending, blog, AI, news, articles',
  authors: [{ name: 'TrendWise Team' }],
  openGraph: {
    title: 'TrendWise - AI-Powered Trending Blog',
    description: 'Discover trending topics and AI-generated articles on the latest news and trends.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrendWise - AI-Powered Trending Blog',
    description: 'Discover trending topics and AI-generated articles on the latest news and trends.',
  },
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  )
} 