# 🛡️ Next.js Advanced Authentication System

A robust, full-stack authentication platform built with **Next.js 15 (App Router)**. This project demonstrates a hybrid identity model, combining industry-standard OAuth 2.0 via Google with a custom localized Multi-Factor Authentication (MFA) flow.

🚀 **Live Demo:** [View Deployment](https://authentication-system-xhaw.vercel.app/)

## ✨ Key Features
* **Dual-Channel Authentication:** Support for Google SSO and Local Email/Password login.
* **Multi-Factor Authentication (MFA):** Integrated 6-digit OTP verification for local logins.
* **Open-Source IAS Integration:** Architecture designed for seamless integration with Identity & Access Management tools like **Authentik**.
* **Route Guarding:** Advanced Middleware implementation protecting `/dashboard` and `/auth/settings`.
* **Responsive UI:** Modern "Glassmorphism" design using Tailwind CSS with dedicated Step-by-Step UX feedback.

## 🛠️ Technical Stack
- **Framework:** Next.js 15+ (React 19)
- **Auth:** NextAuth.js (v4) & JWT Strategy
- **Styling:** Tailwind CSS
- **State Management:** React Hooks (Context API / LocalStorage)
- **Security:** Middleware-level session validation & CSRF protection

## 🏗️ Architecture Overview
The system uses a **Smart Routing** architecture:
1.  **Gatekeeper (`middleware.ts`)**: Validates sessions across two channels (NextAuth Token or Local Session Cookie).
2.  **The Controller (`/`)**: A logic-only root that directs traffic based on real-time authentication state.
3.  **Identity Dashboard (`/dashboard`)**: A centralized hub for user session auditing and role verification.

## ⚙️ Local Setup
1. Clone the repo: `git clone https://github.com/deva-harsha-v/authentication-system`
2. Install dependencies: `npm install`
3. Configure `.env.local`:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret
   GOOGLE_CLIENT_ID=your_id
   GOOGLE_CLIENT_SECRET=your_secret
