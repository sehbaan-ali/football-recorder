import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/database";

/**
 * DELETE /api/players/{id}
 * Deletes a player from the database
 */
export async function deletePlayer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processed a request for deletePlayer');

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

        // Delete the player
        const result = await query(
            'DELETE FROM players WHERE id = $1 RETURNING id, name',
            [playerId]
        );

        // Check if player was found and deleted
        if (result.rows.length === 0) {
            return {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Player not found' })
            };
        }

        const deletedPlayer = result.rows[0];
        context.log(`Deleted player: ${deletedPlayer.name} (${deletedPlayer.id})`);

        return {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                message: 'Player deleted successfully',
                id: deletedPlayer.id
            })
        };

    } catch (error) {
        context.error('Error in deletePlayer:', error);

        // Check for foreign key constraint violation
        if (error.code === '23503') {
            return {
                status: 409,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: 'Cannot delete player',
                    message: 'Player is referenced in existing matches. Archive the player instead.'
                })
            };
        }

        return {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: 'Failed to delete player',
                message: error.message
            })
        };
    }
}

// Register the HTTP trigger
app.http('deletePlayer', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'players/{id}',
    handler: deletePlayer
});
