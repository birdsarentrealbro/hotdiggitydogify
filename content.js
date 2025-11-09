let isEnabled = false;
let originalContent = new Map();
let observer = null;

// store og content
function storeOriginal(element, property, value) {
  const key = element.toString() + property;
  if (!originalContent.has(key)) {
    originalContent.set(key, value);
  }
}

// replace all text with "hot diggity dog!"
function replaceText(node) {
  if (!isEnabled) return;
  
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent.trim();
    if (text.length > 0) {
      storeOriginal(node, 'textContent', node.textContent);
      node.textContent = 'hot diggity dog!'; //change this if you want it to say smth else
    }
  } else {
    for (let child of node.childNodes) {
      replaceText(child);
    }
  }
}

// replace all image with my image
function replaceImages() {
  if (!isEnabled) return;
  
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    storeOriginal(img, 'src', img.src);
    storeOriginal(img, 'srcset', img.srcset);
    
    // check if gif
    if (img.src.toLowerCase().endsWith('.gif') || img.src.toLowerCase().includes('.gif?')) {
      img.src = 'https://file.garden/aP_3ST9j3ifC7mP-/hot%2Bdiggity%2Bdog%2B-%2BMade%2Bwith%2BClipchamp%2B(1).gif'; //replace with link to your gif
    } else {
      img.src = 'https://i.ibb.co/PZ5C23by/caption.webp'; //replace with link to your image file
    }
    img.srcset = '';
  });
}

// replace bg
function replaceBackgroundImages() {
  if (!isEnabled) return;
  
  const elements = document.querySelectorAll('*');
  elements.forEach((el) => {
    const style = window.getComputedStyle(el);
    if (style.backgroundImage && style.backgroundImage !== 'none') {
      storeOriginal(el, 'backgroundImage', el.style.backgroundImage);
      el.style.backgroundImage = `url(https://i.ibb.co/PZ5C23by/caption.webp)`; //replace with link to your image
    }
  });
}

// replace all videos with my vide (not working rn)
function replaceVideos() {
  if (!isEnabled) return;
  
  const videos = document.querySelectorAll('video');
  videos.forEach((video) => {
    storeOriginal(video, 'src', video.src);
    video.src = 'https://file.garden/aP_3ST9j3ifC7mP-/hot%20diggity%20dog%20-%20Made%20with%20Clipchamp%20(1).mp4'; //replaece with link to your video
    video.loop = true;
    video.controls = true;
    video.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
    video.load();
  });
  
  // replace iframe
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach((iframe) => {
    const src = iframe.src.toLowerCase();
    if (src.includes('youtube') || src.includes('vimeo') || src.includes('video') || src.includes('embed')) {
      const video = document.createElement('video');
      video.src = 'https://file.garden/aP_3ST9j3ifC7mP-/hot%20diggity%20dog%20-%20Made%20with%20Clipchamp%20(1).mp4'; //same thing here
      video.loop = true;
      video.controls = true;
      video.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
      video.style.width = iframe.style.width || iframe.width || '100%';
      video.style.height = iframe.style.height || iframe.height || 'auto';
      iframe.parentNode.replaceChild(video, iframe);
    }
  });
}

// enable replacers
function enable() {
  isEnabled = true;
  replaceText(document.body);
  replaceImages();
  replaceBackgroundImages();
  replaceVideos();
  startObserver();
}

// disavle and restore
function disable() {
  isEnabled = false;
  stopObserver();
  location.reload(); // easy way to restore
}

// start looking for new content
function startObserver() {
  if (observer) return;
  
  observer = new MutationObserver((mutations) => {
    if (!isEnabled) return;
    
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          replaceText(node);
          if (node.tagName === 'IMG') {
            storeOriginal(node, 'src', node.src);
            storeOriginal(node, 'srcset', node.srcset);
            
            if (node.src.toLowerCase().endsWith('.gif') || node.src.toLowerCase().includes('.gif?')) {
              node.src = 'https://file.garden/aP_3ST9j3ifC7mP-/hot%2Bdiggity%2Bdog%2B-%2BMade%2Bwith%2BClipchamp%2B(1).gif';
            } else {
              node.src = 'https://i.ibb.co/PZ5C23by/caption.webp';
            }
            node.srcset = '';
          }
          if (node.tagName === 'VIDEO') {
            storeOriginal(node, 'src', node.src);
            node.src = 'https://file.garden/aP_3ST9j3ifC7mP-/hot%20diggity%20dog%20-%20Made%20with%20Clipchamp%20(1).mp4';
            node.loop = true;
            node.controls = true;
            node.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
            node.load();
          }
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Stop looking
function stopObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

// listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    if (isEnabled) {
      disable();
    } else {
      enable();
    }
    sendResponse({ enabled: isEnabled });
  } else if (request.action === 'getStatus') {
    sendResponse({ enabled: isEnabled });
  }
  return true;

});
