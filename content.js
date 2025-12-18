// Content script for GitHub PR pages

(function() {
  'use strict';
  
  let prData = null;
  
  function extractPRData() {
    const url = window.location.href;
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
    
    if (!match) return null;
    
    const [, owner, repo, number] = match;
    
    // Extract PR title
    const titleEl = document.querySelector('.gh-header-title .js-issue-title');
    const title = titleEl ? titleEl.textContent.trim() : 'Unknown';
    
    // Extract author
    const authorEl = document.querySelector('.gh-header-meta .author');
    const author = authorEl ? authorEl.textContent.trim() : 'Unknown';
    
    // Extract created date
    const timeEl = document.querySelector('relative-time');
    const createdAt = timeEl ? new Date(timeEl.getAttribute('datetime')).getTime() : Date.now();
    
    // Extract review status
    const reviewStatus = getReviewStatus();
    
    // Calculate time metrics
    const now = Date.now();
    const timeSinceCreation = now - createdAt;
    
    return {
      url,
      owner,
      repo,
      number: parseInt(number),
      title,
      author,
      createdAt,
      reviewStatus,
      timeSinceCreation,
      lastChecked: now
    };
  }
  
  function getReviewStatus() {
    // Check for review status indicators
    const reviewEl = document.querySelector('.merge-status-item');
    if (reviewEl) {
      if (reviewEl.textContent.includes('Changes requested')) {
        return 'changes_requested';
      } else if (reviewEl.textContent.includes('Approved')) {
        return 'approved';
      } else if (reviewEl.textContent.includes('Review required')) {
        return 'pending';
      }
    }
    return 'pending';
  }
  
  function displayReviewTime() {
    if (!prData) return;
    
    // Remove existing display
    const existing = document.getElementById('review-time-tracker');
    if (existing) existing.remove();
    
    // Calculate times
    const hoursSinceCreation = Math.round(prData.timeSinceCreation / (60 * 60 * 1000));
    const daysSinceCreation = Math.round(hoursSinceCreation / 24);
    
    // Create display element
    const display = document.createElement('div');
    display.id = 'review-time-tracker';
    display.className = 'review-time-tracker';
    display.innerHTML = `
      <div class="review-time-badge">
        <span class="review-time-label">⏱️ Review Time:</span>
        <span class="review-time-value">${daysSinceCreation}d ${hoursSinceCreation % 24}h</span>
      </div>
    `;
    
    // Insert into PR header
    const header = document.querySelector('.gh-header-actions');
    if (header) {
      header.insertBefore(display, header.firstChild);
    }
  }
  
  function init() {
    prData = extractPRData();
    
    if (prData) {
      // Save to storage
      chrome.runtime.sendMessage({
        action: 'savePR',
        data: prData
      });
      
      // Display review time
      displayReviewTime();
      
      // Update periodically
      setInterval(() => {
        prData = extractPRData();
        if (prData) {
          prData.timeSinceCreation = Date.now() - prData.createdAt;
          chrome.runtime.sendMessage({
            action: 'savePR',
            data: prData
          });
          displayReviewTime();
        }
      }, 60000); // Update every minute
    }
  }
  
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Re-init on navigation (GitHub uses SPA)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(init, 1000);
    }
  }).observe(document, { subtree: true, childList: true });
})();


