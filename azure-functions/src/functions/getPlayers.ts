import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/database";

/**
 * GET /api/players
 * Returns all players from the database
 */
export async function getPlayers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processed a request for getPlayers');

    try {
        // Query the database for all players
        const result = await query(
            'SELECT id, name, position, created_at, archived FROM players ORDER BY created_at DESC'
        );

        // Transform database rows to match frontend format
        const players = result.rows.map(row => ({
            id: row.id,
            name: row.name,
            position: row.position,
            createdAt: row.created_at,
            archived: row.archived || false
        }));

        context.log(`Retrieved ${players.length} players from database`);

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(players)
        };
    } catch (error) {
        context.error('Error in getPlayers:', error);

        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Failed to fetch players',
                message: error.message
            })
        };
    }
}

// Register the HTTP trigger
app.http('getPlayers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'players',
    handler: getPlayers
});
