// Product data extraction
function extractProductData() {
  const productData = {
    title: document.getElementById('productTitle')?.textContent.trim(),
    price: document.querySelector('.a-price-whole')?.textContent,
    rating: document.querySelector('.a-icon-star')?.textContent,
    image: document.getElementById('landingImage')?.src,
    asin: location.pathname.match(/\/dp\/([A-Z0-9]+)/)?.[1],
    features: Array.from(document.querySelectorAll('#feature-bullets li span'))
      .map(el => el.textContent.trim())
      .filter(text => text && !text.includes('Hide')),
    category: document.querySelector('#wayfinding-breadcrumbs_container')?.textContent.trim()
  };

  return productData;
}

// Create recommendation overlay
function createOverlay(analysis) {
  const overlay = document.createElement('div');
  overlay.className = 'pa-overlay';
  overlay.innerHTML = `
    <div class="pa-recommendations">
      <div class="pa-header">
        <h3>Smart Analysis</h3>
        <button class="pa-close">×</button>
      </div>
      <div class="pa-analysis">
        <p>${analysis.analysis}</p>
      </div>
      <h4>Recommended Alternatives</h4>
      <div class="pa-items">
        ${analysis.alternatives.map(item => `
          <div class="pa-item">
            <h4>${item.title}</h4>
            <p class="pa-price">$${item.price}</p>
            <div class="pa-features">
              <p>${item.features}</p>
            </div>
            <div class="pa-why-better">
              <h5>Why it's better:</h5>
              <p>${item.why_better}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Add close button functionality
  overlay.querySelector('.pa-close').addEventListener('click', () => {
    overlay.remove();
  });
}

// Initialize
if (window.location.href.includes('amazon.com') && 
    window.location.href.includes('/dp/')) {
  const productData = extractProductData();
  
  // Send data to background script
  chrome.runtime.sendMessage({
    type: 'ANALYZE_PRODUCT',
    data: productData
  });

  // Listen for analysis results
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ANALYSIS_COMPLETE') {
      createOverlay(message.data);
    }
  });
}