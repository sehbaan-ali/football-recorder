import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/football-recorder.db');
const dataDir = path.join(__dirname, '../../data');

let db: Database;

// Initialize sql.js database
export async function initDatabase() {
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const SQL = await initSqlJs();

  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
    console.log('✅ Loaded existing database');
  } else {
    db = new SQL.Database();
    console.log('✅ Created new database');
  }

  return db;
}

// Save database to file
export function saveDatabase() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  const data = db.export();
  fs.writeFileSync(dbPath, data);
}

// Get database instance
export function getDb(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export default { initDatabase, getDb, saveDatabase };
