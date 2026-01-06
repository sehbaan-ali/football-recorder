import { Home, Users, Plus, Trophy, Settings, Shield, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Help() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help & Guide</h1>
        <p className="text-muted-foreground">Learn how to use Football Recorder</p>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>What is Football Recorder?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Football Recorder is a comprehensive app for tracking your football matches, managing players,
            and viewing statistics. Record match events in real-time, track player performance, and see
            who's leading the leaderboard.
          </p>
          <div className="bg-muted/50 p-4 rounded-lg text-sm">
            <p className="font-medium mb-2">Key Features:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Manage players and their positions</li>
              <li>Record matches with live event tracking</li>
              <li>View comprehensive statistics and leaderboards</li>
              <li>Track goals, assists, wins, and clean sheets</li>
              <li>Archive players while preserving their match history</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            <CardTitle>Dashboard</CardTitle>
          </div>
          <CardDescription>Your main overview page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">What you'll see:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Statistics Cards:</strong> Total matches played, total players, and total goals scored</li>
              <li><strong>Recent Matches:</strong> Your last 5 matches with scores and dates</li>
              <li><strong>Top Players:</strong> Leaderboards for most goals, assists, and wins</li>
            </ul>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <p className="font-medium mb-1">Quick Actions:</p>
            <p className="text-muted-foreground">
              Click "Record New Match" to start recording a new game (admin only)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Players Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Players</CardTitle>
          </div>
          <CardDescription>Manage your player roster</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Managing Players:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Add Players:</strong> Click "Add Player" button and enter name and position (admin only)</li>
              <li><strong>View Stats:</strong> See each player's matches, wins, draws, losses, goals, assists, and clean sheets</li>
              <li><strong>Edit Players:</strong> Click edit icon to update player name or position (admin only)</li>
              <li><strong>Archive Players:</strong> Remove players from active roster while keeping their history (admin only)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Player Positions:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted/50 p-2 rounded"><strong>GK</strong> - Goalkeeper</div>
              <div className="bg-muted/50 p-2 rounded"><strong>DEF</strong> - Defender</div>
              <div className="bg-muted/50 p-2 rounded"><strong>MID</strong> - Midfielder</div>
              <div className="bg-muted/50 p-2 rounded"><strong>WING</strong> - Winger</div>
              <div className="bg-muted/50 p-2 rounded"><strong>ST</strong> - Striker</div>
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-sm">
            <p className="font-medium mb-1">⚠️ Important:</p>
            <p className="text-muted-foreground">
              Players with match history cannot be deleted - they'll be archived instead to preserve statistics
            </p>
          </div>
        </CardContent>
      </Card>

      {/* New Match Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            <CardTitle>New Match</CardTitle>
          </div>
          <CardDescription>Record a football match</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">How to Record a Match:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li><strong>Select Match Date:</strong> Choose when the match was played</li>
              <li><strong>Pick Teams:</strong> Select 9 players for Yellow team and 9 players for Red team</li>
              <li><strong>Start Match:</strong> Click "Start Match" to begin recording</li>
              <li><strong>Record Events:</strong>
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Click player names to record goals</li>
                  <li>Select assist provider (optional)</li>
                  <li>Record own goals if needed</li>
                  <li>Use "Undo" to remove the last event</li>
                </ul>
              </li>
              <li><strong>Save Match:</strong> Click "Save Match" when finished</li>
            </ol>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <p className="font-medium mb-1">Requirements:</p>
            <p className="text-muted-foreground">
              You need at least 18 active players (9 per team) to start a match. Admin login required.
            </p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg text-sm">
            <p className="font-medium mb-1">💡 Tip:</p>
            <p className="text-muted-foreground">
              Clean sheets are automatically awarded to players whose team didn't concede any goals
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            <CardTitle>Leaderboard</CardTitle>
          </div>
          <CardDescription>Player rankings and statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Available Statistics:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Wins:</strong> Total matches won by each player</li>
              <li><strong>Goals:</strong> Total goals scored</li>
              <li><strong>Assists:</strong> Total assists provided</li>
              <li><strong>Clean Sheets:</strong> Matches where player's team didn't concede</li>
              <li><strong>Win Rate:</strong> Percentage of matches won</li>
            </ul>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <p className="font-medium mb-1">How to Use:</p>
            <p className="text-muted-foreground">
              Use the filter buttons at the top to sort players by different statistics.
              Click on any column to see the full table sorted by that metric.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Settings Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Settings</CardTitle>
          </div>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Appearance Settings:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Light Mode:</strong> Warm gray color scheme for bright environments</li>
              <li><strong>Dark Mode:</strong> Warm dark color scheme for low-light use</li>
              <li><strong>System:</strong> Automatically match your device's theme preference</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* User Roles Section */}
      <Card>
        <CardHeader>
          <CardTitle>User Roles</CardTitle>
          <CardDescription>Understanding permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {/* Viewer */}
            <div className="border border-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">Viewer</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Default role for anyone visiting the app
              </p>
              <div className="text-sm">
                <p className="font-medium mb-1">Can:</p>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>View all matches and statistics</li>
                  <li>Browse player profiles</li>
                  <li>Check leaderboards</li>
                </ul>
                <p className="font-medium mt-2 mb-1">Cannot:</p>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Add or edit players</li>
                  <li>Record new matches</li>
                  <li>Delete or archive data</li>
                </ul>
              </div>
            </div>

            {/* Admin */}
            <div className="border border-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <h4 className="font-medium">Admin</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Trusted users who can manage the app
              </p>
              <div className="text-sm">
                <p className="font-medium mb-1">Can do everything Viewer can, plus:</p>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Add, edit, and archive players</li>
                  <li>Record new matches</li>
                  <li>Delete matches</li>
                </ul>
              </div>
            </div>

            {/* Super Admin */}
            <div className="border border-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-amber-500" />
                <h4 className="font-medium">Super Admin</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Full access to all features
              </p>
              <div className="text-sm">
                <p className="font-medium mb-1">Can do everything Admin can, plus:</p>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Manage other users (via database)</li>
                  <li>Full administrative control</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg text-sm">
            <p className="font-medium mb-1">💡 Getting Admin Access:</p>
            <p className="text-muted-foreground">
              Contact the app owner to get admin credentials. The app is view-only without logging in.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tips & Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Tips & Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span>💡</span>
              <span>Add all your players before recording your first match</span>
            </li>
            <li className="flex gap-2">
              <span>💡</span>
              <span>Use consistent player names to avoid duplicates</span>
            </li>
            <li className="flex gap-2">
              <span>💡</span>
              <span>Archive players instead of deleting them to preserve statistics</span>
            </li>
            <li className="flex gap-2">
              <span>💡</span>
              <span>Record matches as you play for accurate event timing</span>
            </li>
            <li className="flex gap-2">
              <span>💡</span>
              <span>Use the undo button if you make a mistake during match recording</span>
            </li>
            <li className="flex gap-2">
              <span>💡</span>
              <span>Check the leaderboard regularly to see who's performing best</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
