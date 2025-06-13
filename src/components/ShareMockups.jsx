import 'devices.css/dist/devices.min.css'
import './ShareMockups.css'

export function IOSShareMockup({ shareData, onShareTargetClick }) {
  return (
    <div class="device device-iphone-14 device-black">
      <div class="device-screen">
        <div class="ios-share-dialog">
          <div class="ios-header">
            <div class="ios-close">✕</div>
            <div class="ios-title">Share</div>
            <div class="ios-spacer"></div>
          </div>
          
          <div class="ios-content">
            <div class="ios-preview">
              <div class="ios-link-preview">
                <div class="ios-link-icon">🔗</div>
                <div class="ios-link-details">
                  <div class="ios-link-title">{shareData.title}</div>
                  <div class="ios-link-url">{shareData.url}</div>
                </div>
              </div>
              {shareData.text && (
                <div class="ios-share-text">{shareData.text}</div>
              )}
            </div>
            
            <div class="ios-apps">
              <div class="ios-app-row">
                <div class="ios-app" onClick={() => onShareTargetClick('messages')}>
                  <div class="ios-app-icon messages">💬</div>
                  <div class="ios-app-name">Messages</div>
                </div>
                <div class="ios-app" onClick={() => onShareTargetClick('mail')}>
                  <div class="ios-app-icon mail">✉️</div>
                  <div class="ios-app-name">Mail</div>
                </div>
                <div class="ios-app" onClick={() => onShareTargetClick('twitter')}>
                  <div class="ios-app-icon twitter">🐦</div>
                  <div class="ios-app-name">Twitter</div>
                </div>
                <div class="ios-app" onClick={() => onShareTargetClick('whatsapp')}>
                  <div class="ios-app-icon more">💚</div>
                  <div class="ios-app-name">WhatsApp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AndroidShareMockup({ shareData, onShareTargetClick }) {
  return (
    <div class="device device-google-pixel-6-pro device-black">
      <div class="device-screen">
        <div class="android-share-dialog">
          <div class="android-header">
            <div class="android-title">Share</div>
          </div>
          
          <div class="android-content">
            <div class="android-preview">
              <div class="android-link-preview">
                <div class="android-link-details">
                  <div class="android-link-title">{shareData.title}</div>
                  <div class="android-link-url">{shareData.url}</div>
                </div>
              </div>
              {shareData.text && (
                <div class="android-share-text">{shareData.text}</div>
              )}
            </div>
            
            <div class="android-apps">
              <div class="android-app" onClick={() => onShareTargetClick('messages')}>
                <div class="android-app-icon messages">💬</div>
                <div class="android-app-name">Messages</div>
              </div>
              <div class="android-app" onClick={() => onShareTargetClick('mail')}>
                <div class="android-app-icon gmail">📧</div>
                <div class="android-app-name">Gmail</div>
              </div>
              <div class="android-app" onClick={() => onShareTargetClick('twitter')}>
                <div class="android-app-icon twitter">🐦</div>
                <div class="android-app-name">Twitter</div>
              </div>
              <div class="android-app" onClick={() => onShareTargetClick('whatsapp')}>
                <div class="android-app-icon whatsapp">💚</div>
                <div class="android-app-name">WhatsApp</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MacOSShareMockup({ shareData, onShareTargetClick }) {
  return (
    <div class="device device-macbook-pro device-spacegray">
      <div class="device-screen">
        <div class="macos-share-dialog">
          <div class="macos-titlebar">
            <div class="macos-controls">
              <div class="macos-button close"></div>
              <div class="macos-button minimize"></div>
              <div class="macos-button maximize"></div>
            </div>
            <div class="macos-title">Share</div>
          </div>
          
          <div class="macos-content">
            <div class="macos-preview">
              <div class="macos-link-preview">
                <div class="macos-link-icon">🔗</div>
                <div class="macos-link-details">
                  <div class="macos-link-title">{shareData.title}</div>
                  <div class="macos-link-url">{shareData.url}</div>
                </div>
              </div>
              {shareData.text && (
                <div class="macos-share-text">{shareData.text}</div>
              )}
            </div>
            
            <div class="macos-apps">
              <div class="macos-app" onClick={() => onShareTargetClick('messages')}>
                <div class="macos-app-icon messages">💬</div>
                <div class="macos-app-name">Messages</div>
              </div>
              <div class="macos-app" onClick={() => onShareTargetClick('mail')}>
                <div class="macos-app-icon mail">✉️</div>
                <div class="macos-app-name">Mail</div>
              </div>
              <div class="macos-app" onClick={() => onShareTargetClick('twitter')}>
                <div class="macos-app-icon twitter">🐦</div>
                <div class="macos-app-name">Twitter</div>
              </div>
              <div class="macos-app" onClick={() => onShareTargetClick('whatsapp')}>
                <div class="macos-app-icon notes">💚</div>
                <div class="macos-app-name">WhatsApp</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function WindowsShareMockup({ shareData, onShareTargetClick }) {
  return (
    <div class="device device-surface-studio device-silver">
      <div class="device-screen">
        <div class="windows-share-dialog">
          <div class="windows-header">
            <div class="windows-title">Share</div>
            <div class="windows-close">✕</div>
          </div>
          
          <div class="windows-content">
            <div class="windows-preview">
              <div class="windows-link-preview">
                <div class="windows-link-details">
                  <div class="windows-link-title">{shareData.title}</div>
                  <div class="windows-link-url">{shareData.url}</div>
                </div>
              </div>
              {shareData.text && (
                <div class="windows-share-text">{shareData.text}</div>
              )}
            </div>
            
            <div class="windows-apps">
              <div class="windows-app" onClick={() => onShareTargetClick('mail')}>
                <div class="windows-app-icon mail">📧</div>
                <div class="windows-app-name">Mail</div>
              </div>
              <div class="windows-app" onClick={() => onShareTargetClick('messages')}>
                <div class="windows-app-icon teams">💬</div>
                <div class="windows-app-name">Messages</div>
              </div>
              <div class="windows-app" onClick={() => onShareTargetClick('twitter')}>
                <div class="windows-app-icon twitter">🐦</div>
                <div class="windows-app-name">Twitter</div>
              </div>
              <div class="windows-app" onClick={() => onShareTargetClick('whatsapp')}>
                <div class="windows-app-icon edge">💚</div>
                <div class="windows-app-name">WhatsApp</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}