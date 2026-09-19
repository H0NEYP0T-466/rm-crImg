# rm-crImg

A minimal, 100% client-side image provenance cleaner built with Vite + React. Strips AI-generated watermarks, C2PA Content Credentials, EXIF headers, GPS locations, and edit history via an isolated pixel-level canvas copy. Zero backend, zero server storage, zero data leakage.

<p align="center">

  <!-- Core -->
  <a href="LICENSE"><img src="https://img.shields.io/github/license/H0NEYP0T-466/rm-crImg?style=for-the-badge&color=brightgreen" alt="GitHub License" /></a>
  <a href="https://github.com/H0NEYP0T-466/rm-crImg/stargazers"><img src="https://img.shields.io/github/stars/H0NEYP0T-466/rm-crImg?style=for-the-badge&color=yellow" alt="GitHub Stars" /></a>
  <a href="https://github.com/H0NEYP0T-466/rm-crImg/network/members"><img src="https://img.shields.io/github/forks/H0NEYP0T-466/rm-crImg?style=for-the-badge&color=blue" alt="GitHub Forks" /></a>
  <a href="https://github.com/H0NEYP0T-466/rm-crImg/issues"><img src="https://img.shields.io/github/issues/H0NEYP0T-466/rm-crImg?style=for-the-badge&color=red" alt="GitHub Issues" /></a>
  <a href="https://github.com/H0NEYP0T-466/rm-crImg/pulls"><img src="https://img.shields.io/github/issues-pr/H0NEYP0T-466/rm-crImg?style=for-the-badge&color=orange" alt="GitHub Pull Requests" /></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/Contributions-Welcome-brightgreen?style=for-the-badge" alt="Contributions Welcome" /></a>

  <!-- Activity -->
  <img src="https://img.shields.io/github/last-commit/H0NEYP0T-466/rm-crImg?style=for-the-badge&color=purple" alt="Last Commit" />
  <img src="https://img.shields.io/github/commit-activity/m/H0NEYP0T-466/rm-crImg?style=for-the-badge&color=teal" alt="Commit Activity" />
  <img src="https://img.shields.io/github/repo-size/H0NEYP0T-466/rm-crImg?style=for-the-badge&color=blueviolet" alt="Repo Size" />
  <img src="https://img.shields.io/github/languages/code-size/H0NEYP0T-466/rm-crImg?style=for-the-badge&color=indigo" alt="Code Size" />

  <!-- Languages -->
  <img src="https://img.shields.io/github/languages/top/H0NEYP0T-466/rm-crImg?style=for-the-badge&color=critical" alt="Top Language" />
  <img src="https://img.shields.io/github/languages/count/H0NEYP0T-466/rm-crImg?style=for-the-badge&color=success" alt="Languages Count" />

  <!-- Optional CI/Security -->
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=vite&logoColor=white" alt="Build Status" />
  <img src="https://img.shields.io/badge/Vulnerabilities-0-brightgreen?style=for-the-badge&logo=snyk&logoColor=white" alt="Vulnerabilities" />

  <!-- Community -->
  <a href="https://github.com/H0NEYP0T-466/rm-crImg/discussions"><img src="https://img.shields.io/badge/Discussions-Enabled-blue?style=for-the-badge&logo=github" alt="Discussions" /></a>
  <a href="#-table-of-contents"><img src="https://img.shields.io/badge/Docs-Available-green?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Documentation" /></a>
  <img src="https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red?style=for-the-badge" alt="Open Source Love" />

</p>

---

## 🔗 Links

- **Live Demo**: [Deploy on Vercel](#-deploy-to-vercel)
- **Documentation**: [Jump to Table of Contents](#-table-of-contents)
- **Issue Tracker**: [GitHub Issues](https://github.com/H0NEYP0T-466/rm-crImg/issues)
- **Contributing Guide**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Security Policy**: [SECURITY.md](SECURITY.md)
- **Code of Conduct**: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

---

## 📑 Table of Contents

- [Project Title](#rm-crimg)
- [Links](#-links)
- [Installation](#-installation)
- [Usage Examples](#-usage-examples)
- [Features](#-features)
- [Folder Structure](#-folder-structure)
- [Submodules](#-submodules)
- [Contributing](#-contributing)
- [License](#-license)
- [Security](#-security)
- [Code of Conduct](#-code-of-conduct)
- [Tech Stack](#-tech-stack)
- [Dependencies & Packages](#-dependencies--packages)
- [Deploy to Vercel](#-deploy-to-vercel)

---

## 🚀 Installation

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 18.x or later)
- [npm](https://www.npmjs.com/) (bundled with Node.js) or `pnpm` / `yarn`

### Setup Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/H0NEYP0T-466/rm-crImg.git
   cd rm-crImg
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## ⚡ Usage Examples

The entire workflow follows an intuitive 3-step cycle:

```
[ 1. Upload ] ──────> [ 2. Pixel Copy ] ──────> [ 3. Download ]
 Drag & drop / paste    HTML5 Canvas raster      Pristine clean file
 (JPG, PNG, WebP)      discards all headers     with zero provenance
```

### 1. Uploading an Image
- **Drag & Drop**: Drag any `.jpg`, `.jpeg`, `.png`, or `.webp` directly into the designated drop zone.
- **File Picker**: Click the drop zone to open your native file browser or mobile photo roll.
- **Clipboard Paste**: Press <kbd>Ctrl</kbd>+<kbd>V</kbd> (or <kbd>⌘</kbd>+<kbd>V</kbd> on macOS) anywhere on the page to immediately clean an image from your clipboard.

### 2. Processing (Pixel-Level Copy)
The application takes the image and renders its raw RGBA pixels directly onto an isolated HTML5 canvas context:
```typescript
// Sample execution logic from src/utils/imageCleaner.ts
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
ctx.drawImage(sourceDrawable, 0, 0, width, height);

// Re-encode directly from canvas pixels — headers are completely absent
canvas.toBlob((cleanBlob) => {
  // Brand-new, untraceable image with zero provenance
}, outputMimeType, quality);
```

### 3. Downloading the Cleaned Image
- Click **"Download Clean Image"** to save the sanitized file.
- Toggle between formats anytime:
  - **Original**: Keeps the input container format.
  - **PNG (Lossless)**: 100% pixel fidelity with alpha channel transparency.
  - **JPG (95%)**: High-efficiency output with automatic white background fill for transparent inputs.
  - **WebP**: Modern compact web format.
- Click **"Copy"** to immediately copy the cleaned image into your clipboard for pasting into chat apps, documents, or social media.

---

## ✨ Features

- 🛡️ **Complete Metadata Elimination**: Strips EXIF, IPTC, XMP, GPS coordinates, device serial numbers, and software edit histories.
- 🤖 **AI Label & Provenance Removal**: Neutralizes C2PA Content Credentials, DALL-E/Midjourney/Firefly stamps, and provenance manifests.
- 🔒 **Zero Server Footprint**: 100% frontend execution. No backend server, no database, no uploads, and no external tracking.
- 📋 **Global Clipboard Support**: Paste images into the app and copy cleaned results back with a single click.
- 🎨 **Minimalist Anti-Distraction Design**: Clean white background, high-contrast typography, and a single electric blue accent (`#0066FF`).
- 📱 **Mobile & Desktop Responsive**: Fully optimized for iPhone, Android, tablets, and desktop displays.
- ⚡ **Blazing Fast**: Instantaneous decoding and re-encoding powered by modern browser canvas hardware acceleration.

---

## 📂 Folder Structure

```
rm-crImg/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml          # GitHub Issue Form for bug reports
│   │   ├── feature_request.yml     # GitHub Issue Form for feature suggestions
│   │   └── config.yml              # Issue template contact links & configuration
│   └── pull_request_template.md    # Standardized pull request template
├── public/
│   ├── favicon.svg                 # Application favicon
│   └── icons.svg                   # SVG icon sprites
├── src/
│   ├── assets/
│   │   ├── hero.png                # Hero preview graphic
│   │   ├── react.svg               # React logo asset
│   │   └── vite.svg                # Vite logo asset
│   ├── utils/
│   │   └── imageCleaner.ts         # Core pixel-level canvas cleaner utility
│   ├── App.css                     # Minimalist responsive UI styles
│   ├── App.tsx                     # Main React application component
│   ├── index.css                   # Global CSS design tokens & reset
│   └── main.tsx                    # React DOM root entrypoint
├── .gitignore                      # Git ignored files & directories
├── .oxlintrc.json                  # Oxlint configuration
├── CODE_OF_CONDUCT.md              # Contributor Covenant Code of Conduct v2.1
├── CONTRIBUTING.md                 # Contribution guidelines
├── LICENSE                         # MIT License
├── README.md                       # Repository documentation
├── index.html                      # HTML5 page template
├── package.json                    # Project metadata & dependencies
├── package-lock.json               # Locked dependency tree
├── SECURITY.md                     # Security & vulnerability reporting policy
├── tsconfig.app.json               # Application TypeScript configuration
├── tsconfig.json                   # Root TypeScript project references
├── tsconfig.node.json              # Node/Vite TypeScript configuration
└── vite.config.ts                  # Vite build tool configuration
```

---

## 📦 Submodules

No external Git submodules are included in this repository. All source code is self-contained.

---

## 🤝 Contributing

Contributions are welcome and appreciated! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, development setup, and pull request submission process.

---

## 📜 License

This project is licensed under the terms of the MIT License. See the [LICENSE](LICENSE) file for complete details.

---

## 🛡 Security

For information regarding security policies and reporting vulnerabilities responsibly, please review our [SECURITY.md](SECURITY.md).

---

## 📏 Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. By participating, you are expected to honor this standard. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## 🛠 Tech Stack

### Languages
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

### Frameworks & Libraries
![React](https://img.shields.io/badge/React%2019-%2320232A.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React DOM](https://img.shields.io/badge/React%20DOM-%2320232A.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

### DevOps, CI & Tools
![Vite](https://img.shields.io/badge/Vite%208-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Oxlint](https://img.shields.io/badge/Oxlint-%23000000.svg?style=for-the-badge&logo=oxc&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)

### Cloud & Hosting
![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

---

## 📦 Dependencies & Packages

### Runtime Dependencies

<details open>
<summary><strong>Core Runtime Packages (2)</strong></summary>
<br />

| Package | Version | Description |
| :--- | :---: | :--- |
| [![react](https://img.shields.io/npm/v/react?style=for-the-badge&label=react&color=61DAFB)](https://www.npmjs.com/package/react) | `^19.2.8` | Declarative UI component library |
| [![react-dom](https://img.shields.io/npm/v/react-dom?style=for-the-badge&label=react-dom&color=61DAFB)](https://www.npmjs.com/package/react-dom) | `^19.2.8` | React DOM renderer |

</details>

### Dev / Build / Test Dependencies

<details>
<summary><strong>Development & Build Tooling (7)</strong></summary>
<br />

| Package | Version | Description |
| :--- | :---: | :--- |
| [![vite](https://img.shields.io/npm/v/vite?style=for-the-badge&label=vite&color=646CFF)](https://www.npmjs.com/package/vite) | `^8.3.0` | Next generation frontend build tool |
| [![typescript](https://img.shields.io/npm/v/typescript?style=for-the-badge&label=typescript&color=007ACC)](https://www.npmjs.com/package/typescript) | `~6.0.2` | Typed JavaScript at Any Scale |
| [![oxlint](https://img.shields.io/npm/v/oxlint?style=for-the-badge&label=oxlint&color=black)](https://www.npmjs.com/package/oxlint) | `^1.81.0` | Ultra-fast JavaScript & TypeScript linter |
| [![@vitejs/plugin-react](https://img.shields.io/npm/v/%40vitejs%2Fplugin-react?style=for-the-badge&label=%40vitejs%2Fplugin-react&color=646CFF)](https://www.npmjs.com/package/@vitejs/plugin-react) | `^6.1.1` | Official Vite plugin for React |
| [![@types/react](https://img.shields.io/npm/v/%40types%2Freact?style=for-the-badge&label=%40types%2Freact&color=blue)](https://www.npmjs.com/package/@types/react) | `^19.2.18` | TypeScript type definitions for React |
| [![@types/react-dom](https://img.shields.io/npm/v/%40types%2Freact-dom?style=for-the-badge&label=%40types%2Freact-dom&color=blue)](https://www.npmjs.com/package/@types/react-dom) | `^19.2.7` | TypeScript type definitions for React DOM |
| [![@types/node](https://img.shields.io/npm/v/%40types%2Fnode?style=for-the-badge&label=%40types%2Fnode&color=blue)](https://www.npmjs.com/package/@types/node) | `^24.13.3` | TypeScript type definitions for Node.js runtime |

</details>

---

## 🚀 Deploy to Vercel

Because **rm-crImg** is a static frontend application without a server, it can be deployed to Vercel in seconds:

1. Push your repository to GitHub.
2. In Vercel, click **"Add New Project"** and select `rm-crImg`.
3. Configure the build settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.

---

<p align="center">Made with ❤ by H0NEYP0T-466</p>
