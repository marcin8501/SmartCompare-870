import { analyzeProduct } from './src/services/perplexityApi.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ANALYZE_PRODUCT') {
    analyzeProduct(message.data)
      .then(analysis => {
        chrome.tabs.sendMessage(sender.tab.id, {
          type: 'ANALYSIS_COMPLETE',
          data: analysis
        });
      })
      .catch(error => {
        console.error('Analysis failed:', error);
        chrome.tabs.sendMessage(sender.tab.id, {
          type: 'ANALYSIS_ERROR',
          error: error.message
        });
      });
  }
  return true;
});