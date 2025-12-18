// Options page script

document.addEventListener('DOMContentLoaded', async () => {
  // Load current settings
  const { staleThreshold, notificationsEnabled, githubToken } = await chrome.storage.sync.get([
    'staleThreshold',
    'notificationsEnabled',
    'githubToken'
  ]);
  
  if (staleThreshold) {
    document.getElementById('stale-threshold').value = staleThreshold;
  }
  
  if (notificationsEnabled !== undefined) {
    document.getElementById('notifications').value = notificationsEnabled.toString();
  }
  
  if (githubToken) {
    document.getElementById('github-token').value = githubToken;
  }
  
  // Save button handler
  document.getElementById('save-btn').addEventListener('click', async () => {
    const staleThreshold = parseInt(document.getElementById('stale-threshold').value);
    const notificationsEnabled = document.getElementById('notifications').value === 'true';
    const githubToken = document.getElementById('github-token').value;
    
    await chrome.storage.sync.set({
      staleThreshold,
      notificationsEnabled,
      githubToken: githubToken || ''
    });
    
    // Show success message
    const status = document.getElementById('status');
    status.textContent = 'Settings saved!';
    status.className = 'status success';
    
    setTimeout(() => {
      status.className = 'status';
    }, 3000);
  });
});


