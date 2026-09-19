# 🛡 Security Policy

We take the security and privacy of **rm-crImg** seriously. Because this application processes user imagery and provenance data, privacy and security are foundational to our design.

---

## 🔒 Security Architecture Guarantee

**rm-crImg is designed with a zero-trust, client-side architecture:**
- **Zero Server Storage**: No images or data are ever transmitted to or stored on any server.
- **Pure Local Execution**: All image transformations and pixel manipulations occur inside the local browser context via HTML5 Canvas.
- **No Third-Party Telemetry**: No third-party trackers or external analytic scripts run in the production bundle.

---

## 📦 Supported Versions

We provide security updates and patches for the latest release on the primary branch.

| Version | Supported          |
| ------- | ------------------ |
| Latest (`master`) | :white_check_mark: |
| Older releases   | :x:                |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability in this project:

1. **Do not create a public issue** on GitHub.
2. Report the vulnerability privately:
   - Via **GitHub Private Vulnerability Reporting** on the repository page: [Report a vulnerability](https://github.com/H0NEYP0T-466/rm-crImg/security/advisories/new)
   - Or by contacting the maintainer directly through GitHub profile contact options.
3. Please include in your report:
   - A detailed description of the vulnerability.
   - Steps or proof-of-concept to reproduce the vulnerability.
   - Any potential impact on client-side security or user privacy.
   - Your name or handle if you would like to be credited.

---

## ⏱ Vulnerability Handling Process

1. **Acknowledgment**: We aim to acknowledge receipt of the report within 48 hours.
2. **Evaluation & Verification**: We will assess the severity and replicate the issue.
3. **Remediation**: Once verified, we will develop and test a fix.
4. **Disclosure**: A patched release will be published, followed by a public advisory with appropriate attribution.

Thank you for helping keep our users and open source software secure!
