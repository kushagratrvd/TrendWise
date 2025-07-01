# TrendWise - AI-Powered Trending Blog Platform

A full-stack, SEO-optimized blog platform that automatically generates articles from trending topics using Google Gemini AI.

## 🚀 Features

### Core Features
- **AI Article Generation**: Automatically generates SEO-optimized articles using Google Gemini (Generative AI)
- **Trending Topics**: Fetches trending topics from Google Trends
- **Google Authentication**: Secure login with NextAuth.js
- **Comment System**: Authenticated users can comment on articles
- **Search Functionality**: Full-text search across articles
- **SEO Optimized**: Dynamic sitemap, meta tags, and structured data
- **Responsive Design**: Modern UI with TailwindCSS

### Technical Features
- **Next.js 14**: App Router for optimal performance
- **MongoDB**: Scalable database with Mongoose ODM
- **NextAuth.js**: Secure authentication with Google OAuth
- **Gemini Integration**: Google Generative AI-powered content generation
- **Web Scraping**: Puppeteer for fetching trending topics
- **Vercel Ready**: Optimized for deployment on Vercel

## 📋 Prerequisites

Before you begin, ensure you have the following:
- Node.js 18+ installed
- MongoDB database (local or cloud)
- Google OAuth credentials
- Gemini API key (Google Generative AI)
- Unsplash API key (for images)
- YouTube Data API key (for videos)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/trendwise.git
   cd trendwise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GEMINI_API_KEY=your-gemini-api-key
   UNSPLASH_ACCESS_KEY=your-unsplash-access-key
   YOUTUBE_API_KEY=your-youtube-api-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### MongoDB Setup
1. Create a MongoDB database (local or MongoDB Atlas)
2. Get your connection string
3. Add it to `MONGODB_URI` in `.env.local`

### Gemini API Setup
1. Sign up at [Google AI Studio](https://aistudio.google.com/)
2. Get your Gemini API key
3. Add it to `GEMINI_API_KEY` in `.env.local`

### Unsplash API Setup
1. Sign up at [Unsplash Developers](https://unsplash.com/developers)
2. Create a new app and get your Access Key
3. Add it to `UNSPLASH_ACCESS_KEY` in `.env.local`

### YouTube Data API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3 for your project
3. Create an API key
4. Add it to `YOUTUBE_API_KEY` in `.env.local`

## 📁 Project Structure

```
trendwise/
├── app/                    # Next.js 14 App Router
│   ├── layout.js          # Root layout
│   ├── page.js            # Homepage
│   ├── article/[slug]/    # Article detail pages
│   ├── login/             # Login page
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utility functions (AI, scraping, media)
├── models/                # Mongoose models
├── public/                # Static assets
└── styles/                # Custom styles
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## 📊 API Routes

| Route            | Method | Description                        |
|------------------|--------|------------------------------------|
| `/api/article`   | GET    | Fetch articles with optional search |
| `/api/article`   | POST   | Create new article or trigger generation |
| `/api/comment`   | GET    | Fetch comments for an article       |
| `/api/comment`   | POST   | Create new comment (authenticated)  |
| `/sitemap.xml`   | GET    | Dynamic sitemap                     |
| `/robots.txt`    | GET    | Robots.txt configuration            |

## 🎯 Usage

### For Users
1. **Browse Articles**: Visit the homepage to see all articles
2. **Search**: Use the search bar to find specific topics
3. **Read Articles**: Click on any article to read the full content
4. **Comment**: Sign in with Google to leave comments
5. **Stay Updated**: Check back regularly for new AI-generated content

### For Admins
1. **Access Admin Panel**: Sign in with an admin email (contains 'admin')
2. **Generate Articles**: Use the admin dashboard to trigger article generation
3. **Manage Content**: View or delete articles
4. **Monitor Performance**: Track article engagement and comments

## 🔒 Security Features

- **Authentication**: Google OAuth with NextAuth.js
- **Authorization**: Role-based access control for admin features
- **Input Validation**: Server-side validation for all inputs
- **CORS**: Properly configured for production

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Edit `app/globals.css` for custom styles
- Update component styles in individual component files

### Content Generation
- Modify prompts in `lib/generateArticle.js`
- Add new trending sources in `lib/fetchTrends.js`
- Customize article structure in the Article model

### Features
- Add new API routes in `app/api/`
- Create new pages in the `app/` directory
- Extend models in the `models/` directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:
1. Check the [Issues](https://github.com/yourusername/trendwise/issues) page
2. Create a new issue with detailed information
3. Contact via email: your-email@example.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Google Gemini](https://aistudio.google.com/) for AI capabilities
- [MongoDB](https://mongodb.com/) for the database
- [TailwindCSS](https://tailwindcss.com/) for styling
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Unsplash](https://unsplash.com/) for images
- [YouTube Data API](https://developers.google.com/youtube/v3) for videos

---

**Built with ❤️ for the developer community** 