// Popup script for Code Review Time Tracker

document.addEventListener('DOMContentLoaded', async () => {
  await loadPRs();
  setupEventListeners();
});

async function loadPRs() {
  const data = await chrome.storage.local.get(null);
  const prs = Object.entries(data)
    .filter(([key]) => key.startsWith('pr_'))
    .map(([key, value]) => value)
    .sort((a, b) => (b.lastUpdate || b.createdAt) - (a.lastUpdate || a.createdAt))
    .slice(0, 10); // Show top 10
  
  document.getElementById('total-prs').textContent = prs.length;
  
  // Calculate average review time
  if (prs.length > 0) {
    const avgTime = prs.reduce((sum, pr) => sum + (pr.timeSinceCreation || 0), 0) / prs.length;
    const avgHours = Math.round(avgTime / (60 * 60 * 1000));
    document.getElementById('avg-time').textContent = `${avgHours}h`;
  }
  
  // Display PR list
  const listEl = document.getElementById('pr-list');
  if (prs.length === 0) {
    listEl.innerHTML = '<p>No PRs tracked yet. Visit a GitHub PR page to start tracking.</p>';
  } else {
    listEl.innerHTML = prs.map(pr => {
      const hours = Math.round((pr.timeSinceCreation || 0) / (60 * 60 * 1000));
      const days = Math.floor(hours / 24);
      const timeStr = days > 0 ? `${days}d ${hours % 24}h` : `${hours}h`;
      
      return `
        <div class="pr-item" data-url="${pr.url}">
          <div class="pr-title">${pr.title}</div>
          <div class="pr-time">${timeStr} • ${pr.owner}/${pr.repo}</div>
        </div>
      `;
    }).join('');
    
    // Add click handlers
    listEl.querySelectorAll('.pr-item').forEach(item => {
      item.addEventListener('click', () => {
        chrome.tabs.create({ url: item.dataset.url });
      });
    });
  }
}

function setupEventListeners() {
  document.getElementById('export-btn').addEventListener('click', exportData);
  document.getElementById('settings-btn').addEventListener('click', openSettings);
}

async function exportData() {
  const data = await chrome.storage.local.get(null);
  const prs = Object.entries(data)
    .filter(([key]) => key.startsWith('pr_'))
    .map(([key, value]) => value);
  
  // Convert to CSV
  const csv = [
    ['Title', 'Owner', 'Repo', 'Number', 'Author', 'Created At', 'Review Time (hours)'].join(','),
    ...prs.map(pr => [
      `"${pr.title}"`,
      pr.owner,
      pr.repo,
      pr.number,
      pr.author,
      new Date(pr.createdAt).toISOString(),
      Math.round((pr.timeSinceCreation || 0) / (60 * 60 * 1000))
    ].join(','))
  ].join('\n');
  
  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `review-times-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function openSettings() {
  chrome.runtime.openOptionsPage();
}


