# 3D Print Pricer

Desktop application for pricing 3D printed parts with precision. Built with Tauri 2, React 18, and TypeScript — works fully offline.

## Features

- Calculate material, energy, wear, and extra costs per piece
- Real-time pricing preview as you type
- Save and manage pieces history with full CRUD
- Duplicate and edit existing quotes
- Printer profiles for quick autofill
- Dashboard with KPI cards and cost vs. price bar chart
- Auto-save drafts between sessions
- Keyboard shortcuts for power users
- Dark premium UI inspired by Linear / Vercel / Raycast

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 22+ |
| Rust | 1.77+ (`rustup update stable`) |
| Xcode Command Line Tools (macOS) | latest |

## Installation

```bash
# 1. Clone / open the project directory
cd 3d-printing-pricing-tool

# 2. Install JS dependencies
npm install

# 3. Verify Rust is up to date
rustup update stable
```

## Development

```bash
npm run tauri dev
```

This starts the Vite dev server (port 1420) and the Tauri desktop window simultaneously. The app has hot-module reload for the frontend.

## Production Build

```bash
npm run tauri build
```

Binaries are placed in `src-tauri/target/release/bundle/`.

## Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── calculator/     # Section cards (Material, Energy, Wear, Extras, Profit, Totals)
│   │   ├── layout/         # AppShell, Sidebar, Topbar
│   │   └── ui/             # Button, Card, Input, Select, Textarea, Dialog
│   ├── database/
│   │   ├── migrations.ts   # SQLite init + schema creation
│   │   └── zodSchemas.ts   # Zod types for Printer and Piece
│   ├── hooks/              # useCalculation, usePieces, usePrinters, useShortcuts
│   ├── lib/                # cn() utility
│   ├── pages/              # Calculator, History, Dashboard, Settings
│   ├── services/           # pieceRepo, printerRepo, formatters
│   └── store/              # uiStore, draftStore (Zustand)
├── src-tauri/
│   ├── src/lib.rs          # Tauri builder with sql plugin
│   └── tauri.conf.json     # App config
├── tailwind.config.ts
└── vite.config.ts
```

## Database

SQLite file is stored at:
- **macOS**: `~/Library/Application Support/com.pechinchou.printpricer/pricing.db`
- **Linux**: `~/.local/share/com.pechinchou.printpricer/pricing.db`
- **Windows**: `%APPDATA%\com.pechinchou.printpricer\pricing.db`

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+S` / `Ctrl+S` | Save piece |
| `Cmd+D` / `Ctrl+D` | Duplicate piece |
| `Cmd+N` / `Ctrl+N` | New / clear form |
| `Cmd+1` | Go to Calculator |
| `Cmd+2` | Go to History |
| `Cmd+3` | Go to Dashboard |
| `Cmd+4` | Go to Settings |
| `Cmd+K` (History page) | Focus search |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop shell | Tauri 2 |
| Frontend | React 18 + TypeScript strict |
| Bundler | Vite 7 |
| Styling | TailwindCSS 3 + tailwindcss-animate |
| State | Zustand (with persistence) |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Database | @tauri-apps/plugin-sql (SQLite) |
| Charts | Recharts |
| Icons | Lucide React |
| Toasts | Sonner |
| Routing | React Router v6 |
