import express from 'express'
import { WebSocketServer } from 'ws'
import cors from 'cors'
import { createServer } from 'http'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class WebShareTesterServer {
  constructor(options = {}) {
    this.port = options.port || 3001
    this.app = express()
    this.server = createServer(this.app)
    this.wss = new WebSocketServer({ server: this.server })
    this.clients = new Set()
    
    this.setupMiddleware()
    this.setupRoutes()
    this.setupWebSocket()
  }

  setupMiddleware() {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.static(path.join(__dirname, '../dist')))
  }

  setupRoutes() {
    // Health check endpoint
    this.app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() })
    })

    // Serve the client shim script
    this.app.get('/web-share-tester-shim.js', (req, res) => {
      const shimPath = path.join(__dirname, 'client-shim.js')
      res.setHeader('Content-Type', 'application/javascript')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.sendFile(shimPath)
    })

    // Serve the test app
    this.app.get('/test', (req, res) => {
      const testPath = path.join(__dirname, '../test/test-app.html')
      res.sendFile(testPath)
    })

    // Endpoint to receive intercepted share data
    this.app.post('/api/share', (req, res) => {
      const shareData = req.body
      console.log('📤 Intercepted share data:', shareData)
      
      // Broadcast to all connected WebSocket clients
      this.broadcast({
        type: 'SHARE_INTERCEPTED',
        data: shareData,
        timestamp: new Date().toISOString()
      })
      
      res.json({ success: true, received: shareData })
    })

    // Serve the testing interface for all other routes
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist/index.html'))
    })
    
    // Catch-all route for SPA
    this.app.get('*', (req, res) => {
      // Only serve index.html for non-API routes
      if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, '../dist/index.html'))
      } else {
        res.status(404).json({ error: 'API endpoint not found' })
      }
    })
  }

  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      console.log('🔗 Client connected to WebSocket')
      this.clients.add(ws)

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'CONNECTED',
        message: 'Connected to Web Share Tester server',
        timestamp: new Date().toISOString()
      }))

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message)
          console.log('📨 Received WebSocket message:', data)
          
          // Handle different message types
          switch (data.type) {
            case 'PING':
              ws.send(JSON.stringify({ type: 'PONG', timestamp: new Date().toISOString() }))
              break
            default:
              console.log('❓ Unknown message type:', data.type)
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error)
        }
      })

      ws.on('close', () => {
        console.log('🔌 Client disconnected from WebSocket')
        this.clients.delete(ws)
      })

      ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error)
        this.clients.delete(ws)
      })
    })
  }

  broadcast(message) {
    const messageStr = JSON.stringify(message)
    this.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(messageStr)
      }
    })
  }

  async start() {
    return new Promise((resolve, reject) => {
      // Try the specified port first
      this.server.listen(this.port, (error) => {
        if (error) {
          if (error.code === 'EADDRINUSE') {
            console.log(`⚠️  Port ${this.port} is busy, trying next available port...`)
            this.findAvailablePort().then(resolve).catch(reject)
          } else {
            reject(error)
          }
        } else {
          console.log(`🚀 Web Share Tester server running on http://localhost:${this.port}`)
          console.log(`🔗 WebSocket server running on ws://localhost:${this.port}`)
          resolve(this.port)
        }
      })
    })
  }

  async findAvailablePort() {
    return new Promise((resolve, reject) => {
      const tryPort = (port) => {
        this.server.listen(port, (error) => {
          if (error) {
            if (error.code === 'EADDRINUSE' && port < 3010) {
              tryPort(port + 1)
            } else {
              reject(error)
            }
          } else {
            this.port = port
            console.log(`🚀 Web Share Tester server running on http://localhost:${port}`)
            console.log(`🔗 WebSocket server running on ws://localhost:${port}`)
            resolve(port)
          }
        })
      }
      tryPort(this.port + 1)
    })
  }

  stop() {
    return new Promise((resolve) => {
      this.wss.close(() => {
        this.server.close(() => {
          console.log('🛑 Web Share Tester server stopped')
          resolve()
        })
      })
    })
  }
}

export { WebShareTesterServer }
export default WebShareTesterServer

// If running directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new WebShareTesterServer()
  
  server.start().catch((error) => {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  })

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...')
    await server.stop()
    process.exit(0)
  })
}