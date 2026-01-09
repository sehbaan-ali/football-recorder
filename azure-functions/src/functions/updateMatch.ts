import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/database";

/**
 * PUT /api/matches/{id}
 * Updates an existing match (typically for adding events, updating scores)
 */
export async function updateMatch(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processed a request for updateMatch');

    try {
        // Get match ID from URL parameter
        const matchId = request.params.id;

        if (!matchId) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Match ID is required' })
            };
        }

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

        const { date, yellowTeam, redTeam, events } = data;

        // Validate at least one field is provided
        if (date === undefined && yellowTeam === undefined && redTeam === undefined && events === undefined) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'At least one field must be provided to update' })
            };
        }

        // Build dynamic UPDATE query
        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (date !== undefined) {
            updates.push(`date = $${paramIndex++}`);
            values.push(date);
        }

        if (yellowTeam !== undefined) {
            if (yellowTeam.playerIds !== undefined) {
                if (!Array.isArray(yellowTeam.playerIds)) {
                    return {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ error: 'yellowTeam.playerIds must be an array' })
                    };
                }
                updates.push(`yellow_team_player_ids = $${paramIndex++}`);
                values.push(yellowTeam.playerIds);
            }
            if (yellowTeam.score !== undefined) {
                if (typeof yellowTeam.score !== 'number') {
                    return {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ error: 'yellowTeam.score must be a number' })
                    };
                }
                updates.push(`yellow_team_score = $${paramIndex++}`);
                values.push(yellowTeam.score);
            }
        }

        if (redTeam !== undefined) {
            if (redTeam.playerIds !== undefined) {
                if (!Array.isArray(redTeam.playerIds)) {
                    return {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ error: 'redTeam.playerIds must be an array' })
                    };
                }
                updates.push(`red_team_player_ids = $${paramIndex++}`);
                values.push(redTeam.playerIds);
            }
            if (redTeam.score !== undefined) {
                if (typeof redTeam.score !== 'number') {
                    return {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ error: 'redTeam.score must be a number' })
                    };
                }
                updates.push(`red_team_score = $${paramIndex++}`);
                values.push(redTeam.score);
            }
        }

        if (events !== undefined) {
            if (!Array.isArray(events)) {
                return {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'events must be an array' })
                };
            }
            updates.push(`events = $${paramIndex++}`);
            values.push(JSON.stringify(events));
        }

        // Add match ID as last parameter
        values.push(matchId);

        // Execute update
        const result = await query(
            `UPDATE matches
             SET ${updates.join(', ')}
             WHERE id = $${paramIndex}
             RETURNING
                id,
                date,
                yellow_team_player_ids,
                yellow_team_score,
                red_team_player_ids,
                red_team_score,
                events,
                created_at`,
            values
        );

        // Check if match was found
        if (result.rows.length === 0) {
            return {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Match not found' })
            };
        }

        // Transform to match frontend format
        const updatedMatch = result.rows[0];
        const match = {
            id: updatedMatch.id,
            date: updatedMatch.date,
            yellowTeam: {
                playerIds: updatedMatch.yellow_team_player_ids || [],
                score: updatedMatch.yellow_team_score || 0
            },
            redTeam: {
                playerIds: updatedMatch.red_team_player_ids || [],
                score: updatedMatch.red_team_score || 0
            },
            events: updatedMatch.events || [],
            createdAt: updatedMatch.created_at
        };

        context.log(`Updated match: ${match.id}`);

        return {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(match)
        };

    } catch (error) {
        context.error('Error in updateMatch:', error);

        return {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: 'Failed to update match',
                message: error.message
            })
        };
    }
}

// Register the HTTP trigger
app.http('updateMatch', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'matches/{id}',
    handler: updateMatch
});
