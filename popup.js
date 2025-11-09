document.getElementById('toggle').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { action: 'toggle' }, (response) => {
    const status = document.getElementById('status');
    if (response && response.enabled) {
      status.textContent = '✓ Enabled';
      status.style.color = 'green';
    } else {
      status.textContent = '✗ Disabled';
      status.style.color = 'red';
    }
  });
});

// Check current status when popup opens
chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  chrome.tabs.sendMessage(tab.id, { action: 'getStatus' }, (response) => {
    const status = document.getElementById('status');
    if (response && response.enabled) {
      status.textContent = '✓ Enabled';
      status.style.color = 'green';
    } else {
      status.textContent = '✗ Disabled';
      status.style.color = 'red';
    }
  });
});