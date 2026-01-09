import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/database";

/**
 * POST /api/players
 * Creates a new player in the database
 */
export async function createPlayer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processed a request for createPlayer');

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
                body: JSON.stringify({
                    error: 'Invalid JSON in request body'
                })
            };
        }

        // Validate required fields
        const { name, position } = data;

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: 'Player name is required and must be a non-empty string'
                })
            };
        }

        // Validate position is one of the allowed values
        const validPositions = ['GK', 'DEF', 'MID', 'WING', 'ST'];
        if (!position || !validPositions.includes(position)) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: `Position must be one of: ${validPositions.join(', ')}`
                })
            };
        }

        // Insert into database
        const result = await query(
            `INSERT INTO players (name, position, archived, created_at)
             VALUES ($1, $2, $3, NOW())
             RETURNING id, name, position, created_at, archived`,
            [name.trim(), position, false]
        );

        // Get the created player
        const createdPlayer = result.rows[0];

        // Transform to match frontend format
        const player = {
            id: createdPlayer.id,
            name: createdPlayer.name,
            position: createdPlayer.position,
            createdAt: createdPlayer.created_at,
            archived: createdPlayer.archived || false
        };

        context.log(`Created player: ${player.name} (${player.position})`);

        return {
            status: 201, // 201 Created
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(player)
        };

    } catch (error) {
        context.error('Error in createPlayer:', error);

        return {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: 'Failed to create player',
                message: error.message
            })
        };
    }
}

// Register the HTTP trigger
app.http('createPlayer', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'players',
    handler: createPlayer
});
