const PERPLEXITY_API_KEY = 'your-api-key'; // Replace with actual API key
const API_ENDPOINT = 'https://api.perplexity.ai/chat/completions';

export async function analyzeProduct(productData) {
  try {
    const prompt = `
      Analyze this Amazon product and suggest better alternatives:
      Title: ${productData.title}
      Price: ${productData.price}
      Rating: ${productData.rating}
      
      Please provide 3 alternative products that offer better value, higher quality, or better features.
      Format the response as JSON with the following structure:
      {
        "analysis": "brief analysis of the current product",
        "alternatives": [
          {
            "title": "product name",
            "price": "price",
            "features": "key features",
            "why_better": "explanation"
          }
        ]
      }
    `;

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: "pplx-7b-chat",
        messages: [{
          role: "user",
          content: prompt
        }],
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Perplexity API Error:', error);
    throw error;
  }
}