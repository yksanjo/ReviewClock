# ReviewClock ⏱️

> **Code Review Time Tracker** - Track how long pull requests sit in review. Get insights into your team's code review velocity and identify bottlenecks with this powerful Chrome extension.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=google-chrome)](https://chrome.google.com/webstore)
[![Status: Active](https://img.shields.io/badge/status-active-success.svg)](https://github.com/yksanjo/ReviewClock)
[![GitHub stars](https://img.shields.io/github/stars/yksanjo/ReviewClock?style=social)](https://github.com/yksanjo/ReviewClock)

**ReviewClock** automatically tracks code review times on GitHub, helping you understand your team's review velocity, identify bottlenecks, and improve your development workflow.

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
