document.addEventListener('DOMContentLoaded', () => {
  const productInfo = document.getElementById('productInfo');
  const recommendations = document.getElementById('recommendations');
  const status = document.getElementById('status');

  // Get current tab
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];
    
    if (tab.url.includes('amazon.com')) {
      status.textContent = 'Analyzing...';
      
      try {
        // Get product data from content script
        chrome.tabs.sendMessage(tab.id, { type: 'GET_PRODUCT_DATA' }, 
          async (response) => {
            if (response?.data) {
              displayProductInfo(response.data);
              const recommendations = await fetchRecommendations(response.data);
              displayRecommendations(recommendations);
              status.textContent = 'Analysis complete';
            }
          }
        );
      } catch (error) {
        status.textContent = 'Error analyzing product';
        console.error(error);
      }
    } else {
      status.textContent = 'Please visit an Amazon product page';
    }
  });
});

function displayProductInfo(data) {
  const productInfo = document.getElementById('productInfo');
  productInfo.innerHTML = `
    <div class="product-details">
      <img src="${data.image}" alt="${data.title}">
      <h3>${data.title}</h3>
      <p>Price: $${data.price}</p>
      <p>Rating: ${data.rating}</p>
    </div>
  `;
}

function displayRecommendations(recommendations) {
  const recommendationsDiv = document.getElementById('recommendations');
  recommendationsDiv.innerHTML = `
    <h3>Recommended Alternatives</h3>
    <div class="recommendations-list">
      ${recommendations.map(item => `
        <div class="recommendation-item">
          <img src="${item.image}" alt="${item.title}">
          <div class="recommendation-details">
            <h4>${item.title}</h4>
            <p>$${item.price}</p>
            <a href="${item.url}" target="_blank">View</a>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}