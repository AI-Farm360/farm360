# Farm360

AI-powered satellite advisory for smallholder potato farmers in East Africa. Continuously analyzes satellite imagery, weather indices, and crop growth patterns to detect moisture stress, leaf anomaly, and pest risk early.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Maps:** Leaflet + react-leaflet
- **Charts:** Recharts
- **Forms:** react-hook-form + zod
- **Animation:** motion + lottie-react
- **Icons:** lucide-react

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` and set your `GEMINI_API_KEY`.

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Production build         |
| `npm start`       | Start production server  |
| `npm run lint`    | Run linter               |

## Project Structure

```
app/            # Next.js App Router pages
├── register/   # Farm registration
├── dashboard/  # Main dashboard (advisories, fields, weather, etc.)
├── feedback/   # Farmer feedback
├── api/        # API routes
├── layout.tsx  # Root layout
└── page.tsx    # Landing page
src/components/ # Shared components
```
