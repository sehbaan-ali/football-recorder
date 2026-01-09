import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/database";

/**
 * PATCH /api/players/{id}/archive
 * Archives or unarchives a player
 */
export async function archivePlayer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processed a request for archivePlayer');

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

        // Parse request body to get archived status
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

        const { archived } = data;

        // Validate archived field
        if (typeof archived !== 'boolean') {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'archived field must be a boolean (true or false)' })
            };
        }

        // Update archived status
        const result = await query(
            `UPDATE players
             SET archived = $1
             WHERE id = $2
             RETURNING id, name, position, created_at, archived`,
            [archived, playerId]
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

        const action = archived ? 'archived' : 'unarchived';
        context.log(`Player ${action}: ${player.name} (${player.id})`);

        return {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(player)
        };

    } catch (error) {
        context.error('Error in archivePlayer:', error);

        return {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: 'Failed to archive/unarchive player',
                message: error.message
            })
        };
    }
}

// Register the HTTP trigger
app.http('archivePlayer', {
    methods: ['PATCH'],
    authLevel: 'anonymous',
    route: 'players/{id}/archive',
    handler: archivePlayer
});
