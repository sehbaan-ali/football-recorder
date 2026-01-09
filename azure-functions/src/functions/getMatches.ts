import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/database";

/**
 * GET /api/matches
 * Returns all matches from the database
 */
export async function getMatches(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processed a request for getMatches');

    try {
        // Query the database for all matches
        const result = await query(
            `SELECT
                id,
                date,
                yellow_team_player_ids,
                yellow_team_score,
                red_team_player_ids,
                red_team_score,
                events,
                created_at
             FROM matches
             ORDER BY date DESC`
        );

        // Transform database rows to match frontend format
        const matches = result.rows.map(row => ({
            id: row.id,
            date: row.date,
            yellowTeam: {
                playerIds: row.yellow_team_player_ids || [],
                score: row.yellow_team_score || 0
            },
            redTeam: {
                playerIds: row.red_team_player_ids || [],
                score: row.red_team_score || 0
            },
            events: row.events || [],
            createdAt: row.created_at
        }));

        context.log(`Retrieved ${matches.length} matches from database`);

        return {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(matches)
        };

    } catch (error) {
        context.error('Error in getMatches:', error);

        return {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: 'Failed to fetch matches',
                message: error.message
            })
        };
    }
}

// Register the HTTP trigger
app.http('getMatches', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'matches',
    handler: getMatches
});
