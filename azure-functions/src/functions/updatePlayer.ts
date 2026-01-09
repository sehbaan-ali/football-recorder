import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/database";

/**
 * PUT /api/players/{id}
 * Updates an existing player
 */
export async function updatePlayer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processed a request for updatePlayer');

    try {
        // Get player ID from URL parameter
        const playerId = request.params.id;

        if (!playerId) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Player ID is required' })
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

        const { name, position, archived } = data;

        // Validate at least one field is provided
        if (name === undefined && position === undefined && archived === undefined) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'At least one field must be provided to update' })
            };
        }

        // Validate name if provided
        if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Name must be a non-empty string' })
            };
        }

        // Validate position if provided
        const validPositions = ['GK', 'DEF', 'MID', 'WING', 'ST'];
        if (position !== undefined && !validPositions.includes(position)) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: `Position must be one of: ${validPositions.join(', ')}` })
            };
        }

        // Build dynamic UPDATE query based on provided fields
        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (name !== undefined) {
            updates.push(`name = $${paramIndex++}`);
            values.push(name.trim());
        }
        if (position !== undefined) {
            updates.push(`position = $${paramIndex++}`);
            values.push(position);
        }
        if (archived !== undefined) {
            updates.push(`archived = $${paramIndex++}`);
            values.push(archived);
        }

        // Add player ID as last parameter
        values.push(playerId);

        // Execute update
        const result = await query(
            `UPDATE players
             SET ${updates.join(', ')}
             WHERE id = $${paramIndex}
             RETURNING id, name, position, created_at, archived`,
            values
        );

        // Check if player was found
        if (result.rows.length === 0) {
            return {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Player not found' })
            };
        }

        // Transform to match frontend format
        const updatedPlayer = result.rows[0];
        const player = {
            id: updatedPlayer.id,
            name: updatedPlayer.name,
            position: updatedPlayer.position,
            createdAt: updatedPlayer.created_at,
            archived: updatedPlayer.archived || false
        };

        context.log(`Updated player: ${player.name} (${player.id})`);

        return {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(player)
        };

    } catch (error) {
        context.error('Error in updatePlayer:', error);

        return {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: 'Failed to update player',
                message: error.message
            })
        };
    }
}

// Register the HTTP trigger
app.http('updatePlayer', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'players/{id}',  // URL parameter for player ID
    handler: updatePlayer
});
