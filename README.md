# CleanPix (rm-crimg)

A minimal, frontend-only image cleaner built with Vite + React. Strips AI-generated markers, Content Credentials (C2PA), EXIF data, GPS coordinates, camera specs, and edit history through a pure pixel-level canvas copy.

**100% Client-Side • Zero Backend • Zero Data Leaving Your Device**

---

## 3-Step Workflow

1. **Upload** — Drag-and-drop, browse, or paste (`Ctrl+V` / `⌘V`) any JPG, PNG, or WebP image.
2. **Process** — The browser decodes the image in memory and draws only the raw RGBA pixels onto an isolated HTML5 canvas. Every metadata header, C2PA manifest, and tracking tag is discarded.
3. **Download** — Download or copy the clean image. Any platform reading it sees a standard, untraceable image with zero provenance attached.

---

## Features

- **True Pixel-Level Clone**: Canvas raster buffer transfer leaves behind 100% of headers (EXIF, IPTC, XMP, C2PA).
- **Clipboard Support**: Paste an image directly anywhere on the page, and copy cleaned images back to your clipboard with one click.
- **Format Flexibility**: Preserve original format or switch seamlessly between PNG (lossless), JPG (95%), or WebP.
- **Minimal & Clean Design**: Crisp white aesthetic, high-contrast typography, single electric blue accent, works seamlessly across mobile and desktop.
- **Zero Server Footprint**: Deploy anywhere as static files (Vercel, Cloudflare Pages, Netlify, GitHub Pages).

---

## Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Deploy to Vercel

Because this is a 100% static frontend app, you can deploy it to Vercel instantly:

1. Push this repository to GitHub/GitLab.
2. Import the repo into Vercel.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
