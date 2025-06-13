#!/usr/bin/env node

// CLI entry point for Web Share Tester
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory of this script
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Import and start the server
const { WebShareTesterServer } = await import(path.join(__dirname, '../server/index.js'))

const port = process.env.PORT || 3001

console.log('🚀 Starting Web Share Tester...')
console.log(`📱 Interface: http://localhost:${port}`)
console.log(`🧪 Test Page: http://localhost:${port}/test`)
console.log('💡 Add this to your dev app: <script src="http://localhost:3001/web-share-tester-shim.js"></script>')

const server = new WebShareTesterServer({ port })

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...')
  await server.stop()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down...')
  await server.stop()
  process.exit(0)
})

// Start the server
try {
  await server.start()
} catch (error) {
  console.error('❌ Failed to start server:', error)
  process.exit(1)
}