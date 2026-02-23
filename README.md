# Trinetra SOCOps — Protect. Detect. Respond

A professional cybersecurity knowledge hub dedicated to SOC operations, threat analysis, and security engineering. 

**"DO SOMETHING GREAT"**

## 🚀 Features

- **Cybersecurity Aesthetic**: Matrix-style design with neon blue accents and glassmorphism.
- **Admin Dashboard**: Full CRUD capabilities for managing security insights.
- **Rich Text Editor**: Support for code blocks, formatting, and incident report styles.
- **Supabase Integration**: Robust authentication and real-time database.
- **Responsive Design**: Optimized for everything from mobile phones to high-res monitors.
- **Category Browsing**: Dedicated hubs for SOC, SIEM, Threat Hunting, and more.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Vanilla CSS (Cyber-glass theme)
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **Editor**: React Quill (Customized)
- **Tools**: Antigravity IDE

## 📥 Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Saiprasanna888/trinetra-socops.git
   cd trinetra-socops
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Setup Environment Variables
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`

4. Start Development Server
   ```bash
   npm run dev
   ```

## 📦 Deployment

### Vercel

1. Connect your Github repository to Vercel.
2. In Project Settings, add the environment variables identified in `.env.example`.
3. The build settings should automatically detect Vite (`npm run build`).
4. Output directory: `dist`.

## 📄 License

© 2026 Trinetra SOCops. All rights reserved. Built by Saiprasanna Muppalla for the cybersecurity community.
