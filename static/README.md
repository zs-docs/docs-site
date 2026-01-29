# 🏥 ZARISH SPHERE Documentation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D24.0.0-brightgreen)](https://nodejs.org/)
[![Docusaurus](https://img.shields.io/badge/Docusaurus-3.9.2-blue)](https://docusaurus.io/)

> **Enterprise-Grade Open-Source Healthcare & Operations Platform**

This documentation is built using [Docusaurus](https://docusaurus.io/), a modern static website generator that provides excellent performance, SEO, and user experience for the ZARISH SPHERE healthcare platform.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 24.0.0 or higher
- **npm** or **yarn** package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/zs-docs/docs-site.git
cd docs-site

# Install dependencies
npm install

# Start development server
npm start
```

### Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window at `http://localhost:3000`. Most changes are reflected live without having to restart the server.

## 🏗️ Build & Deployment

### Production Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Local Testing

```bash
npm run serve
```

Test the production build locally before deployment.

### Deployment

#### Automatic Deployment (Recommended)

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

#### Manual Deployment

Using SSH:

```bash
USE_SSH=true npm run deploy
```

Not using SSH:

```bash
GIT_USER=<YourGitHubUsername> npm run deploy
```

## 📚 Documentation Structure

```
docs/
├── intro.md                    # Introduction and overview
├── platform/                   # Platform documentation
│   ├── overview.md
│   ├── architecture.md
│   ├── authentication.md
│   └── deployment.md
├── health/                      # Healthcare modules
│   ├── overview.md
│   ├── patient-management.md
│   ├── clinical-workflows.md
│   └── [27+ health modules]
├── api-reference/              # API documentation
│   ├── overview.md
│   ├── authentication.md
│   ├── endpoints.md
│   └── [15+ API docs]
├── tools/                       # Development tools
│   ├── code-checker.md
│   ├── todo-tracker.md
│   └── [5+ tools]
└── contributing/               # Contributing guides
    ├── how-to-contribute.md
    ├── code-of-conduct.md
    └── documentation-guide.md
```

## 🛠️ Available Scripts

| Script              | Description                     |
| ------------------- | ------------------------------- |
| `npm start`         | Start development server        |
| `npm run build`     | Build for production            |
| `npm run serve`     | Serve production build locally  |
| `npm run clear`     | Clear cache and build artifacts |
| `npm run lint`      | Run code linting                |
| `npm run typecheck` | Run TypeScript type checking    |

## 🎨 Features

- ✅ **Responsive Design**: Works on all devices
- ✅ **Dark Mode**: Built-in dark/light theme toggle
- ✅ **Search**: Full-text search with Algolia integration
- ✅ **Versioning**: Support for multiple documentation versions
- ✅ **Internationalization**: Multi-language support (English, Bengali, Thai, Myanmar)
- ✅ **Code Highlighting**: Syntax highlighting for 100+ languages
- ✅ **Interactive Elements**: Rich content with MDX support
- ✅ **SEO Optimized**: Built-in SEO best practices

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Algolia Search (Optional)
ALGOLIA_APP_ID=your_app_id
ALGOLIA_API_KEY=your_api_key
ALGOLIA_INDEX_NAME=zarishsphere

# GitHub Configuration
GITHUB_TOKEN=your_github_token
GITHUB_REPO=zs-docs/docs-site
GITHUB_ORG=zs-docs
```

### Customization

- **Theme**: Modify `src/css/custom.css` for custom styling
- **Navigation**: Update `docusaurus.config.ts` for navbar/footer
- **Sidebar**: Configure `sidebars.ts` for documentation structure
- **Plugins**: Add plugins in `docusaurus.config.ts`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/contributing/how-to-contribute.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: [support@zarishsphere.com](mailto:support@zarishsphere.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/zs-docs/docs-site/issues)
- 📖 **Documentation**: [docs.zarishsphere.com](https://docs.zarishsphere.com)
- 🌐 **Website**: [zarishsphere.com](https://zarishsphere.com)

## 🌟 Acknowledgments

- [Docusaurus](https://docusaurus.io/) - Static site generator
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [MDX](https://mdxjs.com/) - Markdown with JSX
- [Algolia](https://www.algolia.com/) - Search functionality

---

**Built with ❤️ for the ZARISH SPHERE healthcare community**
