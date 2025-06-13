/**
 * Web Share API Testing Shim
 * 
 * This script intercepts navigator.share() calls and sends them to the 
 * Web Share Tester server for visualization and testing.
 */

(function() {
  'use strict'

  // Configuration
  const CONFIG = {
    serverPort: 3001,
    enableOriginalShare: false, // Whether to also trigger the real share dialog (disabled for dev testing)
    debug: true
  }

  // Get server URL (try to detect from current page or use default)
  const getServerUrl = () => {
    // Try to use the same host as the current page, but with our server port
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:'
    const hostname = window.location.hostname || 'localhost'
    return `${protocol}//${hostname}:${CONFIG.serverPort}`
  }

  const SERVER_URL = getServerUrl()

  // Debug logging
  const log = (...args) => {
    if (CONFIG.debug) {
      console.log('🔗 [Web Share Tester]', ...args)
    }
  }

  // Store original navigator.share if it exists
  const originalShare = navigator.share

  // Check if Web Share API is supported
  const isWebShareSupported = 'share' in navigator

  log('Initializing Web Share API interceptor')
  log('Server URL:', SERVER_URL)
  log('Original Web Share supported:', isWebShareSupported)

  /**
   * Send intercepted share data to the testing server
   */
  async function sendToTester(shareData) {
    try {
      const response = await fetch(`${SERVER_URL}/api/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...shareData,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        log('Successfully sent share data to tester')
        return await response.json()
      } else {
        console.warn('Failed to send share data to tester:', response.status)
      }
    } catch (error) {
      console.warn('Could not connect to Web Share Tester server:', error.message)
    }
  }

  /**
   * Validate share data according to Web Share API spec
   */
  function validateShareData(data) {
    if (!data || typeof data !== 'object') {
      throw new TypeError('Share data must be an object')
    }

    const { title, text, url, files } = data

    // At least one of title, text, or url must be specified
    if (!title && !text && !url && !files) {
      throw new TypeError('Share data must contain at least one of: title, text, url, or files')
    }

    // Validate types
    if (title !== undefined && typeof title !== 'string') {
      throw new TypeError('title must be a string')
    }
    if (text !== undefined && typeof text !== 'string') {
      throw new TypeError('text must be a string')
    }
    if (url !== undefined && typeof url !== 'string') {
      throw new TypeError('url must be a string')
    }

    // Validate URL if provided
    if (url) {
      try {
        new URL(url, window.location.href)
      } catch {
        throw new TypeError('url must be a valid URL')
      }
    }

    return data
  }

  /**
   * Our intercepting share function
   */
  async function interceptedShare(data) {
    log('navigator.share() called with:', data)

    try {
      // Validate the share data
      const validatedData = validateShareData(data)
      
      // Send to our testing server
      await sendToTester(validatedData)

      // If original share is supported and enabled, call it too
      if (CONFIG.enableOriginalShare && originalShare) {
        log('Calling original navigator.share()')
        return await originalShare.call(navigator, validatedData)
      } else {
        // If no original share, simulate successful sharing
        log('Simulating successful share (no original API available)')
        return Promise.resolve()
      }
    } catch (error) {
      log('Share failed:', error)
      throw error
    }
  }

  // Replace navigator.share with our intercepting version
  if (navigator.share) {
    // Replace existing share function
    navigator.share = interceptedShare
    log('Replaced existing navigator.share()')
  } else {
    // Add share function if it doesn't exist (polyfill)
    Object.defineProperty(navigator, 'share', {
      value: interceptedShare,
      writable: true,
      configurable: true
    })
    log('Added navigator.share() polyfill')
  }

  // Also add a test function for manual testing
  window.testWebShare = (data = {}) => {
    const defaultData = {
      title: 'Test Share from Web Share Tester',
      text: 'This is a test share to verify the Web Share API interceptor is working.',
      url: window.location.href
    }
    
    const shareData = { ...defaultData, ...data }
    log('Testing share with:', shareData)
    return navigator.share(shareData)
  }

  // Add utility functions for runtime control
  window.webShareTester = {
    // Enable/disable original share behavior
    enableOriginalShare: (enable = true) => {
      CONFIG.enableOriginalShare = enable
      log(`Original share ${enable ? 'enabled' : 'disabled'}`)
    },
    
    // Toggle debug logging
    enableDebug: (enable = true) => {
      CONFIG.debug = enable
      log(`Debug logging ${enable ? 'enabled' : 'disabled'}`)
    },
    
    // Get current configuration
    getConfig: () => ({ ...CONFIG }),
    
    // Test share with current settings
    testShare: window.testWebShare
  }

  // Expose configuration for runtime changes (backward compatibility)
  window.webShareTesterConfig = CONFIG

  log('Web Share API interceptor initialized successfully')
  log('Use window.testWebShare() to test the interceptor')

})()