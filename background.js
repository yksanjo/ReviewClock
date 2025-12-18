// Background service worker for Code Review Time Tracker

chrome.runtime.onInstalled.addListener(() => {
  console.log('Code Review Time Tracker installed');
  
  // Set default settings
  chrome.storage.sync.set({
    staleThreshold: 48, // hours
    notificationsEnabled: true,
    githubToken: ''
  });
});

// Check for stale PRs periodically
chrome.alarms.create('checkStalePRs', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkStalePRs') {
    checkStalePRs();
  }
});

async function checkStalePRs() {
  const { staleThreshold, notificationsEnabled } = await chrome.storage.sync.get([
    'staleThreshold',
    'notificationsEnabled'
  ]);
  
  if (!notificationsEnabled) return;
  
  const data = await chrome.storage.local.get(null);
  const now = Date.now();
  const thresholdMs = staleThreshold * 60 * 60 * 1000;
  
  for (const [key, pr] of Object.entries(data)) {
    if (key.startsWith('pr_')) {
      const lastUpdate = pr.lastUpdate || pr.createdAt;
      const timeSinceUpdate = now - lastUpdate;
      
      if (timeSinceUpdate > thresholdMs && !pr.notified) {
        // Send notification
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'Stale PR Alert',
          message: `${pr.title} has been waiting ${Math.round(timeSinceUpdate / (60 * 60 * 1000))} hours for review`
        });
        
        pr.notified = true;
        chrome.storage.local.set({ [key]: pr });
      }
    }
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'savePR') {
    savePRData(request.data);
    sendResponse({ success: true });
  } else if (request.action === 'getPR') {
    getPRData(request.prUrl).then(sendResponse);
    return true; // Keep channel open for async response
  }
  return false;
});

async function savePRData(prData) {
  const key = `pr_${prData.url}`;
  const existing = await chrome.storage.local.get(key);
  
  if (existing[key]) {
    // Update existing PR
    const updated = {
      ...existing[key],
      ...prData,
      lastUpdate: Date.now()
    };
    chrome.storage.local.set({ [key]: updated });
  } else {
    // New PR
    prData.createdAt = Date.now();
    prData.lastUpdate = Date.now();
    prData.notified = false;
    chrome.storage.local.set({ [key]: prData });
  }
}

async function getPRData(prUrl) {
  const key = `pr_${prUrl}`;
  const result = await chrome.storage.local.get(key);
  return result[key] || null;
}


