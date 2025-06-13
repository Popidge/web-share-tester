# Contributing to Web Share API Tester

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to Web Share API Tester. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. Please be respectful and professional in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find that the bug has already been reported. When creating a bug report, please use the bug report template and include as many details as possible.

### Suggesting Features

Feature requests are welcome! Please use the feature request template and provide:
- A clear description of the feature
- The problem it solves
- Any potential use cases
- Implementation ideas (if you have any)

### Contributing Code

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
6. **Push to your fork**
7. **Create a pull request**

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm 9+
- A modern browser for testing

### Installation

```bash
# Clone your fork
git clone https://github.com/yourusername/web-share-tester.git
cd web-share-tester

# Install dependencies
npm install

# Start development server
npm run dev

# In another terminal, start the testing server
npm run server
```

### Project Structure

```
├── src/                    # Preact frontend application
│   ├── app.jsx            # Main application component
│   ├── app.css            # Global styles
│   └── components/        # Reusable components
├── server/                 # Express backend
│   ├── index.js           # Main server
│   └── client-shim.js     # Web Share API interceptor
├── plugins/               # Build tool integrations
├── test/                  # Test applications
└── .github/               # GitHub workflows and templates
```

### Available Scripts

```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run server           # Start testing server
npm run test:integration # Run both dev and server
npm run lint             # Run linter (if configured)
npm run typecheck        # Run type checking (if configured)
```

## Pull Request Process

1. **Update documentation** if needed (README.md, CHANGELOG.md)
2. **Test your changes** thoroughly
3. **Follow the existing code style**
4. **Write clear commit messages**
5. **Fill out the PR template completely**
6. **Link any related issues**

### Commit Message Guidelines

We use conventional commits for clear history:

```
feat: add iOS share dialog animation
fix: resolve WebSocket connection timeout
docs: update installation instructions
style: improve button hover effects
refactor: simplify platform selection logic
test: add server startup tests
```

### What We Review

- **Functionality**: Does it work as intended?
- **Code Quality**: Is it readable and maintainable?
- **Testing**: Are there adequate tests?
- **Documentation**: Is it properly documented?
- **Performance**: Does it impact performance?
- **Compatibility**: Does it work across supported platforms?

## Style Guidelines

### JavaScript/JSX

- Use modern ES6+ features
- Prefer functional components with hooks
- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing patterns in the codebase

### CSS

- Use CSS custom properties for themes
- Prefer flexbox/grid for layouts
- Use semantic class names
- Maintain consistent spacing
- Follow mobile-first responsive design

### File Naming

- Use kebab-case for files: `share-mockups.jsx`
- Use PascalCase for components: `ShareMockup`
- Use camelCase for variables and functions

## Testing Guidelines

### Manual Testing

1. **Start both servers** (dev + testing)
2. **Test all platforms** (iOS, Android, macOS, Windows)
3. **Test all share targets** (Messages, Mail, Twitter, WhatsApp)
4. **Test live interception** with the test app
5. **Test responsive design** on different screen sizes
6. **Test WebSocket connections**

### Automated Testing

We welcome contributions to improve our testing:
- Unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for user workflows
- Performance tests for large datasets

## Platform-Specific Guidelines

### Adding New Platforms

1. **Research the platform's** native share UI
2. **Create accurate mockups** using devices.css or custom CSS
3. **Add platform to** the platforms array in `app.jsx`
4. **Create share dialog component** in `components/ShareMockups.jsx`
5. **Add styling** in `components/ShareMockups.css`
6. **Test thoroughly** on different screen sizes

### Adding New Share Target Apps

1. **Research the app's** interface and typical share handling
2. **Create receiver mockup** in the appropriate app section
3. **Ensure responsive design**
4. **Add to shareTargets** array in `app.jsx`
5. **Test the complete flow** from sender to receiver

## Release Process

Releases are automated through GitHub Actions:

1. **Create a release** on GitHub with a version tag (e.g., `v1.1.0`)
2. **GitHub Actions** will automatically build and publish to npm
3. **Update CHANGELOG.md** with release notes

## Getting Help

- **Check the documentation** first
- **Search existing issues** for similar questions
- **Create a question issue** using the template
- **Join discussions** in existing issues and PRs

## Recognition

Contributors are recognized in:
- The README.md file
- Release notes for significant contributions
- Special thanks in major version releases

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Web Share API Tester! 🚀