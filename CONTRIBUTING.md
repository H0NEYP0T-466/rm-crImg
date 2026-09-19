# 🤝 Contributing to rm-crImg

Thank you for your interest in contributing to **rm-crImg**! We appreciate all contributions—whether it's fixing bugs, adding new features, improving documentation, or proposing design enhancements.

Please take a moment to review this guide to make the contribution process smooth and effective for everyone.

---

## 📑 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Coding Standards & Linting](#-coding-standards--linting)
- [Reporting Bugs](#-reporting-bugs)
- [Suggesting Enhancements](#-suggesting-enhancements)
- [Pull Request Guidelines](#-pull-request-guidelines)
- [Questions or Feedback](#-questions-or-feedback)

---

## 📏 Code of Conduct

This project and everyone participating in it is governed by the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior following our [Reporting Guidelines](CODE_OF_CONDUCT.md#enforcement).

---

## 🚀 Getting Started

1. **Check Existing Issues**: Search our [Issue Tracker](https://github.com/H0NEYP0T-466/rm-crImg/issues) to ensure your idea or bug has not already been reported or worked on.
2. **Open an Issue First**: For substantial new features or architecture changes, open a [Feature Request](https://github.com/H0NEYP0T-466/rm-crImg/issues/new?template=feature_request.yml) to discuss it before spending hours writing code.

---

## 💻 Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js) or compatible package manager (`pnpm` / `yarn`)

### Steps

1. **Fork the Repository** to your own GitHub account.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/<your-username>/rm-crImg.git
   cd rm-crImg
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the local dev server**:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:5173`.

---

## 📐 Coding Standards & Linting

We maintain strict quality, type safety, and clean design:

- **TypeScript**: Strict typing with `tsc -b` and `verbatimModuleSyntax`. Avoid `any`.
- **Linter**: We use [oxlint](https://oxc.rs) for ultra-fast, opinionated static analysis.
  ```bash
  npm run lint
  ```
- **Type Checking & Production Build**:
  ```bash
  npm run build
  ```
- **Client-Side Only Rule**: This application must remain **100% frontend-only**. No external API calls, servers, or trackers should be introduced for processing images. All image processing must occur strictly in the browser using the HTML5 Canvas API.

---

## 🐛 Reporting Bugs

Before creating a bug report, please check that it is not already addressed in an existing issue.

To file a bug report:
- Use our [Bug Report Template](https://github.com/H0NEYP0T-466/rm-crImg/issues/new?template=bug_report.yml).
- Provide a clear, descriptive summary.
- Detail the exact steps to reproduce the issue.
- Include environment details: browser name, version, and operating system.
- If possible, describe the sample image format or dimensions that triggered the bug.

---

## 💡 Suggesting Enhancements

Feature suggestions are very welcome!
- Use our [Feature Request Template](https://github.com/H0NEYP0T-466/rm-crImg/issues/new?template=feature_request.yml).
- Explain why this enhancement would be useful to users.
- Outline the proposed implementation or UX flow.
- Describe any alternative solutions or edge cases considered.

---

## 📥 Pull Request Guidelines

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
2. **Make your changes** cleanly and test them in your browser.
3. **Run checks locally**:
   ```bash
   npm run lint
   npm run build
   ```
   Ensure both pass without warnings or errors.
4. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add keyboard shortcut for quick download"
   ```
5. **Push your branch** to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** against `master` using the [Pull Request Template](.github/pull_request_template.md).

---

## 💬 Questions or Feedback

If you have questions, feedback, or need help with your PR, feel free to open an issue or leave a comment on your pull request. Thank you for making **rm-crImg** better!
