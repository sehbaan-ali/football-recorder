import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/database";

/**
 * POST /api/matches
 * Creates a new match in the database
 */
export async function createMatch(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processed a request for createMatch');

    try {
        // Parse request body
        const body = await request.text();
        let data;

        try {
            data = JSON.parse(body);
        } catch (parseError) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Invalid JSON in request body' })
            };
        }

        const { date, yellowTeam, redTeam, events = [] } = data;

        // Validate required fields
        if (!date || typeof date !== 'string') {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Match date is required and must be a string' })
            };
        }

        // Validate yellowTeam
        if (!yellowTeam || !Array.isArray(yellowTeam.playerIds)) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'yellowTeam.playerIds must be an array' })
            };
        }

        // Validate redTeam
        if (!redTeam || !Array.isArray(redTeam.playerIds)) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'redTeam.playerIds must be an array' })
            };
        }

        // Validate events is an array
        if (!Array.isArray(events)) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'events must be an array' })
            };
        }

        // Get scores from teams (default to 0)
        const yellowScore = yellowTeam.score !== undefined ? yellowTeam.score : 0;
        const redScore = redTeam.score !== undefined ? redTeam.score : 0;

        // Validate scores are numbers
        if (typeof yellowScore !== 'number' || typeof redScore !== 'number') {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Scores must be numbers' })
            };
        }

        // Insert into database
        const result = await query(
            `INSERT INTO matches (
                date,
                yellow_team_player_ids,
                yellow_team_score,
                red_team_player_ids,
                red_team_score,
                events,
                created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING
                id,
                date,
                yellow_team_player_ids,
                yellow_team_score,
                red_team_player_ids,
                red_team_score,
                events,
                created_at`,
            [
                date,
                yellowTeam.playerIds,
                yellowScore,
                redTeam.playerIds,
                redScore,
                JSON.stringify(events)  // Convert events array to JSON
            ]
        );

        // Get the created match
        const createdMatch = result.rows[0];

        // Transform to match frontend format
        const match = {
            id: createdMatch.id,
            date: createdMatch.date,
            yellowTeam: {
                playerIds: createdMatch.yellow_team_player_ids || [],
                score: createdMatch.yellow_team_score || 0
            },
            redTeam: {
                playerIds: createdMatch.red_team_player_ids || [],
                score: createdMatch.red_team_score || 0
            },
            events: createdMatch.events || [],
            createdAt: createdMatch.created_at
        };

        context.log(`Created match on ${match.date} (ID: ${match.id})`);

        return {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(match)
        };

    } catch (error) {
        context.error('Error in createMatch:', error);

        return {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: 'Failed to create match',
                message: error.message
            })
        };
    }
}

// Register the HTTP trigger
app.http('createMatch', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'matches',
    handler: createMatch
});
