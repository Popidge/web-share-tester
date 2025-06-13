# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- 📚 **Enhanced Documentation**: Clarified how Web Share API interception works
  - Added "How It Works" section explaining client-side interception approach
  - Clarified that integration requires manual script inclusion (not automatic)
  - Enhanced troubleshooting with common misconceptions and FAQs
  - Added step-by-step integration examples with terminal commands
  - Improved Quick Start section with two distinct usage modes

### Planned for v2.0.0
- File sharing support (`files` property of Web Share API)
- File type validation and MIME type checking
- File preview generation (thumbnails for images, icons for other types)
- Enhanced platform mockups with file attachment UIs

## [1.0.0] - 2025-01-13

### Added
- 🎯 **Manual Testing Mode**
  - Realistic platform share dialogs for iOS, Android, macOS, Windows
  - Interactive share target apps (Messages, Mail, Twitter, WhatsApp)
  - Click-to-navigate flow from sender to receiver views
  - Real-time form updates across all mockups

- 🔴 **Live Interception Mode**
  - WebSocket-based real-time server communication
  - Automatic Web Share API call interception via client shim
  - Live interface updates when shares are intercepted
  - Runtime configuration for original share behavior

- 🎨 **Modern UI Design**
  - Glassmorphism design with backdrop-filter effects
  - Responsive design for desktop, tablet, and mobile
  - Smooth animations and polished interactions
  - Professional gradient backgrounds and styling

- 🛠️ **Developer Experience**
  - Simple CLI installation and usage (`npx web-share-tester`)
  - Express.js server with automatic port detection
  - Comprehensive API documentation
  - Easy integration with existing development workflows

- 📱 **Platform Mockups**
  - **iOS**: Native share sheet with blur effects and realistic styling
  - **Android**: Material Design share bottom sheet
  - **macOS**: System modal dialog with window controls
  - **Windows**: Windows-style share dialog

- 📧 **Receiver App Mockups**
  - **Messages**: Chat interface with message bubbles and link previews
  - **Mail**: Email composition with proper headers and formatting
  - **Twitter**: Tweet compose interface with link cards
  - **WhatsApp**: Chat interface with message styling

- 🔧 **Technical Features**
  - RESTful API endpoints for health checks and data reception
  - WebSocket support for real-time communication
  - Client-side shim for transparent Web Share API interception
  - Vite plugin foundation for build tool integration
  - Comprehensive error handling and logging

- 📚 **Documentation**
  - Detailed README with usage examples
  - API reference documentation
  - Troubleshooting guide
  - Contributing guidelines
  - MIT license

- 🚀 **Development Tools**
  - GitHub Actions CI/CD pipeline
  - Automated npm publishing on releases
  - Issue templates for bugs, features, and questions
  - Development and production build scripts
  - Package validation and testing

### Technical Specifications
- **Frontend**: Preact 10.26+ with modern hooks
- **Backend**: Express.js 4.21+ with WebSocket support
- **Build Tool**: Vite 6.3+ for fast development and building
- **Device Mockups**: devices.css 0.2+ for realistic device frames
- **Node.js**: Requires 18.0.0 or higher
- **Package Size**: ~34KB compressed, ~143KB unpacked

### Browser Support
- Chrome/Edge 89+
- Firefox 88+
- Safari 14+
- Mobile browsers with Web Share API support

[Unreleased]: https://github.com/popidge/web-share-tester/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/popidge/web-share-tester/releases/tag/v1.0.0