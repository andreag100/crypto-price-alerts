const axios = require('axios');

async function fetchCryptoPrices() {
  const apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
  const params = {
    id: '1,1027', // CoinMarketCap IDs for Bitcoin (1) and Ethereum (1027)
    convert: 'USD', // Currency to compare
  };
  const headers = {
    'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
  };

  try {
    const response = await axios.get(apiUrl, { params, headers });
    const data = response.data.data;
    return {
      bitcoin: { usd: data['1'].quote.USD.price },
      ethereum: { usd: data['1027'].quote.USD.price },
    };
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return null;
  }
}

module.exports = fetchCryptoPrices;