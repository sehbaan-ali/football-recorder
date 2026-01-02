# Football Recorder Backend API

Express + SQLite backend for the Football Recorder app.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Initialize Database

This creates the SQLite database and tables:

```bash
npm run db:setup
```

### 3. Start Development Server

```bash
npm run dev
```

The API will run on `http://localhost:3000`

## API Endpoints

### Players

- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get player by ID
- `POST /api/players` - Create new player
  ```json
  { "name": "John Doe" }
  ```
- `PUT /api/players/:id` - Update player
  ```json
  { "name": "John Smith" }
  ```
- `DELETE /api/players/:id` - Delete player
- `PATCH /api/players/:id/archive` - Archive player
- `PATCH /api/players/:id/unarchive` - Unarchive player

### Matches

- `GET /api/matches` - Get all matches
- `GET /api/matches/:id` - Get match by ID
- `POST /api/matches` - Create new match
  ```json
  {
    "date": "2024-01-15",
    "yellowTeam": {
      "playerIds": ["uuid1", "uuid2"],
      "score": 5
    },
    "redTeam": {
      "playerIds": ["uuid3", "uuid4"],
      "score": 3
    },
    "events": []
  }
  ```
- `PUT /api/matches/:id` - Update match
- `DELETE /api/matches/:id` - Delete match

### Stats

- `GET /api/stats` - Get all player statistics
- `GET /api/stats/top?sortBy=wins&limit=10` - Get top players
  - sortBy: `wins`, `goals`, `assists`, `cleanSheets`, `winRate`
  - limit: number of players (default: 10)
- `GET /api/stats/:id` - Get stats for specific player

### Health Check

- `GET /health` - Check if server is running

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Express server entry point
│   ├── types/                # TypeScript type definitions
│   ├── database/
│   │   ├── connection.ts     # SQLite connection
│   │   └── setup.ts          # Database schema creation
│   ├── services/             # Business logic & database operations
│   │   ├── playerService.ts
│   │   ├── matchService.ts
│   │   └── statsService.ts
│   ├── controllers/          # Request handlers
│   │   ├── playerController.ts
│   │   ├── matchController.ts
│   │   └── statsController.ts
│   ├── routes/               # API route definitions
│   │   ├── players.ts
│   │   ├── matches.ts
│   │   └── stats.ts
│   └── middleware/           # Express middleware
│       └── errorHandler.ts
├── data/                     # SQLite database file (created automatically)
├── package.json
└── tsconfig.json
```

## Development

- `npm run dev` - Start dev server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run db:setup` - Initialize/reset database

## Database

The app uses SQLite with two main tables:

**players**
- id (TEXT, PRIMARY KEY)
- name (TEXT)
- created_at (TEXT)
- archived (INTEGER, 0 or 1)

**matches**
- id (TEXT, PRIMARY KEY)
- date (TEXT)
- yellow_team_player_ids (TEXT, JSON array)
- yellow_team_score (INTEGER)
- red_team_player_ids (TEXT, JSON array)
- red_team_score (INTEGER)
- events (TEXT, JSON array)
- created_at (TEXT)

## Next Steps

1. **Test the API** - Use curl, Postman, or your frontend to test endpoints
2. **Update Frontend** - Modify your React app to call these API endpoints instead of localStorage
3. **Deploy** - Deploy to Railway, Render, or Fly.io

## Deployment

When ready to deploy, you'll need to:
1. Build the project: `npm run build`
2. Set environment variable: `PORT=3000` (or your chosen port)
3. Run: `npm start`

Most cloud platforms (Railway, Render, Fly.io) will automatically detect and run these commands.
