# Code Review Time Tracker

A Chrome extension that tracks how long pull requests sit in review. Get insights into your team's code review velocity and identify bottlenecks.

## Features

- ⏱️ Automatic PR review time tracking
- 📊 Dashboard showing review metrics
- 👥 Per-reviewer statistics
- 📈 Team velocity trends
- 🔔 Notifications for stale PRs
- 📤 Export data to CSV/JSON

## Installation

### From Source

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `code-review-time-tracker` directory

### From Chrome Web Store

(Coming soon)

## Setup

1. Install the extension
2. Click the extension icon and configure:
   - GitHub token (for private repos)
   - Notification preferences
   - Stale PR threshold (default: 48 hours)

## Usage

The extension automatically tracks:
- Time from PR creation to first review
- Time from last comment to merge/close
- Total review time
- Number of review rounds

Click the extension icon to view:
- Current PRs being tracked
- Review time statistics
- Team performance metrics

## Permissions

- `storage`: Store review time data locally
- `alarms`: Schedule notifications for stale PRs
- `tabs`: Track PR pages you visit
- `https://github.com/*`: Access GitHub PR pages

## Data Privacy

All data is stored locally in your browser. No data is sent to external servers.

## License

MIT License
