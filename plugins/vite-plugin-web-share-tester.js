import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import WebShareTesterServer from '../server/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Vite plugin for Web Share API testing
 * 
 * This plugin:
 * 1. Automatically injects the client shim script during development
 * 2. Starts the Web Share Tester server alongside Vite dev server
 * 3. Provides seamless integration for Web Share API testing
 */
export default function webShareTesterPlugin(options = {}) {
  const {
    port = 3001,
    enabled = true,
    enableOriginalShare = false, // Default to false for dev tool usage
    debug = false,
    autoOpen = false
  } = options

  let testerServer = null
  let actualPort = port

  return {
    name: 'vite-plugin-web-share-tester',
    
    configResolved(config) {
      // Only enable in development mode
      if (config.command !== 'serve' || !enabled) {
        return
      }
      
      console.log('🔗 Web Share Tester plugin enabled')
    },

    buildStart() {
      // Start the testing server when Vite starts
      if (enabled) {
        this.startTesterServer()
      }
    },

    configureServer(server) {
      if (!enabled) return

      // Add middleware to serve the client shim script
      server.middlewares.use('/web-share-tester-shim.js', (req, res, next) => {
        if (req.method !== 'GET') return next()
        
        // Read and serve the client shim script with dynamic configuration
        const shimPath = path.join(__dirname, '../server/client-shim.js')
        
        try {
          let shimContent = fs.readFileSync(shimPath, 'utf-8')
          
          // Inject configuration
          const configInjection = `
            const CONFIG = {
              serverPort: ${actualPort},
              enableOriginalShare: ${enableOriginalShare},
              debug: ${debug}
            }
          `
          
          // Replace the CONFIG definition in the shim
          shimContent = shimContent.replace(
            /const CONFIG = \{[^}]+\}/,
            configInjection.trim()
          )
          
          res.setHeader('Content-Type', 'application/javascript')
          res.end(shimContent)
        } catch (error) {
          console.error('❌ Failed to serve client shim:', error)
          res.statusCode = 500
          res.end('Failed to load Web Share Tester shim')
        }
      })
    },

    transformIndexHtml(html, context) {
      if (!enabled || context.server?.config.command !== 'serve') {
        return html
      }

      // Inject the client shim script into the HTML
      const shimScript = `
        <script>
          console.log('🔗 Loading Web Share Tester shim...')
        </script>
        <script src="/web-share-tester-shim.js"></script>
      `

      // Insert before closing head tag
      return html.replace('</head>', `${shimScript}</head>`)
    },

    async startTesterServer() {
      if (testerServer) return

      try {
        console.log('🚀 Starting Web Share Tester server...')
        testerServer = new WebShareTesterServer({ port })
        actualPort = await testerServer.start()
        
        console.log(`✅ Web Share Tester ready at http://localhost:${actualPort}`)
        
        if (autoOpen) {
          const { default: open } = await import('open')
          open(`http://localhost:${actualPort}`)
        }
      } catch (error) {
        console.error('❌ Failed to start Web Share Tester server:', error)
      }
    },

    async closeBundle() {
      // Stop the server when Vite stops
      if (testerServer) {
        console.log('🛑 Stopping Web Share Tester server...')
        await testerServer.stop()
        testerServer = null
      }
    }
  }
}

// Named export for plugin options
export { webShareTesterPlugin }