import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  cleanImagePixelLevel,
  formatBytes,
  type CleanResult,
  type SupportedFormat,
} from './utils/imageCleaner';
import './App.css';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [result, setResult] = useState<CleanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [targetFormat, setTargetFormat] = useState<SupportedFormat>('original');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'clean' | 'original'>('clean');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process image with selected format
  const processImage = useCallback(
    async (inputFile: File, format: SupportedFormat = targetFormat) => {
      setIsProcessing(true);
      setError(null);

      // Create preview URL for original if not set
      const origUrl = URL.createObjectURL(inputFile);
      setOriginalUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return origUrl;
      });

      try {
        const cleanData = await cleanImagePixelLevel(inputFile, format);
        setResult((prev) => {
          if (prev?.url) URL.revokeObjectURL(prev.url);
          return cleanData;
        });
        setActiveTab('clean');
      } catch (err: unknown) {
        console.error('Cleaning failed:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to process image. Please ensure it is a valid JPG, PNG, or WebP.'
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [targetFormat]
  );

  const handleFileSelect = useCallback(
    (selectedFile: File) => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      const hasValidExt = /\.(jpe?g|png|webp)$/i.test(selectedFile.name);

      if (!validTypes.includes(selectedFile.type) && !hasValidExt) {
        setError('Please provide a valid JPG, PNG, or WebP image.');
        return;
      }

      setFile(selectedFile);
      processImage(selectedFile, targetFormat);
    },
    [processImage, targetFormat]
  );

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Clipboard Paste listener (Cmd+V / Ctrl+V anywhere)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        const pastedFile = e.clipboardData.files[0];
        if (pastedFile.type.startsWith('image/')) {
          handleFileSelect(pastedFile);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFileSelect]);

  // Format change handler
  const handleFormatChange = (newFormat: SupportedFormat) => {
    setTargetFormat(newFormat);
    if (file) {
      processImage(file, newFormat);
    }
  };

  // Download clean image
  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Copy to clipboard
  const handleCopyToClipboard = async () => {
    if (!result) return;
    try {
      // Most browsers only support copying image/png via ClipboardItem
      if (result.blob.type === 'image/png') {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': result.blob }),
        ]);
      } else {
        // Convert to PNG blob for clipboard
        const img = new Image();
        img.src = result.url;
        await new Promise((res) => {
          img.onload = res;
        });
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const pngBlob = await new Promise<Blob | null>((res) =>
          c.toBlob(res, 'image/png')
        );
        if (pngBlob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': pngBlob }),
          ]);
        }
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
      // Fallback message
      setError('Could not copy to clipboard directly. Please use Download instead.');
    }
  };

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setOriginalUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="site-header">
        <div className="logo-container">
          <div className="logo-mark">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <span className="logo-text">
            Clean<strong>Pix</strong>
          </span>
        </div>
        <div className="badge-client">
          <span className="badge-dot"></span>
          100% In-Browser • Zero Uploads
        </div>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <h1 className="hero-title">Strip AI tags & metadata.</h1>
        <p className="hero-subtitle">
          Copy image pixels directly onto a clean memory canvas. Strips C2PA
          Content Credentials, AI generation stamps, EXIF data, GPS, and edit
          history. Unlinked and untraceable.
        </p>
      </section>

      {/* Main Workflow Container */}
      <main className="main-card">
        {error && (
          <div className="error-alert">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
            <button className="error-close" onClick={() => setError(null)}>
              ✕
            </button>
          </div>
        )}

        {/* STEP 1: UPLOAD STATE */}
        {!file && (
          <div
            className={`dropzone ${isDragging ? 'dropzone-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="file-input-hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            <div className="dropzone-content">
              <div className="upload-icon-wrapper">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>

              <div className="dropzone-text">
                <p className="dropzone-primary">
                  <strong>Click to browse</strong> or drag & drop an image
                </p>
                <p className="dropzone-secondary">
                  Supports JPG, PNG, WebP • or paste with{' '}
                  <kbd className="kbd-shortcut">Ctrl</kbd>+
                  <kbd className="kbd-shortcut">V</kbd>
                </p>
              </div>

              <div className="supported-formats">
                <span className="format-pill">JPG</span>
                <span className="format-pill">PNG</span>
                <span className="format-pill">WebP</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PROCESSING STATE */}
        {file && isProcessing && (
          <div className="processing-state">
            <div className="spinner"></div>
            <p className="processing-title">Performing pixel-level copy...</p>
            <p className="processing-subtitle">
              Decoding raw RGBA pixels into an isolated canvas buffer. Discarding
              all EXIF headers, C2PA manifests, and AI provenance tags.
            </p>
          </div>
        )}

        {/* STEP 3: RESULT & DOWNLOAD STATE */}
        {file && !isProcessing && result && (
          <div className="result-container">
            {/* Image Preview & Details */}
            <div className="preview-card">
              <div className="preview-header">
                <div className="file-info-group">
                  <span className="file-name" title={file.name}>
                    {file.name}
                  </span>
                  <span className="file-dimensions">
                    {result.width} × {result.height} px
                  </span>
                </div>
                <div className="view-toggle">
                  <button
                    className={`toggle-btn ${activeTab === 'clean' ? 'active' : ''}`}
                    onClick={() => setActiveTab('clean')}
                  >
                    Cleaned
                  </button>
                  <button
                    className={`toggle-btn ${activeTab === 'original' ? 'active' : ''}`}
                    onClick={() => setActiveTab('original')}
                  >
                    Original
                  </button>
                </div>
              </div>

              <div className="preview-frame">
                <img
                  src={activeTab === 'clean' ? result.url : (originalUrl || '')}
                  alt={activeTab === 'clean' ? 'Cleaned Image' : 'Original Image'}
                  className="preview-image"
                />
              </div>

              <div className="cleaning-stats">
                <div className="stat-pill">
                  <span className="stat-label">Original:</span>
                  <span className="stat-val">{formatBytes(result.originalSize)}</span>
                </div>
                <div className="stat-arrow">→</div>
                <div className="stat-pill">
                  <span className="stat-label">Cleaned:</span>
                  <span className="stat-val stat-highlight">
                    {formatBytes(result.cleanSize)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stripped Info Checklist */}
            <div className="clean-verdict">
              <div className="verdict-header">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="verdict-title">All Provenance & Metadata Stripped</span>
              </div>
              <ul className="verdict-list">
                <li>
                  <span className="check-mark">✓</span> AI Generation Labels & Tags
                </li>
                <li>
                  <span className="check-mark">✓</span> C2PA Content Credentials Manifests
                </li>
                <li>
                  <span className="check-mark">✓</span> EXIF, Camera Specs & Serial #
                </li>
                <li>
                  <span className="check-mark">✓</span> GPS Coordinates & Location
                </li>
                <li>
                  <span className="check-mark">✓</span> Photoshop / Software Edit History
                </li>
              </ul>
            </div>

            {/* Output Format Selector */}
            <div className="format-selector-row">
              <span className="selector-label">Output Format:</span>
              <div className="selector-options">
                <button
                  className={`format-option-btn ${targetFormat === 'original' ? 'selected' : ''}`}
                  onClick={() => handleFormatChange('original')}
                >
                  Original ({file.type.split('/')[1]?.toUpperCase() || 'EXT'})
                </button>
                <button
                  className={`format-option-btn ${targetFormat === 'image/png' ? 'selected' : ''}`}
                  onClick={() => handleFormatChange('image/png')}
                >
                  PNG (Lossless)
                </button>
                <button
                  className={`format-option-btn ${targetFormat === 'image/jpeg' ? 'selected' : ''}`}
                  onClick={() => handleFormatChange('image/jpeg')}
                >
                  JPG (95%)
                </button>
                <button
                  className={`format-option-btn ${targetFormat === 'image/webp' ? 'selected' : ''}`}
                  onClick={() => handleFormatChange('image/webp')}
                >
                  WebP
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="actions-wrapper">
              <button className="btn-primary-download" onClick={handleDownload}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download Clean Image</span>
              </button>

              <div className="secondary-actions">
                <button
                  className={`btn-secondary ${copied ? 'btn-copied' : ''}`}
                  onClick={handleCopyToClipboard}
                  title="Copy cleaned image to clipboard"
                >
                  {copied ? (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>

                <button
                  className="btn-secondary"
                  onClick={handleReset}
                  title="Clean another image"
                >
                  Clean Another
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3-Step Explanation Cards */}
      <section className="steps-explanation">
        <h2 className="steps-heading">How it works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-badge">1</div>
            <h3>Upload</h3>
            <p>
              Drag-and-drop or select any JPG, PNG, or WebP. The file is read
              strictly in your browser memory.
            </p>
          </div>

          <div className="step-card">
            <div className="step-badge">2</div>
            <h3>Pixel Copy</h3>
            <p>
              An isolated HTML5 canvas redraws the raw RGBA pixels from scratch.
              All headers, C2PA manifests, and metadata are abandoned.
            </p>
          </div>

          <div className="step-card">
            <div className="step-badge">3</div>
            <h3>Download</h3>
            <p>
              Grab a pristine, unlinked image. Platforms treat it as a brand-new
              file with no AI or tracking provenance.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Notice */}
      <section className="privacy-card">
        <div className="privacy-icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div className="privacy-text">
          <h4>100% Client-Side Architecture</h4>
          <p>
            No backend, no server, no telemetry. Your images never leave your
            device. Open DevTools Network tab anytime to confirm zero outbound
            requests.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <p>CleanPix • Frontend-only pixel image cleaner • Ready for static hosting</p>
      </footer>
    </div>
  );
}
