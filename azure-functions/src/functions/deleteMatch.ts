import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { query } from "../lib/database";

/**
 * DELETE /api/matches/{id}
 * Deletes a match from the database
 */
export async function deleteMatch(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('HTTP trigger function processed a request for deleteMatch');

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

        // Delete the match
        const result = await query(
            'DELETE FROM matches WHERE id = $1 RETURNING id, date',
            [matchId]
        );

        // Check if match was found and deleted
        if (result.rows.length === 0) {
            return {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Match not found' })
            };
        }

        const deletedMatch = result.rows[0];
        context.log(`Deleted match from ${deletedMatch.date} (ID: ${deletedMatch.id})`);

        return {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                message: 'Match deleted successfully',
                id: deletedMatch.id
            })
        };

    } catch (error) {
        context.error('Error in deleteMatch:', error);

        return {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: 'Failed to delete match',
                message: error.message
            })
        };
    }
}

// Register the HTTP trigger
app.http('deleteMatch', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'matches/{id}',
    handler: deleteMatch
});
