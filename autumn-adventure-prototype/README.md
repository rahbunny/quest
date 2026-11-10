# The Autumn Castle — Prototype v0.3

## Run locally
1. Unzip this folder.
2. Open `index.html` in a modern browser. If your browser blocks local features, run a simple local server (for example, VS Code Live Server).
3. Play through the adventure.

## What's new in v0.3
- The entrance now emphasizes a dense autumn tree line, with the castle reduced to a distant silhouette.
- Added drifting fog layers and warm lantern glow.
- The robed traveler periodically ducks behind the foreground lantern as a small easter egg.
- Added occasional drifting leaves and a squirrel that hops across the lower edge of adventure scenes.
- Lantern cutscene now holds about one second longer.
- Result item now has a reveal animation.

## Files
- `index.html` — screens and scene elements
- `styles.css` — pixel-art look, scenery, and animations
- `game.js` — branching paths, shadow-route roll, and outcomes

## Developer testing
Append `?shadow=1` to the local URL to force the hidden gnoll fight option to appear. This is a prototype-only testing shortcut.

## Important
Account creation, persistent rewards, shared leaderboard, and server-enforced cooldown are still demo-only and require backend integration before public launch.


## Version 0.4 update
- The ending result appears immediately for a five-second reveal.
- After five seconds, the account creation screen appears.
- Share and collection actions remain hidden until the player submits the prototype account form.
- The reward icon continues with a gentle glow after its reveal.
