#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up TrendWise...')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...')
  const envExample = fs.readFileSync(path.join(process.cwd(), 'env.example'), 'utf8')
  fs.writeFileSync(envPath, envExample)
  console.log('✅ .env.local created. Please update it with your API keys.')
} else {
  console.log('✅ .env.local already exists.')
}

// Install dependencies
console.log('📦 Installing dependencies...')
try {
  execSync('npm install', { stdio: 'inherit' })
  console.log('✅ Dependencies installed successfully.')
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message)
  process.exit(1)
}

// Build the project
console.log('🔨 Building the project...')
try {
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ Project built successfully.')
} catch (error) {
  console.error('❌ Build failed:', error.message)
  console.log('💡 This might be expected if environment variables are not set yet.')
}

console.log('\n🎉 Setup complete!')
console.log('\n📋 Next steps:')
console.log('1. Update .env.local with your API keys')
console.log('2. Run "npm run dev" to start the development server')
console.log('3. Visit http://localhost:3000 to see your app')
console.log('\n📚 For more information, check the README.md file.') 