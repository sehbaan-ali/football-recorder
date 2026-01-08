import { Pool } from 'pg';

/**
 * PostgreSQL Connection Pool
 *
 * A connection pool manages multiple database connections efficiently.
 * Instead of opening/closing a connection for each request (slow),
 * it maintains a pool of reusable connections.
 *
 * Think of it like a taxi stand:
 * - Without pool: Call a new taxi for each trip (slow)
 * - With pool: Taxis waiting at the stand, ready to go (fast)
 */

let pool: Pool | null = null;

/**
 * Get or create the database connection pool
 */
export function getPool(): Pool {
    if (!pool) {
        const connectionString = process.env.DATABASE_CONNECTION_STRING;

        if (!connectionString) {
            throw new Error('DATABASE_CONNECTION_STRING is not set in environment variables');
        }

        pool = new Pool({
            connectionString,
            ssl: {
                rejectUnauthorized: false // Azure PostgreSQL requires SSL
            },
            max: 10,              // Maximum number of connections in pool
            idleTimeoutMillis: 30000,  // Close idle connections after 30 seconds
            connectionTimeoutMillis: 2000, // Timeout if can't get connection
        });

        // Log when pool is created
        console.log('PostgreSQL connection pool created');
    }

    return pool;
}

/**
 * Execute a SQL query
 *
 * @param query - SQL query string
 * @param params - Query parameters (prevents SQL injection)
 * @returns Query result
 */
export async function query(query: string, params?: any[]) {
    const pool = getPool();
    const start = Date.now();

    try {
        const result = await pool.query(query, params);
        const duration = Date.now() - start;

        console.log('Executed query', { query, duration, rows: result.rowCount });

        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

/**
 * Close the connection pool (for cleanup)
 */
export async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
        console.log('PostgreSQL connection pool closed');
    }
}
