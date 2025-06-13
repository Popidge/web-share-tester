import { useState, useEffect, useRef } from 'preact/hooks'
import './app.css'
import { IOSShareMockup, AndroidShareMockup, MacOSShareMockup, WindowsShareMockup } from './components/ShareMockups.jsx'

export function App() {
  const [activeView, setActiveView] = useState('sender')
  const [selectedPlatform, setSelectedPlatform] = useState('ios')
  const [selectedShareTarget, setSelectedShareTarget] = useState('messages')
  const [shareData, setShareData] = useState({
    title: 'Check out this awesome article!',
    text: 'I found this really interesting article about web development that I think you\'d enjoy reading.',
    url: 'https://example.com/awesome-article'
  })
  
  // WebSocket and live mode state
  const [isLiveMode, setIsLiveMode] = useState(false)
  const [wsConnected, setWsConnected] = useState(false)
  const [lastInterceptedAt, setLastInterceptedAt] = useState(null)
  const wsRef = useRef(null)

  const platforms = [
    { id: 'ios', name: 'iOS', icon: '📱' },
    { id: 'android', name: 'Android', icon: '🤖' },
    { id: 'macos', name: 'macOS', icon: '💻' },
    { id: 'windows', name: 'Windows', icon: '🪟' }
  ]

  const shareTargets = [
    { id: 'messages', name: 'Messages', icon: '💬' },
    { id: 'mail', name: 'Mail/Email', icon: '📧' },
    { id: 'twitter', name: 'Twitter', icon: '🐦' },
    { id: 'whatsapp', name: 'WhatsApp', icon: '💚' }
  ]

  const handleInputChange = (field, value) => {
    setShareData(prev => ({ ...prev, [field]: value }))
  }

  const handleShareTargetClick = (targetId) => {
    setSelectedShareTarget(targetId)
    setActiveView('receiver')
  }

  // WebSocket connection management
  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsHost = window.location.hostname || 'localhost'
      const wsUrl = `${wsProtocol}//${wsHost}:3001`
      
      console.log('🔗 Connecting to WebSocket:', wsUrl)
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected')
        setWsConnected(true)
        setIsLiveMode(true)
      }
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          console.log('📨 WebSocket message:', message)
          
          switch (message.type) {
            case 'SHARE_INTERCEPTED':
              console.log('🎯 Share data intercepted:', message.data)
              // Update share data with intercepted data
              if (message.data.title !== undefined) setShareData(prev => ({ ...prev, title: message.data.title }))
              if (message.data.text !== undefined) setShareData(prev => ({ ...prev, text: message.data.text }))
              if (message.data.url !== undefined) setShareData(prev => ({ ...prev, url: message.data.url }))
              
              setLastInterceptedAt(new Date(message.timestamp))
              setActiveView('receiver') // Switch to receiver view to show the intercepted data
              break
              
            case 'CONNECTED':
              console.log('🎉 Server connection established')
              break
              
            default:
              console.log('❓ Unknown message type:', message.type)
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error)
        }
      }
      
      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected')
        setWsConnected(false)
        setIsLiveMode(false)
        wsRef.current = null
      }
      
      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
        setWsConnected(false)
        setIsLiveMode(false)
      }
      
      wsRef.current = ws
    } catch (error) {
      console.error('❌ Failed to connect WebSocket:', error)
      setWsConnected(false)
      setIsLiveMode(false)
    }
  }

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setWsConnected(false)
    setIsLiveMode(false)
  }

  // Effect to manage WebSocket connection
  useEffect(() => {
    // Try to connect on component mount
    connectWebSocket()
    
    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  // Reconnection logic
  useEffect(() => {
    if (!wsConnected && isLiveMode) {
      const reconnectInterval = setInterval(() => {
        console.log('🔄 Attempting to reconnect WebSocket...')
        connectWebSocket()
      }, 5000)
      
      return () => clearInterval(reconnectInterval)
    }
  }, [wsConnected, isLiveMode])

  return (
    <div class="app">
      <header class="app-header">
        <h1>Web Share API Tester</h1>
        <p>Interactive tool to test Web Share API sender and receiver flows</p>
        
        {/* Live Mode Indicator */}
        <div class="live-mode-indicator">
          <div class={`connection-status ${wsConnected ? 'connected' : 'disconnected'}`}>
            <span class="status-dot"></span>
            <span class="status-text">
              {wsConnected ? 'Live Mode Active' : 'Live Mode Offline'}
            </span>
            {lastInterceptedAt && (
              <span class="last-intercepted">
                Last intercepted: {lastInterceptedAt.toLocaleTimeString()}
              </span>
            )}
            <a 
              href="/test" 
              target="_blank" 
              rel="noopener noreferrer"
              class="tester-link"
            >
              🧪 Test Page
            </a>
          </div>
          
          <div class="connection-controls">
            {wsConnected ? (
              <button 
                class="connection-btn disconnect" 
                onClick={disconnectWebSocket}
              >
                Disconnect
              </button>
            ) : (
              <button 
                class="connection-btn connect" 
                onClick={connectWebSocket}
              >
                Connect Live Mode
              </button>
            )}
          </div>
        </div>
      </header>
      
      <nav class="view-switcher">
        <button 
          class={activeView === 'sender' ? 'active' : ''}
          onClick={() => setActiveView('sender')}
        >
          Sender
        </button>
        <button 
          class={activeView === 'receiver' ? 'active' : ''}
          onClick={() => setActiveView('receiver')}
        >
          Receiver
        </button>
      </nav>

      <main class="main-content">
        {activeView === 'sender' && (
          <div class="sender-view">
            <div class="sender-controls">
              <div class="platform-selector">
                <h3>Select Platform</h3>
                <div class="platform-buttons">
                  {platforms.map(platform => (
                    <button
                      key={platform.id}
                      class={selectedPlatform === platform.id ? 'active' : ''}
                      onClick={() => setSelectedPlatform(platform.id)}
                    >
                      <span class="platform-icon">{platform.icon}</span>
                      <span class="platform-name">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div class="share-form">
                <h3>Web Share API Data</h3>
                <div class="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={shareData.title}
                    onInput={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Share title"
                  />
                </div>
                <div class="form-group">
                  <label>Text</label>
                  <textarea
                    value={shareData.text}
                    onInput={(e) => handleInputChange('text', e.target.value)}
                    placeholder="Share description"
                    rows="3"
                  />
                </div>
                <div class="form-group">
                  <label>URL</label>
                  <input
                    type="url"
                    value={shareData.url}
                    onInput={(e) => handleInputChange('url', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <button class="share-button">
                  Test Share on {platforms.find(p => p.id === selectedPlatform)?.name}
                </button>
              </div>
            </div>

            <div class="platform-mockup">
              <h3>{platforms.find(p => p.id === selectedPlatform)?.name} Share Dialog</h3>
              <div class="mockup-container">
                {selectedPlatform === 'ios' && <IOSShareMockup shareData={shareData} onShareTargetClick={handleShareTargetClick} />}
                {selectedPlatform === 'android' && <AndroidShareMockup shareData={shareData} onShareTargetClick={handleShareTargetClick} />}
                {selectedPlatform === 'macos' && <MacOSShareMockup shareData={shareData} onShareTargetClick={handleShareTargetClick} />}
                {selectedPlatform === 'windows' && <WindowsShareMockup shareData={shareData} onShareTargetClick={handleShareTargetClick} />}
              </div>
            </div>
          </div>
        )}
        
        {activeView === 'receiver' && (
          <div class="receiver-view">
            <div class="receiver-controls">
              <div class="platform-selector">
                <h3>Select Platform</h3>
                <div class="platform-buttons">
                  {platforms.map(platform => (
                    <button
                      key={platform.id}
                      class={selectedPlatform === platform.id ? 'active' : ''}
                      onClick={() => setSelectedPlatform(platform.id)}
                    >
                      <span class="platform-icon">{platform.icon}</span>
                      <span class="platform-name">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div class="share-target-selector">
                <h3>Share Target App</h3>
                <select 
                  value={selectedShareTarget} 
                  onChange={(e) => setSelectedShareTarget(e.target.value)}
                >
                  {shareTargets.map(target => (
                    <option key={target.id} value={target.id}>
                      {target.icon} {target.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div class="receiver-mockup">
              <h3>Received Content in {platforms.find(p => p.id === selectedPlatform)?.name}</h3>
              <div class="receiver-notification">
                <div class="notification-header">
                  <span class="notification-app">
                    {shareTargets.find(t => t.id === selectedShareTarget)?.icon} {shareTargets.find(t => t.id === selectedShareTarget)?.name}
                  </span>
                  <span class="notification-time">now</span>
                </div>
                <div class="notification-content">
                  <div class="notification-title">{shareData.title}</div>
                  <div class="notification-text">{shareData.text}</div>
                  <div class="notification-url">{shareData.url}</div>
                </div>
              </div>

              <div class="app-mockup-window">
                <h4>{shareTargets.find(t => t.id === selectedShareTarget)?.name} App View</h4>
                <div class={`app-mockup app-mockup-${selectedShareTarget}`}>
                  {selectedShareTarget === 'messages' && (
                    <div class="messages-app">
                      <div class="messages-header">
                        <div class="messages-contact">
                          <div class="contact-avatar">👤</div>
                          <div class="contact-name">John Doe</div>
                        </div>
                        <div class="messages-time">12:34 PM</div>
                      </div>
                      <div class="messages-content">
                        <div class="message-bubble">
                          <div class="message-title">{shareData.title}</div>
                          <div class="message-text">{shareData.text}</div>
                          <div class="message-link">
                            <div class="link-preview">
                              <div class="link-icon">🔗</div>
                              <div class="link-details">
                                <div class="link-title">{shareData.title}</div>
                                <div class="link-url">{shareData.url}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedShareTarget === 'mail' && (
                    <div class="mail-app">
                      <div class="mail-header">
                        <div class="mail-subject">Shared: {shareData.title}</div>
                        <div class="mail-from">From: john.doe@example.com</div>
                        <div class="mail-time">Today, 12:34 PM</div>
                      </div>
                      <div class="mail-content">
                        <div class="mail-body">
                          <p>{shareData.text}</p>
                          <div class="mail-link">
                            <a href={shareData.url} target="_blank" rel="noopener">
                              {shareData.title} - {shareData.url}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedShareTarget === 'twitter' && (
                    <div class="twitter-app">
                      <div class="tweet-compose">
                        <div class="tweet-header">
                          <div class="tweet-avatar">👤</div>
                          <div class="tweet-user">
                            <div class="tweet-name">John Doe</div>
                            <div class="tweet-handle">@johndoe</div>
                          </div>
                        </div>
                        <div class="tweet-content">
                          <div class="tweet-text">{shareData.text}</div>
                          <div class="tweet-link-card">
                            <div class="link-card-image">🖼️</div>
                            <div class="link-card-content">
                              <div class="link-card-title">{shareData.title}</div>
                              <div class="link-card-url">{shareData.url}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedShareTarget === 'whatsapp' && (
                    <div class="whatsapp-app">
                      <div class="whatsapp-header">
                        <div class="whatsapp-contact">
                          <div class="contact-avatar">👤</div>
                          <div class="contact-info">
                            <div class="contact-name">John Doe</div>
                            <div class="contact-status">Online</div>
                          </div>
                        </div>
                      </div>
                      <div class="whatsapp-messages">
                        <div class="whatsapp-message">
                          <div class="message-content">
                            <div class="message-text">{shareData.text}</div>
                            <div class="message-link-preview">
                              <div class="link-preview-image">🖼️</div>
                              <div class="link-preview-content">
                                <div class="link-preview-title">{shareData.title}</div>
                                <div class="link-preview-url">{shareData.url}</div>
                              </div>
                            </div>
                          </div>
                          <div class="message-time">12:34</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div class="payload-display">
                <h4>Shared Content Payload</h4>
                <pre class="payload-code">
{`{
  "title": "${shareData.title}",
  "text": "${shareData.text}",
  "url": "${shareData.url}"
}`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
