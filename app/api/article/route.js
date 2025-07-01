'use server'

import { NextResponse } from 'next/server'
import { getArticles, createArticle, deleteArticle } from '../../../lib/mongodb'
import { generateArticle } from '../../../lib/generateArticle'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    
    const articles = await getArticles(query)
    
    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { topic, triggerGeneration = false } = body

    if (triggerGeneration) {
      // Trigger article generation from trending topics
      const generatedArticle = await generateArticle(topic)
      const savedArticle = await createArticle(generatedArticle)
      return NextResponse.json({ article: savedArticle })
    } else {
      // Create article from provided data
      const savedArticle = await createArticle(body)
      return NextResponse.json({ article: savedArticle })
    }
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), { status: 400 });
    }
    await deleteArticle(slug);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error deleting article:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete article' }), { status: 500 });
  }
} 