import { initDatabase, getDb, saveDatabase } from './connection';

// Create tables
export async function setupDatabase() {
  console.log('Setting up database schema...');

  await initDatabase();
  const db = getDb();

  // Players table
  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      position TEXT NOT NULL,
      created_at TEXT NOT NULL,
      archived INTEGER DEFAULT 0
    )
  `);

  // Matches table
  db.run(`
    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      yellow_team_player_ids TEXT NOT NULL,
      yellow_team_score INTEGER NOT NULL,
      red_team_player_ids TEXT NOT NULL,
      red_team_score INTEGER NOT NULL,
      events TEXT NOT NULL,
      created_at TEXT NOT NULL,
      man_of_the_match TEXT
    )
  `);

  // Create indexes for better query performance
  db.run(`CREATE INDEX IF NOT EXISTS idx_players_archived ON players(archived)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(date)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_matches_motm ON matches(man_of_the_match)`);

  // Save database to disk
  saveDatabase();

  console.log('✅ Database schema created successfully!');
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('Database setup complete. You can now start the server.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}
