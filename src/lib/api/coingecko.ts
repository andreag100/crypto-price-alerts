const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export async function fetchCryptoPrices(): Promise<CoinGeckoPrice[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=false`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch prices');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return [];
  }
}
