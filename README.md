# ⚽ Footy Tracker

A modern football match tracking app for recording pickup games with friends.

🌐 **Live Site:** [www.footy-tracker.com](https://www.footy-tracker.com)

## Features

- 📊 Track players, matches, and statistics
- 📈 Leaderboard with goals, assists, and win/loss records
- ⚡ Real-time updates across all devices
- 📱 Fully responsive mobile design
- 🎨 Clean, modern UI with dark mode support
- 🔐 Secure authentication

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **UI:** TailwindCSS + Radix UI
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Real-time:** Supabase Realtime
- **Deployment:** Vercel
- **Testing:** Vitest + React Testing Library

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/football-recorder.git
   cd football-recorder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your Supabase credentials to .env
   ```

4. **Start dev server**
   ```bash
   npm run dev
   ```

5. **Open** http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Lint code

## Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these from your Supabase project dashboard.

## Deployment

Deployed automatically to Vercel on push to `master` branch.

## License

MIT
